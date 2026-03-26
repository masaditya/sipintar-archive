<?php

namespace App\Http\Controllers;

use App\Models\SuratKeluar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class SuratKeluarController extends Controller
{
    public function dashboard()
    {
        // Simple counts for dashboard
        $stats = [
            'sekretariat' => SuratKeluar::where('unit_pengolah', 'Sekretariat')->count(),
            'perpustakaan' => SuratKeluar::where('unit_pengolah', 'Bidang Perpustakaan')->count(),
            'kearsipan' => SuratKeluar::where('unit_pengolah', 'Bidang Kearsipan')->count(),
        ];
        $stats['total'] = array_sum($stats);

        return Inertia::render('Sipintar/Dashboard', [
            'stats' => $stats
        ]);
    }

    public function create($kategori)
    {
        if (!in_array($kategori, ['umum', 'pengadaan', 'sk'])) {
            abort(404);
        }
        return Inertia::render('Sipintar/Create', [
            'kategori' => $kategori
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori' => 'required|in:umum,pengadaan,sk',
            'klasifikasi' => 'required|string',
            'tujuan' => 'required|string',
            'perihal' => 'required|string',
            'unit_pengolah' => 'required|string',
            'tanggal' => 'required|date',
        ]);

        $year = Carbon::parse($validated['tanggal'])->format('Y');

        // Extract code from classification name like "000.1.1 Perjalanan Dinas"
        $klasifikasiCode = '000'; // fallback
        if (preg_match('/^([\d\.]+)/', $validated['klasifikasi'], $matches)) {
            $klasifikasiCode = $matches[1];
        }

        // Generate nomor agenda (sequence for the current year)
        // using latest recorded sequence to avoid gaps or double-up on recount during deletions
        $lastSurat = SuratKeluar::whereYear('tanggal', $year)
            ->orderBy('id', 'desc')
            ->first();

        $nextNumFallback = 1;
        if ($lastSurat) {
            $parts = explode('/', $lastSurat->nomor_surat);
            if (count($parts) >= 2 && is_numeric($parts[1])) {
                $nextNumFallback = intval($parts[1]) + 1;
            } else {
                // fallback to count if format was non-standard
                $nextNumFallback = SuratKeluar::whereYear('tanggal', $year)->count() + 1;
            }
        }

        $nextNumStr = str_pad($nextNumFallback, 3, '0', STR_PAD_LEFT);

        // [kode-klasifikasi]/[nomor-agenda]/412.216/[tahun]
        $nomorSurat = "{$klasifikasiCode}/{$nextNumStr}/412.216/{$year}";

        $validated['nomor_surat'] = $nomorSurat;

        SuratKeluar::create($validated);

        return redirect()->route('sipintar.agenda', ['kategori' => $validated['kategori']])
                         ->with('success', 'Surat berhasil disimpan');
    }

    public function searchKlasifikasi(Request $request)
    {
        $search = $request->query('query');
        $klasifikasis = \App\Models\Klasifikasi::where('name', 'LIKE', "%{$search}%")
            ->orderBy('name', 'asc')
            ->limit(10)
            ->get(['id', 'name']);
        
        return response()->json($klasifikasis);
    }

    public function agenda($kategori = 'all')
    {
        $query = SuratKeluar::query();
        if ($kategori !== 'all') {
            if (!in_array($kategori, ['umum', 'pengadaan', 'sk'])) {
                abort(404);
            }
            $query->where('kategori', $kategori);
        }

        $surats = $query->orderBy('id', 'desc')->get();

        return Inertia::render('Sipintar/Agenda', [
            'kategori' => $kategori,
            'surats' => $surats
        ]);
    }

    public function edit($id)
    {
        $surat = SuratKeluar::findOrFail($id);
        return Inertia::render('Sipintar/Edit', [
            'surat' => $surat
        ]);
    }

    public function update(Request $request, $id)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $surat = SuratKeluar::findOrFail($id);
// ...
// (the rest of update)
    }

    public function destroy($id)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $surat = SuratKeluar::findOrFail($id);
        $kategori = $surat->kategori;
        $surat->delete();

        return redirect()->route('sipintar.agenda', ['kategori' => $kategori])
                         ->with('success', 'Surat berhasil dihapus');
    }
}
