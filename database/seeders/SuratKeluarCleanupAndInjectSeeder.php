<?php

namespace Database\Seeders;

use App\Models\SuratKeluar;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SuratKeluarCleanupAndInjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Cleanup all existing data in surat_keluars
        SuratKeluar::truncate();

        // 2. Data from the table image
        $data = [
            [
                'tanggal' => '2026-04-07',
                'nomor_surat' => '000.4/215/412.216/2026',
                'klasifikasi' => '000.4',
                'tujuan' => 'Dinas Perpustakaan dan Kearsipan Provinsi Jawa Timur',
                'perihal' => 'Rekapitulasi data statistik perpustakaan',
                'unit_pengolah' => 'Bidang Perpustakaan',
                'kategori' => 'umum',
            ],
            [
                'tanggal' => '2026-04-07',
                'nomor_surat' => '800.1.11.1/216/412.216/2026',
                'klasifikasi' => '800.1.11.1',
                'tujuan' => 'SMKN 3 Bojonegoro',
                'perihal' => 'SPT UKK SMKN 3 Bojonegoro',
                'unit_pengolah' => 'Bidang kearsipan',
                'kategori' => 'umum',
            ],
            [
                'tanggal' => '2026-04-07',
                'nomor_surat' => '900/217/412.216/2026',
                'klasifikasi' => '900',
                'tujuan' => 'Bagian Pembangunan',
                'perihal' => 'laporan Fisik dan non fisik Bulan Maret',
                'unit_pengolah' => 'Sekretariat',
                'kategori' => 'umum',
            ],
            [
                'tanggal' => '2026-04-07',
                'nomor_surat' => '900/218/412.216/2026',
                'klasifikasi' => '900',
                'tujuan' => 'BPKAD',
                'perihal' => 'SPJTM TPP Bulan Maret',
                'unit_pengolah' => 'Sekretariat',
                'kategori' => 'umum',
            ],
            [
                'tanggal' => '2026-04-07',
                'nomor_surat' => '069.5/219/412.216/2026',
                'klasifikasi' => '069.5',
                'tujuan' => 'INSPEKTORAT',
                'perihal' => 'Tindak Lanjut hasil evaluasi SAKIP Tahun 2025',
                'unit_pengolah' => 'Sekretariat',
                'kategori' => 'umum',
            ],
            [
                'tanggal' => '2026-04-08',
                'nomor_surat' => '800.11.1/ 220 /412.216/2026',
                'klasifikasi' => '800.11.1',
                'tujuan' => 'Desa Sembunglor dan Desa Pucangarum Kecamatan Baureno',
                'perihal' => 'SPT Pembinaan Kearsipan Desa di Desa Sembunglor dan Desa Pucangarum Kecamatan Baureno',
                'unit_pengolah' => 'Bidang kearsipan',
                'kategori' => 'umum',
            ],
            [
                'tanggal' => '2026-04-08',
                'nomor_surat' => '---/221/412.216/2026', 
                'klasifikasi' => '',
                'tujuan' => '',
                'perihal' => 'Surat Umum',
                'unit_pengolah' => '',
                'kategori' => 'umum',
            ],
            [
                'tanggal' => '2026-04-08',
                'nomor_surat' => '000.5.15.1/222/412.216/2026',
                'klasifikasi' => '000.5.15.1',
                'tujuan' => 'Bapak Bupati',
                'perihal' => 'Pelaksanaan pengawasan kearsipan internal di Lingkungan Pemerintah Kabupaten Bojonegoro',
                'unit_pengolah' => 'Bidang kearsipan',
                'kategori' => 'umum',
            ],
        ];

        foreach ($data as $item) {
            SuratKeluar::create($item);
        }
    }
}
