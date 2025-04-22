<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:show-permission')->only(['index']);
        $this->middleware('permission:edit-permission')->only(['edit']);
        $this->middleware('permission:create-permission')->only(['create']);
        $this->middleware('permission:delete-permission')->only(['delete']);
    }

    public function index()
    {
        $permissions = Permission::all();

        return Inertia::render('permission/index', [
            'permissions' => $permissions,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }


    public function create()
    {
        return Inertia::render('permission/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name',
        ]);

        Permission::create([
            'name' => $request->name,
            'guard_name' => 'web',
        ]);

        return redirect()->route('permission.index')->with('success', 'Permission created successfully.');
    }

    public function edit($id)
    {
        $permission = Permission::findOrFail($id);

        return Inertia::render('permission/edit', [
            'permission' => $permission,
        ]);
    }

    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);

        $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $permission->id,
        ]);

        $permission->update([
            'name' => $request->name,
        ]);

        return redirect()->route('permission.index')->with('success', 'Permission updated successfully.');
    }

    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return redirect()->route('permission.index')->with('success', 'Permission deleted successfully.');
    }
}
