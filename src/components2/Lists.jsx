import React, { useState } from "react";
import UserListDemo from "./UserListDemo";
import Burning from "./Burning";
import TradingQue from "./TradingQue";
import NormalList from "./NormalList";

export default function Lists() {
    const [activeTab, setActiveTab] = useState("normal");

    return (
        <div>
            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab("tradingQue")}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                        activeTab === "tradingQue"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700"
                    }`}
                >
                    Trading Que
                </button>
                <button
                    onClick={() => setActiveTab("users")}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                        activeTab === "users"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700"
                    }`}
                >
                    User List
                </button>

                <button
                    onClick={() => setActiveTab("burning")}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                        activeTab === "burning"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700"
                    }`}
                >
                    Burning
                </button>

                                <button
                    onClick={() => setActiveTab("normal")}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                        activeTab === "normal"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700"
                    }`}
                >
                    Normal List
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "tradingQue" && <TradingQue />}
                        {activeTab === "normal" && <NormalList />}
            {activeTab === "users" && <UserListDemo />}
            {activeTab === "burning" && <Burning />}
        </div>
    );
}
