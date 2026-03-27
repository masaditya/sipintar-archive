import React, { useState } from 'react';
import SipintarLayout from '@/layouts/SipintarLayout';
import { usePage, router, Link } from '@inertiajs/react';

interface Surat {
    id: number;
    kategori: string;
    nomor_surat: string;
    klasifikasi: string;
    tujuan: string;
    perihal: string;
    unit_pengolah: string;
    tanggal: string;
}

interface AgendaProps {
    kategori: string;
    surats: Surat[];
}

export default function Agenda({ kategori, surats }: AgendaProps) {
    const [search, setSearch] = useState('');
    const [suratToDelete, setSuratToDelete] = useState<Surat | null>(null);
    
    let title = "BUKU AGENDA GLOBAL";
    let showKategori = true;

    if (kategori === 'umum') { title = "AGENDA SURAT UMUM"; showKategori = false; }
    if (kategori === 'pengadaan') { title = "AGENDA SURAT PENGADAAN"; showKategori = false; }
    if (kategori === 'sk') { title = "AGENDA SURAT SK KADIN"; showKategori = false; }

    const filteredSurats = surats.filter((s) => 
        s.nomor_surat.toLowerCase().includes(search.toLowerCase()) ||
        s.tujuan.toLowerCase().includes(search.toLowerCase()) ||
        s.perihal.toLowerCase().includes(search.toLowerCase()) ||
        s.klasifikasi.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SipintarLayout title={title}>
            <header className="mb-6">
                <div>
                    <h1 className="text-5xl font-black text-white m-0 drop-shadow-md leading-none">{title}</h1>
                    <p className="text-white/90 font-semibold text-lg mt-1">Daftar Rekapitulasi Surat Keluar Instansi</p>
                </div>
            </header>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl border-2 border-white/50 shadow-xl p-6 h-full min-h-[70vh]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <h4 className="font-bold text-blue-700 text-xl m-0"><i className="fas fa-book-open mr-2 text-blue-500"></i>Data Surat Keluar</h4>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-inner px-4 p-2 w-full sm:w-[350px]">
                            <i className="fas fa-search text-slate-400"></i>
                            <input 
                                type="text" 
                                placeholder="Cari surat..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent border-none outline-none font-semibold text-slate-700 px-3 focus:ring-0" 
                            />
                        </div>
                        <button className="bg-white text-blue-600 font-bold border-2 border-blue-600 rounded-xl px-6 py-2 shadow-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
                            <i className="fas fa-print mr-2"></i>Cetak Laporan
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-separate" style={{ borderSpacing: '0 10px' }}>
                        <thead>
                            <tr>
                                <th className="border-none font-extrabold text-blue-700 py-3 px-5 text-left uppercase text-xs">No</th>
                                <th className="border-none font-extrabold text-blue-700 py-3 px-5 text-left uppercase text-xs">Tanggal</th>
                                <th className="border-none font-extrabold text-blue-700 py-3 px-5 text-left uppercase text-xs">Nomor Surat</th>
                                <th className="border-none font-extrabold text-blue-700 py-3 px-5 text-left uppercase text-xs">Klasifikasi</th>
                                <th className="border-none font-extrabold text-blue-700 py-3 px-5 text-left uppercase text-xs">Tujuan</th>
                                <th className="border-none font-extrabold text-blue-700 py-3 px-5 text-left uppercase text-xs">Isi / Perihal</th>
                                {/* {showKategori && <th className="border-none font-extrabold text-blue-700 py-3 px-5 text-left uppercase text-xs">Jenis Pengajuan</th>} */}
                                <th className="border-none font-extrabold text-blue-700 py-3 px-5 text-left uppercase text-xs">Unit Pengolah</th>
                                <th className="border-none font-extrabold text-blue-700 py-3 px-5 text-center uppercase text-xs">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSurats.map((surat, i) => (
                                <tr key={surat.id} className="bg-white/70 hover:bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all group">
                                    <td className="py-4 px-5 font-extrabold text-slate-700 rounded-l-xl align-middle">{i + 1}</td>
                                    <td className="py-4 px-5 font-semibold text-slate-700 align-middle whitespace-nowrap">
                                        {surat.tanggal.split('-').reverse().join('-')}
                                    </td>
                                    <td className="py-4 px-5 font-bold text-blue-600 align-middle">
                                        <div className="max-w-[180px] wrap-break-word line-clamp-2">{surat.nomor_surat}</div>
                                    </td>
                                    <td className="py-4 px-5 align-middle">
                                        <div className="max-w-[250px]">
                                            <span className="inline-block bg-blue-100 text-blue-600 border border-blue-400 rounded-xl px-3 py-1 text-sm font-bold line-clamp-2">
                                                {surat.klasifikasi}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5 font-bold text-slate-800 align-middle">
                                        <div className="max-w-[250px] line-clamp-2 wrap-break-word">{surat.tujuan}</div>
                                    </td>
                                    <td className="py-4 px-5 text-slate-600 font-semibold align-middle">
                                        <div className="max-w-[350px] line-clamp-2 wrap-break-word">{surat.perihal}</div>
                                    </td>
                                    
                                    {/* {showKategori && (
                                        <td className="py-4 px-5 align-middle">
                                            <span className={`px-3 py-1 rounded-xl text-white text-sm font-bold whitespace-nowrap ${
                                                surat.kategori === 'umum' ? 'bg-blue-600' :
                                                surat.kategori === 'pengadaan' ? 'bg-teal-500' : 'bg-purple-500'
                                            }`}>
                                                {surat.kategori === 'umum' ? 'Surat Umum' : surat.kategori === 'pengadaan' ? 'Pengadaan' : 'SK Kadin'}
                                            </span>
                                        </td>
                                    )} */}
                                    
                                    <td className="py-4 px-5 align-middle">
                                        <div className="max-w-[150px]">
                                            <span className="inline-block bg-slate-500 text-white rounded-xl px-3 py-1 text-sm font-bold line-clamp-2">
                                                {surat.unit_pengolah}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-4 px-5 rounded-r-xl align-middle text-center">
                                        {(usePage().props.auth as any).user.role === 'admin' && (
                                            <div className="flex justify-center items-center gap-2">
                                                <Link 
                                                    href={`/surat/${surat.id}/edit`}
                                                    className="w-10 h-10 flex justify-center items-center bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    title="Edit Surat"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </Link>
                                                <button 
                                                    onClick={() => setSuratToDelete(surat)}
                                                    className="w-10 h-10 flex justify-center items-center bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm cursor-pointer"
                                                    title="Hapus Surat"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredSurats.length === 0 && (
                                <tr>
                                    <td colSpan={showKategori ? 8 : 7} className="bg-white/70 py-8 px-5 rounded-xl text-center font-bold text-slate-500">
                                        Belum ada data surat keluar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modal Delete Confirmation */}
            {suratToDelete && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-[450px] shadow-2xl overflow-hidden border-2 border-white/50 animate-in fade-in zoom-in duration-300">
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-xl flex justify-center items-center mx-auto mb-6">
                                <i className="fas fa-trash-alt fa-3x"></i>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">Hapus Surat?</h3>
                            <p className="text-slate-500 font-semibold mb-6">
                                Anda yakin ingin menghapus surat dengan nomor <span className="text-blue-600 font-bold">{suratToDelete.nomor_surat}</span>? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            
                            <div className="flex gap-3 justify-center">
                                <button 
                                    className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                    onClick={() => setSuratToDelete(null)}
                                >
                                    Batal
                                </button>
                                <button 
                                    className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-colors"
                                    onClick={() => {
                                        router.delete(`/surat/${suratToDelete.id}`, {
                                            onSuccess: () => setSuratToDelete(null)
                                        });
                                    }}
                                >
                                    Ya, Hapus Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SipintarLayout>
    );
}
