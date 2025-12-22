import React, { useState } from "react";
import UserListDemo from "./UserListDemo";
import Burning from "./Burning";

export default function Lists() {
    const [activeTab, setActiveTab] = useState("users");

    return (
        <div>
            {/* Tabs */}
            <div className="flex gap-4 mb-6">
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
            </div>

            {/* Tab Content */}
            {activeTab === "users" && <UserListDemo />}
            {activeTab === "burning" && <Burning />}
        </div>
    );
}
