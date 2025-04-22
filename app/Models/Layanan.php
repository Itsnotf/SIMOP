<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Layanan extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_layanan',
        'deskripsi_layanan',
    ];

    public function layananBerkas()
    {
        return $this->hasMany(LayananBerkas::class, 'layanan_id');
    }

    public function pengajuan()
    {
        return $this->hasMany(Pengajuan::class, 'layanan_id');
    }
}
