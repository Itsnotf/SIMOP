<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JenisBerkas extends Model
{
    use HasFactory;

    protected $guarded = [ 'id' ];

    public function layananBerkas()
    {
        return $this->hasMany(LayananBerkas::class, 'jenis_berkas_id');
    }

    public function pengajuanBerkas()
    {
        return $this->hasMany(PengajuanBerkas::class, 'jenis_berkas_id');
    }


}
