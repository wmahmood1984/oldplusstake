import React, { useEffect, useMemo, useState } from 'react'
import "./TradingQue.css"
import { fetcherAbi, fetcherAddress, web3 } from '../config'
import { formatAddress, formatWithCommas, secondsToDHMSDiff, secondsToDMY } from '../utils/contractExecutor';
import toast from 'react-hot-toast';

export default function TradingQue() {

    const [nfts, setnfts] = useState()

    const fetcherContract = new web3.eth.Contract(fetcherAbi, fetcherAddress);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("")
    const [sortOrder, setSortOrder] = useState("default")

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

    return nfts.filter(u =>
        !search ||
        u._owner?.toLowerCase().includes(search) ||
        String(u.id).toLowerCase().includes(search)
    );
}, [nfts, searchText]);


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




    const totalpages = nfts && Math.ceil(filteredUsers.length / pageSize);


    console.log("object",nfts);


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


            <div class="container">

                <div className="header">
                    <h1
                        style={{
                            fontSize: "2.5rem",
                            color: "#0f172a",
                            fontWeight: 900,
                            marginBottom: "12px",
                            textShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        }}
                    >
                        NFT Trading Queue
                    </h1>

                    <p
                        style={{
                            fontSize: "1.125rem",
                            color: "#0f172a",
                            opacity: 0.8,
                            fontWeight: 500,
                        }}
                    >
                        Active NFT Listings
                    </p>
                </div>



                <div class="search-box">
                    <input
                        onChange={(e) => setSearchText(e.target.value)}
                        type="text"
                        id="searchInput"
                        placeholder="🔍 Search by token number or owner address..."
                        class="search-input"
                    />
                    <button id="clearSearch" class="clear-btn" style={{ display: "none" }}>
                        Clear
                    </button>
                </div>
                <div id="searchResults" style={{ fontSize: "14px", color: "#0f172a", opacity: 0.7, marginTop: "8px" }}></div>

                <div class="stats-grid">

                    <div class="stats-card">
                        <div style={{ fontSize: "14px", color: "white", opacity: "0.9", marginBottom: "8px", fontWeight: "600" }}>
                            🎨 Total NFTs in Marketplace
                        </div>
                        <div style={{ fontSize: "3rem", color: "white", fontWeight: "900" }}>
                            {nfts.length}
                        </div>
                    </div>


                    <div class="stats-card-value">
                        <div style={{ fontSize: "14px", color: "white", opacity: "0.9", marginBottom: "8px", fontWeight: "600" }}>
                            💰 Total Value of NFTs in Marketplace
                        </div>
                        <div style={{ fontSize: "3rem", color: "white", fontWeight: "900" }}>
                            ${formatWithCommas(totalValue, 2)}
                        </div>
                    </div>
                </div>


                <div class="table-container">
                    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                        <table style={{ width: "100%", minWidth: "320px" }}>
                            <thead className="table-header">
                                <tr>
                                    <th class="table-cell" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>Queue</th>
                                    <th class="table-cell" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>NFT Token</th>
                                    <th class="table-cell" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>Buy Time</th>
                                    <th class="table-cell" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>Trade Time</th>
                                    <th class="table-cell" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>Owner</th>
                                    <th class="table-cell" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>Value</th>
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
                                                        ⏱️ {secondsToDHMSDiff(now -  nft.purchasedTime)}
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
                                                    ${Number(web3.utils.fromWei(nft.price, 'ether')* 1.07).toFixed(2) }
                                                </td>
                                            </tr>
                                        )
                                    }
                                })}

                            </tbody>
                        </table>
                    </div>


                    <div class="pagination">
                        <div style={{ fontSize: "12px", color: "#0f172a", opacity: "0.8", textAlign: "center" }}>
                            Showing <span class="font-bold" style={{ "color": "#0f172a" }}>{(page - 1) * pageSize + 1}</span> to <span class="font-bold" style={{ "color": "#0f172a" }}>{Math.min(page * pageSize, filteredUsers.length)}</span> of <span class="font-bold" style={{ "color": "#0f172a" }}>{filteredUsers.length}</span> users
                        </div>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <button
                                onClick={() => {
                                    if (page > 1) {
                                        setPage(prev => prev - 1);
                                    }
                                }}
                                id="prevBtn" class="pagination-btn" disabled>
                                ← Prev
                            </button>
                            <div class="page-info">
                                <span style={{ "color": "#64748b" }}>Page</span> <span class="mx-2" style={{ "color": "#2563eb", "font-size": "16px" }}>{page}</span> <span style={{ "color": "#64748b" }}>of {totalpages}</span>
                            </div>
                            <button
                                onClick={() => {
                                    if (page < totalpages) {
                                        setPage(prev => prev + 1);
                                    }
                                }}
                                id="nextBtn" class="pagination-btn">
                                Next →
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <div id="nftModal" class="nft-modal">
                <div class="nft-modal-content">
                    <div style={{ position: "relative" }}>
                        <button class="modal-close-btn" id="closeModal">
                            ×
                        </button>

                        <div class="nft-image">
                            <svg width="100%" height="300" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: "#FF6B6B", stopOpacity: "1" }} />
                                        <stop offset="50%" style={{ stopColor: "#4ECDC4", stopOpacity: "1" }} />
                                        <stop offset="100%" style={{ stopColor: "#45B7D1", stopOpacity: "1" }} />
                                    </linearGradient>
                                </defs>
                                <rect width="400" height="400" fill="url(#grad-1)" />
                                <circle cx="200" cy="150" r="80" fill="rgba(255,255,255,0.2)" />
                                <circle cx="150" cy="250" r="60" fill="rgba(255,255,255,0.15)" />
                                <circle cx="280" cy="280" r="70" fill="rgba(255,255,255,0.15)" />
                                <text x="200" y="350" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">
                                    NFT-1001
                                </text>
                            </svg>
                        </div>

                        <div style={{ padding: "24px", background: "linear-gradient(to bottom, white, #f8fafc)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                                <div>
                                    <h2 style={{ fontSize: "1.75rem", color: "#0f172a", fontWeight: "800", margin: "0 0 8px 0" }}>
                                        NFT-1001
                                    </h2>
                                    <div class="rarity-badge rarity-rare" style={{ background: "#3b82f6" }}>
                                        ✨ Rare
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "12px", color: "#0f172a", opacity: "0.7", marginBottom: "4px" }}>
                                        Value
                                    </div>
                                    <div style={{ fontSize: "1.5rem", color: "#10b981", fontWeight: "800" }}>
                                        $53.50
                                    </div>
                                </div>
                            </div>

                            <div class="modal-section">
                                <div style={{ fontSize: "14px", color: "#0f172a", opacity: "0.8", marginBottom: "8px", fontWeight: "600" }}>
                                    📍 Queue Position
                                </div>
                                <div style={{ fontSize: "1.25rem", color: "#3b82f6", fontWeight: "700" }}>
                                    #1
                                </div>
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <div style={{ fontSize: "14px", color: "#0f172a", opacity: "0.8", marginBottom: "8px", fontWeight: "600" }}>
                                    👤 Owner Address
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
                                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", color: "#0f172a", wordBreak: "break-all", flex: "1" }}>
                                        0x7a3b9c8d1e2f4a5b6c7d8e9f0a
                                    </span>
                                    <button
                                        class="copy-btn modal-copy-btn"
                                        data-address="0x7a3b9c8d1e2f4a5b6c7d8e9f0a"
                                        style={{ background: "#3b82f6", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", flexShrink: "0" }}
                                    >
                                        📋 Copy
                                    </button>
                                </div>
                            </div>

                            <div class="info-grid" style={{ marginBottom: "20px" }}   >
                                <div class="info-box">
                                    <div style={{ fontSize: "12px", color: "#0f172a", opacity: "0.7", marginBottom: "4px" }}>
                                        🕐 Buy Time
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#0f172a", fontWeight: "600" }}>
                                        Jan 15, 2023, 10:30 AM
                                    </div>
                                </div>

                                <div class="info-box">
                                    <div style={{ fontSize: "12px", color: "#0f172a", opacity: "0.7", marginBottom: "4px" }}>
                                        ⏱️ Trade Time
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#f59e0b", fontWeight: "700" }}>
                                        120 hours
                                    </div>
                                </div>
                            </div>

                            <div class="modal-section">
                                <div style={{ fontSize: "14px", color: "#0f172a", opacity: "0.8", marginBottom: "8px", fontWeight: "600" }}>
                                    👥 Total Value of NFT Holders
                                </div>
                                <div style={{ fontSize: "1.5rem", color: "#3b82f6", fontWeight: "700" }}>
                                    $5,350.00
                                </div>
                                <div style={{ fontSize: "12px", color: "#0f172a", opacity: "0.6", marginTop: "4px" }}>
                                    100 holders × $53.50
                                </div>
                            </div>

                            <button class="modal-action-btn" id="hideModalBtn">
                                🙈 Hide NFT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
