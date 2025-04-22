<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:show-user')->only(['index']);
        $this->middleware('permission:edit-user')->only(['edit']);
        $this->middleware('permission:create-user')->only(['create']);
        $this->middleware('permission:delete-user')->only(['delete']);
    }

    public function index()
    {
        $users = User::with('roles')->get();

        return Inertia::render('user/index', [
            'users' => $users,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function create()
    {
        $roles = Role::all();

        return Inertia::render('user/create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role_id'  => 'required|exists:roles,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $role = Role::find($validated['role_id']);
        if ($role) {
            $user->syncRoles([$role->name]);
        }

        return redirect()->route('user.index')->with('success', 'User created successfully.');
    }

    public function edit(string $id)
    {
        $user  = User::with('roles')->findOrFail($id);
        $roles = Role::all();
        $currentRole = $user->roles->first()->id ?? null;

        return Inertia::render('user/edit', [
            'user'  => $user,
            'roles' => $roles,
            'currentRole' => $currentRole,
        ]);
    }


    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6|confirmed',
            'role_id'  => 'required|exists:roles,id',
        ]);

        $user->update([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => isset($data['password']) ? Hash::make($data['password']) : $user->password,
        ]);

        $user->syncRoles([$data['role_id']]);

        return redirect()->route('user.index')->with('success', 'User updated successfully.');
    }


    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('user.index')->with('success', 'User deleted.');
    }
}
