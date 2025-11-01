import { useAppKitAccount } from '@reown/appkit/react';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useConfig } from 'wagmi';
import { executeContract, formatAddress, formatWithCommas } from '../utils/contractExecutor';
import { formatEther } from 'ethers';
import toast from 'react-hot-toast';
import { init, readName } from '../slices/contractSlice';
import { mlmcontractaddress, usdtContract } from '../config';
import CountdownTimer from './Timer';
import Spinner from './Spinner';

export default function Dashboard() {

    const config = useConfig()
    const { Package, myNFTs, packages, downlines, registered, admin, allowance, NFTQueBalance, limitUtilized, NFTque

        , levelIncome,
        referralIncome,
        tradingIncome, walletBalance,
        status, error
    } = useSelector((state) => state.contract);
    const { address } = useAppKitAccount();
    const [referrer, setReferrer] = useState()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(init()).then(() => {
            if (address) {
                dispatch(readName({ address }));
            }
        });
    }, [dispatch, address]);


    const inputRef = useRef();

    const handleCopy = async () => {
        const value = inputRef.current.value;
        await navigator.clipboard.writeText(value);
        toast.success('Copied to clipboard!');
    };


    const handleUpdate2 = async (id) => {
        await executeContract({
            config,
            functionName: "buyPackage",
            args: [id],
            onSuccess: (txHash, receipt) => {
                console.log("🎉 Tx Hash:", txHash);
                console.log("🚀 Tx Receipt:", receipt);
                dispatch(readName({ address: receipt.from }));
                setLoading(false)
            },
            onError: (err) => {
                console.error("🔥 Error in register:", err);
                toast.error("Transaction failed");
                setLoading(false)
            },
        });
    };




    const handleUpdate = async (pkg) => {
        setLoading(true)
        // if (allowance >= pkg.price) {
        //     handleUpdate2(pkg.id)
        // } else {
        await executeContract({
            config,
            functionName: "approve",
            args: [mlmcontractaddress, pkg.price],
            onSuccess: () => handleUpdate2(pkg.id),
            onError: (err) => {
                toast.error("Transaction failed", err)
                setLoading(false)
            },
            contract: usdtContract
        });
        //}


    };

    const normalizedAddr = address && address.toLowerCase();
    const normalizedQue = NFTque &&  NFTque.map(a => a.toLowerCase());


    const NFTQueStatus = NFTque &&  normalizedQue.indexOf(normalizedAddr) < 0
    ? "Not in the Que"
    : normalizedQue.indexOf(normalizedAddr) + 1;

    const now = new Date().getTime()


     const isLoading = !Package || !downlines || !packages;

  if (isLoading) {
    // show a waiting/loading screen
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
      </div>
    );
  }


    return (
        <div>

            <div id="dashboard-page" class="page">
                <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 py-8 sm:py-12">
                        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Dashboard</h1>
                            <p class="text-indigo-100 text-sm sm:text-base">Manage your NFT portfolio and earnings</p>
                        </div>
                    </div>
                    <div class="relative -mt-6 sm:-mt-8">
                        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                            <div class="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                                <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                    <div class="text-center p-3 sm:p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                                        <div class="text-xs sm:text-sm text-gray-600 mt-1">
                                            User ID
                                        </div>
                                        <div class="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-600" id="user-id">
                                            {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "..."}
                                        </div>
                                    </div>
                                    <div class="text-center p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                                        <div class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900" id="referred-by">
                                            Direct
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 mt-1">
                                            {formatAddress(downlines?.referrer)}
                                        </div>
                                    </div>
                                    <div class="text-center p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                                        <div class="text-xs sm:text-sm text-gray-600 mt-1">
                                            Wallet Balance
                                        </div>
                                        <div class="text-sm sm:text-base lg:text-lg font-bold text-green-600" id="wallet-balance">
                                            ${formatWithCommas(walletBalance)}
                                        </div>
                                    </div>
                                    <div class="text-center p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                                        <div class="text-xs sm:text-sm text-gray-600 mt-1">
                                            Active Package
                                        </div>
                                        <div class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900" id="active-package">
                                            {Package.id == "0" ? "Welcome" : `$ ${formatEther(Package.price)}`}
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-xl">
                                    <div class="text-xs sm:text-sm text-gray-600 mb-2">
                                        Referral Link:
                                    </div>
                                    <div class="flex flex-col sm:flex-row gap-2">
                                        <input

                                            ref={inputRef} type="text" id="referral-link"
                                            value={`https://hexaway.com/auth/${address}`} class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm" readonly />
                                        <button
                                            onClick={handleCopy}
                                            class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm hover:bg-indigo-700 transition-colors">Copy</button>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Hexaway Packages</h3>
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
                                    <div class="package-card bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl text-center border-2 border-transparent hover:border-blue-300 transition-all">
                                        <h4 class="font-bold text-base sm:text-xl text-blue-800 mb-2">WELCOME</h4>
                                        <div class="text-2xl sm:text-3xl font-bold text-blue-600 my-2 sm:my-3">
                                            ${formatEther(packages[0].price)}
                                        </div>
                                        <div class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                                            Limit: {formatEther(packages[0].limit)}
                                        </div>
                                        <button
                                            disabled={Package.id == 0}
                                            style={Number(Package.id) + 1 > 0 ? { backgroundColor: "grey", color: "white" } : {}}
                                            class="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 text-sm sm:text-base transition-colors font-medium">Upgrade</button>
                                    </div>
                                    <div class="package-card bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl text-center border-2 border-transparent hover:border-green-300 transition-all">
                                        <h4 class="font-bold text-base sm:text-xl text-green-800 mb-2">DI</h4>
                                        <div class="text-2xl sm:text-3xl font-bold text-green-600 my-2 sm:my-3">
                                            ${formatEther(packages[1].price)}
                                        </div>
                                        <div class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                                            Limit: ${formatEther(packages[1].limit)}
                                        </div>
                                        <button
                                            disabled={Package.id == 1 || downlines.indirect.length < packages[1].team}
                                            style={Number(Package.id) == 1 || downlines.indirect.length < packages[1].team ? { backgroundColor: "grey", color: "white" } : {}}
                                            onClick={() => { handleUpdate(packages[1]) }}
                                            class="w-full bg-purple-600 text-white py-2 sm:py-3 rounded-lg hover:bg-purple-700 text-sm sm:text-base transition-colors font-medium">
                                            {
                                                loading ? (
                                                    <>
                                                        <Spinner size={20} color="#fff" />
                                                        <span>Processing...</span>
                                                    </>
                                                ) :

                                                    downlines.indirect.length >= packages[1].team ? `Upgrade` : `Need ${packages[1].team - downlines.indirect.length} team members`}
                                        </button>
                                    </div>
                                    <div class="package-card bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-xl text-center border-2 border-transparent hover:border-purple-300 transition-all">
                                        <h4 class="font-bold text-base sm:text-xl text-purple-800 mb-2">TRI</h4>
                                        <div class="text-2xl sm:text-3xl font-bold text-purple-600 my-2 sm:my-3">
                                            ${formatEther(packages[2].price)}
                                        </div>
                                        <div class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                                            Limit: ${formatEther(packages[2].limit)}
                                        </div><button
                                            disabled={Package.id == 2 || downlines.indirect.length < packages[2].team}
                                            style={Number(Package.id) == 2 || downlines.indirect.length < packages[2].team ? { backgroundColor: "grey", color: "white" } : {}}
                                            onClick={() => { handleUpdate(packages[2]) }}
                                            class="w-full bg-purple-600 text-white py-2 sm:py-3 rounded-lg hover:bg-purple-700 text-sm sm:text-base transition-colors font-medium">
                                            {
                                                loading ? (
                                                    <>
                                                        <Spinner size={20} color="#fff" />
                                                        <span>Processing...</span>
                                                    </>
                                                ) : downlines.indirect.length >= packages[2].team ? `Upgrade` : `Need ${packages[2].team - downlines.indirect.length} team members`}
                                        </button>
                                    </div>
                                    <div class="package-card bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 rounded-xl text-center border-2 border-transparent hover:border-yellow-300 transition-all">
                                        <h4 class="font-bold text-base sm:text-xl text-yellow-800 mb-2">TETRA</h4>
                                        <div class="text-2xl sm:text-3xl font-bold text-yellow-600 my-2 sm:my-3">
                                            ${formatEther(packages[3].price)}
                                        </div>
                                        <div class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                                            Limit: ${formatEther(packages[3].limit)}
                                        </div><button
                                            disabled={Package.id == 3 || downlines.indirect.length < packages[3].team}
                                            style={Number(Package.id) == 3 || downlines.indirect.length < packages[3].team ? { backgroundColor: "grey", color: "white" } : {}}
                                            onClick={() => { handleUpdate(packages[3]) }}
                                            class="w-full bg-purple-600 text-white py-2 sm:py-3 rounded-lg hover:bg-purple-700 text-sm sm:text-base transition-colors font-medium">
                                            {loading ? (
                                                <>
                                                    <Spinner size={20} color="#fff" />
                                                    <span>Processing...</span>
                                                </>
                                            ) : downlines.indirect.length >= packages[3].team ? `Upgrade` : `Need ${packages[3].team - downlines.indirect.length} team members`}
                                        </button>
                                    </div>
                                    <div class="package-card bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 rounded-xl text-center border-2 border-transparent hover:border-red-300 transition-all">
                                        <h4 class="font-bold text-base sm:text-xl text-red-800 mb-2">PENTA</h4>
                                        <div class="text-2xl sm:text-3xl font-bold text-red-600 my-2 sm:my-3">
                                            ${formatEther(packages[4].price)}
                                        </div>
                                        <div class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                                            Limit: ${formatEther(packages[4].limit)}
                                        </div><button
                                            disabled={Package.id == 4 || downlines.indirect.length < packages[4].team}
                                            style={Number(Package.id) == 4 || downlines.indirect.length < packages[4].team ? { backgroundColor: "grey", color: "white" } : {}}
                                            onClick={() => { handleUpdate(packages[4]) }}
                                            class="w-full bg-purple-600 text-white py-2 sm:py-3 rounded-lg hover:bg-purple-700 text-sm sm:text-base transition-colors font-medium">
                                            {loading ? (
                                                <>
                                                    <Spinner size={20} color="#fff" />
                                                    <span>Processing...</span>
                                                </>
                                            ) : downlines.indirect.length >= packages[4].team ? `Upgrade` : `Need ${packages[4].team - downlines.indirect.length} team members`}
                                        </button>
                                    </div>
                                    <div class="package-card bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 sm:p-6 rounded-xl text-center border-2 border-transparent hover:border-indigo-300 transition-all">
                                        <h4 class="font-bold text-base sm:text-xl text-indigo-800 mb-2">HEXA</h4>
                                        <div class="text-2xl sm:text-3xl font-bold text-indigo-600 my-2 sm:my-3">
                                            ${formatEther(packages[5].price)}
                                        </div>
                                        <div class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                                            Limit: ${formatEther(packages[5].limit)}
                                        </div><button
                                            disabled={Package.id == 5 || downlines.indirect.length < packages[5].team}
                                            style={Number(Package.id) == 5 || downlines.indirect.length < packages[5].team ? { backgroundColor: "grey", color: "white" } : {}}
                                            onClick={() => { handleUpdate(packages[5]) }}
                                            class="w-full bg-purple-600 text-white py-2 sm:py-3 rounded-lg hover:bg-purple-700 text-sm sm:text-base transition-colors font-medium">
                                            {loading ? (
                                                <>
                                                    <Spinner size={20} color="#fff" />
                                                    <span>Processing...</span>
                                                </>
                                            ) : downlines.indirect.length >= packages[5].team ? `Upgrade` : `Need ${packages[5].team - downlines.indirect.length} team members`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                <div class="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-4 sm:p-6 text-center">
                                    <div class="text-2xl sm:text-3xl mb-2">
                                        🤝
                                    </div>
                                    <h4 class="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Direct Referral Bonus</h4>
                                    <div id="group-trading-bonus" class="text-xl sm:text-2xl font-bold text-green-600">
                                        ${referralIncome}
                                    </div>
                                </div>
                                <div class="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-4 sm:p-6 text-center">
                                    <div class="text-2xl sm:text-3xl mb-2">
                                        💰
                                    </div>
                                    <h4 class="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Level Bonus</h4>
                                    <div id="level-income" class="text-xl sm:text-2xl font-bold text-blue-600">
                                        ${levelIncome}
                                    </div>
                                </div>
                                <div class="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-4 sm:p-6 text-center">
                                    <div class="text-2xl sm:text-3xl mb-2">
                                        📈
                                    </div>
                                    <h4 class="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Team Trading Bonus</h4>
                                    <div id="referral-income" class="text-xl sm:text-2xl font-bold text-purple-600">
                                        ${tradingIncome}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div class="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8">
                            <div class="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-blue-200">
                                <div class="text-center mb-4">
                                    <h3 class="text-lg sm:text-xl font-bold text-blue-800 mb-2">⏰ Package Expiry Countdown</h3>
                                    <p class="text-xs sm:text-sm text-gray-600">Time remaining for your current package </p>
                                </div>
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                    <div class="text-center p-3 sm:p-4 bg-white/70 rounded-lg border border-blue-100">
                                        <div class="text-2xl sm:text-3xl font-bold text-blue-600" id="countdown-days">
                                            30
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            Days
                                        </div>
                                    </div>
                                    <div class="text-center p-3 sm:p-4 bg-white/70 rounded-lg border border-blue-100">
                                        <div class="text-2xl sm:text-3xl font-bold text-blue-600" id="countdown-hours">
                                            00
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            Hours
                                        </div>
                                    </div>
                                    <div class="text-center p-3 sm:p-4 bg-white/70 rounded-lg border border-blue-100">
                                        <div class="text-2xl sm:text-3xl font-bold text-blue-600" id="countdown-minutes">
                                            00
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            Minutes
                                        </div>
                                    </div>
                                    <div class="text-center p-3 sm:p-4 bg-white/70 rounded-lg border border-blue-100">
                                        <div class="text-2xl sm:text-3xl font-bold text-blue-600" id="countdown-seconds">
                                            00
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            Seconds
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-4 text-center">
                                    <div class="text-xs sm:text-sm text-gray-500">
                                        Package expires on: <span id="expiry-date" class="font-medium text-gray-700"></span>
                                    </div>

                                </div>
                            </div>
                        </div> */}

                        {
                            <CountdownTimer durationInSeconds={Number(Package.purchaseTime) + 60 * 60 * 24 * 30 - now / 1000} />
                        }
                    </div>
                    <div class="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
                        <div class="p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl border border-purple-200">
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                <h3 class="text-base sm:text-lg font-semibold text-purple-800 mb-2 sm:mb-0">🎨 NFTque Status</h3><span id="nftque-status-badge" class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs sm:text-sm font-medium self-start">Inactive</span>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="text-center p-3 bg-white/50 rounded-lg">
                                    <div class="text-lg sm:text-xl font-bold text-pink-600" id="nftque-earnings">
                                        ${NFTQueBalance}
                                    </div>
                                    <div class="text-xs sm:text-sm text-gray-600">
                                        NFTque Earnings
                                    </div>
                                </div>
                                <div class="text-center p-3 bg-white/50 rounded-lg">
                                    <div class="text-lg sm:text-xl font-bold text-indigo-600" id="nftque-position">
                                        {NFTQueStatus}
                                    </div>
                                    <div class="text-xs sm:text-sm text-gray-600">
                                        NFTque Position
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4 sm:mt-6">
                                <div class="flex items-center justify-between mb-2"><span class="text-xs sm:text-sm text-gray-600"></span> <span class="text-xs sm:text-sm font-medium text-purple-600" id="nftque-progress"></span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                                    <div id="nftque-progress-bar" class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 sm:h-3 rounded-full" style={{ width: "0%" }}></div>
                                </div>
                                {/* <p class="text-xs text-gray-500 mt-2">Create or purchase 5 NFTs to activate NFTque Level 1 and start earning NFTque income!</p> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
