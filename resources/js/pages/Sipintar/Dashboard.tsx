import React, { useEffect, useRef, useState } from 'react';
import SipintarLayout from '@/layouts/SipintarLayout';
import { Chart, BarController, BarElement, PieController, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Link } from '@inertiajs/react';

Chart.register(BarController, BarElement, PieController, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

interface DashboardProps {
    stats: {
        sekretariat: number;
        perpustakaan: number;
        kearsipan: number;
        total: number;
    }
}

export default function Dashboard({ stats }: DashboardProps) {
    const barChartRef = useRef<HTMLCanvasElement>(null);
    const pieChartRef = useRef<HTMLCanvasElement>(null);
    const barChartInstance = useRef<Chart | null>(null);
    const pieChartInstance = useRef<Chart | null>(null);

    const [filter, setFilter] = useState('bulan');

    useEffect(() => {
        // Init Charts
        const cTeal = '#14B8A6'; const cOrange = '#F97316'; const cPurple = '#8B5CF6';
        Chart.defaults.color = '#FFFFFF';
        Chart.defaults.font.family = "'Nunito', sans-serif";

        if (barChartRef.current) {
            if (barChartInstance.current) barChartInstance.current.destroy();
            barChartInstance.current = new Chart(barChartRef.current, {
                type: 'bar',
                data: { 
                    labels: ['Sekretariat', 'Bidang Perpustakaan', 'Bidang Kearsipan'], 
                    datasets: [{ 
                        data: [stats.sekretariat, stats.perpustakaan, stats.kearsipan], 
                        backgroundColor: [cTeal, cOrange, cPurple], 
                        borderRadius: 6, 
                        barPercentage: 0.6 
                    }] 
                },
                options: { 
                    indexAxis: 'y', 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    plugins: { 
                        legend: { display: false }, 
                        tooltip: { backgroundColor: 'rgba(255,255,255,0.9)', titleColor: '#333', bodyColor: '#333', padding: 10, cornerRadius: 8 } 
                    }, 
                    scales: { 
                        x: { grid: { color: 'rgba(255,255,255,0.2)', drawOnChartArea: true }, ticks: { font: { weight: 'bold' } } }, 
                        y: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 14 } } } 
                    } 
                }
            });
        }

        if (pieChartRef.current) {
            if (pieChartInstance.current) pieChartInstance.current.destroy();
            const total = stats.total > 0 ? stats.total : 1; // avoid divide by zero
            const pSek = Math.round((stats.sekretariat / total) * 100);
            const pPer = Math.round((stats.perpustakaan / total) * 100);
            const pArs = Math.round((stats.kearsipan / total) * 100);

            pieChartInstance.current = new Chart(pieChartRef.current, {
                type: 'pie',
                data: { 
                    labels: ['Sekretariat', 'Bidang Perpustakaan', 'Bidang Kearsipan'], 
                    datasets: [{ 
                        data: [stats.total === 0 ? 0 : pSek, stats.total === 0 ? 0 : pPer, stats.total === 0 ? 0 : pArs], 
                        backgroundColor: [cTeal, cOrange, cPurple], 
                        borderWidth: 3, 
                        borderColor: 'transparent', 
                        hoverOffset: 4 
                    }] 
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    layout: { padding: 10 }, 
                    plugins: { 
                        legend: { position: 'right', labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { size: 13, weight: 'normal' } } }, 
                        tooltip: { callbacks: { label: function(c) { return ' ' + c.label + ': ' + c.raw + '%'; } }, backgroundColor: 'rgba(255,255,255,0.9)', titleColor: '#333', bodyColor: '#333', } 
                    } 
                }
            });
        }

        return () => {
            if (barChartInstance.current) barChartInstance.current.destroy();
            if (pieChartInstance.current) pieChartInstance.current.destroy();
        }
    }, [stats]);

    return (
        <SipintarLayout title="Dashboard">
            <header className="flex items-center relative mb-5">
                <div>
                    <h1 className="text-5xl font-black text-white m-0 drop-shadow-md leading-none">DASHBOARD SIPINTAR</h1>
                    <p className="text-white/90 font-semibold text-lg mt-1">Selamat datang kembali di panel statistik surat keluar.</p>
                </div>
            </header>

            <div className="container-fluid px-0">
                <div className="flex justify-between items-end mb-3">
                    <h4 className="text-white font-bold mb-0 drop-shadow-md text-xl"><i className="fas fa-chart-pie mr-2"></i>Ringkasan Statistik (Seluruh Waktu)</h4>
                    
                    <div className="flex gap-3 items-center">
                        <Link href="/surat/agenda/all" className="bg-white/80 border-2 border-white text-blue-600 font-bold rounded-full shadow-sm px-6 py-2 hover:bg-white transition-all">
                            <i className="fas fa-book-open mr-2"></i>Lihat Buku Agenda
                        </Link>
                    </div>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-teal-500 rounded-2xl p-5 text-center relative shadow-[inset_0_2px_5px_rgba(255,255,255,0.3),0_4px_15px_rgba(0,0,0,0.1)] border border-white/20 text-white bg-gradient-to-b from-white/20 to-transparent">
                        <div className="text-lg font-bold border-b-2 border-white/20 pb-2 mb-2">Sekretariat</div>
                        <div className="text-5xl font-black flex items-center justify-center gap-4 leading-none transition-opacity duration-300">
                            <i className="fas fa-envelope-open-text bg-black/10 p-3 rounded-xl text-3xl"></i> {stats.sekretariat}
                        </div>
                    </div>
                    <div className="bg-orange-500 rounded-2xl p-5 text-center relative shadow-[inset_0_2px_5px_rgba(255,255,255,0.3),0_4px_15px_rgba(0,0,0,0.1)] border border-white/20 text-white bg-gradient-to-b from-white/20 to-transparent">
                        <div className="text-lg font-bold border-b-2 border-white/20 pb-2 mb-2">Bidang Perpustakaan</div>
                        <div className="text-5xl font-black flex items-center justify-center gap-4 leading-none transition-opacity duration-300">
                            <i className="fas fa-book bg-black/10 p-3 rounded-xl text-3xl"></i> {stats.perpustakaan}
                        </div>
                    </div>
                    <div className="bg-purple-500 rounded-2xl p-5 text-center relative shadow-[inset_0_2px_5px_rgba(255,255,255,0.3),0_4px_15px_rgba(0,0,0,0.1)] border border-white/20 text-white bg-gradient-to-b from-white/20 to-transparent">
                        <div className="text-lg font-bold border-b-2 border-white/20 pb-2 mb-2">Bidang Kearsipan</div>
                        <div className="text-5xl font-black flex items-center justify-center gap-4 leading-none transition-opacity duration-300">
                            <i className="fas fa-archive bg-black/10 p-3 rounded-xl text-3xl"></i> {stats.kearsipan}
                        </div>
                    </div>
                    <div className="bg-blue-500 rounded-2xl p-5 text-center relative shadow-[inset_0_2px_5px_rgba(255,255,255,0.3),0_4px_15px_rgba(0,0,0,0.1)] border border-white/20 text-white bg-gradient-to-b from-white/20 to-transparent">
                        <div className="text-lg font-bold border-b-2 border-white/20 pb-2 mb-2">Total Surat Keluar</div>
                        <div className="text-5xl font-black flex items-center justify-center gap-4 leading-none transition-opacity duration-300">
                            <i className="fas fa-paper-plane bg-black/10 p-3 rounded-xl text-3xl"></i> {stats.total}
                        </div>
                    </div>
                </div>

                {/* Bottom Layout */}
                <div className="flex flex-col md:flex-row gap-5 items-stretch mt-5">
                    <div className="flex-1 p-5 rounded-2xl bg-white/20 backdrop-blur-md shadow-lg border border-white/30">
                        <h5 className="font-extrabold text-white mb-4 text-lg drop-shadow-sm">Jumlah Surat Keluar per Unit</h5>
                        <div className="h-[230px] relative w-full">
                            <canvas ref={barChartRef}></canvas>
                        </div>
                    </div>
                    <div className="w-[350px] p-5 rounded-2xl bg-white/20 backdrop-blur-md shadow-lg border border-white/30">
                        <h5 className="font-extrabold text-white mb-4 text-center text-lg drop-shadow-sm">Persentase Surat Keluar</h5>
                        <div className="h-[230px] relative w-full flex justify-center">
                            <canvas ref={pieChartRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </SipintarLayout>
    );
}
