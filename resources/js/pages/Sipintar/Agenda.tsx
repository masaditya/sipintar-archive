import React, { useState, useMemo, useEffect } from 'react';
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
    selectedYear: number;
    availableYears: number[];
}

export default function Agenda({ kategori, surats, selectedYear, availableYears }: AgendaProps) {
    const [search, setSearch] = useState('');
    const [suratToDelete, setSuratToDelete] = useState<Surat | null>(null);
    const [showEmptyNumbers, setShowEmptyNumbers] = useState(false);
    
    let title = "BUKU AGENDA GLOBAL";
    let showKategori = true;

    if (kategori === 'umum') { title = "AGENDA SURAT UMUM"; showKategori = false; }
    if (kategori === 'pengadaan') { title = "AGENDA SURAT PENGADAAN"; showKategori = false; }
    if (kategori === 'sk') { title = "AGENDA SURAT SK KADIN"; showKategori = false; }

    // Helper to extract sequence number from nomor_surat
    const getSequence = (nomor_surat: string) => {
        const parts = nomor_surat.split('/');
        if (parts.length >= 2) {
            const seq = parseInt(parts[1]);
            return isNaN(seq) ? 0 : seq;
        }
        return 0;
    };

    const displayedSurats = useMemo(() => {
        // 1. Sort by sequence number ascending to find gaps reliably
        let sorted = [...surats].sort((a, b) => getSequence(a.nomor_surat) - getSequence(b.nomor_surat));
        
        let result: any[] = [];
        
        if (showEmptyNumbers && sorted.length > 0) {
            for (let i = 0; i < sorted.length; i++) {
                const current = sorted[i];
                const currentSeq = getSequence(current.nomor_surat);
                
                if (i > 0) {
                    const prevSeq = getSequence(sorted[i-1].nomor_surat);
                    for (let gap = prevSeq + 1; gap < currentSeq; gap++) {
                        result.push({
                            id: -gap, // Use negative number for unique key and type compatibility
                            nomor_surat: `RESERVED / ${gap} / --- / ---`,
                            tanggal: sorted[i-1].tanggal, 
                            perihal: 'NOMOR AGENDA KOSONG (UNTUK BACKDATE)',
                            klasifikasi: '---',
                            tujuan: '---',
                            unit_pengolah: '---',
                            isEmpty: true,
                            sequence: gap
                        });
                    }
                }
                result.push(current);
            }
        } else {
            result = sorted;
        }

        // Return reversed to keep "newest first" feel if desired, or keep as is
        // The original backend was id desc, which is roughly newest first.
        return result.reverse();
    }, [surats, showEmptyNumbers]);

    const filteredSurats = displayedSurats.filter((s) => {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
            s.nomor_surat.toLowerCase().includes(searchLower) ||
            (s.tujuan?.toLowerCase().includes(searchLower) ?? false) ||
            (s.perihal?.toLowerCase().includes(searchLower) ?? false) ||
            (s.klasifikasi?.toLowerCase().includes(searchLower) ?? false);
        
        return matchesSearch;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Reset pagination when search or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, showEmptyNumbers, selectedYear]);

    const totalPages = Math.ceil(filteredSurats.length / itemsPerPage);
    const paginatedSurats = filteredSurats.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    
    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }, [currentPage, totalPages]);

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
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div 
                                className="flex items-center gap-3 cursor-pointer group select-none bg-slate-50 hover:bg-slate-100 rounded-xl px-3 py-2 border border-slate-200 transition-all shadow-sm" 
                                onClick={() => setShowEmptyNumbers(!showEmptyNumbers)}
                            >
                                <div className={`w-10 h-5 rounded-full transition-all duration-300 flex items-center px-1 ${showEmptyNumbers ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-slate-300'}`}>
                                    <div className={`w-3 h-3 rounded-full bg-white transition-all duration-300 transform ${showEmptyNumbers ? 'translate-x-5' : 'translate-x-0'} shadow-md`}></div>
                                </div>
                                <span className={`text-[13px] font-black transition-colors uppercase tracking-tight ${showEmptyNumbers ? 'text-blue-700' : 'text-slate-500'}`}>Tampilkan Kosong</span>
                            </div>

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
                        </div>
                            <select 
                                value={selectedYear}
                                onChange={(e) => router.get(`/surat/agenda/${kategori}`, { year: e.target.value }, { preserveState: true })}
                                className="bg-white text-blue-700 font-bold border-2 border-blue-200 rounded-xl px-4 py-2 shadow-sm hover:border-blue-400 focus:ring-0 outline-none transition-all cursor-pointer mr-2"
                            >
                                {availableYears.map(year => (
                                    <option key={year} value={year}>Tahun {year}</option>
                                ))}
                            </select>

                            <button 
                                onClick={() => window.location.href = `/surat/export/${kategori}?year=${selectedYear}`}
                                className="bg-white text-blue-600 font-bold border-2 border-blue-600 rounded-xl px-6 py-2 shadow-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
                            >
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
                            {paginatedSurats.map((surat, i) => (
                                <tr key={surat.id} className={`${surat.isEmpty ? 'bg-slate-50/50 opacity-70' : 'bg-white/70'} hover:bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all group`}>
                                    <td className="py-4 px-5 font-extrabold text-slate-700 rounded-l-xl align-middle">
                                        {surat.isEmpty ? <i className="fas fa-minus text-slate-300"></i> : ((currentPage - 1) * itemsPerPage) + (i + 1)}
                                    </td>
                                    <td className={`py-4 px-5 font-semibold align-middle whitespace-nowrap ${surat.isEmpty ? 'text-slate-400' : 'text-slate-700'}`}>
                                        {surat.tanggal?.split('-').reverse().join('-') ?? '---'}
                                    </td>
                                    <td className={`py-4 px-5 font-bold align-middle ${surat.isEmpty ? 'text-slate-400 italic' : 'text-blue-600'}`}>
                                        <div className="max-w-[180px] wrap-break-word line-clamp-2">{surat.nomor_surat}</div>
                                    </td>
                                    <td className="py-4 px-5 align-middle">
                                        <div className="max-w-[250px]">
                                            <span className={`inline-block border rounded-xl px-3 py-1 text-sm font-bold line-clamp-2 ${
                                                surat.isEmpty ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-blue-100 text-blue-600 border-blue-400'
                                            }`}>
                                                {surat.klasifikasi}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`py-4 px-5 font-bold align-middle ${surat.isEmpty ? 'text-slate-400' : 'text-slate-800'}`}>
                                        <div className="max-w-[250px] line-clamp-2 wrap-break-word">{surat.tujuan}</div>
                                    </td>
                                    <td className={`py-4 px-5 font-semibold align-middle ${surat.isEmpty ? 'text-slate-400 italic' : 'text-slate-600'}`}>
                                        <div className="max-w-[350px] line-clamp-2 wrap-break-word">{surat.perihal}</div>
                                    </td>
                                    
                                    <td className="py-4 px-5 align-middle">
                                        <div className="max-w-[150px]">
                                            <span className={`inline-block rounded-xl px-3 py-1 text-sm font-bold line-clamp-2 ${
                                                surat.isEmpty ? 'bg-slate-200 text-slate-400' : 'bg-slate-500 text-white'
                                            }`}>
                                                {surat.unit_pengolah}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-4 px-5 rounded-r-xl align-middle text-center">
                                        {!surat.isEmpty && (usePage().props.auth as any).user.role === 'admin' && (
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
                                        {surat.isEmpty && (
                                            <div className="flex justify-center items-center gap-2">
                                                <Link 
                                                    href={`/surat/create/${kategori}?sequence=${surat.sequence}&tanggal=${surat.tanggal}`}
                                                    className="w-10 h-10 flex justify-center items-center bg-teal-100 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                                                    title="Gunakan Nomor Ini"
                                                >
                                                    <i className="fas fa-plus"></i>
                                                </Link>
                                                <span className="text-slate-300 text-xs font-bold uppercase tracking-wider ml-1">Tersedia</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {paginatedSurats.length === 0 && (
                                <tr>
                                    <td colSpan={showKategori ? 8 : 7} className="bg-white/70 py-8 px-5 rounded-xl text-center font-bold text-slate-500">
                                        Belum ada data surat keluar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4 border-t border-slate-100 pt-6">
                        <div className="text-slate-500 font-bold text-sm bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-inner">
                            Menampilkan <span className="text-blue-600">{Math.min(filteredSurats.length, (currentPage - 1) * itemsPerPage + 1)}</span> - <span className="text-blue-600">{Math.min(filteredSurats.length, currentPage * itemsPerPage)}</span> dari <span className="text-blue-700">{filteredSurats.length}</span> entri
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="w-10 h-10 flex justify-center items-center rounded-xl bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                title="Sebelumnya"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>

                            <div className="flex gap-2">
                                {pageNumbers[0] > 1 && <span className="flex items-end px-1 text-slate-400">...</span>}
                                {pageNumbers.map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-xl font-bold transition-all shadow-sm border-2 ${
                                            currentPage === page 
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-500'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                {pageNumbers[pageNumbers.length - 1] < totalPages && <span className="flex items-end px-1 text-slate-400">...</span>}
                            </div>

                            <button 
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="w-10 h-10 flex justify-center items-center rounded-xl bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                title="Selanjutnya"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                )}
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
                                Anda yakin ingin menghapus surat dengan nomor <span className="text-blue-600 font-bold">{suratToDelete?.nomor_surat}</span>? Tindakan ini tidak dapat dibatalkan.
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
                                        if (suratToDelete) {
                                            router.delete(`/surat/${suratToDelete.id}`, {
                                                onSuccess: () => setSuratToDelete(null)
                                            });
                                        }
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
