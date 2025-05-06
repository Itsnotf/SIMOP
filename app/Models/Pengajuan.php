<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengajuan extends Model
{

    protected $guarded = [
        'id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function layanan()
    {
        return $this->belongsTo(Layanan::class);
    }

    public function pengajuanBerkas()
    {
        return $this->hasMany(PengajuanBerkas::class, 'pengajuan_id');
    }

    public function allBerkasApproved(): bool
    {
        return $this->pengajuanBerkas->isNotEmpty() &&
            $this->pengajuanBerkas->every('status', 'approved');
    }


}
