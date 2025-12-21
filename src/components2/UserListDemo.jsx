import { useEffect, useMemo, useState } from "react";
import { fetcherAbi, fetcherAddress, helperAbi, helperAddress, packageKeys, web3 } from "../config";
import { formatAddress, secondsToDMY } from "../utils/contractExecutor";
import toast from "react-hot-toast";



/* ------------------ COMPONENT ------------------ */
export default function UserListDemo() {
    const [users, setUsers] = useState();
    const [page, setPage] = useState(1);
    const [Trades, setTrades] = useState(0)
    const [packageSelected, setPackageSelected] = useState("All")
    const [searchText, setSearchText] = useState("")

    const fetcherContract = new web3.eth.Contract(fetcherAbi, fetcherAddress)
    const helperContract = new web3.eth.Contract(helperAbi, helperAddress)

    const pageSize = 50;

    useEffect(() => {


        const abc = async () => {
            const _users = await fetcherContract.methods.getUsers().call()
            const now = Math.floor(Date.now() / 1000);
            const modifiedUsers = _users.map((v, e) => {
                return ({
                    ...v, packageName: packageKeys[v.packageId].name, packagePrice: packageKeys[v.packageId].dollar
                    , active: Number(v.packageUpgraded) - now <= 60 * 60 * 24 * 45 ? "Active" : "Expired"
                })
            })
            setUsers(modifiedUsers)
        }



        abc()
    }, [])


    useEffect(() => {
        const bringTransaction = async () => {
            const latestBlock = await web3.eth.getBlockNumber();
            const fromBlock = latestBlock - 200000;
            const step = 5000; // or smaller if node still complains
            let allEvents = [];

            for (let i = fromBlock; i <= latestBlock; i += step) {
                const toBlock = Math.min(i + step - 1, latestBlock);

                try {
                    const events = await helperContract.getPastEvents("Trades",

                        {

                            fromBlock: i,
                            toBlock: toBlock,
                        });
                    allEvents = allEvents.concat(events);
                    setTrades(allEvents)
                    // console.log(`Fetched ${events.length} events from ${i} to ${toBlock}`);
                } catch (error) {
                    console.warn(`Error fetching from ${i} to ${toBlock}`, error);
                }
            }

            // console.log("All events:", allEvents);
        };




        bringTransaction();

    }, []);

    const addressToValue = (address) => {
        if (Trades.length === 0) return "not found";

        const trade = Trades.filter(trade => trade.returnValues._user.toLowerCase() === address.toLowerCase());
        const totalVolume = trade.reduce((acc, curr) => acc + Number(web3.utils.fromWei(curr.returnValues.amount, 'ether')), 0);
        return Number(totalVolume).toFixed(4);


    }





    const countOfActive = users && users.filter(user => user.active === "Active").length;

    const welcomeCount = users && users.filter(user => user.packageName === "Welcome").length;
    const DiCount = users && users.filter(user => user.packageName === "DI").length;
    const tricount = users && users.filter(user => user.packageName === "TRI").length;
    const tetracount = users && users.filter(user => user.packageName === "TETRA").length;
    const pentacount = users && users.filter(user => user.packageName === "PENTA").length;
    const hexacount = users && users.filter(user => user.packageName === "HEXA").length;




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




const filteredUsers = useMemo(() => {
    if (!users) return [];

    const search = searchText?.toLowerCase().trim();

    return users.filter(u => {
        const matchPackage =
            packageSelected === "All" || u.packageName === packageSelected;

        const matchAddress =
            !search || u._address?.toLowerCase().includes(search);

        return matchPackage && matchAddress;
    });
}, [users, packageSelected, searchText]);


    const totalpages = users && Math.ceil(filteredUsers.length / pageSize);


    const isLoading = !users || !Trades;





    if (isLoading) {
        // show a waiting/loading screen
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
            </div>
        );
    }

    /* ------------------ RENDER ------------------ */
    return (
        <div class="min-h-full w-full p-4 md:p-8">
            <div class="max-w-7xl mx-auto">

                <div class="mb-6 md:mb-8 pb-4 md:pb-6 border-b-2" style={{ "border-color": "#2563eb" }}>
                    <h1 class="font-bold mb-2" style={{ "font-size": "28px", "color": "#0f172a", "letter-spacing": "-0.025em" }}>
                        User List Demo
                    </h1>
                    <p style={{ "font-size": "14px", "color": "#64748b", "font-weight": 500 }}>
                        Active Users
                    </p>
                </div>


                <div class="mb-4 md:mb-6">
                    <div class="relative">
                        <input
                            type="text"
                            id="searchInput"
                            onChange={(e)=>setSearchText(e.target.value)}
                            placeholder="🔍 Search by address..."
                            class="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl border-2 transition-all focus:outline-none"
                            style={{ "border-color": "rgba(37, 99, 235, 0.2)", "background": "#ffffff", "color": "#0f172a", "padding-right": "80px" }}
                        />
                        <button
                            id="clearSearch"
                            class="absolute right-2 top-1/2 px-4 py-2 rounded-lg transition-all"
                            style={{ "transform": "translateY(-50%)", "background": "#2563eb", "color": "#ffffff", "font-weight": 600, "border": "none", "cursor": "pointer", "display": "none" }}
                        >
                            Clear
                        </button>
                    </div>
                    <div id="searchResults" style={{ "font-size": "14px", "color": "#64748b", "margin-top": "8px", "font-weight": 500 }}></div>
                </div>


                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">

                    <div class="rounded-xl p-6" style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)", "box-shadow": "0 8px 20px rgba(37, 99, 235, 0.3)" }}>
                        <div style={{ "font-size": "14px", "color": "#ffffff", "font-weight": 600, "opacity": 0.9, "margin-bottom": "8px" }}>
                            👥 Total Users
                        </div>
                        <div style={{ "font-size": "40px", "color": "#ffffff", "font-weight": 800 }}>
                            {users.length}
                        </div>
                    </div>


                    <div class="rounded-xl p-6" style={{ background: "linear-gradient(135deg, #10b981, #059669)", "box-shadow": "0 8px 20px rgba(16, 185, 129, 0.3)" }}>
                        <div style={{ "font-size": "14px", "color": "#ffffff", "font-weight": 600, "opacity": 0.9, "margin-bottom": "8px" }}>
                            ✓ Active Users
                        </div>
                        <div style={{ "font-size": "40px", "color": "#ffffff", "font-weight": 800 }}>
                            {countOfActive}
                        </div>
                    </div>
                </div>


                <div class="rounded-2xl p-6 mb-8" style={{ "background": "#ffffff", "box-shadow": "0 4px 12px rgba(0, 0, 0, 0.08)" }}>
                    <div class="flex items-center justify-between mb-4">
                        <h3 style={{ "font-size": "20px", "color": "#0f172a", "font-weight": 700 }}>
                            📦 Package Distribution
                        </h3>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">

                        <div class="package-card rounded-lg p-4 border-2 transition-all"
                            onClick={() => {
                                if (packageSelected === "Welcome") {
                                    setPackageSelected("All")
                                } else {
                                    setPackageSelected("Welcome")
                                }

                            }}
                            style={{ background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(59, 130, 246, 0.1))", borderColor: "rgba(37, 99, 235, 0.3)", "cursor": "pointer" }}>
                            <div style={{ "font-size": "14px", "color": "#2563eb", "font-weight": 700, "margin-bottom": "6px" }}>
                                Welcome
                            </div>
                            <div style={{ "font-size": "28px", "color": "#0f172a", "font-weight": 800 }}>
                                {welcomeCount} <span style={{ "font-size": "14px", "color": "#64748b", "font-weight": 500 }}>users</span>
                            </div>
                        </div>


                        <div class="package-card rounded-lg p-4 border-2 transition-all"
                            onClick={() => {
                                if (packageSelected === "DI") {
                                    setPackageSelected("All")
                                } else {
                                    setPackageSelected("DI")
                                }

                            }}
                            style={{ background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(59, 130, 246, 0.1))", borderColor: "rgba(37, 99, 235, 0.3)", "cursor": "pointer" }}>
                            <div style={{ "font-size": "14px", "color": "#2563eb", "font-weight": 700, "margin-bottom": "6px" }}>
                                DI
                            </div>
                            <div style={{ "font-size": "28px", "color": "#0f172a", "font-weight": 800 }}>
                                {DiCount} <span style={{ "font-size": "14px", "color": "#64748b", "font-weight": 500 }}>users</span>
                            </div>
                        </div>


                        <div class="package-card rounded-lg p-4 border-2 transition-all"
                            onClick={() => {
                                if (packageSelected === "TRI") {
                                    setPackageSelected("All")
                                } else {
                                    setPackageSelected("TRI")
                                }

                            }}
                            style={{ background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(59, 130, 246, 0.1))", borderColor: "rgba(37, 99, 235, 0.3)", "cursor": "pointer" }}>
                            <div style={{ "font-size": "14px", "color": "#2563eb", "font-weight": 700, "margin-bottom": "6px" }}>
                                TRI
                            </div>
                            <div style={{ "font-size": "28px", "color": "#0f172a", "font-weight": 800 }}>
                                {tricount} <span style={{ "font-size": "14px", "color": "#64748b", "font-weight": 500 }}>users</span>
                            </div>
                        </div>


                        <div class="package-card rounded-lg p-4 border-2 transition-all"
                            onClick={() => {
                                if (packageSelected === "TETRA") {
                                    setPackageSelected("All")
                                } else {
                                    setPackageSelected("TETRA")
                                }

                            }}
                            style={{ background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(59, 130, 246, 0.1))", borderColor: "rgba(37, 99, 235, 0.3)", "cursor": "pointer" }}>
                            <div style={{ "font-size": "14px", "color": "#2563eb", "font-weight": 700, "margin-bottom": "6px" }}>
                                TETRA
                            </div>
                            <div style={{ "font-size": "28px", "color": "#0f172a", "font-weight": 800 }}>
                                {tetracount} <span style={{ "font-size": "14px", "color": "#64748b", "font-weight": 500 }}>users</span>
                            </div>
                        </div>


                        <div class="package-card rounded-lg p-4 border-2 transition-all"
                            onClick={() => {
                                if (packageSelected === "PENTA") {
                                    setPackageSelected("All")
                                } else {
                                    setPackageSelected("PENTA")
                                }

                            }}
                            style={{ background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(59, 130, 246, 0.1))", borderColor: "rgba(37, 99, 235, 0.3)", "cursor": "pointer" }}>
                            <div style={{ "font-size": "14px", "color": "#2563eb", "font-weight": 700, "margin-bottom": "6px" }}>
                                PENTA
                            </div>
                            <div style={{ "font-size": "28px", "color": "#0f172a", "font-weight": 800 }}>
                                {pentacount} <span style={{ "font-size": "14px", "color": "#64748b", "font-weight": 500 }}>users</span>
                            </div>
                        </div>


                        <div class="package-card rounded-lg p-4 border-2 transition-all"
                            onClick={() => {
                                if (packageSelected === "HEXA") {
                                    setPackageSelected("All")
                                } else {
                                    setPackageSelected("HEXA")
                                }

                            }}
                            style={{ background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(59, 130, 246, 0.1))", borderColor: "rgba(37, 99, 235, 0.3)", "cursor": "pointer" }}>
                            <div style={{ "font-size": "14px", "color": "#2563eb", "font-weight": 700, "margin-bottom": "6px" }}>
                                HEXA
                            </div>
                            <div style={{ "font-size": "28px", "color": "#0f172a", "font-weight": 800 }}>
                                {hexacount} <span style={{ "font-size": "14px", "color": "#64748b", "font-weight": 500 }}>users</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rounded-2xl overflow-hidden" style={{ background: "#ffffff", boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)" }}>
                    <div class="table-container overflow-x-auto">
                        <table class="w-full" style={{ minWidth: "900px" }}>
                            <thead style={{ background: "linear-gradient(to bottom, #2563eb, #3b82f6)", borderBottom: "3px solid #2563eb" }}>
                                <tr>
                                    <th class="px-6 py-5 text-left font-bold uppercase tracking-wider" style={{ "font-size": "11.2px", "color": "#ffffff", "letter-spacing": "0.05em" }}>#</th>
                                    <th class="px-6 py-5 text-left font-bold uppercase tracking-wider" style={{ "font-size": "11.2px", "color": "#ffffff", "letter-spacing": "0.05em" }}>Address</th>
                                    <th class="px-6 py-5 text-left font-bold uppercase tracking-wider" style={{ "font-size": "11.2px", "color": "#ffffff", "letter-spacing": "0.05em" }}>Referred By</th>
                                    <th class="px-6 py-5 text-left font-bold uppercase tracking-wider" style={{ "font-size": "11.2px", "color": "#ffffff", "letter-spacing": "0.05em" }}>Package</th>
                                    <th class="px-6 py-5 text-left font-bold uppercase tracking-wider" style={{ "font-size": "11.2px", "color": "#ffffff", "letter-spacing": "0.05em" }}>Join Date</th>
                                    <th class="px-6 py-5 text-left font-bold uppercase tracking-wider" style={{ "font-size": "11.2px", "color": "#ffffff", "letter-spacing": "0.05em" }}>Volume (24h)</th>
                                    <th class="px-6 py-5 text-left font-bold uppercase tracking-wider" style={{ "font-size": "11.2px", "color": "#ffffff", "letter-spacing": "0.05em" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>

                                {filteredUsers.map((user, index) => {
                                    if (index >= (page - 1) * pageSize && index < page * pageSize) {
                                        return (
                                            <tr class="table-row border-b transition-all" style={{ borderColor: "#e2e8f0", background: "#ffffff" }}>
                                                <td class="px-6 py-5 font-semibold" style={{ "font-size": "14px", "color": "#0f172a" }}   >{index + 1}</td>
                                                <td class="px-6 py-5">
                                                    <div class="flex items-center gap-2">
                                                        <span class="font-mono" style={{ "font-family": "'Courier New', monospace", "font-size": "11.2px", "color": "#0f172a", "font-weight": "700", "word-break": "break-all" }}>{formatAddress(user._address)}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(user._address)}
                                                            class="copy-btn px-2 py-1 rounded transition-all" style={{ "background": "#e0e7ff", "color": "#2563eb", "font-size": "11.2px", "font-weight": "600", "border": "none", "cursor": "pointer" }} data-address="0x7a3b9c8d1e2f4a5b6c7d8e9f0a">
                                                            📋
                                                        </button>
                                                    </div>
                                                </td>
                                                <td class="px-6 py-5">
                                                    <div class="flex items-center gap-2">
                                                        <span class="font-mono" style={{ "font-family": "'Courier New', monospace", "font-size": "11.2px", "color": "#0f172a", "font-weight": "700", "word-break": "break-all" }}>{formatAddress(user.referrer)}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(user.referrer)}
                                                            class="copy-btn px-2 py-1 rounded transition-all" style={{ "background": "#e0e7ff", "color": "#2563eb", "font-size": "11.2px", "font-weight": "600", "border": "none", "cursor": "pointer" }} data-address="0x9f0a1b2c3d4e5f6a7b8c9d0e1f">
                                                            📋
                                                        </button>
                                                    </div>
                                                </td>
                                                <td class="px-6 py-5" style={{ "font-size": "14px", "color": "#0f172a" }}>
                                                    <span class="px-4 py-2 rounded-lg font-bold" style={
                                                        user.packageName === "HEXA" ? { "background": "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(59, 130, 246, 0.2))", "color": "#2563eb", "border": "1.5px solid rgba(37, 99, 235, 0.3)", "display": "inline-block", "font-size": "12px" } :
                                                            { "background": "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(59, 130, 246, 0.2)); color: #2563eb; border: 1.5px solid rgba(37, 99, 235, 0.3); display: inline-block; font-size: 12px;" }}>
                                                        {user.packageName} ({user.packagePrice})
                                                    </span>
                                                </td>
                                                <td class="px-6 py-5" style={{ "font-size": "12.8px", "color": "#475569", "font-weight": "500", "white-space": "nowrap" }}>{secondsToDMY(user.joiningDate)}</td>
                                                <td class="px-6 py-5 font-bold" style={{ "font-size": "14px", "color": "#10b981", "white-space": "nowrap" }}>${addressToValue(user._address)}</td>
                                                <td class="px-6 py-5">
                                                    <span class="px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2" style={{ "background": user.active === "Active" ? "#10b981" : "#f87171", "color": "#ffffff", "box-shadow": "0 2px 8px rgba(16, 185, 129, 0.3)", "font-size": "12px", "white-space": "nowrap" }}>
                                                        <span style={{ "width": "5px", "height": "5px", "border-radius": "50%", "background": "#ffffff" }}></span>
                                                        {user.active}
                                                    </span>
                                                </td>
                                            </tr>

                                        )
                                    }
                                })}






                                {/* 
                                <tr class="table-row border-b transition-all" style={{ "border-color": "#e2e8f0", "background": "#ffffff" }}>
                                    <td class="px-6 py-5 font-semibold" style={{ "font-size": "14px", "color": "#0f172a" }}>50</td>
                                    <td class="px-6 py-5">
                                        <div class="flex items-center gap-2">
                                            <span class="font-mono" style={{ "font-family": "'Courier New', monospace", "font-size": "11.2px", "color": "#0f172a", "font-weight": "700", "word-break": "break-all" }}>0x9d8e7f6a5b4c3d2e1f0a9b8c7d</span>
                                            <button class="copy-btn px-2 py-1 rounded transition-all" style={{ "background": "#e0e7ff", "color": "#2563eb", "font-size": "11.2px", "font-weight": "600", "border": "none", "cursor": "pointer" }} data-address="0x9d8e7f6a5b4c3d2e1f0a9b8c7d">
                                                📋
                                            </button>
                                        </div>
                                    </td>
                                    <td class="px-6 py-5">
                                        <div class="flex items-center gap-2">
                                            <span class="font-mono" style={{ "font-family": "'Courier New', monospace", "font-size": "11.2px", "color": "#0f172a", "font-weight": "700", "word-break": "break-all" }}>0x6e5f4a3b2c1d0e9f8a7b6c5d4e</span>
                                            <button class="copy-btn px-2 py-1 rounded transition-all" style={{ "background": "#e0e7ff", "color": "#2563eb", "font-size": "11.2px", "font-weight": "600", "border": "none", "cursor": "pointer" }} data-address="0x6e5f4a3b2c1d0e9f8a7b6c5d4e">
                                                📋
                                            </button>
                                        </div>
                                    </td>
                                    <td class="px-6 py-5" style={{ "font-size": "14px", "color": "#0f172a" }}>
                                        <span class="px-4 py-2 rounded-lg font-bold" style={{ "background": "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(59, 130, 246, 0.2))", "color": "#2563eb", "border": "1.5px solid rgba(37, 99, 235, 0.3)", "display": "inline-block", "font-size": "12px" }}  >
                                            HEXA ($35)
                                        </span>
                                    </td>
                                    <td class="px-6 py-5" style={{ "font-size": "12.8px", "color": "#475569", "font-weight": "500", "white-space": "nowrap" }}>Dec 5, 2023</td>
                                    <td class="px-6 py-5 font-bold" style={{ "font-size": "14px", "color": "#10b981", "white-space": "nowrap" }}>$45,678.90</td>
                                    <td class="px-6 py-5">
                                        <span class="px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2" style={{ "background": "#ef4444", "color": "#ffffff", "box-shadow": "0 2px 8px rgba(239, 68, 68, 0.3)", "font-size": "12px", "white-space": "nowrap" }}>
                                            <span style={{ "width": "5px", "height": "5px", "border-radius": "50%", "background": "#ffffff" }}></span>
                                            Expired
                                        </span>
                                    </td>
                                </tr> */}


                            </tbody>
                        </table>
                    </div>


                    <div class="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0 border-t-2" style={{ "border-color": "#e2e8f0", "background": "linear-gradient(to bottom, #f8fafc, #ffffff);" }}>
                        <div style={{ "font-size": "13px", "color": "#64748b", "font-weight": "500", "text-align": "center" }}>
                            Showing <span class="font-bold" style={{ "color": "#0f172a" }}>{(page - 1) * pageSize + 1}</span> to <span class="font-bold" style={{ "color": "#0f172a" }}>{Math.min(page * pageSize, filteredUsers.length)}</span> of <span class="font-bold" style={{ "color": "#0f172a" }}>{filteredUsers.length}</span> users
                        </div>
                        <div class="flex gap-3 items-center">
                            <button
                                onClick={() => {
                                    if (page > 1) {
                                        setPage(prev => prev - 1);
                                    }
                                }}
                                id="prevBtn"
                                class="px-6 py-3 rounded-lg font-bold transition-all shadow-md"
                                style={{ "background": "#2563eb", "color": "#ffffff", "box-shadow": "0 4px 12px rgba(37, 99, 235, 0.4);" }}
                            >
                                ← Prev
                            </button>
                            <div class="flex items-center px-6 py-3 rounded-lg" style={{ "font-size": "14px", "color": "#0f172a", "background": "#f1f5f9", "font-weight": "600" }}>
                                <span style={{ "color": "#64748b" }}>Page</span> <span class="mx-2" style={{ "color": "#2563eb", "font-size": "16px" }}>{page}</span> <span style={{ "color": "#64748b" }}>of {totalpages}</span>
                            </div>
                            <button
                                onClick={() => {
                                    if (page < totalpages) {
                                        setPage(prev => prev + 1);
                                    }
                                }}

                                id="nextBtn"
                                class="px-6 py-3 rounded-lg font-bold transition-all shadow-md"
                                style={{ "background": "#2563eb", "color": "#ffffff", "box-shadow": "0 4px 12px rgba(37, 99, 235, 0.4);" }}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------ SUB COMPONENT ------------------ */
