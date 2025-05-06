<?php

namespace App\Providers;

use App\Events\AllBerkasApproved;
use App\Models\PengajuanBerkas;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(function (AllBerkasApproved $event) {
            $event->pengajuan->update(['status' => 'completed']);
        });

        PengajuanBerkas::updated(function ($berkas) {
            $pengajuan = $berkas->pengajuan()->with('pengajuanBerkas')->first();

            if ($pengajuan->pengajuanBerkas->every(fn($b) => $b->status === 'approved')) {
                $pengajuan->update(['status' => 'completed']);
            }
        });

        Inertia::share([
            'auth' => function () {
                $user = Auth::user();
                return [
                    'user' => $user,
                    'roles' => $user?->getRoleNames()->toArray(),
                ];
            },
        ]);
    }
}
