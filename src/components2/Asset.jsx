import { formatEther } from 'ethers';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { NFT } from './NFT2';
import { helperAbi, helperAddress, web3 } from '../config';
import { useAppKitAccount } from '@reown/appkit/react';
import { Link } from 'react-router-dom';

export default function Asset() {
    const { Package, myNFTs, packages, downlines, registered, admin, allowance, NFTQueBalance, limitUtilized, NFTque

        , levelIncome,
        referralIncome,
        totalIncome,
        tradingIncome, walletBalance, nftListed,
        status, error
    } = useSelector((state) => state.contract);




    const [allNFTs, setAllNFTs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("All NFTs")
    // ✅ Replace with your own Redux selector for NFTs

    const { address } = useAppKitAccount();


    const helperContract = new web3.eth.Contract(helperAbi, helperAddress);

    useEffect(() => {
        const fetchAllNFTs = async () => {
            try {
                setLoading(true);

                // --- 1️⃣ Fetch NFTused from chain ---
                const nftUsedRaw = await helperContract.methods.getNFTused().call();

                // --- 2️⃣ Combine all NFTs sources ---
                const combined = [
                    ...myNFTs.map((n) => ({ ...n, source: "market" })),
                    ...nftUsedRaw.map((n) => ({ ...n, source: "used" })),
                ];



                // --- 3️⃣ Resolve all URIs concurrently ---
                const resolved = await Promise.all(
                    combined.map(async (nft) => {
                        try {
                            const res = await fetch(nft.uri);
                            if (!res.ok) throw new Error(`Failed to fetch ${nft.uri}`);
                            const meta = await res.json();

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
                            };
                        } catch (err) {
                            console.error("Error fetching metadata for", nft.uri, err);
                            return null;
                        }
                    })
                );



                // --- 4️⃣ Clean and mark status ---
                const filtered = resolved.filter(e => e.owner.toLowerCase() == address.toLocaleLowerCase()).map((nft) => {
                    let status;
                    if (
                        nft.source === "used"

                    ) {
                        status = "burn"; // Burned NFTs only if owned by current address
                    } else if (nft.creator?.toLowerCase() === address?.toLowerCase()) {
                        status = "purchased"; // Creator is current user
                    } else if (nft.source === "market") {
                        status = "purchased"; // Others in marketplace
                    } else {
                        status = "other";
                    }

                    return { ...nft, status };
                });



                // --- 5️⃣ Store in state ---
                setAllNFTs(filtered);
            } catch (err) {
                console.error("Error fetching NFTs:", err);
            } finally {
                setLoading(false);
            }
        };

        // if (myNFTs.length) 
        fetchAllNFTs();
    }, [myNFTs, address]);

    if (loading) return <p>Loading NFTs...</p>;

    // ✅ Filter logic for UI
    const createdNFTs = allNFTs.filter((n) => n.status === "created");
    const purchasedNFTs = allNFTs.filter((n) => n.status === "purchased");
    const burnedNFTs = allNFTs.filter((n) => n.status === "burn");



    const filteredNFTs = allNFTs.filter((nft) => {
        switch (filter) {
            case "Burn":
                return nft.status === "burn";
            case "Created":
                return nft.status === "created";
            case "Purchased":
                return nft.status === "purchased";
            case "All NFTs":
            default:
                return true; // show everything
        }
    });




    const totalWei = allNFTs.filter((e) => e.status != "created").reduce(
        (acc, nft) => acc + Number(nft.price), 0
    );
    const totalEth = Number(totalWei).toFixed(1);


console.log("filtered nft",filteredNFTs);


    return (
        <div>

            <main class="min-h-screen py-8 sm:py-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header class="text-center mb-8 sm:mb-12">
                        <h2 id="page-title" class="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-3">My Assets</h2>
                        <p id="page-subtitle" class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">Track Your NFT Portfolio</p>
                    </header>

                    <div class="flex justify-center mt-10 -mb-[-10px]">
                                <button
                                    onclick="showPage('history')"
                                    class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg flex items-center space-x-2"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <Link to="/nftcreationdetails">Creation History</Link>
                                </button>
                            </div>
                    <section class="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 mb-8 sm:mb-12">
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                            
                            {/* <div class="text-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm hover:shadow-lg transition-all">
                                <div class="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-2">
                                    {createdNFTs.length}
                                </div>
                                <div class="text-sm sm:text-base text-gray-700 font-semibold">
                                    Created
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    Listed
                                </div>
                            </div> */}
                            <div class="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm hover:shadow-lg transition-all">
                                <div class="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                                    {purchasedNFTs.length}
                                </div>
                                <div class="text-sm sm:text-base text-gray-700 font-semibold">
                                    Purchased / Created
                                </div>
                            </div>
                            <div class="text-center p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 shadow-sm hover:shadow-lg transition-all">
                                <div class="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-600 mb-2">
                                    {burnedNFTs.length}
                                </div>
                                <div class="text-sm sm:text-base text-gray-700 font-semibold">
                                    Burn
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    In Processing
                                </div>
                            </div>
                            <div class="text-center p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 shadow-sm hover:shadow-lg transition-all">
                                <div class="text-3xl sm:text-4xl lg:text-5xl font-bold text-indigo-600 mb-2">
                                    {allNFTs.length}
                                </div>
                                <div class="text-sm sm:text-base text-gray-700 font-semibold">
                                    Total NFTs
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    Your collection
                                </div>
                            </div>
                            <div class="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm hover:shadow-lg transition-all">
                                <div class="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-600 mb-2">
                                    ${totalEth}
                                </div>
                                <div class="text-sm sm:text-base text-gray-700 font-semibold">
                                    Total Value
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    USDT
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="mb-6">
                        <div class="flex flex-wrap items-center justify-center gap-3">
                            <button id="filter-all"
                                onClick={(e) => { setFilter("All NFTs") }}
                                class="filter-btn px-6 py-2.5 rounded-xl font-semibold transition-all bg-indigo-600 text-white shadow-lg hover:bg-indigo-700">
                                All NFTs </button>
                            {/* <button id="filter-created"
                                                            onClick={(e)=>{setFilter("Created")}}
                                class="filter-btn px-6 py-2.5 rounded-xl font-semibold transition-all bg-white text-gray-700 border-2 border-gray-200 hover:border-green-500 hover:text-green-600">
                                Created </button> */}
                            <button id="filter-purchased"
                                onClick={(e) => { setFilter("Purchased") }}
                                class="filter-btn px-6 py-2.5 rounded-xl font-semibold transition-all bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600">
                                Purchased </button>
                            <button id="filter-burn"
                                onClick={(e) => { setFilter("Burn") }}
                                class="filter-btn px-6 py-2.5 rounded-xl font-semibold transition-all bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-500 hover:text-orange-600">
                                Burn </button>
                        </div>
                    </section>
                    <section class="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
                        <div class="flex items-center justify-between mb-6 sm:mb-8">
                            <h3 class="text-2xl sm:text-3xl font-bold text-gray-900">Your NFT Portfolio</h3>
                            <div class="flex items-center space-x-2 text-sm text-gray-600">
                                <div class="w-2 h-2 bg-green-500 rounded-full pulse-animation"></div><span>Live Prices</span>
                            </div>
                        </div>
                        <div id="nft-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredNFTs.map((v, e) => {
                                return (
                                    <NFT

                                        name={v.name}
                                        description={v.description}
                                        image={v.image}
                                        price={v.price}
                                        status={v.status}
                                        id={v.id}
                                        index={e}></NFT>
                                )
                            })}

                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
