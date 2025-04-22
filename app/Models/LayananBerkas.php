<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LayananBerkas extends Model
{
    protected $table = 'layanan_berkas';

    protected $fillable = [
        'layanan_id',
        'jenis_berkas_id',
        'template',
    ];

    public function layanan()
    {
        return $this->belongsTo(Layanan::class, 'layanan_id');
    }

    public function jenisBerkas()
    {
        return $this->belongsTo(JenisBerkas::class, 'jenis_berkas_id');
    }
}
