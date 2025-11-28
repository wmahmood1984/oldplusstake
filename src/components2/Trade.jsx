import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { formatWithCommas } from '../utils/contractExecutor';
import { formatEther } from 'ethers';
import { helperAbi, helperAddress, web3 } from '../config';
import { NFT } from './NFT';
import { Link } from 'react-router-dom';
import { useAppKitAccount } from '@reown/appkit/react';
import TradingLimitTimer from './Timer4';

export default function Trade() {

    const { Package, myNFTs, packages, downlines, registered, admin, allowance, NFTQueBalance, limitUtilized, NFTque

        , levelIncome,
        referralIncome,
        tradingIncome, walletBalance, userTradingTime, timeLimit,
        status, error
    } = useSelector((state) => state.contract);
    const { address } = useAppKitAccount();




    const [nfts, setNFTs] = useState()
    const [toggle, setToggle] = useState(false)
    const [userTradingLimitTime, setUserTradingLimitTime] = useState(0)
    const helperContract = new web3.eth.Contract(helperAbi, helperAddress)

    // useEffect(() => {


    //     const abc = async () => {
    //         const _userTradingLimitTime = await helperContract.methods.userTradingLimitTime(address).call()
    //         setUserTradingLimitTime(_userTradingLimitTime)
    //         const _nfts = await helperContract.methods.getNFTs().call()
    //         const _filteredNFTs = _nfts.filter(v => v._owner != "0x0000000000000000000000000000000000000000" &&
    //             v._owner.toLowerCase() !== address.toLowerCase()
    //         )

    //         console.log("nn", _nfts);
    //         const resolved = await Promise.all(
    //             _filteredNFTs.map(async (nft) => {
    //                 try {
    //                     const res = await fetch(nft.uri);
    //                     const _purchasedTime = await helperContract.methods.idPurchasedtime(nft.id).call();
    //                     if (!res.ok) throw new Error(`Failed to fetch ${nft.uri}`);
    //                     const meta = await res.json();

    //                     return {
    //                         id: nft.id,
    //                         name: meta.name || "Unnamed NFT",
    //                         description: meta.description || "",
    //                         image: meta.image || "",
    //                         price: nft.price ? formatEther(nft.price.toString()) : "0",
    //                         premium: nft.premium || false,
    //                         creator: meta.creator || "Unknown",
    //                         owner: nft._owner || "Unknown",
    //                         uri: nft.uri,
    //                         source: nft.source,
    //                         nftObject: nft,
    //                         purchasedTime: _purchasedTime
    //                     };
    //                 } catch (err) {
    //                     console.error("Error fetching metadata for", nft.uri, err);
    //                     return null;
    //                 }
    //             })
    //         );


    //         setNFTs(resolved)
    //     }

    //     abc()


    // }, [toggle, address])

useEffect(() => {

    const processInBatches = async (items, batchSize, callback) => {
        const results = [];

        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);

            const batchResults = await Promise.all(
                batch.map(item => callback(item))
            );

            results.push(...batchResults);

            // small wait so RPC does NOT rate-limit
            await new Promise(r => setTimeout(r, 200));
        }

        return results;
    };

    const abc = async () => {
        try {
            const _userTradingLimitTime =
                await helperContract.methods.userTradingLimitTime(address).call();

            setUserTradingLimitTime(_userTradingLimitTime);

            const _nfts = await helperContract.methods.getNFTs().call();

            const _filteredNFTs = _nfts.filter(
                v =>
                    v._owner !== "0x0000000000000000000000000000000000000000" &&
                    v._owner.toLowerCase() !== address.toLowerCase()
            );

            console.log("nn", _nfts);

            const resolved = await processInBatches(_filteredNFTs, 5, async (nft) => {
                try {
                    const res = await fetch(nft.uri);
                    if (!res.ok) throw new Error(`Failed to fetch ${nft.uri}`);

                    const meta = await res.json();
                    const _purchasedTime =
                        await helperContract.methods.idPurchasedtime(nft.id).call();

                    return {
                        id: nft.id,
                        name: meta.name || "Unnamed NFT",
                        description: meta.description || "",
                        image: meta.image || "",
                        price: nft.price ? formatEther(nft.price.toString()) : "0",
                        premium: nft.premium || false,
                        creator: meta.creator || "Unknown",
                        owner: nft._owner || "Unknown",
                        uri: nft.uri,
                        source: nft.source,
                        nftObject: nft,
                        purchasedTime: _purchasedTime
                    };
                } catch (err) {
                    console.error("Error fetching metadata for", nft.uri, err);
                    return null;
                }
            });

            setNFTs(resolved);
        } catch (error) {
            console.error("Error in abc()", error);
        }
    };

    abc();

}, [toggle, address]);

    const isLoading = !nfts || !Package



    if (isLoading) {
        // show a waiting/loading screen
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
            </div>
        );
    }

    const now = new Date().getTime() / 1000

    const revisedLimitUtilized = 
    now - Number(userTradingLimitTime) > 60 * 60 * 24 ? 0 : limitUtilized

    const randomeNFTs = nfts
        ? [...nfts].sort((a, b) => a.purchasedTime - b.purchasedTime)
        : [];//nfts && shuffleArray(nfts)


    console.log("object", randomeNFTs);



    return (
        <div>

            <div id="trade-page" class="page">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <h2 class="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">NFT Marketplace</h2><button onclick="showPage('history')" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg flex items-center space-x-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg><Link
                                to={"/history"}
                            >Transaction History</Link> </button>
                    </div> */}
                    <div class="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-6 mb-8">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                    </svg>
                                </div>
                                <div class="text-sm text-gray-600 font-medium">
                                    Wallet Balance
                                </div>
                                <div class="text-2xl font-bold text-green-600" id="trade-wallet-balance">
                                    ${formatWithCommas(walletBalance)}
                                </div>
                            </div>
                            <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                    </svg>
                                </div>
                                <div class="text-sm text-gray-600 font-medium">
                                    Trading Limit
                                </div>
                                <div class="text-2xl font-bold text-blue-600" id="trade-limit-total">
                                    ${formatWithCommas(formatEther(Package.limit))}
                                </div>
                            </div>
                            <div class="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                                <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                                    </svg>
                                </div>
                                <div class="text-sm text-gray-600 font-medium">
                                    Limit Used
                                </div>
                                <div class="text-2xl font-bold text-orange-600" id="trade-limit-used">
                                    ${formatWithCommas(revisedLimitUtilized)}
                                </div>
                            </div>
                            <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                                    </svg>
                                </div>
                                <div class="text-sm text-gray-600 font-medium">
                                    Remaining Limit
                                </div>
                                <div class="text-2xl font-bold text-purple-600" id="trade-limit-remaining">
                                    ${formatWithCommas(Number(formatEther(Package.limit)) - Number(revisedLimitUtilized))}
                                </div>
                            </div>
                        </div>
                        <div class="mt-6">
                            <div class="flex items-center justify-between mb-2"><span class="text-sm font-medium text-gray-700">Trading Limit Usage</span> <span class="text-sm text-gray-600" id="trade-usage-percentage">{`${Number(Number(revisedLimitUtilized) / Number(formatEther(Package.limit)) * 100).toFixed(2)}%`}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div id="trade-progress-bar" class="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"

                                    style={{ width: `${Number(revisedLimitUtilized) / Number(formatEther(Package.limit)) * 100}%` }}></div>
                            </div>
                            <div class="flex justify-between text-xs text-gray-500 mt-1"><span>${revisedLimitUtilized}</span> <span id="trade-limit-display">${formatWithCommas(formatEther(Package.limit))}</span>
                            </div>
                        </div>
                    </div>
                    <TradingLimitTimer durationInSeconds={Number(userTradingLimitTime) + 60 * 60 * 24 - now >0?Number(userTradingLimitTime) + 60 * 60 * 24 - now :0} />
                    <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {randomeNFTs.map((v, e) => {
                            if (e < 15) {
                                return (
                                    <NFT
                                        nft={v}
                                        image={v.image}
                                        name={v.name}
                                        index={v.id}
                                        toggle={toggle}
                                        setToggle={setToggle}
                                        revisedLimitUtilized={revisedLimitUtilized} />
                                    //     <div class="nft-card bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg overflow-hidden">
                                    //     <div class="h-48 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 relative">
                                    //         <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    //         <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    //             <div class="w-20 h-24 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full opacity-80"></div>
                                    //             <div class="absolute top-4 left-4 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
                                    //             <div class="absolute top-6 right-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                                    //             <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-cyan-400"></div>
                                    //         </div>
                                    //     </div>
                                    //     <div class="p-4">
                                    //         <h3 class="font-semibold text-gray-900 mb-2">Cyber Genesis #001</h3>
                                    //         <div class="text-2xl font-bold text-blue-600 mb-3">
                                    //             $53.5
                                    //         </div><button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Buy Now</button>
                                    //     </div>
                                    // </div>
                                )
                            }
                        })


                        }
                        {/* <div class="nft-card bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg overflow-hidden">
                            <div class="h-48 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 relative">
                                <div class="absolute inset-0">
                                    <div class="absolute top-8 left-8 w-12 h-12 bg-yellow-300 rounded-full opacity-70 blur-sm"></div>
                                    <div class="absolute top-16 right-8 w-8 h-16 bg-blue-400 rounded-lg opacity-60 transform rotate-45"></div>
                                    <div class="absolute bottom-12 left-12 w-10 h-10 bg-green-400 opacity-50 transform rotate-12"></div>
                                    <div class="absolute top-12 right-16 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div class="p-4">
                                <h3 class="font-semibold text-gray-900 mb-2">Abstract Dreams #002</h3>
                                <div class="text-2xl font-bold text-blue-600 mb-3">
                                    $47.8
                                </div><button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Buy Now</button>
                            </div>
                        </div>
                        <div class="nft-card bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg overflow-hidden">
                            <div class="h-48 bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-900 relative">
                                <div class="absolute bottom-0 left-0 right-0">
                                    <svg viewbox="0 0 192 120" class="w-full h-20"><polygon points="0,120 48,72 96,84 144,60 192,78 192,120" fill="#1e1b4b" opacity="0.8" /> <polygon points="0,120 36,90 84,96 132,78 168,90 192,84 192,120" fill="#312e81" opacity="0.6" />
                                    </svg>
                                </div>
                                <div class="absolute top-4 left-6 w-0.5 h-0.5 bg-white rounded-full"></div>
                                <div class="absolute top-8 right-10 w-0.5 h-0.5 bg-white rounded-full"></div>
                                <div class="absolute top-6 right-16 w-0.5 h-0.5 bg-white rounded-full"></div>
                                <div class="absolute top-8 right-8 w-6 h-6 bg-yellow-200 rounded-full opacity-90"></div>
                            </div>
                            <div class="p-4">
                                <h3 class="font-semibold text-gray-900 mb-2">Cosmic Valley #003</h3>
                                <div class="text-2xl font-bold text-blue-600 mb-3">
                                    $62.1
                                </div><button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Buy Now</button>
                            </div>
                        </div>
                        <div class="nft-card bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg overflow-hidden">
                            <div class="h-48 bg-gradient-to-br from-emerald-400 to-teal-600 relative">
                                <div class="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-0.5 p-2">
                                    <div class="bg-white opacity-20 rounded-sm"></div>
                                    <div class="bg-white opacity-40 rounded-sm"></div>
                                    <div class="bg-white opacity-60 rounded-sm"></div>
                                    <div class="bg-white opacity-30 rounded-sm"></div>
                                    <div class="bg-white opacity-50 rounded-sm"></div>
                                    <div class="bg-white opacity-70 rounded-sm"></div>
                                    <div class="bg-white opacity-60 rounded-sm"></div>
                                    <div class="bg-white opacity-80 rounded-sm"></div>
                                    <div class="bg-white opacity-30 rounded-sm"></div>
                                    <div class="bg-white opacity-50 rounded-sm"></div>
                                    <div class="bg-white opacity-40 rounded-sm"></div>
                                    <div class="bg-white opacity-60 rounded-sm"></div>
                                </div>
                            </div>
                            <div class="p-4">
                                <h3 class="font-semibold text-gray-900 mb-2">Pixel Matrix #004</h3>
                                <div class="text-2xl font-bold text-blue-600 mb-3">
                                    $38.9
                                </div><button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Buy Now</button>
                            </div>
                        </div>
                        <div class="nft-card bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg overflow-hidden">
                            <div class="h-48 bg-gradient-to-b from-amber-200 via-orange-300 to-red-400 relative">
                                <div class="absolute top-8 left-1/2 transform -translate-x-1/2">
                                    <div class="w-12 h-16 bg-gradient-to-b from-pink-200 to-orange-200 rounded-full"></div>
                                    <div class="absolute top-4 left-3 w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                                    <div class="absolute top-4 right-3 w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                                    <div class="absolute top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-orange-300"></div>
                                    <div class="absolute top-8 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-red-400 rounded-full"></div>
                                </div>
                            </div>
                            <div class="p-4">
                                <h3 class="font-semibold text-gray-900 mb-2">Portrait Series #005</h3>
                                <div class="text-2xl font-bold text-blue-600 mb-3">
                                    $71.3
                                </div><button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Buy Now</button>
                            </div>
                        </div>
                        <div class="nft-card bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg overflow-hidden">
                            <div class="h-48 bg-gradient-to-br from-slate-800 to-gray-900 relative">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="w-24 h-24 border-4 border-blue-400 rounded-full relative">
                                        <div class="absolute inset-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
                                        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs">
                                            NFT
                                        </div>
                                    </div>
                                </div>
                                <div class="absolute top-4 left-4 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                <div class="absolute top-6 right-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
                                <div class="absolute bottom-6 left-6 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                            </div>
                            <div class="p-4">
                                <h3 class="font-semibold text-gray-900 mb-2">Digital Badge #006</h3>
                                <div class="text-2xl font-bold text-blue-600 mb-3">
                                    $29.7
                                </div><button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Buy Now</button>
                            </div>
                        </div>
                        <div class="nft-card bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg overflow-hidden">
                            <div class="h-48 bg-gradient-to-br from-violet-600 to-purple-800 relative">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="w-20 h-20 bg-gradient-to-br from-pink-400 to-violet-600 rounded-lg transform rotate-45"></div>
                                    <div class="absolute w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg transform -rotate-12"></div>
                                    <div class="absolute w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"></div>
                                </div>
                            </div>
                            <div class="p-4">
                                <h3 class="font-semibold text-gray-900 mb-2">Geometric Fusion #007</h3>
                                <div class="text-2xl font-bold text-blue-600 mb-3">
                                    $84.2
                                </div><button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Buy Now</button>
                            </div>
                        </div>
                        <div class="nft-card bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg overflow-hidden">
                            <div class="h-48 bg-gradient-to-br from-rose-400 to-pink-600 relative">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="w-16 h-20 bg-gradient-to-b from-white to-gray-200 rounded-lg shadow-lg">
                                        <div class="w-full h-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-t-lg"></div>
                                        <div class="p-2 text-center">
                                            <div class="w-8 h-1 bg-gray-400 rounded mx-auto mb-1"></div>
                                            <div class="w-6 h-1 bg-gray-300 rounded mx-auto mb-1"></div>
                                            <div class="w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mx-auto"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="p-4">
                                <h3 class="font-semibold text-gray-900 mb-2">Digital Card #008</h3>
                                <div class="text-2xl font-bold text-blue-600 mb-3">
                                    $42.6
                                </div><button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Buy Now</button>
                            </div>
                        </div>
                        <div class="nft-card bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg overflow-hidden">
                            <div class="h-48 bg-gradient-to-br from-yellow-400 to-amber-600 relative">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border-4 border-yellow-600 relative">
                                        <div class="absolute inset-2 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full"></div>
                                        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-800 font-bold text-xs">
                                            GOLD
                                        </div>
                                    </div>
                                </div>
                                <div class="absolute top-4 left-4 w-2 h-2 bg-yellow-200 rounded-full opacity-60"></div>
                                <div class="absolute bottom-4 right-4 w-2 h-2 bg-yellow-200 rounded-full opacity-60"></div>
                            </div>
                            <div class="p-4">
                                <h3 class="font-semibold text-gray-900 mb-2">Golden Token #009</h3>
                                <div class="text-2xl font-bold text-blue-600 mb-3">
                                    $95.4
                                </div><button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Buy Now</button>
                            </div>
                        </div>
                        <div class="nft-card bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg overflow-hidden">
                            <div class="h-48 bg-gradient-to-br from-indigo-500 to-purple-700 relative">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="w-16 h-20 bg-gradient-to-b from-indigo-400 to-purple-600 rounded-lg relative">
                                        <div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full"></div>
                                        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-yellow-500 rounded"></div>
                                        <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-yellow-600"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="p-4">
                                <h3 class="font-semibold text-gray-900 mb-2">Victory Trophy #010</h3>
                                <div class="text-2xl font-bold text-blue-600 mb-3">
                                    $156.8
                                </div><button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Buy Now</button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
