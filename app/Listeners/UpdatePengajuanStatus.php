<?php

namespace App\Listeners;

use App\Events\AllBerkasApproved;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdatePengajuanStatus
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(AllBerkasApproved $event)
    {
        $pengajuan = $event->pengajuan;

        $pengajuan->update([
            'status' => 'completed'
        ]);
    }
}
