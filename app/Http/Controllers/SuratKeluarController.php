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
            'nomor_surat' => 'nullable|string', 
        ]);

        $user = auth()->user();
        
        // Enforce unit_pengolah for non-admins
        if ($user->role !== 'admin' && $user->unit_pengolah) {
            $validated['unit_pengolah'] = $user->unit_pengolah;
        }

        $year = Carbon::parse($validated['tanggal'])->format('Y');

        if (empty($validated['nomor_surat'])) {
            // Extract code from classification name like "000.1.1 Perjalanan Dinas"
            $klasifikasiCode = '000'; // fallback
            if (preg_match('/^([\d\.]+)/', $validated['klasifikasi'], $matches)) {
                $klasifikasiCode = $matches[1];
            }

            // Generate nomor agenda (sequence for the current year)
            $nextNumFallback = $this->calculateNextAgendaNumber($validated['tanggal'], $validated['kategori']);

            // [kode-klasifikasi]/[nomor-agenda]/412.216/[tahun]
            $nomorSurat = "{$klasifikasiCode}/{$nextNumFallback}/412.216/{$year}";
            $validated['nomor_surat'] = $nomorSurat;
        }

        SuratKeluar::create($validated);

        return redirect()->route('sipintar.agenda', ['kategori' => $validated['kategori']])
                         ->with('success', 'Surat berhasil disimpan');
    }

    public function getNextAgendaNumber(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'klasifikasi' => 'required|string',
            'kategori' => 'required|in:umum,pengadaan,sk',
        ]);

        $tanggal = $request->query('tanggal');
        $klasifikasi = $request->query('klasifikasi');
        $kategori = $request->query('kategori');
        $year = Carbon::parse($tanggal)->format('Y');

        // Extract code from classification name
        $klasifikasiCode = '000';
        if (preg_match('/^([\d\.]+)/', $klasifikasi, $matches)) {
            $klasifikasiCode = $matches[1];
        }

        $nextNum = $this->calculateNextAgendaNumber($tanggal, $kategori);

        $nomorSurat = "{$klasifikasiCode}/{$nextNum}/412.216/{$year}";

        return response()->json([
            'next_number' => $nextNum,
            'nomor_surat' => $nomorSurat
        ]);
    }

    private function calculateNextAgendaNumber($tanggal, $kategori)
    {
        $dateObj = Carbon::parse($tanggal);
        $year = $dateObj->format('Y');

        // 1. Check if there are already records for this specific date
        $lastSuratSameDay = SuratKeluar::whereYear('tanggal', $year)
            ->whereDate('tanggal', $dateObj->toDateString())
            ->where('kategori', $kategori)
            ->get()
            ->sortByDesc(fn($s) => $this->extractSequence($s))
            ->first();

        if ($lastSuratSameDay) {
            return $this->extractSequence($lastSuratSameDay) + 1;
        }

        // 2. If no records for this date, find the maximum sequence on any date BEFORE this one
        $lastSuratBefore = SuratKeluar::whereYear('tanggal', $year)
            ->whereDate('tanggal', '<', $dateObj->toDateString())
            ->where('kategori', $kategori)
            ->get()
            ->sortByDesc(fn($s) => $this->extractSequence($s))
            ->first();

        // 3. If there are also no records before this date, find the maximum sequence OVERALL for the year
        // This handles the case where you select an earlier date but something later is already recorded
        if (!$lastSuratBefore) {
            $lastSuratGlobal = SuratKeluar::whereYear('tanggal', $year)
                ->where('kategori', $kategori)
                ->get()
                ->sortByDesc(fn($s) => $this->extractSequence($s))
                ->first();
            
            if (!$lastSuratGlobal) {
                return 1;
            }
            
            // If selecting a date before the global max, it still behaves like a "before" record for consistency
            $lastSuratBefore = $lastSuratGlobal;
        }

        $lastNum = $this->extractSequence($lastSuratBefore);
        $isWeekday = $dateObj->isWeekday();

        if ($isWeekday) {
            return $lastNum + 2;
        } else {
            return $lastNum + 1;
        }
    }

    private function extractSequence($surat)
    {
        if (!$surat) return 0;
        $parts = explode('/', $surat->nomor_surat);
        if (count($parts) >= 2 && is_numeric($parts[1])) {
            return intval($parts[1]);
        }
        return 0;
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

    public function agenda(Request $request, $kategori = 'all')
    {
        $user = auth()->user();
        $query = SuratKeluar::query();

        // 1. Category filter
        if ($kategori !== 'all') {
            if (!in_array($kategori, ['umum', 'pengadaan', 'sk'])) {
                abort(404);
            }
            $query->where('kategori', $kategori);
        }

        // 2. Unit filter (non-admin can only see their own unit)
        if ($user->role !== 'admin' && $user->unit_pengolah) {
            $query->where('unit_pengolah', $user->unit_pengolah);
        }

        // 3. Year filter (default to current year)
        $selectedYear = $request->query('year', Carbon::now()->year);
        $query->whereYear('tanggal', $selectedYear);

        // Fetch all surats for the filtered list
        $surats = $query->orderBy('id', 'desc')->get();

        // Get available years for the filter dropdown from DB
        $availableYears = SuratKeluar::selectRaw('YEAR(tanggal) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();
        
        // Ensure current year is always in the list if not already there
        if (!in_array(Carbon::now()->year, $availableYears)) {
            array_unshift($availableYears, (int)Carbon::now()->year);
            $availableYears = array_unique($availableYears);
        }

        return Inertia::render('Sipintar/Agenda', [
            'kategori' => $kategori,
            'surats' => $surats,
            'selectedYear' => (int)$selectedYear,
            'availableYears' => $availableYears,
        ]);
    }

    public function export(Request $request, $kategori = 'all')
    {
        $user = auth()->user();
        $query = SuratKeluar::query();
        $titleKategori = "GLOBAL";

        if ($kategori !== 'all') {
            $query->where('kategori', $kategori);
            $titleKategori = strtoupper($kategori);
        }

        // Apply unit filter for non-admins
        if ($user->role !== 'admin' && $user->unit_pengolah) {
            $query->where('unit_pengolah', $user->unit_pengolah);
            $titleKategori .= " - " . strtoupper($user->unit_pengolah);
        }

        // Apply year filter
        $selectedYear = $request->query('year', Carbon::now()->year);
        $query->whereYear('tanggal', $selectedYear);

        $surats = $query->orderBy('tanggal', 'asc')->orderBy('id', 'asc')->get();
        $filename = "agenda_" . ($kategori ?? "global") . "_{$selectedYear}_" . date('Ymd_His') . ".xls";

        $headerTitle = "DAFTAR SURAT KELUAR TAHUN {$selectedYear} ({$titleKategori})";

        header("Content-Type: application/vnd.ms-excel");
        header("Content-Disposition: attachment; filename=\"$filename\"");
        header("Pragma: no-cache");
        header("Expires: 0");

        echo '<table border="1">';
        echo '<tr><th colspan="6" style="font-size: 16px; font-weight: bold; text-align: center;">' . $headerTitle . '</th></tr>';
        echo '<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>'; // empty row as seen in sample
        echo '<tr style="font-weight: bold; text-align: center;">
                <th width="50">No</th>
                <th width="120">Tanggal Surat</th>
                <th width="200">Nomor Surat</th>
                <th width="250">Tujuan</th>
                <th width="350">Perihal</th>
                <th width="150">Unit Pengolah</th>
              </tr>';

        $no = 1;
        foreach ($surats as $surat) {
            echo '<tr>';
            echo '<td style="text-align: center;">' . $no++ . '</td>';
            echo '<td style="text-align: center;">' . Carbon::parse($surat->tanggal)->format('d-m-Y') . '</td>';
            echo '<td>' . $surat->nomor_surat . '</td>';
            echo '<td>' . $surat->tujuan . '</td>';
            echo '<td>' . $surat->perihal . '</td>';
            echo '<td>' . $surat->unit_pengolah . '</td>';
            echo '</tr>';
        }
        echo '</table>';
        exit;
    }

    public function edit($id)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

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

        $validated = $request->validate([
            'klasifikasi' => 'required|string',
            'tujuan' => 'required|string',
            'perihal' => 'required|string',
            'unit_pengolah' => 'required|string',
            'tanggal' => 'required|date',
        ]);

        $newDate = Carbon::parse($validated['tanggal']);
        $year = $newDate->format('Y');

        // Extract code from classification name like "000.1.1 Perjalanan Dinas"
        $klasifikasiCode = '000'; // fallback
        if (preg_match('/^([\d\.]+)/', $validated['klasifikasi'], $matches)) {
            $klasifikasiCode = $matches[1];
        }

        // Reconstruct nomor surat based on updated klasifikasi or year change
        // Keep the original sequence number (agenda number)
        $parts = explode('/', $surat->nomor_surat);
        $sequence = isset($parts[1]) ? intval($parts[1]) : 1;

        // [kode-klasifikasi]/[nomor-agenda]/412.216/[tahun]
        $nomorSurat = "{$klasifikasiCode}/{$sequence}/412.216/{$year}";
        $validated['nomor_surat'] = $nomorSurat;

        $surat->update($validated);

        return redirect()->route('sipintar.agenda', ['kategori' => $surat->kategori])
                         ->with('success', 'Surat berhasil diperbarui');
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
