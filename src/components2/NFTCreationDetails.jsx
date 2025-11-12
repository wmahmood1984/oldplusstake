import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { helperAbi, helperAddress, web3 } from '../config';
import { useAppKitAccount } from '@reown/appkit/react';
import { formatEther } from 'ethers';

export default function NFTCreationDetails() {

    const { NFTQueBalance,nftListed,
    } = useSelector((state) => state.contract);
    const { address } = useAppKitAccount();

    const helperContract = new web3.eth.Contract(helperAbi, helperAddress)
    const [nftQues, setNFTs] = useState()

    useEffect(() => {


        const abc = async () => {
            const _nfts = await helperContract.methods.getNFTque().call()
            setNFTs(_nfts)
        }

        abc()


    }, [])

    const isLoading = !nftQues

    const filteredNftQues = nftQues && nftQues.filter(e => e.user.toLowerCase() == address.toLowerCase())



    if (isLoading) {
        // show a waiting/loading screen
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
            </div>
        );
    }

    const gradients = [
        "from-purple-400 to-pink-500",
        "from-blue-400 to-cyan-500",
        "from-yellow-400 to-orange-500",
        "from-green-400 to-emerald-500",
        "from-indigo-400 to-purple-500",
        "from-red-400 to-rose-500",
    ];


    console.log("nav", filteredNftQues);

    return (
        <main class="min-h-screen py-6 sm:py-8">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <header class="mb-6">
                    <h2 id="page-title" class="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-2">NFT Creation Details</h2>
                    <p class="text-gray-600">View all your NFTs Status</p>
                </header>
                <section class="mb-6">
                    <div class="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl shadow-lg p-6 text-white fade-in">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-lg font-semibold opacity-90">Total Royalty Income</h3>
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <p class="text-5xl font-bold font-display mb-2">${NFTQueBalance}</p>
                        <p class="text-2xl font-bold font-display mb-2" >NFT Created: {nftListed.length}</p>
                        <p class="text-sm opacity-80">All-time earnings from NFT royalties</p>
                    </div>
                </section>
                <section>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold text-gray-900">Your Created NFTs</h3>
                    </div>
                    <div className="space-y-3">
                        {filteredNftQues.map((nft, index) => {
                            const gradient = gradients[index % gradients.length];
                            const formattedIncome =
                                nft.income > 0 ? `+$${formatEther(nft.income)}` : `$${formatEther(nft.income)}`;
                            const incomeColor =
                                nft.income > 0 ? "text-green-600" : "text-gray-600";

                            return (
                                <div
                                    key={nft.id}
                                    className="transaction-card bg-white rounded-xl shadow p-5 border border-gray-100 fade-in"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div
                                                className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center`}
                                            >
                                                <span className="text-white font-bold text-lg">
                                                    {index+1}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg">
                                                    NFT Royalty
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Token ID: #{String(nft.id).padStart(3, "0")}
                                                </p>

                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-2xl font-bold ${incomeColor}`}>
                                                {formattedIncome}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    )
}
