<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'create-user',
            'edit-user',
            'delete-user',
            'show-user',
            'create-role',
            'edit-role',
            'delete-role',
            'show-role',
            'create-permission',
            'edit-permission',
            'delete-permission',
            'show-permission',
            'create-layanan',
            'edit-layanan',
            'delete-layanan',
            'show-layanan',
            'create-layananBerkas',
            'edit-layananBerkas',
            'delete-layananBerkas',
            'show-layananBerkas',
            'create-jenisBerkas',
            'edit-jenisBerkas',
            'delete-jenisBerkas',
            'show-jenisBerkas',
            'create-pengajuan',
            'edit-pengajuan',
            'delete-pengajuan',
            'show-pengajuan',
            'berkas-pengajuan',
            'validasi-berkas',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }
    }
}
