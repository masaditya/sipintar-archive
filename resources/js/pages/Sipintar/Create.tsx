import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SipintarLayout from '@/layouts/SipintarLayout';
import { useForm, usePage } from '@inertiajs/react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface CreateProps {
    kategori: 'umum' | 'pengadaan' | 'sk';
    sequence?: string;
    prefilledTanggal?: string;
}

export default function Create({ kategori, sequence, prefilledTanggal }: CreateProps) {
    const titleStr = kategori === 'umum' ? 'Umum' : kategori === 'pengadaan' ? 'Pengadaan' : 'SK Kadin';

    const user = usePage().props.auth as any;
    const isUserAdmin = user.user.role === 'admin';

    const { data, setData, post, processing, errors } = useForm({
        kategori: kategori,
        klasifikasi: '',
        tujuan: '',
        perihal: '',
        unit_pengolah: isUserAdmin ? '' : (user.user.unit_pengolah || ''),
        tanggal: prefilledTanggal || new Date().toISOString().split('T')[0],
        nomor_surat: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [showTujuanDropdown, setShowTujuanDropdown] = useState(false);
    const [showKlasifikasiDropdown, setShowKlasifikasiDropdown] = useState(false);
    const [filteredKlasifikasi, setFilteredKlasifikasi] = useState<any[]>([]);
    const [isLoadingKlasifikasi, setIsLoadingKlasifikasi] = useState(false);
    const [isFetchingAgenda, setIsFetchingAgenda] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.klasifikasi && data.klasifikasi.length >= 2) {
                fetchKlasifikasi(data.klasifikasi);
            } else {
                setFilteredKlasifikasi([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [data.klasifikasi]);

    // Auto-generate nomor_surat if sequence is provided
    useEffect(() => {
        if (sequence && data.klasifikasi) {
            const klCode = data.klasifikasi.match(/^([\d\.]+)/)?.[1] || '000';
            const year = new Date(data.tanggal).getFullYear();
            setData('nomor_surat', `${klCode}/${sequence}/412.216/${year}`);
        }
    }, [data.klasifikasi, data.tanggal, sequence]);

    const fetchKlasifikasi = async (query: string) => {
        setIsLoadingKlasifikasi(true);
        try {
            const response = await axios.get('/search-klasifikasi', {
                params: { query }
            });
            setFilteredKlasifikasi(response.data);
        } catch (error) {
            console.error('Error fetching klasifikasi:', error);
        } finally {
            setIsLoadingKlasifikasi(false);
        }
    };

    const fetchAgendaNumber = async () => {
        if (!data.klasifikasi || !data.tanggal) {
            alert('Pilih Klasifikasi dan Tanggal terlebih dahulu');
            return;
        }

        setIsFetchingAgenda(true);
        try {
            const response = await axios.get('/surat/next-agenda', {
                params: {
                    tanggal: data.tanggal,
                    klasifikasi: data.klasifikasi,
                    kategori: data.kategori
                }
            });
            setData('nomor_surat', response.data.nomor_surat);
        } catch (error) {
            console.error('Error fetching agenda number:', error);
            alert('Gagal mengambil nomor agenda');
        } finally {
            setIsFetchingAgenda(false);
        }
    };

    const tujuanOptions = [
        "Bupati Bojonegoro",
        "Wakil Bupati Bojonegoro",
        "Sekretaris Daerah Kabupaten Bojonegoro",
        "Inspektorat Kabupaten Bojonegoro",
        "Sekretariat DPRD Kabupaten Bojonegoro",
        "Dinas Pendidikan",
        "Dinas Kesehatan",
        "Dinas Sosial",
        "Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil)",
        "Dinas Komunikasi dan Informatika (Dinkominfo)",
        "Dinas Pekerjaan Umum Bina Marga dan Penataan Ruang",
        "Dinas Pekerjaan Umum Sumber Daya Air",
        "Dinas Perumahan, Kawasan Permukiman dan Cipta Karya",
        "Dinas Pemadam Kebakaran dan Penyelamatan (Damkarmat)",
        "Dinas Pemberdayaan Masyarakat dan Desa (DPMD)",
        "Dinas Pemberdayaan Perempuan, Perlindungan Anak dan Keluarga Berencana (DP3AKB)",
        "Dinas Perhubungan",
        "Dinas Lingkungan Hidup",
        "Dinas Kebudayaan dan Pariwisata",
        "Dinas Kepemudaan dan Olahraga",
        "Dinas Ketahanan Pangan dan Pertanian",
        "Dinas Perdagangan, Koperasi dan Usaha Mikro",
        "Dinas Perindustrian dan Tenaga Kerja",
        "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu (DPMPTSP)",
        "Dinas Perpustakaan dan Kearsipan",
        "Dinas Peternakan dan Perikanan",
        "Satuan Polisi Pamong Praja (Satpol PP)",
        "Badan Perencanaan Pembangunan Daerah (Bappeda)",
        "Badan Kepegawaian, Pendidikan dan Pelatihan (BKPP)",
        "Badan Pendapatan Daerah (Bapenda)",
        "Badan Pengelolaan Keuangan dan Aset Daerah (BPKAD)",
        "Badan Kesatuan Bangsa dan Politik (Bakesbangpol)",
        "Badan Penanggulangan Bencana Daerah (BPBD)",
        "Badan Riset dan Inovasi Daerah (Brida)",
        "RSUD Dr. R. Sosodoro Djatikoesoemo",
        "RSUD Padangan",
        "RSUD Kepohbaru",
        "Kecamatan se-Kabupaten Bojonegoro",
        "Kelurahan / Desa se-Kabupaten Bojonegoro"
    ];

    const filteredTujuan = data.tujuan === ''
        ? tujuanOptions
        : tujuanOptions.filter(opt => opt.toLowerCase().includes(data.tujuan.toLowerCase()));

    const handlePreSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(true);
    };

    const submitConfirmed = () => {
        post('/surat', {
            onSuccess: () => setShowModal(false)
        });
    };

    return (
        <SipintarLayout title={`Pengajuan Surat ${titleStr}`}>

            {/* Modal Konfirmasi */}
            {showModal && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl w-[90%] max-w-[500px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] text-left border-2 border-white/50">
                        <h4 className="font-bold mb-3 text-blue-600 text-xl"><i className="fas fa-question-circle mr-2"></i>Konfirmasi Pengajuan</h4>
                        <p className="text-slate-500 font-semibold mb-6">Apakah Anda sudah yakin dengan detail isi, klasifikasi, perihal, tujuan surat, dan unit pengolah berikut?</p>

                        <div className="mb-6 space-y-2">
                            <div className="flex border-b border-dashed border-slate-300 pb-2"><div className="w-[130px] font-bold text-slate-500">Kode Klasifikasi</div><div className="flex-1 font-black text-slate-800">{data.klasifikasi}</div></div>
                            <div className="flex border-b border-dashed border-slate-300 pb-2"><div className="w-[130px] font-bold text-slate-500">Tujuan Surat</div><div className="flex-1 font-black text-slate-800">{data.tujuan}</div></div>
                            <div className="flex border-b border-dashed border-slate-300 pb-2"><div className="w-[130px] font-bold text-slate-500">Isi / Perihal</div><div className="flex-1 font-black text-slate-800">{data.perihal}</div></div>
                            <div className="flex border-b border-dashed border-slate-300 pb-2"><div className="w-[130px] font-bold text-slate-500">Unit Pengolah</div><div className="flex-1 font-black text-slate-800">{data.unit_pengolah}</div></div>
                            <div className="flex border-b border-dashed border-slate-300 pb-2"><div className="w-[130px] font-bold text-slate-500">Nomor Surat</div><div className="flex-1 font-black text-slate-800">{data.nomor_surat || '(Otomatis)'}</div></div>
                            <div className="flex"><div className="w-[130px] font-bold text-slate-500">Tanggal Surat</div><div className="flex-1 font-black text-slate-800">{data.tanggal.split('-').reverse().join('-')}</div></div>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button className="bg-white font-bold px-6 py-2 rounded-full border-2 border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors" onClick={() => setShowModal(false)}>Cek Kembali</button>
                            <button className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors" onClick={submitConfirmed} disabled={processing}>
                                {processing ? 'Menyimpan...' : <><i className="fas fa-check mr-2"></i>Ya, Simpan Surat</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center justify-center min-h-[90vh]">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl border-2 border-white/50 shadow-xl w-full max-w-[550px] p-10 relative mt-10">
                    <div className="absolute top-[-80px] left-[50%] translate-x-[-50%] w-[160px] h-[120px] flex justify-center items-end">
                        <div className="relative w-[120px] h-[100px]">
                            <div className="absolute bg-[#4ADE80] border-2 border-slate-800 rounded shadow-[2px_2px_0_#1E293B] w-[80px] h-[60px] bottom-[10px] left-[10px] rotate-[-10deg]"></div>
                            <div className="absolute bg-[#F472B6] border-2 border-slate-800 rounded shadow-[2px_2px_0_#1E293B] w-[70px] h-[80px] bottom-[15px] left-[30px] rotate-[5deg]"></div>
                            <div className="absolute bg-white border-2 border-slate-800 rounded shadow-[2px_2px_0_#1E293B] w-[100px] h-[50px] bottom-0 left-[10px] flex justify-center items-center text-slate-800 font-black z-10">
                                <i className="fas fa-pen-nib fa-2x"></i>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-blue-700 font-extrabold text-center text-2xl mb-1">Pengajuan Surat {titleStr}</h3>
                        <p className="text-slate-500 font-semibold text-center mb-8">Lengkapi detail surat untuk disimpan ke database</p>

                        <form onSubmit={handlePreSubmit}>
                            <div className="mb-4 relative">
                                <label className="block text-sm font-bold text-slate-700 ml-2 mb-1">Kode Klasifikasi</label>
                                <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden relative z-20">
                                    <i className="fas fa-folder text-blue-500 p-4"></i>
                                    <input
                                        type="text"
                                        required
                                        value={data.klasifikasi}
                                        onChange={e => {
                                            setData('klasifikasi', e.target.value);
                                            setShowKlasifikasiDropdown(true);
                                        }}
                                        onFocus={() => setShowKlasifikasiDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowKlasifikasiDropdown(false), 200)}
                                        placeholder="Ketik atau pilih kode klasifikasi..."
                                        className="w-full bg-transparent border-none outline-none font-bold text-slate-700 focus:ring-0 p-4 pl-0"
                                    />
                                    <div
                                        className="pr-4 text-slate-400 hover:text-blue-500 cursor-pointer flex items-center h-full"
                                        onClick={() => setShowKlasifikasiDropdown(!showKlasifikasiDropdown)}
                                    >
                                        <i className={`fas fa-chevron-${showKlasifikasiDropdown ? 'up' : 'down'} transition-transform`}></i>
                                    </div>
                                </div>
                                {showKlasifikasiDropdown && filteredKlasifikasi.length > 0 && (
                                    <div className="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] max-h-56 overflow-y-auto overflow-x-hidden">
                                        {filteredKlasifikasi.map((opt, idx) => (
                                            <div
                                                key={idx}
                                                className="px-5 py-3 hover:bg-blue-50 cursor-pointer text-slate-700 font-bold border-b border-slate-100 last:border-none transition-colors duration-150"
                                                onClick={() => {
                                                    setData('klasifikasi', opt.name);
                                                    setShowKlasifikasiDropdown(false);
                                                }}
                                            >
                                                {opt.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {isLoadingKlasifikasi && (
                                    <div className="absolute right-12 top-1/2 -translate-y-1/2 z-30 text-blue-500">
                                        <i className="fas fa-spinner fa-spin"></i>
                                    </div>
                                )}
                                {errors.klasifikasi && <span className="text-red-500 text-sm mt-1 block pl-2">{errors.klasifikasi}</span>}
                            </div>

                            <div className="mb-4 relative">
                                <label className="block text-sm font-bold text-slate-700 ml-2 mb-1">Tujuan Surat</label>
                                <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden relative z-20">
                                    <i className="fas fa-user-tie text-blue-500 p-4"></i>
                                    <input
                                        type="text"
                                        required
                                        value={data.tujuan}
                                        onChange={e => {
                                            setData('tujuan', e.target.value);
                                            setShowTujuanDropdown(true);
                                        }}
                                        onFocus={() => setShowTujuanDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowTujuanDropdown(false), 200)}
                                        placeholder="Masukkan instansi/tujuan surat..."
                                        className="w-full bg-transparent border-none outline-none font-bold text-slate-700 focus:ring-0 p-4 pl-0"
                                    />
                                    <div
                                        className="pr-4 text-slate-400 hover:text-blue-500 cursor-pointer flex items-center h-full"
                                        onClick={() => setShowTujuanDropdown(!showTujuanDropdown)}
                                    >
                                        <i className={`fas fa-chevron-${showTujuanDropdown ? 'up' : 'down'} transition-transform`}></i>
                                    </div>
                                </div>
                                {showTujuanDropdown && filteredTujuan.length > 0 && (
                                    <div className="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] max-h-56 overflow-y-auto overflow-x-hidden">
                                        {filteredTujuan.map((opt, idx) => (
                                            <div
                                                key={idx}
                                                className="px-5 py-3 hover:bg-blue-50 cursor-pointer text-slate-700 font-bold border-b border-slate-100 last:border-none transition-colors duration-150"
                                                onClick={() => {
                                                    setData('tujuan', opt);
                                                    setShowTujuanDropdown(false);
                                                }}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.tujuan && <span className="text-red-500 text-sm mt-1 block pl-2">{errors.tujuan}</span>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold text-slate-700 ml-2 mb-1">Isi Surat / Perihal</label>
                                <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden">
                                    <i className="fas fa-clipboard-list text-blue-500 p-4"></i>
                                    <input type="text" required value={data.perihal} onChange={e => setData('perihal', e.target.value)} placeholder="Masukkan ringkasan perihal..." className="w-full bg-transparent border-none outline-none font-bold text-slate-700 focus:ring-0 p-4 pl-0" />
                                </div>
                                {errors.perihal && <span className="text-red-500 text-sm">{errors.perihal}</span>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold text-slate-700 ml-2 mb-1">Unit Pengolah</label>
                                <div className={`flex items-center rounded-xl border border-slate-200 shadow-inner overflow-hidden ${!isUserAdmin ? 'bg-slate-100' : 'bg-white'}`}>
                                    <i className="fas fa-building text-blue-500 p-4"></i>
                                    <select
                                        required
                                        value={data.unit_pengolah}
                                        onChange={e => setData('unit_pengolah', e.target.value)}
                                        disabled={!isUserAdmin}
                                        className={`w-full bg-transparent border-none outline-none font-bold text-slate-700 focus:ring-0 p-4 pl-0 ${!isUserAdmin ? 'cursor-not-allowed' : ''}`}
                                    >
                                        <option value="" disabled>Pilih unit pengolah...</option>
                                        <option value="Sekretariat">Sekretariat</option>
                                        <option value="Bidang Perpustakaan">Bidang Perpustakaan</option>
                                        <option value="Bidang Kearsipan">Bidang Kearsipan</option>
                                    </select>
                                </div>
                                {!isUserAdmin && <p className="text-xs text-slate-400 mt-1 ml-2">* Unit pengolah dikunci sesuai akun Anda</p>}
                                {errors.unit_pengolah && <span className="text-red-500 text-sm">{errors.unit_pengolah}</span>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold text-slate-700 ml-2 mb-1">Nomor Surat</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 flex items-center bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden">
                                        <i className="fas fa-hashtag text-blue-500 p-4"></i>
                                        <input
                                            type="text"
                                            value={data.nomor_surat}
                                            onChange={e => setData('nomor_surat', e.target.value)}
                                            placeholder="Klik tombol di sebelah atau isi manual..."
                                            className="w-full bg-transparent border-none outline-none font-bold text-slate-700 focus:ring-0 p-4 pl-0"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={fetchAgendaNumber}
                                        disabled={isFetchingAgenda}
                                        className="bg-blue-100 text-blue-700 px-4 rounded-xl font-bold hover:bg-blue-200 transition-colors flex items-center whitespace-nowrap"
                                    >
                                        {isFetchingAgenda ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-sync-alt mr-2"></i>}
                                        Ambil Nomor
                                    </button>
                                </div>
                                {errors.nomor_surat && <span className="text-red-500 text-sm mt-1 block pl-2">{errors.nomor_surat}</span>}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 ml-2 mb-1">Tanggal Surat</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className="w-full flex items-center bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden font-bold text-slate-700 text-left cursor-pointer"
                                        >
                                            <i className="fas fa-calendar-day text-blue-500 p-4"></i>
                                            <span className="p-4 pl-0">
                                                {data.tanggal ? format(new Date(data.tanggal + 'T00:00:00'), 'dd MMMM yyyy', { locale: id }) : <span>Pilih Tanggal Surat</span>}
                                            </span>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={data.tanggal ? new Date(data.tanggal + 'T00:00:00') : undefined}
                                            onSelect={(date) => {
                                                if (date) {
                                                    const year = date.getFullYear();
                                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                                    const day = String(date.getDate()).padStart(2, '0');
                                                    setData('tanggal', `${year}-${month}-${day}`);
                                                }
                                            }}
                                            disabled={(date) => date > new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.tanggal && <span className="text-red-500 text-sm">{errors.tanggal}</span>}
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-200">
                                <button type="submit" className="w-full cursor-pointer bg-linear-to-br from-blue-500 to-blue-700 text-white font-extrabold text-lg py-4 rounded-xl shadow-[0_4px_15px_rgba(29,78,216,0.4)] hover:shadow-[0_6px_20px_rgba(29,78,216,0.6)] hover:-translate-y-1 transition-all">
                                    Simpan Surat <i className="fas fa-check-circle ml-2"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SipintarLayout>
    );
}
