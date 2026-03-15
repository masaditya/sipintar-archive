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

        // Generate Nomor Surat
        $klasifikasiCode = explode(' - ', $validated['klasifikasi'])[0];
        $suffix = strtoupper($validated['kategori']);
        if ($suffix === 'SK') $suffix = 'SK-KADIN';

        $lastSurat = SuratKeluar::where('kategori', $validated['kategori'])
            ->whereYear('tanggal', $year)
            ->orderBy('id', 'desc')
            ->first();

        // extract sequence from latest nomor, or start at 1
        $nextNumFallback = 1;
        if ($lastSurat) {
            $parts = explode('/', $lastSurat->nomor_surat);
            if (count($parts) >= 2 && is_numeric($parts[1])) {
                $nextNumFallback = intval($parts[1]) + 1;
            } else {
                // simple fallback if parsing fails, just count existing records in category+year
                $nextNumFallback = SuratKeluar::where('kategori', $validated['kategori'])->whereYear('tanggal', $year)->count() + 1;
            }
        }

        $nextNumStr = str_pad($nextNumFallback, 3, '0', STR_PAD_LEFT);
        $nomorSurat = "{$klasifikasiCode}/{$nextNumStr}/{$suffix}/{$year}";

        $validated['nomor_surat'] = $nomorSurat;

        SuratKeluar::create($validated);

        return redirect()->route('sipintar.agenda', ['kategori' => $validated['kategori']])
                         ->with('success', 'Surat berhasil disimpan');
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
        $surat = SuratKeluar::findOrFail($id);

        $validated = $request->validate([
            'klasifikasi' => 'required|string',
            'tujuan' => 'required|string',
            'perihal' => 'required|string',
            'unit_pengolah' => 'required|string',
            'tanggal' => 'required|date',
        ]);

        // Note: Usually nomor_surat is not updated unless klasifikasi changes significantly 
        // but for simplicity we will just update the fields and keep nomor_surat as is 
        // unless you want to regenerate it. Let's keep the original nomor_surat for now.
        
        $surat->update($validated);

        return redirect()->route('sipintar.agenda', ['kategori' => $surat->kategori])
                         ->with('success', 'Surat berhasil diperbarui');
    }

    public function destroy($id)
    {
        $surat = SuratKeluar::findOrFail($id);
        $kategori = $surat->kategori;
        $surat->delete();

        return redirect()->route('sipintar.agenda', ['kategori' => $kategori])
                         ->with('success', 'Surat berhasil dihapus');
    }
}
