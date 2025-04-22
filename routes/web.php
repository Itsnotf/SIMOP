<?php

use App\Http\Controllers\JenisBerkasController;
use App\Http\Controllers\LayananBerkasController;
use App\Http\Controllers\LayananController;
use App\Http\Controllers\PengajuanController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\testerController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    route::resource('permission', PermissionController::class);
    route::resource('role', RoleController::class);
    route::resource('user', UserController::class);
    route::resource('layanan', LayananController::class);
    route::resource('jenis_berkas', JenisBerkasController::class);
    route::resource('layanan_berkas', LayananBerkasController::class);
    route::resource('pengajuan', PengajuanController::class);
    route::get('pengajuan/{id}/berkas', [PengajuanController::class, 'berkas']);
    Route::post('/pengajuan/{pengajuan}/berkas/{jenisBerkas}', [PengajuanController::class, 'uploadBerkas'])->name('pengajuan.berkas.upload');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
