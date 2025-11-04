import { useAppKitAccount } from '@reown/appkit/react'
import React, { useEffect, useState } from 'react'
import ConnectButton from './ConnectButton';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { init, readName } from '../slices/contractSlice';


export default function Auth() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [referrer, setReferrer] = useState(id)

    const { registered } = useSelector((state) => state.contract);

    const dispatch = useDispatch()

    const { address,isConnected } = useAppKitAccount()


    useEffect(() => {
        dispatch(init()).then(() => {
            if (address) {
                dispatch(readName({ address }));
            }
        });
    }, [address, dispatch]);

    useEffect(() => {
        if (registered && isConnected) {
            navigate("/");
        }
    }, [registered,navigate,isConnected]);

    console.log("nav", registered);

    return (
        <div>

            <div id="auth-page" class="page">
                <div class="hidden lg:block min-h-screen">
                    <div class="flex min-h-screen">
                        <div class="flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
                            <div class="absolute inset-0 bg-black/20"></div>
                            <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-600/90"></div>
                            <div class="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                            <div class="absolute bottom-40 right-32 w-48 h-48 bg-pink-400/20 rounded-full blur-2xl"></div>
                            <div class="absolute top-1/2 left-10 w-24 h-24 bg-cyan-400/15 rounded-full blur-lg"></div>
                            <div class="relative flex flex-col justify-center items-center h-full px-16 text-center">
                                <div class="mb-8">
                                    <div class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                        </svg>
                                    </div>
                                    <h1 class="text-5xl font-bold font-display text-white mb-4">Welcome to HEXAWAY</h1>
                                    <p class="text-xl text-indigo-100 max-w-md mx-auto leading-relaxed">The premier destination for NFT trading and digital asset management</p>
                                </div>
                                <div class="grid grid-cols-1 gap-6 max-w-sm w-full">
                                    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                        <div class="text-3xl mb-3">
                                            🎨
                                        </div>
                                        <h3 class="text-lg font-semibold text-white mb-2">Create &amp; Trade</h3>
                                        <p class="text-indigo-100 text-sm">Mint your own NFTs and trade with confidence</p>
                                    </div>
                                    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                        <div class="text-3xl mb-3">
                                            💰
                                        </div>
                                        <h3 class="text-lg font-semibold text-white mb-2">Earn Rewards</h3>
                                        <p class="text-indigo-100 text-sm">Multiple income streams and referral bonuses</p>
                                    </div>
                                    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                        <div class="text-3xl mb-3">
                                            🔒
                                        </div>
                                        <h3 class="text-lg font-semibold text-white mb-2">Secure Platform</h3>
                                        <p class="text-indigo-100 text-sm">Enterprise-grade security for your assets</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex-1 bg-gray-50 flex items-center justify-center p-8">
                            <div class="max-w-md w-full">
                                <div class="text-center mb-8">
                                    <h2 class="text-3xl font-bold font-display text-gray-900 mb-3">Sign In</h2>
                                    <p class="text-gray-600">Connect your wallet to access your account</p>
                                </div>
                                <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

                                    <div class="space-y-6">
                                        <div>
                                            <label for="walletAddress" class="block text-sm font-semibold text-gray-700 mb-3">Wallet Address</label>
                                            <input
                                                value={address}
                                                disabled
                                                type="text" id="walletAddress" name="walletAddress" placeholder="0x..." class="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-base transition-all" required />
                                        </div>
                                        <div>
                                            <label for="referredBy" class="block text-sm font-semibold text-gray-700 mb-3">Referred By (Optional)</label>
                                            <input
                                                value={referrer}
                                                onChange={(e) => { setReferrer(e.target.value) }}
                                                type="text" id="referredBy" name="referredBy" placeholder="Enter referrer's wallet address" class="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-base transition-all" />
                                        </div>
                                    </div>
                                    <div class="mt-8 space-y-4">
                                        {/* <button type="button" 
                                            onclick="connectWallet()" 
                                            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-base"> 
                                            🔗 Connect Wallet </button> */}
                                        <ConnectButton referrer={referrer} />
                                        <div class="relative">
                                            <div class="absolute inset-0 flex items-center">
                                                <div class="w-full border-t border-gray-300"></div>
                                            </div>
                                            {/* <div class="relative flex justify-center text-sm"><span class="px-4 bg-white text-gray-500 font-medium">or</span>
                                                </div> */}
                                        </div>
                                        {/* <button type="submit" class="w-full bg-white text-gray-900 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-300 hover:border-gray-400 text-base"> 📝 Login with Address </button> */}
                                    </div>

                                    <div class="mt-8 pt-6 border-t border-gray-200">
                                        <div class="text-center">
                                            <p class="text-sm text-gray-600 mb-4">Supported Wallets</p>
                                            <div class="flex justify-center space-x-6">
                                                <div class="flex items-center space-x-2 text-sm text-gray-500">
                                                    <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-md"><span class="text-white text-xs font-bold">M</span>
                                                    </div><span class="font-medium">MetaMask</span>
                                                </div>
                                                <div class="flex items-center space-x-2 text-sm text-gray-500">
                                                    <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md"><span class="text-white text-xs font-bold">T</span>
                                                    </div><span class="font-medium">Trust Wallet</span>
                                                </div>
                                                <div class="flex items-center space-x-2 text-sm text-gray-500">
                                                    <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-md"><span class="text-white text-xs font-bold">W</span>
                                                    </div><span class="font-medium">WalletConnect</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-center mt-6">
                                    <p class="text-sm text-gray-600">By connecting your wallet, you agree to our <a href="#" class="text-indigo-600 hover:text-indigo-800 font-medium">Terms of Service</a> and <a href="#" class="text-indigo-600 hover:text-indigo-800 font-medium">Privacy Policy</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:hidden min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative">
                    <div class="absolute inset-0 bg-black/20"></div>
                    <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-600/90"></div>
                    <div class="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                    <div class="absolute bottom-20 left-8 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl"></div>
                    <div class="absolute top-1/3 right-6 w-16 h-16 bg-cyan-400/15 rounded-full blur-lg"></div>
                    <div class="relative flex flex-col min-h-screen">
                        <div class="flex-shrink-0 text-center pt-12 pb-8 px-6">
                            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <h1 class="text-3xl sm:text-4xl font-bold font-display text-white mb-2">Join HEXAWAY</h1>
                            <p class="text-base sm:text-lg text-indigo-100 max-w-sm mx-auto">Connect your wallet to get started with NFT trading</p>
                        </div>
                        <div class="flex-1 px-4 sm:px-6 pb-8">
                            <div class="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md mx-auto">

                                <div class="space-y-5 sm:space-y-6">
                                    <div>
                                        <label for="mobileWalletAddress" class="block text-sm font-semibold text-gray-700 mb-2">Wallet Address</label>
                                        <input
                                                value={address}
                                                disabled
                                        type="text" id="mobileWalletAddress" name="walletAddress" placeholder="0x..." class="w-full px-4 py-3 sm:py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-base transition-all" required />
                                    </div>
                                    <div><label for="mobileReferredBy" class="block text-sm font-semibold text-gray-700 mb-2">Referred By (Optional)</label>

                                        <input
                                            value={referrer}
                                            onChange={(e) => { setReferrer(e.target.value) }}
                                            type="text" id="mobileReferredBy" name="referredBy" placeholder="Enter referrer's wallet address" class="w-full px-4 py-3 sm:py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-base transition-all" />
                                    </div>
                                </div>
                                <div class="mt-6 sm:mt-8 space-y-4">
                                    {/* <button type="button" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform active:scale-95 text-base"> 
                                        🔗 Connect Wallet </button> */}
                                    <ConnectButton referrer={referrer} />
                                    <div class="relative">
                                        <div class="absolute inset-0 flex items-center">
                                            <div class="w-full border-t border-gray-300"></div>
                                        </div>
                                        <div class="relative flex justify-center text-sm">
                                            <span class="px-4 bg-white text-gray-500 font-medium">or</span>
                                        </div>
                                    </div>
                                    {/* <button type="submit" class="w-full bg-white text-gray-900 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-300 hover:border-gray-400 text-base transform active:scale-95"> 📝 Login with Address </button> */}
                                </div>

                                <div class="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
                                    <div class="text-center">
                                        <p class="text-sm text-gray-600 mb-4">Supported Wallets</p>
                                        <div class="flex justify-center space-x-4 sm:space-x-6">
                                            <div class="flex flex-col items-center space-y-1">
                                                <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-md"><span class="text-white text-xs font-bold">M</span>
                                                </div><span class="text-xs text-gray-500">MetaMask</span>
                                            </div>
                                            <div class="flex flex-col items-center space-y-1">
                                                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md"><span class="text-white text-xs font-bold">T</span>
                                                </div><span class="text-xs text-gray-500">Trust Wallet</span>
                                            </div>
                                            <div class="flex flex-col items-center space-y-1">
                                                <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-md"><span class="text-white text-xs font-bold">W</span>
                                                </div><span class="text-xs text-gray-500">WalletConnect</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center mt-6 px-4">
                                <p class="text-sm text-white/80">By connecting your wallet, you agree to our <a href="#" class="text-white font-medium underline">Terms of Service</a> and <a href="#" class="text-white font-medium underline">Privacy Policy</a></p>
                            </div>
                        </div>
                        <div class="flex-shrink-0 px-6 pb-8">
                            <div class="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                                    <div class="text-2xl mb-1">
                                        🎨
                                    </div>
                                    <div class="text-xs text-white font-medium">
                                        Create &amp; Trade
                                    </div>
                                </div>
                                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                                    <div class="text-2xl mb-1">
                                        💰
                                    </div>
                                    <div class="text-xs text-white font-medium">
                                        Earn Rewards
                                    </div>
                                </div>
                                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                                    <div class="text-2xl mb-1">
                                        🔒
                                    </div>
                                    <div class="text-xs text-white font-medium">
                                        Secure Platform
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
