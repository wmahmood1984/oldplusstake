import React, { useState, useEffect } from "react";
import "../../App.css";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import { init, readName } from "../../slices/contractSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useAppKitAccount } from "@reown/appkit/react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import ProfileSection from "../../ProfileSection.jsx";

Modal.setAppElement("#root");

export default function MagicverseDashboard() {
    const [active, setActive] = useState("dashboard");
    const [loading, setLoading] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { address } = useAppKitAccount();
    const { name, status, error } = useSelector((state) => state.contract || {});

    useEffect(() => {
        if (address) {
            setLoading(true);
            dispatch(init());
            dispatch(readName({ address })).finally(() => setLoading(false));
        }
    }, [dispatch, address]);

    const user = {
        id: 816461,
        rank: 2,
        walletFund: 117.5998,
        totalIncome: 260.4096,
        referralLink: "https://magicverse.org/signup?ref=816461",
        referredBy: 771274,
    };

    const incomeItems = [
        { sr: 1, amount: "100 USDT", status: "Completed", time: "2025-10-21 12:30 PM" },
        { sr: 2, amount: "75 USDT", status: "Pending", time: "2025-10-23 04:10 PM" },
        { sr: 3, amount: "50 USDT", status: "Completed", time: "2025-10-24 09:50 AM" },
    ];

    const referrals = [
        { id: 771274, address: "0x3dF4a...45e7", date: "2025-09-15" },
        { id: 771275, address: "0x7dD2a...12b3", date: "2025-09-20" },
        { id: 771276, address: "0x9Aa4f...9f1c", date: "2025-09-28" },
    ];

    const communityTree = {
        root: "816461",
        left: { id: "771274", children: ["772001", "772002", "772003"] },
        right: { id: "771275", children: ["773001", "773002", "773003"] },
    };

   
    const packages = [
        { id: 0, price: ethers.parseEther("2"), limit: ethers.parseEther("100"), team: 0 },
        { id: 1, price: ethers.parseEther("15"), limit: ethers.parseEther("300"), team: 5 },
        { id: 2, price: ethers.parseEther("20"), limit: ethers.parseEther("700"), team: 10 },
        { id: 3, price: ethers.parseEther("25"), limit: ethers.parseEther("1200"), team: 15 },
        { id: 4, price: ethers.parseEther("50"), limit: ethers.parseEther("2200"), team: 20 },
        { id: 5, price: ethers.parseEther("165"), limit: ethers.parseEther("5500"), team: 25 },
    ];

    const Package = packages[user.rank] || packages[0]; // current user package
    const downlines = {
        direct: ["A1", "A2", "A3", "A4", "A5", "A6"],
        indirect: ["B1", "B2", "B3", "B4"],
    };

    const handleUpdate = (nextPackage) => {
        alert(
            `Upgrading to Package #${nextPackage.id} (${ethers.formatEther(
                nextPackage.price
            )} ETH)`
        );
       
    };

    return (
        <>
            <Header onRegister={() => setIsProfileOpen(true)} />
            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-slate-900 flex">
                <Sidebar active={active} setActive={setActive} user={user} />

                <main className="flex-1 p-6 md:p-10">
                    {!address ? (
                        <div className="text-center py-10 text-slate-600 text-lg">
                            ⚠️ Please connect your wallet to view the dashboard.
                        </div>
                    ) : loading ? (
                        <div className="text-center py-10 text-slate-500 text-lg">
                            Loading data...
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <section className="space-y-6">
                                    <button
                                        onClick={() => navigate("/")}
                                        className="mb-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg bckbtnscstm"
                                    >
                                        ← Back to Home
                                    </button>
                                  
                                    {active === "dashboard" && (
                                        <div className="bg-[#0a0125] text-white p-6 rounded-2xl shadow-lg">
                                            <h1 className="text-2xl font-extrabold mb-4">Dashboard</h1>
                                            <ProfileSection />
                                        </div>
                                    )}

                                   
                                    {active === "packages" && (
                                        <div className="bg-[#0a0125] text-white p-6 rounded-2xl shadow-lg">
                                            <h1 className="text-2xl font-extrabold mb-4">Packages</h1>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {packages.map((pkg) => (
                                                    <div
                                                        key={pkg.id}
                                                        className={`border rounded-xl p-4 ${pkg.id === Package.id
                                                            ? "border-indigo-600 bg-indigo-50 bgactivebox"
                                                            : "border-gray-200"
                                                            }`}
                                                    >
                                                        <h2 className="text-lg font-semibold mb-2">
                                                            Package #{pkg.id}
                                                        </h2>
                                                        <p>💰 Price: {ethers.formatEther(pkg.price)} ETH</p>
                                                        <p>🎯 Limit: {ethers.formatEther(pkg.limit)} ETH</p>
                                                        <p>👥 Team Required: {pkg.team}</p>

                                                        {pkg.id === Package.id ? (
                                                            <button
                                                                disabled
                                                                className="mt-4 w-full py-3 rounded-lg activebtns"
                                                            >
                                                                Active Package
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleUpdate(pkg)}
                                                                className="mt-4 w-full py-3 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors upgradebtns"
                                                            >
                                                                View / Upgrade Option
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-8">
                                                {(() => {
                                                    const currentId = Number(Package.id);
                                                    const nextPackage = packages[currentId + 1];

                                                    if (!nextPackage) {
                                                        return (
                                                            <button
                                                                disabled
                                                                className="w-full py-3 rounded-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed pckagebtnss"
                                                            >
                                                                🎉 You are at the highest package
                                                            </button>
                                                        );
                                                    }

                                                    const teamRequired = nextPackage.team || 0;
                                                    const teamHas = downlines.direct.length + downlines.indirect.length;
                                                    const canUpgrade = teamHas >= teamRequired;

                                                    return (
                                                        <button
                                                            disabled={!canUpgrade}
                                                            onClick={() => handleUpdate(nextPackage)}
                                                            className={`w-full py-3 rounded-lg font-semibold transition-colors pckagebtnss ${canUpgrade
                                                                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                }`}
                                                        >
                                                            {canUpgrade
                                                                ? `⬆️ Upgrade to ${ethers.formatEther(
                                                                    nextPackage.price
                                                                )} ETH (Limit ${ethers.formatEther(nextPackage.limit)} ETH)`
                                                                : `🔒 Need ${teamRequired} total downlines (You have ${teamHas}) to upgrade`}
                                                        </button>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    {active === "income" && (
                                        <div className="bg-[#0a0125]/95 backdrop-blur-lg text-white p-6 rounded-2xl shadow-lg border border-[#1e1b4b]">
                                            <h1 className="text-2xl font-extrabold mb-4">Income Overview</h1>
                                            <div className="overflow-x-auto rounded-xl">
                                                <table className="w-full border-collapse">
                                                    <thead className="bg-[#1e1b4b] text-indigo-200">
                                                        <tr>
                                                            <th className="py-3 px-4 text-left">Sr.No</th>
                                                            <th className="py-3 px-4 text-left">Amount</th>
                                                            <th className="py-3 px-4 text-left">Status</th>
                                                            <th className="py-3 px-4 text-left">Time</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {incomeItems.map((it, i) => (
                                                            <tr
                                                                key={i}
                                                                className={`transition-all ${i % 2 === 0 ? "bg-[#120038]" : "bg-[#0f0030]"
                                                                    } hover:bg-indigo-900/30`}
                                                            >
                                                                <td className="py-3 px-4">{it.sr}</td>
                                                                <td className="py-3 px-4">{it.amount}</td>
                                                                <td
                                                                    className={`py-3 px-4 font-semibold ${it.status === "Completed"
                                                                        ? "text-green-400"
                                                                        : "text-yellow-400"
                                                                        }`}
                                                                >
                                                                    {it.status}
                                                                </td>
                                                                <td className="py-3 px-4 text-indigo-200">{it.time}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {active === "referrals" && (
                                        <div className="bg-[#0a0125]/95 backdrop-blur-lg text-white p-6 rounded-2xl shadow-lg border border-[#1e1b4b]">
                                            <h1 className="text-2xl font-extrabold mb-4"> My Referrals</h1>
                                            <div className="overflow-x-auto rounded-xl">
                                                <table className="w-full border-collapse">
                                                    <thead className="bg-[#1e1b4b] text-indigo-200">
                                                        <tr>
                                                            <th className="py-3 px-4 text-left">Sr.No</th>
                                                            <th className="py-3 px-4 text-left">User ID</th>
                                                            <th className="py-3 px-4 text-left">Wallet Address</th>
                                                            <th className="py-3 px-4 text-left">Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {referrals.map((r, idx) => (
                                                            <tr
                                                                key={r.id}
                                                                className={`transition-all ${idx % 2 === 0 ? "bg-[#120038]" : "bg-[#0f0030]"
                                                                    } hover:bg-indigo-900/30`}
                                                            >
                                                                <td className="py-3 px-4">{idx + 1}</td>
                                                                <td className="py-3 px-4 text-indigo-300">{r.id}</td>
                                                                <td className="py-3 px-4 text-indigo-200">{r.address}</td>
                                                                <td className="py-3 px-4 text-indigo-300">{r.date}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {active === "community" && (
                                        <div className="bg-[#0a0125]/95 backdrop-blur-lg text-white p-6 rounded-2xl shadow-lg border border-[#1e1b4b]">
                                            <h1 className="text-2xl font-extrabold mb-4">Community Tree</h1>

                                            <div className="flex flex-col items-center">

                                                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-3 rounded-full shadow-lg mb-4 font-semibold">
                                                    ID: {communityTree.root}
                                                </div>

                                                <div className="w-px h-8 bg-indigo-400" />


                                                <div className="flex gap-16 mt-8 flex-wrap justify-center">
                                                    {[communityTree.left, communityTree.right].map((branch, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex flex-col items-center bg-[#120038]/70 rounded-xl px-6 py-4 shadow-lg border border-[#292060] min-w-[220px]"
                                                        >
                                                            <div className="font-bold text-indigo-400 mb-2">
                                                                Branch ID: {branch.id}
                                                            </div>
                                                            <div className="text-sm text-gray-300 mb-4">Direct Members:</div>

                                                            <div className="grid grid-cols-3 gap-3">
                                                                {branch.children.map((child) => (
                                                                    <div
                                                                        key={child}
                                                                        className="bg-[#1a0c50] hover:bg-indigo-700/40 transition-all px-3 py-2 rounded-lg text-sm text-center"
                                                                    >
                                                                        <div className="font-semibold text-indigo-300">{child}</div>
                                                                        <div className="text-xs text-gray-400 mt-1">Member</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </section>
                            </div>
                        </div>
                    )}
                </main>
            </div>

           
            <Modal
                isOpen={isProfileOpen}
                onRequestClose={() => setIsProfileOpen(false)}
                className="max-w-3xl mx-auto mt-20 bg-[#120038] rounded-xl p-6 text-white outline-none"
                overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start z-50"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Profile</h2>
                    <button
                        onClick={() => setIsProfileOpen(false)}
                        className="text-gray-300 hover:text-white font-bold text-xl"
                    >
                        ×
                    </button>
                </div>
                <ProfileSection />
            </Modal>

            <Footer />
        </>
    );
}
