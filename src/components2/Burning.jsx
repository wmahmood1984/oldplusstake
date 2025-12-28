import React, { useEffect, useMemo, useState } from 'react'
import { bulkAddAbi, bulkContractAdd, fetcherAbi, fetcherAddress, helperAbi, helperAddress, web3, testweb3 } from '../config';
import { secondsToDHMSDiff, secondsToDMY, secondsToHMSDiff } from '../utils/contractExecutor';
import toast from 'react-hot-toast';
import { mode } from '@cloudinary/url-gen/actions/rotate';


export default function Burning() {

    const [burntNFTs, setBurntNFTs] = React.useState()
    const fetcherContract = new web3.eth.Contract(fetcherAbi, fetcherAddress);
    const [page, setPage] = useState(1);
    const [ADMIN_ADDRESSES, setadminAddress] = useState([])
    const [MODE, setMODE] = useState("list")
    const [searchText, setSearchText] = useState("")
    const [sortOrder, setSortOrder] = useState("default")
    const [showModal, setShowModal] = useState(false);
    const [adminWallet, setAdminWallet] = useState("")
    const [loading, setLoading] = useState(false)
    const [adminFilter, setAdminFilter] = useState("all");

    const contractABI = bulkAddAbi;
    const contractAddress = bulkContractAdd;
    const contract = new testweb3.eth.Contract(contractABI, contractAddress);

    const pageSize = 50;

    useEffect(() => {
        const abc = async () => {
            const _burntNFTS = await fetcherContract.methods.getNFTUsed().call();
            setBurntNFTs(_burntNFTS)

            const _adminAddresses = await contract.methods.getAdminWallets().call()
            setadminAddress(_adminAddresses)

        }

        abc()
    }, [])


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

    const saveAdmin = async () => {
        if (adminWallet === "") {
            toast.error("set admin wallet first")
            return

        }
        setLoading(true);
        try {
            const account = testweb3.eth.accounts.privateKeyToAccount(
                import.meta.env.VITE_PRIVATE_KEY
            );
            testweb3.eth.accounts.wallet.add(account);

            const tx = contract.methods.setAdminWallets(adminWallet);
            const gas = await tx.estimateGas({ from: account.address });
            const data = tx.encodeABI();

            const txData = {
                from: account.address,
                to: contract.options.address,
                data,
                gas,
            };

            const signedTx = await account.signTransaction(txData);
            const receipt = await testweb3.eth.sendSignedTransaction(
                signedTx.rawTransaction
            );

            showModal(false)

            console.log("tx hash:", receipt.transactionHash);
        } catch (error) {
            console.error("Error in set admin wallet:", error);
        } finally {
            setLoading(false);
            showModal(false)
        }
    };


    const filteredUsers1 = useMemo(() => {
        if (!burntNFTs) return [];

        const search = searchText?.toLowerCase().trim();
        const adminSet = new Set(ADMIN_ADDRESSES.map(a => a.toLowerCase()));

        return burntNFTs.filter(u => {
            const owner = String(u[2]).toLowerCase();

            // 🔍 Search filter
            const matchesSearch =
                !search ||
                String(u[0]).toLowerCase().includes(search) ||
                owner.includes(search);

            if (!matchesSearch) return false;

            // 👑 Admin filter
            if (adminFilter === "include") {
                return adminSet.has(owner);
            }

            if (adminFilter === "exclude") {
                return !adminSet.has(owner);
            }

            // "all"
            return true;
        });
    }, [burntNFTs, searchText, adminFilter, ADMIN_ADDRESSES]);
    ;


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




    const totalpages = burntNFTs && Math.ceil(filteredUsers.length / pageSize);


    const isLoading = !burntNFTs;





    if (isLoading) {
        // show a waiting/loading screen
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
            </div>
        );
    }

    const now = new Date().getTime() / 1000;

    console.log("nft used", ADMIN_ADDRESSES);
    return (
        <div>
            <div class="min-h-full w-full p-4 md:p-8">
                <div class="max-w-7xl mx-auto">

                    <div class="mb-6 md:mb-8 text-center">
                        <h1 style={{ fontSize: "40px", color: "#0f172a", fontWeight: "900", marginBottom: "12px", textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                            NFT Burning Queue
                        </h1>
                        <p style={{ fontSize: "18px", color: "#0f172a", opacity: "0.8", fontWeight: "500" }}>
                            Active NFT Listings with Address Sorting
                        </p>
                    </div>


                    <div class="mb-6">
                        <div class="admin-buttons" style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                            <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>🔧 Admin Management:</span>
                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                <button
                                    onClick={() => { setMODE("add"); setShowModal(true); }}
                                    id="addAdminBtn"
                                    style={{ padding: "10px 20px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s", border: "2px solid #ef4444", background: "#ffffff", color: "#0f172a" }}
                                >
                                    ➕ Add Admin Address
                                </button>
                                <button
                                    onClick={() => { setMODE("list"); setShowModal(true); }}
                                    id="viewAdminBtn"
                                    style={{ padding: "10px 20px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s", border: "2px solid #3b82f6", background: "#ffffff", color: "#0f172a" }}
                                >
                                    👁️ View Admin List
                                </button>
                            </div>
                        </div>
                    </div>


                    <div class="mb-6">
                        <div class="relative">
                            <input
                                onChange={(e) => setSearchText(e.target.value)}
                                type="text"
                                id="searchInput"
                                placeholder="🔍 Search by token number or owner address..."
                                class="w-full px-6 py-4 rounded-xl border-2 transition-all focus:outline-none"
                                style={{ "border-color": "#3b82f6", "background": "#ffffff", "color": "#0f172a", "padding-right": "100px" }}
                            />
                            <button
                                id="clearSearch"
                                class="absolute right-2 top-1/2 px-4 py-2 rounded-lg transition-all"
                                style={{ "transform": "translateY(-50%)", "background": "#3b82f6", "color": "#ffffff", "font-weight": 600, "border": "none", "cursor": "pointer", "display": "none" }}
                            >
                                Clear
                            </button>
                        </div>
                        <div id="searchResults" style={{ "font-size": "14px", "color": "#0f172a", "margin-top": "8px", "opacity": 0.7 }}></div>
                    </div>


                    <div class="mb-6">
                        <div class="sort-buttons" style={{ "display": "flex", "gap": "12px", "flex-wrap": "wrap", "align-items": "center" }}>
                            <span style={{ "font-size": "14px", "color": "#0f172a", "font-weight": 600 }}>⏰ Sort by Burning Time:</span>
                            <div style={{ "display": "flex", "gap": "12px", "flex-wrap": "wrap" }}>
                                <button
                                    onClick={() => setSortOrder("newest")}
                                    class="sort-btn"
                                    style={{ "padding": "10px 20px", "border-radius": "8px", "font-size": "12px", "font-weight": 600, "cursor": "pointer", "transition": "all 0.2s", "border": "2px solid #3b82f6", "background": "#ffffff", "color": "#0f172a" }}
                                >
                                    🆕 Newest First
                                </button>
                                <button
                                    onClick={() => setSortOrder("oldest")}
                                    class="sort-btn"
                                    style={{ "padding": "10px 20px", "border-radius": "8px", "font-size": "12px", "font-weight": 600, "cursor": "pointer", "transition": "all 0.2s", "border": "2px solid #3b82f6", "background": "#ffffff", "color": "#0f172a" }}
                                >
                                    ⏳ Oldest First
                                </button>
                                <button
                                    onClick={() => setAdminFilter("include")}
                                    class="sort-btn"
                                    data-sort="admin"
                                    style={{ padding: "10px 20px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s", border: "2px solid #ef4444", background: "#ffffff", color: "#0f172a" }}
                                >
                                    👑 Include ADM
                                </button>
                                <button
                                    onClick={() => setAdminFilter("exclude")}
                                    class="sort-btn"
                                    data-sort="newuser"
                                    style={{ padding: "10px 20px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s", border: "2px solid #10b981", background: "#ffffff", color: "#0f172a" }}
                                >
                                    🆕 Exclude ADM
                                </button>

                                <button
                                    onClick={() => { setSortOrder("default"); setAdminFilter("all") }}
                                    class="sort-btn"
                                    style={{ "padding": "10px 20px", "border-radius": "8px", "font-size": "12px", "font-weight": 600, "cursor": "pointer", "transition": "all 0.2s", "border": "2px solid #3b82f6", "background": "#ffffff", "color": "#0f172a" }}
                                >
                                    🔄 Default Order
                                </button>
                            </div>
                        </div>
                    </div>


                    <div class="mb-8 rounded-2xl p-6" style={{ "background": "linear-gradient(135deg, #3b82f6, #8b5cf6)", "box-shadow": "0 10px 30px rgba(59, 130, 246, 0.4)" }}>
                        <div style={{ "font-size": "14px", "color": "white", "opacity": 0.9, "margin-bottom": "8px", "font-weight": 600 }}>
                            🎨 Total NFTs in Marketplace
                        </div>
                        <div style={{ "font-size": "48px", "color": "white", "font-weight": 900 }}>
                            {burntNFTs.length}
                        </div>
                    </div>


                    <div class="rounded-2xl overflow-hidden" style={{ "background": "#ffffff", "box-shadow": "0 10px 40px rgba(0, 0, 0, 0.3)" }}>
                        <div class="table-container overflow-x-auto" style={{ "-webkit-overflow-scrolling": "touch" }}>
                            <table class="w-full" style={{ "min-width": "320px" }}>
                                <thead style={{ "background": "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                                    <tr>
                                        <th class="px-3 py-4 text-left font-bold uppercase" style={{ "font-size": "10.4px", "color": "white", "letter-spacing": "0.05em" }}>Queue</th>
                                        <th class="px-3 py-4 text-left font-bold uppercase" style={{ "font-size": "10.4px", "color": "white", "letter-spacing": "0.05em" }}>NFT Token</th>
                                        <th class="px-3 py-4 text-left font-bold uppercase" style={{ "font-size": "10.4px", "color": "white", "letter-spacing": "0.05em" }}>Burning Time</th>
                                        <th class="px-3 py-4 text-left font-bold uppercase" style={{ "font-size": "10.4px", "color": "white", "letter-spacing": "0.05em" }}>Duration</th>
                                        <th class="px-3 py-4 text-left font-bold uppercase" style={{ "font-size": "10.4px", "color": "white", "letter-spacing": "0.05em" }}>Burning Owner</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {filteredUsers.map((nft, index) => {
                                        if (index >= (page - 1) * pageSize && index < page * pageSize) {
                                            return (
                                                <tr class="table-row border-b transition-all" style={{ "border-color": "rgba(59, 130, 246, 0.3)", "background": "#ffffff" }}>
                                                    <td class="px-3 py-4" style={{ "font-size": "12px", "color": "#0f172a", "font-weight": 600 }}>
                                                        #{index + 1}
                                                    </td>
                                                    <td class="px-3 py-4">
                                                        <span
                                                            class="token-clickable"
                                                            style={{ "display": "inline-block", "padding": "8px 12px", "background": "linear-gradient(135deg, #3b82f6, #8b5cf6)", "color": "white", "border-radius": "8px", "font-size": "12px", "font-weight": 700, "box-shadow": "0 4px 12px rgba(59, 130, 246, 0.3)" }}
                                                        >
                                                            NFT-{nft.id}
                                                        </span>
                                                    </td>
                                                    <td class="px-3 py-4" style={{ "font-size": "11.2px", "color": "#0f172a", "opacity": 0.8, "white-space": "nowrap" }}>
                                                        {secondsToDMY(nft.purchasedTime)}
                                                    </td>
                                                    <td class="px-3 py-4">
                                                        <span style={{ "display": "inline-flex", "align-items": "center", "gap": "6px", "padding": "6px 12px", "background": "#f59e0b", "color": "white", "border-radius": "6px", "font-size": "10.4px", "font-weight": 700, "white-space": "nowrap" }}>
                                                            ⏱️ {secondsToDHMSDiff(now - nft.purchasedTime)}
                                                        </span>
                                                    </td>
                                                    <td class="px-3 py-4">
                                                        <div style={{ "display": "flex", "align-items": "center", "gap": "6px" }}>
                                                            <div style={{ "font-family": "'Courier New', monospace", "font-size": "10.4px", "color": "#1e293b", "font-weight": 700, "max-width": "150px", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" }}>
                                                                {nft._owner}
                                                            </div>
                                                            <button
                                                                onClick={() => { copyToClipboard(nft._owner) }}

                                                                class="copy-table-btn"
                                                                data-address={nft._owner}
                                                                style={{ "background": "#3b82f6", "color": "white", "border": "none", "padding": "5px 8px", "border-radius": "5px", "cursor": "pointer", "font-size": "10.4px", "font-weight": 600, "white-space": "nowrap", "transition": "all 0.2s", "flex-shrink": 0 }}
                                                            >
                                                                📋
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })}



                                    {/* <tr class="table-row border-b transition-all" style={{"border-color": "rgba(59, 130, 246, 0.3)", "background": "#f8fafc"}}>
                <td class="px-3 py-4" style={{"font-size": "12px", "color": "#0f172a", "font-weight": 600}}>
                  #2
                </td>
                <td class="px-3 py-4">
                  <span 
                    class="token-clickable"
                    style={{"display": "inline-block", "padding": "8px 12px", "background": "linear-gradient(135deg, #3b82f6, #8b5cf6)", "color": "white", "border-radius": "8px", "font-size": "12px", "font-weight": 700, "box-shadow": "0 4px 12px rgba(59, 130, 246, 0.3)"}}
                  >
                    NFT-1002
                  </span>
                </td>
                <td class="px-3 py-4" style={{"font-size": "11.2px", "color": "#0f172a", "opacity": 0.8, "white-space": "nowrap"}}>
                  Feb 28, 2024, 09:15
                </td>
                <td class="px-3 py-4">
                  <span style={{"display": "inline-flex", "align-items": "center", "gap": "6px", "padding": "6px 12px", "background": "#f59e0b", "color": "white", "border-radius": "6px", "font-size": "10.4px", "font-weight": 700, "white-space": "nowrap"}}>
                    ⏱️ 96h
                  </span>
                </td>
                <td class="px-3 py-4">
                  <div style={{"display": "flex", "align-items": "center", "gap": "6px"}}>
                    <div style={{"font-family": "'Courier New', monospace", "font-size": "10.4px", "color": "#1e293b", "font-weight": 700, "max-width": "150px", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap"}}>
                      0x2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b
                    </div>
                    <button 
                      class="copy-table-btn"
                      data-address="0x2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b"
                      style={{"background": "#3b82f6", "color": "white", "border": "none", "padding": "5px 8px", "border-radius": "5px", "cursor": "pointer", "font-size": "10.4px", "font-weight": 600, "white-space": "nowrap", "transition": "all 0.2s", "flex-shrink": 0}}
                    >
                      📋
                    </button>
                  </div>
                </td>
              </tr>



              <tr class="table-row border-b transition-all" style={{"border-color": "rgba(59, 130, 246, 0.3)", "background": "#ffffff"}}>
                <td class="px-3 py-4" style={{"font-size": "12px", "color": "#0f172a", "font-weight": 600}}>
                  #20
                </td>
                <td class="px-3 py-4">
                  <span 
                    class="token-clickable"
                    style={{"display": "inline-block", "padding": "8px 12px", "background": "linear-gradient(135deg, #3b82f6, #8b5cf6)", "color": "white", "border-radius": "8px", "font-size": "12px", "font-weight": 700, "box-shadow": "0 4px 12px rgba(59, 130, 246, 0.3)"}}
                  >
                    NFT-1020
                  </span>
                </td>
                <td class="px-3 py-4" style={{"font-size": "11.2px", "color": "#0f172a", "opacity": 0.8, "white-space": "nowrap"}}>
                  Aug 24, 2024, 09:35
                </td>
                <td class="px-3 py-4">
                  <span style={{"display": "inline-flex", "align-items": "center", "gap": "6px", "padding": "6px 12px", "background": "#f59e0b", "color": "white", "border-radius": "6px", "font-size": "10.4px", "font-weight": 700, "white-space": "nowrap"}}>
                    ⏱️ 24h
                  </span>
                </td>
                <td class="px-3 py-4">
                  <div style={{"display": "flex", "align-items": "center", "gap": "6px"}}>
                    <div style={{"font-family": "'Courier New', monospace", "font-size": "10.4px", "color": "#1e293b", "font-weight": 700, "max-width": "150px", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap"}}>
                      0x0a2b4d6f8a0c2e4a6c8e0a2b4d6f8a0c2e4a6c
                    </div>
                    <button 
                      class="copy-table-btn"
                      data-address="0x0a2b4d6f8a0c2e4a6c8e0a2b4d6f8a0c2e4a6c"
                      style={{"background": "#3b82f6", "color": "white", "border": "none", "padding": "5px 8px", "border-radius": "5px", "cursor": "pointer", "font-size": "10.4px", "font-weight": 600, "white-space": "nowrap", "transition": "all 0.2s", "flex-shrink": 0}}
                    >
                      📋
                    </button>
                  </div>
                </td>
              </tr> */}
                                </tbody>
                            </table>
                        </div>


                        <div class="px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2" style={{ "border-color": "rgba(59, 130, 246, 0.3)" }}>
                            <div style={{ "font-size": "12px", "color": "#0f172a", "opacity": 0.8, "text-align": "center" }}>
                                Showing <span class="font-bold" style={{ "color": "#0f172a" }}>{(page - 1) * pageSize + 1}</span> to <span class="font-bold" style={{ "color": "#0f172a" }}>{Math.min(page * pageSize, filteredUsers.length)}</span> of <span class="font-bold" style={{ "color": "#0f172a" }}>{filteredUsers.length}</span> users
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
                                    style={{ "background": "#3b82f6", "color": "white", "font-size": "12px", "border": "none", "cursor": "pointer", "box-shadow": "0 4px 12px rgba(59, 130, 246, 0.4)" }}
                                >
                                    ← Prev
                                </button>
                                <div style={{ "padding": "8px 16px", "background": "rgba(59, 130, 246, 0.2)", "border-radius": "8px", "font-size": "12px", "color": "#0f172a", "font-weight": 700 }}>
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
                                    style={{ "background": "#3b82f6", "color": "white", "font-size": "12px", "border": "none", "cursor": "pointer", "box-shadow": "0 4px 12px rgba(59, 130, 246, 0.4)" }}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div id="nftModal" class="nft-image-container">
                <div class="nft-card rounded-2xl overflow-hidden" style={{ "background": "white" }}>
                    <div id="nftModalContent"></div>
                </div>
            </div>
            {showModal && (
                <div
                    id="adminModal"
                    className="admin-modal-container"
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 100,
                    }}
                >
                    <div class="admin-card rounded-2xl overflow-hidden" style={{ background: "white", maxwidth: "600px" }}>
                        <div>
                            {MODE == "add" ?
                                <div style={{ position: "relative" }}>
                                    <button
                                        onClick={() => { setShowModal(false) }}
                                        id="closeAdminModal"
                                        style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(0,0,0,0.7)", color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "24px", cursor: "pointer", zIndex: "10", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: " bold", transition: "all 0.2s" }}
                                    >
                                        ×
                                    </button>

                                    <div style={{ padding: "32px", background: "linearGradient(to bottom, #ffffff, #f8fafc)" }}>
                                        <h2 style={{ fontFamily: 'Inter', fontSize: "28px", color: "#0f172a", fontWeight: "800", margin: "0 0 24px 0" }}>
                                            ➕ Add Admin Address
                                        </h2>

                                        <div style={{ marginBottom: "24px" }}>
                                            <div style={{ fontSize: "14px", color: "#0f172a", opacity: "0.8", marginBottom: "8px", fontWeight: "600" }}>
                                                Admin Address
                                            </div>
                                            <input
                                                value={adminWallet}
                                                onChange={(e) => { setAdminWallet(e.target.value) }}
                                                type="text"
                                                id="adminAddressInput"
                                                placeholder="0x..."
                                                class="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none"
                                                style={{
                                                    borderColor: "#3b82f6",
                                                    background: "#ffffff",
                                                    color: "#0f172a",
                                                    fontFamily: "'Courier New', monospace",
                                                }}
                                            />
                                            <div style={{
                                                fontSize: "12px",
                                                color: "#64748b",
                                                marginTop: "8px",
                                            }}>
                                                Enter a valid OPBNB address (0x...)
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", gap: "12px" }}>
                                            <button
                                                onClick={saveAdmin}
                                                id="saveAdminBtn"
                                                style={{
                                                    flex: 1,
                                                    padding: "16px",
                                                    background: "linear-gradient(135deg, #10b981, #059669)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                                                    fontSize: "16px",
                                                    fontWeight: 700,
                                                    cursor: "pointer",
                                                    transition: "all 0.2s",
                                                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
                                                }}
                                            >
                                                💾 Save Address
                                            </button>

                                            <button
                                                onClick={() => { setShowModal(false) }}
                                                id="cancelAddBtn"
                                                style={{
                                                    flex: 1,
                                                    padding: "16px",
                                                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                                                    fontSize: "16px",
                                                    fontWeight: 700,
                                                    cursor: "pointer",
                                                    transition: "all 0.2s",
                                                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
                                                }}
                                            >
                                                ❌ Cancel
                                            </button>
                                        </div>

                                    </div>
                                </div> :
                                <div style={{ position: "relative" }}>
                                    {/* Close Modal Button */}
                                    <button
                                        onClick={() => { setShowModal(false) }}
                                        id="closeAdminModal"
                                        style={{
                                            position: "absolute",
                                            top: "16px",
                                            right: "16px",
                                            background: "rgba(0,0,0,0.7)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: "40px",
                                            height: "40px",
                                            fontSize: "24px",
                                            cursor: "pointer",
                                            zIndex: 10,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "bold",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        ×
                                    </button>

                                    <div
                                        style={{
                                            padding: "32px",
                                            background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
                                        }}
                                    >
                                        {/* Title */}
                                        <h2
                                            style={{
                                                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                                                fontSize: "28px",
                                                color: "#0f172a",
                                                fontWeight: 800,
                                                margin: "0 0 24px 0",
                                            }}
                                        >
                                            👑 Admin Address List
                                        </h2>

                                        {/* Total Count */}
                                        <div
                                            style={{
                                                marginBottom: "24px",
                                                fontSize: "14px",
                                                color: "#0f172a",
                                                opacity: 0.8,
                                            }}
                                        >
                                            Total: <strong>{ADMIN_ADDRESSES.length}</strong>{" "}
                                            admin address{ADMIN_ADDRESSES.length !== 1 ? "es" : ""}
                                        </div>

                                        {/* Admin List */}
                                        <div
                                            id="adminList"
                                            style={{
                                                maxHeight: "300px",
                                                overflowY: "auto",
                                                marginBottom: "24px",
                                            }}
                                        >
                                            {ADMIN_ADDRESSES.length > 0 ? (
                                                ADMIN_ADDRESSES.map((addr, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            padding: "12px",
                                                            background: "rgba(0,0,0,0.05)",
                                                            borderRadius: "8px",
                                                            marginBottom: "8px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontFamily: "'Courier New', monospace",
                                                                fontSize: "12px",
                                                                color: "#0f172a",
                                                                wordBreak: "break-all",
                                                                flex: 1,
                                                            }}
                                                        >
                                                            {addr}
                                                        </div>

                                                        <button
                                                            className="delete-admin-btn"
                                                            data-address={addr}
                                                            style={{
                                                                background: "#ef4444",
                                                                color: "white",
                                                                border: "none",
                                                                padding: "8px 12px",
                                                                borderRadius: "6px",
                                                                cursor: "pointer",
                                                                fontSize: "12px",
                                                                fontWeight: 600,
                                                                flexShrink: 0,
                                                                transition: "all 0.2s",
                                                            }}
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div
                                                    style={{
                                                        textAlign: "center",
                                                        padding: "20px",
                                                        color: "#64748b",
                                                        fontStyle: "italic",
                                                    }}
                                                >
                                                    No admin addresses added yet
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div style={{ display: "flex", gap: "12px" }}>
                                            <button
                                                id="addNewAdminBtn"
                                                style={{
                                                    flex: 1,
                                                    padding: "16px",
                                                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                                                    fontSize: "16px",
                                                    fontWeight: 700,
                                                    cursor: "pointer",
                                                    transition: "all 0.2s",
                                                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                                                }}
                                            >
                                                ➕ Add New
                                            </button>

                                            <button
                                                id="closeListBtn"
                                                style={{
                                                    flex: 1,
                                                    padding: "16px",
                                                    background: "linear-gradient(135deg, #94a3b8, #64748b)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                                                    fontSize: "16px",
                                                    fontWeight: 700,
                                                    cursor: "pointer",
                                                    transition: "all 0.2s",
                                                    boxShadow: "0 4px 12px rgba(148, 163, 184, 0.4)",
                                                }}
                                            >
                                                ✅ Done
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            }

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
