import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { init, readName } from '../slices/contractSlice';
import { useAppKitAccount } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';

export default function Home() {

const dispatch = useDispatch();

const { registered } = useSelector((state) => state.contract);  
const navigate = useNavigate()

const { address } = useAppKitAccount();
    useEffect(() => {
    dispatch(init()).then(() => {
      if (address) {
        dispatch(readName({ address }));
      }
    });
  }, [dispatch, address]);

  const handleClick = async ()=>{
    if(registered){
        navigate("/trade")
    }else{
        navigate("/auth")
    }

  }

    return (
        <div>            <div id="home-page" class="page">
            <section class="relative hero-gradient py-20 overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"
                ></div>

                <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 id="hero-title" class="text-5xl md:text-7xl font-bold font-display bg-gradient-to-r from-gray-900 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-6 leading-tight">Discover, Trade &amp; Create NFTs</h2>
                    <p id="hero-subtitle" class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">Join the future of digital art trading</p>
                    <button 
                    onClick={handleClick} 
                    
                    class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105">Start Trading Now</button>
                </div>
            </section>
            <section class="py-20 overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100">
                <div class="mb-16 text-center">
                    <h3 class="text-4xl font-bold font-display text-gray-900 mb-6">Featured Collections</h3>
                    <p class="text-xl text-gray-600 max-w-2xl mx-auto">Discover premium digital assets from world-renowned artists and creators</p>
                </div>
                <div class="scroll-animation flex space-x-8">
                    <div class="flex-shrink-0 w-80 h-80 bg-black rounded-2xl overflow-hidden shadow-2xl">
                        <div class="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 relative">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div class="w-32 h-40 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full opacity-80"></div>
                                <div class="absolute top-8 left-8 w-4 h-4 bg-cyan-300 rounded-full animate-pulse"></div>
                                <div class="absolute top-12 right-8 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
                                <div class="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-cyan-400"></div>
                            </div>
                            <div class="absolute bottom-4 left-4 text-white">
                                <div class="text-sm font-bold">
                                    Cyber Genesis #001
                                </div>
                                <div class="text-xs opacity-75">
                                    by DigitalVision
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-shrink-0 w-80 h-80 bg-white rounded-2xl overflow-hidden shadow-2xl">
                        <div class="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 relative">
                            <div class="absolute inset-0">
                                <div class="absolute top-12 left-12 w-24 h-24 bg-yellow-300 rounded-full opacity-70 blur-sm"></div>
                                <div class="absolute top-32 right-16 w-16 h-32 bg-blue-400 rounded-lg opacity-60 transform rotate-45"></div>
                                <div class="absolute bottom-20 left-20 w-20 h-20 bg-green-400 opacity-50 transform rotate-12"></div>
                                <div class="absolute top-20 right-32 w-8 h-8 bg-white rounded-full"></div>
                            </div>
                            <div class="absolute bottom-4 left-4 text-white">
                                <div class="text-sm font-bold">
                                    Abstract Dreams #247
                                </div>
                                <div class="text-xs opacity-75">
                                    by ModernArt
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-shrink-0 w-80 h-80 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                        <div class="w-full h-full bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-900 relative">
                            <div class="absolute bottom-0 left-0 right-0">
                                <svg viewbox="0 0 320 200" class="w-full h-32"><polygon points="0,200 80,120 160,140 240,100 320,130 320,200" fill="#1e1b4b" opacity="0.8" /> <polygon points="0,200 60,150 140,160 220,130 280,150 320,140 320,200" fill="#312e81" opacity="0.6" />
                                </svg>
                            </div>
                            <div class="absolute top-8 left-12 w-1 h-1 bg-white rounded-full"></div>
                            <div class="absolute top-16 right-20 w-1 h-1 bg-white rounded-full"></div>
                            <div class="absolute top-12 right-32 w-1 h-1 bg-white rounded-full"></div>
                            <div class="absolute top-20 left-32 w-1 h-1 bg-white rounded-full"></div>
                            <div class="absolute top-16 right-16 w-12 h-12 bg-yellow-200 rounded-full opacity-90"></div>
                            <div class="absolute bottom-4 left-4 text-white">
                                <div class="text-sm font-bold">
                                    Cosmic Valley #089
                                </div>
                                <div class="text-xs opacity-75">
                                    by SpaceArt
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-shrink-0 w-80 h-80 bg-white rounded-2xl overflow-hidden shadow-2xl">
                        <div class="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 relative">
                            <div class="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-4">
                                <div class="bg-white opacity-20 rounded"></div>
                                <div class="bg-white opacity-40 rounded"></div>
                                <div class="bg-white opacity-60 rounded"></div>
                                <div class="bg-white opacity-30 rounded"></div>
                                <div class="bg-white opacity-50 rounded"></div>
                                <div class="bg-white opacity-70 rounded"></div>
                                <div class="bg-white opacity-20 rounded"></div>
                                <div class="bg-white opacity-40 rounded"></div>
                                <div class="bg-white opacity-60 rounded"></div>
                                <div class="bg-white opacity-80 rounded"></div>
                                <div class="bg-white opacity-30 rounded"></div>
                                <div class="bg-white opacity-50 rounded"></div>
                                <div class="bg-white opacity-40 rounded"></div>
                                <div class="bg-white opacity-60 rounded"></div>
                                <div class="bg-white opacity-20 rounded"></div>
                                <div class="bg-white opacity-70 rounded"></div>
                            </div>
                            <div class="absolute bottom-4 left-4 text-white">
                                <div class="text-sm font-bold">
                                    Pixel Matrix #156
                                </div>
                                <div class="text-xs opacity-75">
                                    by GeometricArt
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-shrink-0 w-80 h-80 bg-amber-50 rounded-2xl overflow-hidden shadow-2xl">
                        <div class="w-full h-full bg-gradient-to-b from-amber-200 via-orange-300 to-red-400 relative">
                            <div class="absolute top-16 left-1/2 transform -translate-x-1/2">
                                <div class="w-24 h-32 bg-gradient-to-b from-pink-200 to-orange-200 rounded-full"></div>
                                <div class="absolute top-8 left-6 w-3 h-3 bg-gray-800 rounded-full"></div>
                                <div class="absolute top-8 right-6 w-3 h-3 bg-gray-800 rounded-full"></div>
                                <div class="absolute top-12 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-orange-300"></div>
                                <div class="absolute top-16 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-red-400 rounded-full"></div>
                            </div>
                            <div class="absolute bottom-4 left-4 text-gray-800">
                                <div class="text-sm font-bold">
                                    Portrait Series #034
                                </div>
                                <div class="text-xs opacity-75">
                                    by ClassicArt
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="py-16 bg-gray-100">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 class="text-2xl font-bold font-display text-gray-900 mb-6">🏆 Today's Top Picks</h3>
                            <div class="space-y-4">
                                <div class="bg-white/95 backdrop-blur-md border border-blue-200 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-4">
                                    <div class="w-16 h-16 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 rounded-lg overflow-hidden">
                                        <div class="w-full h-full relative">
                                            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                <div class="w-8 h-10 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full opacity-80"></div>
                                                <div class="absolute top-2 left-2 w-1 h-1 bg-cyan-300 rounded-full"></div>
                                                <div class="absolute top-3 right-2 w-1 h-1 bg-pink-400 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Cyber Genesis #7804</h4>
                                        <p class="text-gray-600">Floor: 45.2 $</p>
                                    </div>
                                </div>
                                <div class="bg-white/95 backdrop-blur-md border border-blue-200 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-4">
                                    <div class="w-16 h-16 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 rounded-lg overflow-hidden">
                                        <div class="w-full h-full relative">
                                            <div class="absolute top-3 left-3 w-6 h-6 bg-yellow-300 rounded-full opacity-70 blur-sm"></div>
                                            <div class="absolute top-8 right-4 w-4 h-8 bg-blue-400 rounded-lg opacity-60 transform rotate-45"></div>
                                            <div class="absolute bottom-5 left-5 w-5 h-5 bg-green-400 opacity-50 transform rotate-12"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Abstract Dreams #3749</h4>
                                        <p class="text-gray-600">Floor: 32.1 $</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold font-display text-gray-900 mb-6">💰 Top Sellers</h3>
                            <div class="space-y-4">
                                <div class="bg-white/95 backdrop-blur-md border border-blue-200 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                                        <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center"><span class="text-emerald-600 font-bold text-sm">DV</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">DigitalVision</h4>
                                        <p class="text-gray-600">Volume: 1,234 $</p>
                                    </div>
                                </div>
                                <div class="bg-white/95 backdrop-blur-md border border-blue-200 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                        <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center"><span class="text-purple-600 font-bold text-sm">SA</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">SpaceArt</h4>
                                        <p class="text-gray-600">Volume: 987 $</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="py-16 bg-white">
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 class="text-3xl font-bold font-display text-gray-900 mb-8">Contact Us</h3>
                    <div class="grid md:grid-cols-3 gap-8">
                        <div class="p-6 bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl hover:shadow-lg transition-all duration-200">
                            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-2">Email Support</h4>
                            <p class="text-gray-600">support@hexaway.com</p>
                        </div>
                        <div class="p-6 bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl hover:shadow-lg transition-all duration-200">
                            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-2">Live Chat</h4>
                            <p class="text-gray-600">24/7 Support Available</p>
                        </div>
                        <div class="p-6 bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl hover:shadow-lg transition-all duration-200">
                            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-2">Community</h4>
                            <p class="text-gray-600">Join our Discord</p>
                        </div>
                    </div>
                </div>
            </section>
        </div ></div>
    )
}
