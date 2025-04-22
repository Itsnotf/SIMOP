<?php

namespace App\Http\Controllers;

use App\Models\JenisBerkas;
use App\Models\Layanan;
use App\Models\LayananBerkas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LayananBerkasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $layananBerkas = LayananBerkas::with('layanan', 'jenisBerkas')->get();

        return Inertia::render('layananBerkas/index', [
            'layananBerkas' => $layananBerkas,
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
        $jenisBerkas = JenisBerkas::all();
        $layanans = Layanan::all();
        return Inertia::render('layananBerkas/create',[
            'jenisBerkas' => $jenisBerkas,
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
            'jenis_berkas_id' => 'required|exists:jenis_berkas,id',
            'template' => 'required|file|mimes:pdf,doc,docx|max:2048',
        ]);

        $path = $request->file('template')->store('templates', 'public');

        LayananBerkas::create([
            'layanan_id' => $validated['layanan_id'],
            'jenis_berkas_id' => $validated['jenis_berkas_id'],
            'template' => $path,
        ]);

        return redirect()->route('layanan_berkas.index')->with('success', 'Template berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
