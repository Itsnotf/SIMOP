<?php

namespace App\Http\Controllers;

use App\Models\Layanan;
use App\Models\LayananBerkas;
use App\Models\Pengajuan;
use App\Models\PengajuanBerkas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PengajuanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pengajuans = Pengajuan::with('user','layanan')->get();
        return Inertia::render('pengajuan/index', [
            'pengajuan' => $pengajuans,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $layanans = Layanan::all();

        return Inertia::render('pengajuan/create', [
            'layanans' => $layanans,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'layanan_id' => 'required|exists:layanans,id',
        'perusahaan' => 'required|string|max:255',
        'nohp' => 'required|string|max:20',
    ]);

    Pengajuan::create([
        'layanan_id' => $validated['layanan_id'],
        'perusahaan' => $validated['perusahaan'],
        'nohp' => $validated['nohp'],
        'user_id' => Auth::id(),
    ]);

    return redirect()->route('pengajuan.index')->with('success', 'Pengajuan berhasil disimpan.');
}

    /**
     * Display the specified resource.
     */
    public function show(Pengajuan $pengajuan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $pengajuan = Pengajuan::findOrFail($id);
        $layanans = Layanan::all();

        return Inertia::render('pengajuan/edit', [
            'pengajuan' => $pengajuan,
            'layanans' => $layanans,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $pengajuan = Pengajuan::findOrFail($id);

        $validated = $request->validate([
            'layanan_id' => 'required|exists:layanans,id',
            'perusahaan' => 'required|string|max:255',
            'nohp' => 'required|string|max:20',
        ]);

        $pengajuan->update($validated);

        return redirect()->route('pengajuan.index')->with('success', 'Pengajuan berhasil diperbarui.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pengajuan = Pengajuan::findOrFail($id);
        $pengajuan->delete();

        return redirect()->route('pengajuan.index')->with('success', 'Pengajuan berhasil dihapus.');
    }

    public function berkas(string $id)
    {
        $pengajuan = Pengajuan::findOrFail($id);

        $pengajuanBerkas = $pengajuan->pengajuanBerkas()->with('jenis_berkas')->get();

        $layananBerkas = LayananBerkas::where('layanan_id', $pengajuan->layanan_id)->with('jenisBerkas')->get();

        return Inertia::render('pengajuan/berkas', [
            'pengajuanBerkas' => $pengajuanBerkas,
            'pengajuan' => $pengajuan,
            'layananBerkas' => $layananBerkas,
        ]);
    }

    public function uploadBerkas(Request $request, string $pengajuanId, string $jenisBerkasId)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png,gif|max:2048',
        ]);

        $pengajuanBerkas = PengajuanBerkas::firstOrNew([
            'pengajuan_id' => $pengajuanId,
            'jenis_berkas_id' => $jenisBerkasId,
        ]);

        if ($pengajuanBerkas->file) {
            Storage::disk('public')->delete($pengajuanBerkas->file);
        }

        $uploadedFile = $request->file('file')->store('pengajuan_berkas', 'public');

        $pengajuanBerkas->file = $uploadedFile;
        $pengajuanBerkas->status = 'pending';
        $pengajuanBerkas->save();

        return redirect()->back()->with('success', 'Berkas berhasil diunggah.');
    }

}
