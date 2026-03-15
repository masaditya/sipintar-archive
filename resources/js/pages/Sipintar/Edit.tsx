import React, { useState } from 'react';
import SipintarLayout from '@/layouts/SipintarLayout';
import { useForm } from '@inertiajs/react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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

interface EditProps {
    surat: Surat;
}

export default function Edit({ surat }: EditProps) {
    const titleStr = surat.kategori === 'umum' ? 'Umum' : surat.kategori === 'pengadaan' ? 'Pengadaan' : 'SK Kadin';
    
    const { data, setData, patch, processing, errors } = useForm({
        klasifikasi: surat.klasifikasi,
        tujuan: surat.tujuan,
        perihal: surat.perihal,
        unit_pengolah: surat.unit_pengolah,
        tanggal: surat.tanggal,
    });

    const [showModal, setShowModal] = useState(false);
    const [showTujuanDropdown, setShowTujuanDropdown] = useState(false);
    const [showKlasifikasiDropdown, setShowKlasifikasiDropdown] = useState(false);

    const klasifikasiOptions = [
        "000 - Umum",
        "010 - Urusan Dalam",
        "020 - Peralatan",
        "030 - Kekayaan Daerah",
        "040 - Perpustakaan / Dokumen / Kearsipan / Sandi",
        "050 - Perencanaan",
        "060 - Organisasi dan Ketatalaksanaan",
        "070 - Penelitian",
        "080 - Konferensi",
        "090 - Perjalanan Dinas",
        "100 - Pemerintahan",
        "110 - Pemerintahan Pusat",
        "120 - Pemerintahan Provinsi",
        "130 - Pemerintahan Kabupaten / Kota",
        "140 - Pemerintahan Desa",
        "200 - Politik",
        "300 - Keamanan dan Ketertiban",
        "400 - Kesejahteraan Rakyat",
        "410 - Pembangunan Desa",
        "420 - Pendidikan",
        "430 - Kebudayaan",
        "440 - Kesehatan",
        "450 - Agama",
        "460 - Sosial",
        "470 - Kependudukan",
        "500 - Perekonomian",
        "510 - Perdagangan",
        "520 - Pertanian",
        "530 - Perindustrian",
        "540 - Pertambangan / Fasilitas",
        "550 - Perhubungan",
        "560 - Tenaga Kerja",
        "570 - Penanaman Modal",
        "580 - Perbankan / Moneter",
        "590 - Agraria",
        "600 - Pekerjaan Umum dan Ketenagaan",
        "700 - Pengawasan",
        "800 - Kepegawaian",
        "900 - Keuangan"
    ];

    const filteredKlasifikasi = data.klasifikasi === ''
        ? klasifikasiOptions
        : klasifikasiOptions.filter(opt => opt.toLowerCase().includes(data.klasifikasi.toLowerCase()));

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
        patch(`/surat/${surat.id}`, {
            onSuccess: () => setShowModal(false)
        });
    };

    return (
        <SipintarLayout title={`Edit Surat ${titleStr}`}>
            
            {/* Modal Konfirmasi */}
            {showModal && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl w-[90%] max-w-[500px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] text-left border-2 border-white/50">
                        <h4 className="font-bold mb-3 text-blue-600 text-xl"><i className="fas fa-question-circle mr-2"></i>Konfirmasi Perubahan</h4>
                        <p className="text-slate-500 font-semibold mb-6">Apakah Anda yakin ingin memperbarui detail isi surat berikut?</p>
                        
                        <div className="mb-6 space-y-2">
                            <div className="flex border-b border-dashed border-slate-300 pb-2"><div className="w-[130px] font-bold text-slate-500">Nomor Surat</div><div className="flex-1 font-black text-blue-600">{surat.nomor_surat}</div></div>
                            <div className="flex border-b border-dashed border-slate-300 pb-2"><div className="w-[130px] font-bold text-slate-500">Kode Klasifikasi</div><div className="flex-1 font-black text-slate-800">{data.klasifikasi}</div></div>
                            <div className="flex border-b border-dashed border-slate-300 pb-2"><div className="w-[130px] font-bold text-slate-500">Tujuan Surat</div><div className="flex-1 font-black text-slate-800">{data.tujuan}</div></div>
                            <div className="flex border-b border-dashed border-slate-300 pb-2"><div className="w-[130px] font-bold text-slate-500">Isi / Perihal</div><div className="flex-1 font-black text-slate-800">{data.perihal}</div></div>
                            <div className="flex border-b border-dashed border-slate-300 pb-2"><div className="w-[130px] font-bold text-slate-500">Unit Pengolah</div><div className="flex-1 font-black text-slate-800">{data.unit_pengolah}</div></div>
                            <div className="flex"><div className="w-[130px] font-bold text-slate-500">Tanggal Surat</div><div className="flex-1 font-black text-slate-800">{data.tanggal.split('-').reverse().join('-')}</div></div>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button className="bg-white font-bold px-6 py-2 rounded-full border-2 border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors" onClick={() => setShowModal(false)}>Cek Kembali</button>
                            <button className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors" onClick={submitConfirmed} disabled={processing}>
                                {processing ? 'Menyimpan...' : <><i className="fas fa-check mr-2"></i>Simpan Perubahan</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center justify-center min-h-[90vh]">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl border-2 border-white/50 shadow-xl w-full max-w-[550px] p-10 relative mt-10">
                    <div className="absolute top-[-80px] left-[50%] translate-x-[-50%] w-[160px] h-[120px] flex justify-center items-end">
                        <div className="relative w-[120px] h-[100px]">
                            <div className="absolute bg-[#38BDF8] border-2 border-slate-800 rounded shadow-[2px_2px_0_#1E293B] w-[80px] h-[60px] bottom-[10px] left-[10px] rotate-[-10deg]"></div>
                            <div className="absolute bg-[#FDE047] border-2 border-slate-800 rounded shadow-[2px_2px_0_#1E293B] w-[70px] h-[80px] bottom-[15px] left-[30px] rotate-[5deg]"></div>
                            <div className="absolute bg-white border-2 border-slate-800 rounded shadow-[2px_2px_0_#1E293B] w-[100px] h-[50px] bottom-0 left-[10px] flex justify-center items-center text-slate-800 font-black z-10">
                                <i className="fas fa-edit fa-2x text-blue-500"></i>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-blue-700 font-extrabold text-center text-2xl mb-1">Edit Surat {titleStr}</h3>
                        <p className="text-slate-500 font-semibold text-center mb-8">Ubah detail surat: <span className="text-blue-600">{surat.nomor_surat}</span></p>
                        
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
                                                    setData('klasifikasi', opt);
                                                    setShowKlasifikasiDropdown(false);
                                                }}
                                            >
                                                {opt}
                                            </div>
                                        ))}
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
                                <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden">
                                    <i className="fas fa-building text-blue-500 p-4"></i>
                                    <select required value={data.unit_pengolah} onChange={e => setData('unit_pengolah', e.target.value)} className="w-full bg-transparent border-none outline-none font-bold text-slate-700 focus:ring-0 p-4 pl-0">
                                        <option value="" disabled>Pilih unit pengolah...</option>
                                        <option value="Sekretariat">Sekretariat</option>
                                        <option value="Bidang Perpustakaan">Bidang Perpustakaan</option>
                                        <option value="Bidang Kearsipan">Bidang Kearsipan</option>
                                    </select>
                                </div>
                                {errors.unit_pengolah && <span className="text-red-500 text-sm">{errors.unit_pengolah}</span>}
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
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.tanggal && <span className="text-red-500 text-sm">{errors.tanggal}</span>}
                            </div>
                            
                            <div className="flex gap-3 pt-4 border-t border-slate-200">
                                <button type="submit" className="w-full cursor-pointer bg-linear-to-br from-blue-500 to-blue-700 text-white font-extrabold text-lg py-4 rounded-xl shadow-[0_4px_15px_rgba(29,78,216,0.4)] hover:shadow-[0_6px_20px_rgba(29,78,216,0.6)] hover:-translate-y-1 transition-all">
                                    Simpan Perubahan <i className="fas fa-check-circle ml-2"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SipintarLayout>
    );
}
