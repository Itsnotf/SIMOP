<?php

namespace App\Http\Controllers;

use App\Models\JenisBerkas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JenisBerkasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jenisBerkas = JenisBerkas::all();

        return Inertia::render('jenisBerkas/index', [
            'JenisBerkas' => $jenisBerkas,
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
        return Inertia::render('jenisBerkas/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_berkas' => 'required|string|max:255',
            'kode' => 'required|string',
        ]);

        JenisBerkas::create($request->all());

        return redirect()->route('jenis_berkas.index')->with('success', 'Jenis Berkas created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(JenisBerkas $jenisBerkas)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $jenisBerkas = JenisBerkas::findOrFail($id);

        return Inertia::render('jenisBerkas/edit', [
            'JenisBerkas' => $jenisBerkas,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nama_berkas' => 'required|string|max:255',
            'kode' => 'required|string',
        ]);
        $jenisBerkas = JenisBerkas::findOrFail($id);

        $jenisBerkas->update($request->all());

        return redirect()->route('jenis_berkas.index')->with('success', 'Jenis Berkas updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $jenisBerkas = JenisBerkas::findOrFail($id);
        $jenisBerkas->delete();

        return redirect()->route('jenis_berkas.index')->with('success', 'Jenis Berkas deleted successfully.');
    }
}
