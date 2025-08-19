<?php

namespace App\Http\Controllers;

use App\Models\JenisBerkas;
use App\Models\Layanan;
use App\Models\LayananBerkas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        $jenisBerkas = JenisBerkas::whereDoesntHave('layananBerkas')->get();
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
            'template' => 'nullable|file|mimes:pdf,doc,docx|max:50480',
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
        $layananBerkas = LayananBerkas::with('layanan', 'jenisBerkas')->findOrFail($id);
        $jenisBerkas = JenisBerkas::whereDoesntHave('layananBerkas', function($query) use ($id) {
            $query->where('id', '!=', $id);
        })->get();
        $layanans = Layanan::all();

        return Inertia::render('layananBerkas/edit', [
            'jenisBerkas' => $jenisBerkas,
            'layanans' => $layanans,
            'layananBerkas' => $layananBerkas
        ]);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'layanan_id' => 'required|exists:layanans,id',
            'jenis_berkas_id' => 'required|exists:jenis_berkas,id',
            'template' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        $layananBerkas = LayananBerkas::findOrFail($id);

        $data = [
            'layanan_id' => $request->layanan_id,
            'jenis_berkas_id' => $request->jenis_berkas_id,
        ];

        if ($request->hasFile('template')) {
            Storage::delete($layananBerkas->template);
            $data['template'] = $request->file('template')->store('templates', 'public');
        }

        $layananBerkas->update($data);

        return redirect()->route('layanan_berkas.index')->with('success', 'Layanan Berkas berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        LayananBerkas::destroy($id);

        return redirect()->route('layanan_berkas.index')->with('success', 'Layanan Berkas berhasil dihapus');

    }
}
