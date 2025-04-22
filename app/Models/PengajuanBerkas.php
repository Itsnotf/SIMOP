<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengajuanBerkas extends Model
{
    protected $guarded = [
        'id'
    ];

    public function pengajuan()
    {
        return $this->belongsTo(Pengajuan::class);
    }

    public function jenis_berkas()
    {
        return $this->belongsTo(JenisBerkas::class);
    }

}
