<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = Role::firstOrCreate(['name' => 'admin'], ['guard_name' => 'web']);
        $user = Role::firstOrCreate(['name' => 'user'], ['guard_name' => 'web']);

        $permissions = Permission::all();
        $admin->syncPermissions($permissions);
    }
}
