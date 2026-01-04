import React, { useEffect, useMemo, useState } from 'react'
import "./TradingQue.css"
import { fetcherAbi, fetcherAddress, web3 } from '../config'
import { formatAddress, formatWithCommas, secondsToDHMSDiff, secondsToDMY } from '../utils/contractExecutor';
import toast from 'react-hot-toast';

export default function NormalList() {


    const [nfts, setnfts] = useState()

    const fetcherContract = new web3.eth.Contract(fetcherAbi, fetcherAddress);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("")
    const [sortOrder, setSortOrder] = useState("default")
    const [priceSelected, setPriceSelected] = useState("default")

    const pageSize = 50;


    useEffect(() => {
        const abc = async () => {
            const _nfts = await fetcherContract.methods.getNFTs().call()
            setnfts(_nfts)


        }

        abc()
    }, [])


    const totalValue = nfts && nfts.map((nft) => Number(web3.utils.fromWei(nft.price, 'ether')) * 1.07).reduce((a, b) => a + b, 0);







    const filteredUsers1 = useMemo(() => {
        if (!nfts) return [];

        const search = searchText.toLowerCase().trim();

        return nfts.filter(u => {
            const ownerMatch =
                u._owner?.toLowerCase().includes(search);

            const idMatch =
                String(u.id).toLowerCase().includes(search);

            // Calculate price once
            const priceWithFee =
                Number(web3.utils.fromWei(u.price, "ether")) * 1.07;

            // PRICE FILTER MODE
if (priceSelected !== "default") {
    return (
        priceWithFee >= priceSelected.min &&
        priceWithFee <= priceSelected.max
    );
}

            // SEARCH MODE
            if (!search) return true;

            return ownerMatch || idMatch;
        });
    }, [nfts, searchText, priceSelected]);



    const filteredUsers = useMemo(() => {
        if (!filteredUsers1) return [];

        // Preserve default order
        if (sortOrder === "default") {
            return [...filteredUsers1];
        }

        return [...filteredUsers1].sort((a, b) => {
            const timeA = Number(a.purchasedTime);
            const timeB = Number(b.purchasedTime);

            if (sortOrder === "newest") {
                return timeB - timeA; // newest first
            }

            if (sortOrder === "oldest") {
                return timeA - timeB; // oldest first
            }

            return 0;
        });
    }, [filteredUsers1, sortOrder]);

    const copyToClipboard = async (value) => {
        if (!value || value === "Not defined") return;

        try {
            await navigator.clipboard.writeText(value);
        } catch {
            // fallback for older browsers
            const textarea = document.createElement("textarea");
            textarea.value = value;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }
        toast.success("copied to clipboard");
    };

    const PRICE_BUCKETS_CENTS = {
        5350: 0,   // 53.50
        5724: 0,   // 57.24
        6124: 0,   // 61.24
        6504: 0,   // 65.04
        7528: 0,   // 75.28
    };




    const _5325 = nfts && nfts.filter(nft => Number(web3.utils.fromWei(nft.price, 'ether') * 1.07).toFixed(2) >= 53.50 && Number(web3.utils.fromWei(nft.price, 'ether') * 1.07).toFixed(2) <= 57.24).length;
    const _5724 = nfts && nfts.filter(nft => Number(web3.utils.fromWei(nft.price, 'ether') * 1.07).toFixed(2) >= 57.24 && Number(web3.utils.fromWei(nft.price, 'ether') * 1.07).toFixed(2) <= 61.24).length;
    const _6124 = nfts && nfts.filter(nft => Number(web3.utils.fromWei(nft.price, 'ether') * 1.07).toFixed(2) >= 61.24 && Number(web3.utils.fromWei(nft.price, 'ether') * 1.07).toFixed(2) <= 65.04).length;
    const _6504 = nfts && nfts.filter(nft => Number(web3.utils.fromWei(nft.price, 'ether') * 1.07).toFixed(2) >= 65.04 && Number(web3.utils.fromWei(nft.price, 'ether') * 1.07).toFixed(2) <= 70.12).length;
    const _7012 = nfts && nfts.filter(nft => Number(web3.utils.fromWei(nft.price, 'ether') * 1.07).toFixed(2) >= 70.12 && Number(web3.utils.fromWei(nft.price, 'ether') * 1.07).toFixed(2) <= 75.03).length;
    const _7528 = nfts && nfts.filter(nft => Number(web3.utils.fromWei(nft.price, 'ether') * 1.07).toFixed(2) >= 75.03).length;
    const totalpages = nfts && Math.ceil(filteredUsers.length / pageSize);


    console.log("object", _6504);


    const isLoading = !nfts;

    const now = new Date().getTime() / 1000;



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


            <div class="min-h-full w-full p-4 md:p-8">
                <div class="max-w-7xl mx-auto">

                    <div class="mb-6 md:mb-8 text-center">
                        <h1 style={{ fontSize: "40px", color: "#0f172a", fontWeight: "900", marginBottom: "12px", textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                            NFT Marketplace
                        </h1>
                        <p style={{ fontSize: "18px", color: "#0f172a", opacity: "0.8", fontWeight: "500" }}>
                            Active NFT Listings
                        </p>
                    </div>


                    <div class="mb-6">
                        <div class="relative">
                            <input
                                onChange={(e) => setSearchText(e.target.value)}
                                type="text"
                                id="searchInput"
                                placeholder="🔍 Search by token number or owner address..."
                                class="w-full px-6 py-4 rounded-xl border-2 transition-all focus:outline-none"
                                style={{ borderColor: "#3b82f6", background: "#ffffff", color: "#0f172a", paddingRight: "100px" }}
                            />
                            <button
                                id="clearSearch"
                                class="absolute right-2 top-1/2 px-4 py-2 rounded-lg transition-all"
                                style={{ transform: "translateY(-50%)", background: "#3b82f6", color: "#ffffff", fontWeight: "600", border: "none", cursor: "pointer", display: "none" }}
                            >
                                Clear
                            </button>
                        </div>
                        <div id="searchResults" style={{ fontSize: "14px", color: "#0f172a", marginTop: "8px", opacity: "0.7" }}></div>
                    </div>


                    <div class="mb-8 rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)" }}>
                        <div style={{ fontSize: "14px", color: "white", opacity: "0.9", marginBottom: "8px", fontWeight: "600" }}>
                            🎨 Total NFTs in Marketplace
                        </div>
                        <div style={{ fontSize: "48px", color: "white", fontWeight: "900" }}>
                            {nfts.length}
                        </div>
                    </div>

                    <div class="mb-8">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <div style={{ fontSize: "16px", color: "#0f172a", fontWeight: "700" }}>
                                💰 Filter by Price
                            </div>
                        </div>
                        <div class="price-filter-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>

                            <div
onClick={() => setPriceSelected({ min: 53.5, max: 57.24 })}

                                class="price-filter-card rounded-lg p-4 border-2 transition-all"
                                style={{ background: "#ffffff", border: "3px solid #3b82f6", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                                <div style={{ fontSize: "20px", color: "#3b82f6", fontWeight: "900", marginBottom: "8px" }}>
                                    $53.50
                                </div>
                                <div style={{ fontSize: "12px", color: "#0f172a", opacity: "0.7", fontWeight: "600" }}>
                                    👥 {_5325} NFTs
                                </div>
                            </div>

                            <div
onClick={() => setPriceSelected({ min: 57.24, max: 61.24 })}
                                class="price-filter-card rounded-lg p-4 border-2 transition-all"
                                style={{ background: "#ffffff", border: "3px solid #3b82f6", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                                <div style={{ fontSize: "20px", color: "#3b82f6", fontWeight: "900", marginBottom: "8px" }}>
                                    $57.24
                                </div>
                                <div style={{ fontSize: "12px", color: "#0f172a", opacity: "0.7", fontWeight: "600" }}>
                                    👥 {_5724} NFTs
                                </div>
                            </div>

                            <div
onClick={() => setPriceSelected({ min: 61.24, max: 65.04 })}
                                class="price-filter-card rounded-lg p-4 border-2 transition-all"
                                style={{ background: "#ffffff", border: "3px solid #3b82f6", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                                <div style={{ fontSize: "20px", color: "#3b82f6", fontWeight: "900", marginBottom: "8px" }}>
                                    $61.24
                                </div>
                                <div style={{ fontSize: "12px", color: "#0f172a", opacity: "0.7", fontWeight: "600" }}>
                                    👥 {_6124} NFTs
                                </div>
                            </div>

                            <div
onClick={() => setPriceSelected({ min: 65.04, max: 70.12 })}
                                class="price-filter-card rounded-lg p-4 border-2 transition-all"
                                style={{ background: "#ffffff", border: "3px solid #3b82f6", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                                <div style={{ fontSize: "20px", color: "#3b82f6", fontWeight: "900", marginBottom: "8px" }}>
                                    $65.04
                                </div>
                                <div style={{ fontSize: "12px", color: "#0f172a", opacity: "0.7", fontWeight: "600" }}>
                                    👥 {_6504} NFTs
                                </div>
                            </div>
                            <div
onClick={() => setPriceSelected({ min: 70.12, max: 75.00 })}
                                class="price-filter-card rounded-lg p-4 border-2 transition-all"
                                style={{ background: "#ffffff", border: "3px solid #3b82f6", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                                <div style={{ fontSize: "20px", color: "#3b82f6", fontWeight: "900", marginBottom: "8px" }}>
                                    $70.12
                                </div>
                                <div style={{ fontSize: "12px", color: "#0f172a", opacity: "0.7", fontWeight: "600" }}>
                                    👥 {_7012} NFTs
                                </div>
                            </div>
                            <div
onClick={() => setPriceSelected({ min: 75.00, max: 76.00 })}
                                class="price-filter-card rounded-lg p-4 border-2 transition-all"
                                style={{ background: "#ffffff", border: "3px solid #3b82f6", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                                <div style={{ fontSize: "20px", color: "#3b82f6", fontWeight: "900", marginBottom: "8px" }}>
                                    $75.28
                                </div>
                                <div style={{ fontSize: "12px", color: "#0f172a", opacity: "0.7", fontWeight: "600" }}>
                                    👥 {_7528} NFTs
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-2xl overflow-hidden" style={{ background: "#ffffff", boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)" }}>
                        <div class="table-container overflow-x-auto" style={{ webkitOverflowScrolling: "touch" }}>
                            <table class="w-full" style={{ minWidth: "320px" }}>
                                <thead style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                                    <tr>
                                        <th class="px-3 py-4 text-left font-bold uppercase" style={{ fontSize: "10.4px", color: "white", letterSpacing: "0.05em" }}>S.no</th>
                                        <th class="px-3 py-4 text-left font-bold uppercase" style={{ fontSize: "10.4px", color: "white", letterSpacing: "0.05em" }}>NFT Token</th>
                                        <th class="px-3 py-4 text-left font-bold uppercase" style={{ fontSize: "10.4px", color: "white", letterSpacing: "0.05em" }}>Buy Time</th>
                                        <th class="px-3 py-4 text-left font-bold uppercase" style={{ fontSize: "10.4px", color: "white", letterSpacing: "0.05em" }}>Trade Time</th>
                                        <th class="px-3 py-4 text-left font-bold uppercase" style={{ fontSize: "10.4px", color: "white", letterSpacing: "0.05em" }}>Owner</th>
                                        <th class="px-3 py-4 text-left font-bold uppercase" style={{ fontSize: "10.4px", color: "white", letterSpacing: "0.05em" }}>Value</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {filteredUsers.map((nft, index) => {
                                        if (index >= (page - 1) * pageSize && index < page * pageSize) {
                                            return (
                                                <tr class="border-b" style={{ borderColor: "rgba(59, 130, 246, 0.3)", background: "white" }}>
                                                    <td class="table-cell" style={{ fontSize: "12px", color: "#0f172a", fontWeight: "600" }}>
                                                        #{index + 1}
                                                    </td>
                                                    <td class="table-cell">
                                                        <span class="token-badge" data-token="1">
                                                            NFT-{nft.id}
                                                        </span>
                                                    </td>
                                                    <td class="table-cell" style={{ fontSize: "11px", color: "#0f172a", opacity: "0.8", whiteSpace: "nowrap" }}>
                                                        {secondsToDMY(nft.purchasedTime)}
                                                    </td>
                                                    <td class="table-cell">
                                                        <span class="time-badge">
                                                            ⏱️ {secondsToDHMSDiff(now - nft.purchasedTime)}
                                                        </span>
                                                    </td>
                                                    <td class="table-cell">
                                                        <div class="address-cell">
                                                            <span class="address-text">
                                                                {formatAddress(nft._owner)}
                                                            </span>
                                                            <button
                                                                onClick={() => { copyToClipboard(nft._owner) }}

                                                                class="copy-btn" data-address="0x7a3b9c8d1e2f4a5b6c7d8e9f0a">
                                                                📋
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td class="table-cell" style={{ fontSize: "13px", color: "#10b981", fontWeight: "800", whiteSpace: "nowrap" }}>
                                                        ${Number(web3.utils.fromWei(nft.price, 'ether') * 1.07).toFixed(2)}
                                                    </td>
                                                </tr>

                                            )
                                        }
                                    })}


                                </tbody>
                            </table>
                        </div>

                        <div class="px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2" style={{ borderColor: "rgba(59, 130, 246, 0.3)" }}>
                            <div style={{ fontSize: "12px", color: "#0f172a", opacity: "0.8", textAlign: "center" }}>
                                Showing <span class="font-bold" style={{ "color": "#0f172a" }}>{(page - 1) * pageSize + 1}</span> to <span class="font-bold" style={{ "color": "#0f172a" }}>{Math.min(page * pageSize, filteredUsers.length)}</span> of <span class="font-bold" style={{ "color": "#0f172a" }}>{filteredUsers.length}</span> nfts
                            </div>
                            <div class="flex gap-2 items-center">
                                <button
                                    onClick={() => {
                                        if (page > 1) {
                                            setPage(prev => prev - 1);
                                        }
                                    }}
                                    id="prevBtn"
                                    class="px-4 py-2 rounded-lg font-bold transition-all"
                                    style={{ background: "#3b82f6", color: "white", fontSize: "12px", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)" }}
                                >
                                    ← Prev
                                </button>
                                <div style={{ padding: "8px 16px", background: "rgba(59, 130, 246, 0.2)", borderRadius: "8px", fontSize: "12px", color: "#0f172a", fontWeight: "700" }}>
                                    <span style={{ "color": "#64748b" }}>Page</span> <span class="mx-2" style={{ "color": "#2563eb", "font-size": "16px" }}>{page}</span> <span style={{ "color": "#64748b" }}>of {totalpages}</span>
                                </div>
                                <button

                                    onClick={() => {
                                        if (page < totalpages) {
                                            setPage(prev => prev + 1);
                                        }
                                    }}
                                    id="nextBtn"
                                    class="px-4 py-2 rounded-lg font-bold transition-all"
                                    style={{ background: "#3b82f6", color: "white", fontSize: "12px", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)" }}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div id="nftModal" class="nft-image-container">
                <div class="nft-card rounded-2xl overflow-hidden" style={{ background: "white" }}>
                    <div id="nftModalContent"></div>
                </div>
            </div>
        </div>
    )
}
