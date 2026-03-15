import { Form, Head } from '@inertiajs/react';
import { store } from '@/routes/login';

export default function Login() {
    return (
        <div className="w-full min-h-screen flex relative font-['Nunito']" style={{
            background: 'linear-gradient(180deg, #60A5FA 0%, #3B82F6 40%, #1D4ED8 100%)',
            backgroundAttachment: 'fixed',
            color: '#1E293B',
            overflowX: 'hidden'
        }}>
            <Head title="SIPINTAR - Log in" />
            
            <div className="clouds-container absolute top-[-50px] left-0 w-full h-[150px] flex justify-around opacity-60 pointer-events-none z-0">
                <div className="cloud bg-white rounded-full absolute blur-[4px] w-[300px] h-[300px] top-[-150px] left-[-50px]"></div>
                <div className="cloud bg-white rounded-full absolute blur-[4px] w-[400px] h-[400px] top-[-200px] left-[20%]"></div>
                <div className="cloud bg-white rounded-full absolute blur-[4px] w-[250px] h-[250px] top-[-100px] left-[50%]"></div>
                <div className="cloud bg-white rounded-full absolute blur-[4px] w-[500px] h-[500px] top-[-250px] right-[-100px]"></div>
                <div className="cloud bg-white rounded-full absolute blur-[4px] w-[350px] h-[350px] top-[-180px] right-[25%]"></div>
            </div>
            <div className="city-silhouette absolute top-[15vh] left-0 w-full h-[100px] z-0 pointer-events-none" style={{
                background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 100\" preserveAspectRatio=\"none\"><path d=\"M0,100 L0,80 L20,80 L20,60 L40,60 L40,90 L60,90 L60,50 L90,50 L90,70 L110,70 L110,40 L150,40 L150,80 L180,80 L180,30 L220,30 L220,70 L250,70 L250,50 L280,50 L280,80 L320,80 L320,20 L370,20 L370,60 L400,60 L400,90 L430,90 L430,40 L480,40 L480,80 L520,80 L520,30 L570,30 L570,80 L1000,80 L1000,100 Z\" fill=\"rgba(255,255,255,0.15)\"/></svg>') repeat-x"
            }}></div>

            <div className="w-full relative z-10 flex flex-col items-center justify-center min-h-screen">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl border-2 border-white/50 shadow-xl w-full max-w-[550px] p-10 relative mt-16">
                    <div className="absolute top-[-80px] left-[50%] translate-x-[-50%] w-[160px] h-[120px] flex justify-center items-end">
                        <div className="relative w-[120px] h-[100px]">
                            <div className="absolute bg-[#FDE047] border-2 border-slate-800 rounded shadow-[2px_2px_0_#1E293B] w-[80px] h-[60px] bottom-[10px] left-[10px] rotate-[-10deg]"></div>
                            <div className="absolute bg-[#38BDF8] border-2 border-slate-800 rounded shadow-[2px_2px_0_#1E293B] w-[70px] h-[80px] bottom-[15px] left-[30px] rotate-[5deg]"></div>
                            <div className="absolute bg-white border-2 border-slate-800 rounded shadow-[2px_2px_0_#1E293B] w-[90px] h-[50px] bottom-0 left-[20px] flex justify-center items-center text-slate-800 font-black z-10">
                                <i className="fas fa-envelope-open-text fa-2x"></i>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-[#1D4ED8] font-black text-center text-3xl mb-1">SIPINTAR</h2>
                        <p className="text-slate-500 font-semibold text-center mb-8">Sistem Pencatatan Surat Keluar</p>
                        
                        <Form {...store.form()} resetOnSuccess={['password']} className="flex flex-col gap-4">
                            {({ processing, errors }) => (
                                <>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden mb-1">
                                            <i className="fas fa-user p-4 text-slate-500 text-lg w-[50px] text-center"></i>
                                            <input 
                                                type="text" 
                                                name="username"
                                                required 
                                                autoFocus
                                                placeholder="Username" 
                                                className="border-none outline-none p-4 w-full bg-transparent text-slate-800 font-semibold ring-0 focus:ring-0"
                                            />
                                        </div>
                                        {errors.username && <span className="text-red-500 text-sm font-bold ml-2">{errors.username}</span>}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden mb-1">
                                            <i className="fas fa-lock p-4 text-slate-500 text-lg w-[50px] text-center"></i>
                                            <input 
                                                type="password" 
                                                name="password"
                                                required 
                                                placeholder="Password" 
                                                className="border-none outline-none p-4 w-full bg-transparent text-slate-800 font-semibold ring-0 focus:ring-0"
                                            />
                                        </div>
                                        {errors.password && <span className="text-red-500 text-sm font-bold ml-2">{errors.password}</span>}
                                    </div>
                                    
                                    <div className="mt-2">
                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white border-none rounded-xl p-4 font-black text-lg shadow-[0_4px_15px_rgba(29,78,216,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(29,78,216,0.6)] disabled:opacity-50"
                                        >
                                            {processing ? 'Logging in...' : 'Log In Dashboard'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    );
}
