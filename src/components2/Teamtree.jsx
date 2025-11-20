import React, { useEffect, useState } from 'react'
import UserCard from './UserCard';
import { useSelector } from 'react-redux';
import { useAppKitAccount } from '@reown/appkit/react';
import { helperAbi, helperAddress, web3 } from '../config';

export default function Teamtree() {

    const [selected, setSelected] = useState("direct");
    const [loading, setLoading] = useState(false);

    const levels = Array.from({ length: 25 }).map((_, i) => ({
        id: i + 1,
        count: 12 + i * 6,
    }));

    const baseClasses =
        "bg-white rounded-xl p-3 text-center cursor-pointer transition duration-200 shadow-sm hover:shadow-md hover:-translate-y-1";

    const selectedClasses =
        "border-2 border-indigo-500 bg-indigo-50 shadow-lg hover:shadow-lg";
    const {
        downlines, totalIncome
    } = useSelector((state) => state.contract);

    const { address } = useAppKitAccount();
    const [levels1, setLevels] = useState([]); // array of arrays

    // --- Build hierarchical levels ---
    const buildLevels = async (root, contract) => {
        if (!root) return [];
        const visited = new Set();
        const levelsArray = [];

        let currentLevel = [root];

        while (currentLevel.length > 0) {
            const nextLevel = [];
            const currentLevelData = [];

            for (const addr of currentLevel) {
                if (visited.has(addr)) continue;
                visited.add(addr);

                try {
                    const user = await contract.methods.getUser(addr).call();
                    const pkg = await contract.methods.userPackage(addr).call();

                    currentLevelData.push({
                        address: addr,
                        short: addr.slice(0, 4) + "..." + addr.slice(-4),
                        packageId: pkg.id,
                        packagePrice: pkg.price,
                        children: user.children || [],
                    });

                    if (user.children && user.children.length > 0) {
                        nextLevel.push(...user.children);
                    }
                } catch (err) {
                    console.error(`Error fetching user ${addr}:`, err);
                }
            }

            levelsArray.push(currentLevelData);
            currentLevel = nextLevel;
        }

        setLoading(false);

        return levelsArray;
    };

    // --- Fetch levels data ---
    useEffect(() => {
        const fetchData = async () => {
            if (!address) return;
            setLoading(true);
            const contract = new web3.eth.Contract(helperAbi, helperAddress);
            const levelsData = await buildLevels(address, contract);
            setLevels(levelsData);
            
        };
        fetchData();
    }, [address]);

    // --- Gradient color helper ---
    const getLevelColor = (level) => {
        const colors = [
            "from-blue-50 to-blue-100 border-blue-200",
            "from-green-50 to-green-100 border-green-200",
            "from-yellow-50 to-yellow-100 border-yellow-200",
            "from-purple-50 to-purple-100 border-purple-200",
            "from-indigo-50 to-indigo-100 border-indigo-200",
        ];
        return colors[level % colors.length];
    };

    const filteredLevels = selected === "direct" ? downlines.direct : levels1[selected] || [];



    return (
        <main class="min-h-screen py-6 sm:py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header class="mb-6">
                    <h2 id="page-title" class="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-2">Team View</h2>
                    <p class="text-gray-600">Manage and view your team structure across all levels</p>
                </header>
                <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white fade-in">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-lg font-semibold opacity-90">Direct Members</h3>
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <p class="text-5xl font-bold font-display mb-2">{downlines.direct.length}</p>
                        <p class="text-sm opacity-80">Direct Members</p>
                    </div>
                    <div class="bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl shadow-lg p-6 text-white fade-in">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-lg font-semibold opacity-90">Total Members</h3>
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                        </div>
                        <p class="text-5xl font-bold font-display mb-2">{downlines.indirect.length}</p>
                        <p class="text-sm opacity-80">All levels combined</p>
                    </div>
                    <div class="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl shadow-lg p-6 text-white fade-in sm:col-span-2 lg:col-span-1">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-lg font-semibold opacity-90">Active Levels</h3>
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <p class="text-5xl font-bold font-display mb-2">{loading ? "Loading...":levels1.length==0?0: `${levels1.length - 1}/25`}</p>
                        <p class="text-sm opacity-80">Levels with members</p>
                    </div>
                </section>
                <section class="mb-6">
                    <div class="mb-4">
                        <h3 class="text-xl font-bold text-gray-900">Select View</h3>
                    </div>


                    <div className="p-4">


                        <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2">
                            {/* Direct Card */}
                            <div
                                onClick={() => setSelected("direct")}
                                className={`${baseClasses} ${selected === "direct" ? selectedClasses : ""
                                    }`}
                            >
                                <div className="text-xs text-gray-600 mb-1">Direct</div>
                                <div className="text-xl font-bold text-black">👥</div>
                                <div className="text-xs text-gray-700 mt-1">{downlines.direct.length}</div>
                            </div>

                            {/* Levels 1–25 */}
                            {levels1.length>0 &&  levels.map((lvl, e) => (
                                <div
                                    key={lvl.id}
                                    onClick={() => setSelected(lvl.id)}
                                    className={`${baseClasses} ${selected === lvl.id ? selectedClasses : ""
                                        }`}
                                >
                                    <div className="text-xs text-gray-600 mb-1">Level</div>
                                    <div className="text-xl font-bold text-black">{lvl.id}</div>
                                    <div className="text-xs text-gray-700 mt-1">{levels1[e+1]?.length ? levels1[e+1]?.length : 0}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* <div class="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2" id="level-grid">
      <div id="direct-card" class="level-card bg-white rounded-lg shadow p-3 text-center active cursor-pointer" onclick="selectLevel('direct')">
       <div class="text-xs text-gray-600 mb-1">
        Direct
       </div>
       <div class="text-xl font-bold text-indigo-600">
        👥
       </div>
       <div class="text-xs text-gray-500 mt-1">
        8
       </div>
      </div>
     </div> */}
                </section>
                <section>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold text-gray-900"><span id="level-title">Direct Referrals</span> <span class="text-sm font-normal text-gray-600 ml-2">(<span id="member-count">{downlines.direct.length}</span> members)</span></h3>
                    </div>
                    <div class="space-y-3" id="members-container">
                        <div className="p-4">

                            {filteredLevels.length > 0 && filteredLevels.map((lvl,i)=> (
                            <UserCard
                                key={i}
                                number={i+1}
                                address={selected=="direct"? lvl:lvl.address}
                                tags={[
                                    { label: "Welcome", icon: "📦", color: "#6366F1" },
                                    { label: "NFT: Active", icon: "🎨", color: "#EC4899" },
                                ]}
                            />                            ))

                            }
                            
 


                        </div>
                    </div>
                    {/* <div class="flex items-center justify-between mt-6 bg-white rounded-xl shadow p-4"><button id="prev-btn" onclick="previousPage()" class="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg><span>Previous</span> </button>
                        <div class="text-sm text-gray-600">
                            Page <span id="current-page" class="font-bold text-gray-900">1</span> of <span id="total-pages" class="font-bold text-gray-900">1</span>
                        </div><button id="next-btn" onclick="nextPage()" class="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"> <span>Next</span>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg></button>
                    </div> */}
                </section>
            </div>
        </main>
    )
}
