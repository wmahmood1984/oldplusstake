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

    const Package = packages[user.rank] || packages[0];
    const downlines = {
        direct: ["A1", "A2", "A3", "A4", "A5", "A6"],
        indirect: ["B1", "B2", "B3", "B4"],
    };

    const handleUpdate = (nextPackage) => {

        alert(`Upgrading to Package #${nextPackage.id} (${ethers.formatEther(nextPackage.price)} ETH)`);
    };


    const teamCount = () => downlines.direct.length + downlines.indirect.length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#040213] via-[#070427] to-[#07031a] text-slate-100">
            <Header onRegister={() => setIsProfileOpen(true)} />
            <div className="container">


                <main className="flex-1 p-6 md:p-10">
                    {!address ? (
                        <div className="text-center py-20 text-slate-400 text-lg">
                            ⚠️ Please connect your wallet to view the dashboard.
                        </div>
                    ) : loading ? (
                        <div className="text-center py-20 text-slate-400 text-lg">Loading data...</div>
                    ) : (
                        <div className="space-y-6">

                            <div className="rounded-2xl bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-700 p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-extrabold">Welcome back,</h2>
                                    <p className="text-sm text-indigo-200 mt-1">Manage your account, view earnings and upgrade packages.</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-xs text-indigo-200">User ID</div>
                                        <div className="text-lg font-bold">#{user.id}</div>
                                    </div>

                                    <div className="text-right hidden sm:block">
                                        <div className="text-xs text-indigo-200">Wallet Balance</div>
                                        <div className="text-lg font-bold">{user.walletFund} USDT</div>
                                    </div>

                                    <button
                                        onClick={() => setIsProfileOpen(true)}
                                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>


                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                <div className="lg:col-span-2 space-y-6">

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                        <div className="bg-white text-gray-900 paddingcstm rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                            <div className="text-sm font-semibold text-indigo-600">Total Income</div>
                                            <div className="mt-2 text-2xl font-extrabold text-gray-900">{user.totalIncome} USDT</div>
                                            <div className="text-xs text-gray-500 mt-1">All-time earnings</div>
                                        </div>


                                        <div className="bg-white text-gray-900 paddingcstm rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                            <div className="text-sm font-semibold text-blue-600">Wallet Fund</div>
                                            <div className="mt-2 text-2xl font-extrabold text-gray-900">{user.walletFund} USDT</div>
                                            <div className="text-xs text-gray-500 mt-1">Available to withdraw</div>
                                        </div>


                                        <div className="bg-white text-gray-900 paddingcstm rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                            <div className="text-sm font-semibold text-pink-600">Team Members</div>
                                            <div className="mt-2 text-2xl font-extrabold text-gray-900">{teamCount()}</div>
                                            <div className="text-xs text-gray-500 mt-1">Direct & indirect</div>
                                        </div>
                                    </div>

                                    <div className="bg-[#0b0830]/80 p-6 rounded-2xl shadow border border-[#2c2750]">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div>
                                                <div className="text-sm text-indigo-300">Active Package</div>
                                                <div className="text-2xl font-bold mt-1">Package #{Package.id} — {ethers.formatEther(Package.price)} ETH</div>
                                                <div className="text-xs text-slate-400 mt-1">Limit: {ethers.formatEther(Package.limit)} ETH • Team required: {Package.team}</div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => navigate("/contract")}
                                                    className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 font-semibold"
                                                >
                                                    Contract
                                                </button>

                                                <button
                                                    onClick={() => alert('Feature: Withdraw (implement)')}
                                                    className="px-4 py-2 rounded-md bg-transparent border border-white/10"
                                                >
                                                    Withdraw
                                                </button>
                                            </div>
                                        </div>


                                        <div className="mt-6">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Upgrade Options</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {packages.map((pkg) => (
                                                    <div
                                                        key={pkg.id}
                                                        className={`p-4 rounded-2xl border shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${pkg.id === Package.id
                                                            ? "border-indigo-500 bg-indigo-50"
                                                            : "border-gray-200 bg-white"
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="text-xs text-gray-500">Package #{pkg.id}</div>
                                                                <div className="font-bold text-gray-900 mt-1">
                                                                    {ethers.formatEther(pkg.price)} ETH
                                                                </div>
                                                            </div>
                                                            <div className="text-sm text-gray-600">Team: {pkg.team}</div>
                                                        </div>

                                                        {pkg.id === Package.id ? (
                                                            <button
                                                                disabled
                                                                className="mt-4 w-full py-2 rounded-lg bg-gray-200 text-gray-600 font-semibold"
                                                            >
                                                                Active
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleUpdate(pkg)}
                                                                className="mt-4 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-300"
                                                            >
                                                                Upgrade
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>


                                    <div className="bg-[#0b0830] p-5 mobpdingtble rounded-2xl shadow border border-[#2c2750] w-full">
                                        <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">Recent Income</h3>

                                        <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200 bg-white">
                                            <table className="w-full text-left border-collapse min-w-[600px]">
                                                <thead className="bg-gray-50 text-gray-600 text-xs sm:text-sm uppercase tracking-wide">
                                                    <tr>
                                                        <th className="py-3 px-4">#</th>
                                                        <th className="py-3 px-4">Amount</th>
                                                        <th className="py-3 px-4">Status</th>
                                                        <th className="py-3 px-4">Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {incomeItems.map((it, i) => (
                                                        <tr
                                                            key={i}
                                                            className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-50 transition-all duration-200`}
                                                        >
                                                            <td className="py-3 px-4 text-gray-900 font-medium">{it.sr}</td>
                                                            <td className="py-3 px-4 text-gray-900">{it.amount}</td>
                                                            <td
                                                                className={`py-3 px-4 font-semibold ${it.status === "Completed" ? "text-green-600" : "text-yellow-600"
                                                                    }`}
                                                            >
                                                                {it.status}
                                                            </td>
                                                            <td className="py-3 px-4 text-gray-600">{it.time}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>


                                <div className="space-y-6">

                                    <div className="bg-white text-gray-900 p-5 sm:p-6 md:p-7 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full">
                                        <div className="text-sm md:text-base font-semibold text-indigo-600 mb-3">
                                            Referral Link
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                            <input
                                                type="text"
                                                readOnly
                                                value={user.referralLink}
                                                className="flex-1 px-3 py-2 md:py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 text-sm md:text-base font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <button
                                                onClick={() => navigator.clipboard?.writeText(user.referralLink)}
                                                className="px-4 py-2 md:px-5 md:py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-300 w-full sm:w-auto"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>



                                    <div className="bg-white text-gray-900 p-4 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="text-sm font-semibold text-indigo-600">Referred By</div>
                                        <div className="mt-2 text-xl font-extrabold text-gray-900">#{user.referredBy}</div>
                                        <div className="text-xs text-gray-500 mt-1">Joined on 2025-09-15</div>
                                    </div>


                                    <div className="bg-white text-gray-900 p-4 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="text-sm font-semibold text-indigo-600 mb-3">Community Preview</div>
                                        <div className="flex flex-col gap-2 text-sm text-gray-700">
                                            <div>Root: <span className="font-semibold text-gray-900">#{communityTree.root}</span></div>
                                            <div>Left: <span className="font-semibold text-gray-900">#{communityTree.left.id}</span> ({communityTree.left.children.length})</div>
                                            <div>Right: <span className="font-semibold text-gray-900">#{communityTree.right.id}</span> ({communityTree.right.children.length})</div>
                                        </div>

                                        <button
                                            onClick={() => setActive("community")}
                                            className="mt-4 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-300"
                                        >
                                            Open Tree
                                        </button>
                                    </div>


                                    <div className="bg-white text-gray-900 p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="text-sm font-semibold text-indigo-600 mb-3">Recent Referrals</div>
                                        <div className="space-y-3">
                                            {referrals.map((r) => (
                                                <div
                                                    key={r.id}
                                                    className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 hover:border-indigo-200 transition-all duration-200"
                                                >
                                                    <div>
                                                        <div className="font-semibold text-gray-900">#{r.id}</div>
                                                        <div className="text-xs text-gray-500">{r.address}</div>
                                                    </div>
                                                    <div className="text-xs text-gray-500">{r.date}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>



                        </div>
                    )}
                </main>
            </div>


            <Modal
                isOpen={isProfileOpen}
                onRequestClose={() => setIsProfileOpen(false)}
                className="max-w-4xl mx-auto mt-20 bg-[#0b0830] rounded-xl p-6 text-white outline-none cstmsmodaldata"
                overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start z-50"
            >
                <div className="flex justify-between items-center mb-4 dataprofiles">
                    <h2 className="text-2xl font-bold">Profile</h2>
                    <button onClick={() => setIsProfileOpen(false)} className="text-gray-300 hover:text-white font-bold text-xl">×</button>
                </div>
                <ProfileSection />
            </Modal>

            <Footer />
        </div>
    );
}
