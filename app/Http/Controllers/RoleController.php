<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:show-role')->only(['index']);
        $this->middleware('permission:edit-role')->only(['edit']);
        $this->middleware('permission:create-role')->only(['create']);
        $this->middleware('permission:delete-role')->only(['delete']);
    }
    public function index()
    {
        $roles = Role::all();

        return Inertia::render('role/index', [
            'roles' => $roles,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('role/create', [
            'permissions' => Permission::all()
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'array|nullable',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);



        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web',
        ]);

        if (!empty($request->permissions)) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('role.index')->with('success', 'Role created successfully.');
    }

    public function edit(string $id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        $permissions = Permission::all();

        return Inertia::render('role/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->map(function ($p) {
                    return [
                        'id' => $p->id,
                        'name' => $p->name,
                    ];
                }),
            ],
            'permissions' => $permissions->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                ];
            }),
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update(['name' => $validated['name']]);
        $role->permissions()->sync($validated['permissions']);

        return redirect()->route('role.index')->with('success', 'Role updated successfully.');
    }


    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return redirect()->route('role.index')->with('success', 'Role deleted successfully.');
    }
}
