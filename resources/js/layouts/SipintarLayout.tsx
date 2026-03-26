import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function SipintarLayout({ children, title = "" }: { children: React.ReactNode, title?: string }) {
    const { url } = usePage();
    
    // Auth handling
    const handleLogout = () => {
        router.post('/logout'); // Assuming fortify standard logout route
    };

    return (
        <>
            <Head title={`SIPINTAR - ${title}`} />
            <style dangerouslySetInnerHTML={{__html: `
                :root {
                    --bg-top: #60A5FA;
                    --bg-bottom: #1D4ED8;
                    --card-glass: rgba(255, 255, 255, 0.9);
                    --text-main: #1E293B;
                    --text-muted: #64748B;
                    
                    /* KPI Colors */
                    --kpi-teal: #14B8A6;
                    --kpi-orange: #F97316;
                    --kpi-purple: #8B5CF6;
                    --kpi-blue: #3B82F6;
                }

                body {
                    font-family: 'Nunito', sans-serif;
                    background: linear-gradient(180deg, var(--bg-top) 0%, #3B82F6 40%, var(--bg-bottom) 100%) !important;
                    background-attachment: fixed !important;
                    color: var(--text-main);
                    min-height: 100vh;
                    overflow-x: hidden;
                    position: relative;
                }

                .clouds-container {
                    position: fixed; top: -50px; left: 0; width: 100%; height: 150px;
                    z-index: 0; pointer-events: none; display: flex; justify-content: space-around; opacity: 0.6;
                }
                .cloud { background: white; border-radius: 50%; position: absolute; filter: blur(4px); }
                .cloud:nth-child(1) { width: 300px; height: 300px; top: -150px; left: -50px; }
                .cloud:nth-child(2) { width: 400px; height: 400px; top: -200px; left: 20%; }
                .cloud:nth-child(3) { width: 250px; height: 250px; top: -100px; left: 50%; }
                .cloud:nth-child(4) { width: 500px; height: 500px; top: -250px; right: -100px; }
                .cloud:nth-child(5) { width: 350px; height: 350px; top: -180px; right: 25%; }

                .city-silhouette {
                    position: fixed; top: 15vh; left: 0; width: 100%; height: 100px;
                    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0,100 L0,80 L20,80 L20,60 L40,60 L40,90 L60,90 L60,50 L90,50 L90,70 L110,70 L110,40 L150,40 L150,80 L180,80 L180,30 L220,30 L220,70 L250,70 L250,50 L280,50 L280,80 L320,80 L320,20 L370,20 L370,60 L400,60 L400,90 L430,90 L430,40 L480,40 L480,80 L520,80 L520,30 L570,30 L570,70 L600,70 L600,50 L640,50 L640,90 L680,90 L680,20 L730,20 L730,80 L760,80 L760,40 L810,40 L810,70 L840,70 L840,50 L880,50 L880,80 L920,80 L920,30 L970,30 L970,80 L1000,80 L1000,100 Z" fill="rgba(255,255,255,0.15)"/></svg>') repeat-x;
                    background-size: contain; z-index: 0; pointer-events: none;
                }

                .app-container {
                    position: relative; z-index: 10; width: 100%; min-height: 100vh;
                    display: flex; padding: 20px; gap: 20px;
                }
                .main-content { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; }

                .glass-box {
                    background: var(--card-glass); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
                    border-radius: 20px; border: 2px solid rgba(255, 255, 255, 0.5); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
                }

                /* SIDEBAR STYLES */
                .sidebar-glass {
                    width: 280px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px);
                    border-radius: 20px; border: 2px solid rgba(255, 255, 255, 0.6); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                    display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0;
                }
                .sidebar-header { padding: 25px 20px; border-bottom: 1px solid rgba(0,0,0,0.05); text-align: center; }
                .sidebar-header h3 { font-weight: 900; color: var(--bg-bottom); margin: 0; letter-spacing: 1px; }
                .sidebar-menu { padding: 15px 10px; flex-grow: 1; overflow-y: auto; }
                .menu-label { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin: 15px 0 5px 15px; letter-spacing: 1px;}
                .menu-item {
                    display: flex; align-items: center; padding: 10px 15px; margin-bottom: 5px; border-radius: 12px;
                    color: var(--text-main); font-weight: 700; text-decoration: none; cursor: pointer; transition: all 0.2s;
                }
                .menu-item:hover { background: rgba(59, 130, 246, 0.1); color: var(--bg-bottom); }
                .menu-item.active { background: var(--bg-bottom); color: white; box-shadow: 0 4px 10px rgba(29, 78, 216, 0.3); }
                .menu-item i { width: 25px; font-size: 1.1rem; }
                .sidebar-footer { padding: 15px; border-top: 1px solid rgba(0,0,0,0.05); text-align: center;}
                
                .btn-gradient {
                    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); color: white; border: none; border-radius: 12px; padding: 12px;
                    font-weight: 800; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(29, 78, 216, 0.4); transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; width: 100%;
                }
                .btn-gradient:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(29, 78, 216, 0.6); color: white;}
            `}} />
            
            <div className="clouds-container">
                <div className="cloud"></div><div className="cloud"></div><div className="cloud"></div>
                <div className="cloud"></div><div className="cloud"></div>
            </div>
            <div className="city-silhouette"></div>

            <div className="app-container">
                <aside className="sidebar-glass">
                    <div className="sidebar-header">
                        <h3 className="flex justify-center items-center"><i className="fas fa-paper-plane text-blue-600 mr-2"></i>SIPINTAR</h3>
                        <small className="text-gray-500 font-bold block mt-1">Sistem Pencatatan Nomor Surat Keluar</small>
                    </div>
                    
                    <div className="sidebar-menu">
                        <Link href="/dashboard" className={`menu-item ${url.startsWith('/dashboard') ? 'active' : ''}`}>
                            <i className="fas fa-home"></i> Dashboard
                        </Link>
                        
                        <div className="menu-label text-xs">Kategori Umum</div>
                        <Link href="/surat/create/umum" className={`menu-item ${url === '/surat/create/umum' ? 'active' : ''}`}><i className="fas fa-pen-square"></i> Input Surat Umum</Link>
                        <Link href="/surat/agenda/umum" className={`menu-item ${url === '/surat/agenda/umum' ? 'active' : ''}`}><i className="fas fa-book"></i> Agenda Umum</Link>
                        
                        <div className="menu-label text-xs">Kategori Pengadaan</div>
                        <Link href="/surat/create/pengadaan" className={`menu-item ${url === '/surat/create/pengadaan' ? 'active' : ''}`}><i className="fas fa-file-invoice"></i> Input Pengadaan</Link>
                        <Link href="/surat/agenda/pengadaan" className={`menu-item ${url === '/surat/agenda/pengadaan' ? 'active' : ''}`}><i className="fas fa-book"></i> Agenda Pengadaan</Link>
                        
                        <div className="menu-label text-xs">Kategori SK Kadin</div>
                        <Link href="/surat/create/sk" className={`menu-item ${url === '/surat/create/sk' ? 'active' : ''}`}><i className="fas fa-file-signature"></i> Input SK Kadin</Link>
                        <Link href="/surat/agenda/sk" className={`menu-item ${url === '/surat/agenda/sk' ? 'active' : ''}`}><i className="fas fa-book"></i> Agenda SK Kadin</Link>
                    </div>

                    <div className="sidebar-footer">
                        <button onClick={handleLogout} className="w-full bg-white/80 border-2 border-gray-200 text-red-500 rounded-xl py-3 font-bold hover:bg-gray-200 hover:text-gray-800 transition-all flex items-center justify-center">
                            <i className="fas fa-sign-out-alt mr-2"></i> Keluar Sistem
                        </button>
                    </div>
                </aside>

                <div className="main-content">
                    {children}
                </div>
            </div>
        </>
    );
}
