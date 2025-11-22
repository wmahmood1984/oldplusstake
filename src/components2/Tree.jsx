import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppKitAccount } from "@reown/appkit/react";
import { helperAbi, helperAddress, web3 } from "../config";
import User from "./User";

export default function Tree() {
  const {
    downlines,totalIncome
  } = useSelector((state) => state.contract);

  const { address } = useAppKitAccount();
  const [levels, setLevels] = useState([]); // array of arrays

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

    return levelsArray;
  };

  // --- Fetch levels data ---
  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;
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

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Header --- */}
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Team Tree Structure
        </h2>

        {/* --- Root User --- */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full mb-4 shadow-lg">
            <span className="text-2xl font-bold">YOU</span>
          </div>
          <div className="text-lg font-semibold">Your Account</div>
          <div className="text-sm text-gray-600">Root Level</div>
          <div className="text-xs text-indigo-600 font-medium">
            Total Network: {downlines?.indirect?.length || 0} Member(s)
          </div>
        </div>

        {/* --- Direct Referrals --- */}
        {/* <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 bg-gradient-to-r from-green-50 to-green-100 py-3 rounded-lg border border-green-200">
            Direct Referrals
          </h3>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {downlines?.direct?.map((v, e) => (
                <User key={e} address1={v} />
              ))}
            </div>
          </div>
        </div> */}

        {/* --- Dynamic Matrix Levels --- */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 bg-gradient-to-r from-blue-50 to-blue-100 py-3 rounded-lg border border-blue-200">
            Matrix Tree
          </h3>

          <div className="text-center mb-6">
            <h4 className="text-xl font-semibold text-gray-700 bg-gradient-to-r from-indigo-50 to-indigo-100 py-2 px-4 rounded-lg inline-block border border-indigo-200">
              Indirect Referrals
            </h4>
          </div>

          {levels.map((levelData, levelIndex) => (
            <div key={levelIndex} className="mb-12">
              <h5
                className={`text-lg font-semibold text-center mb-6 text-gray-700 py-2 rounded-lg bg-gradient-to-r ${getLevelColor(
                  levelIndex
                )}`}
              >
                {levelIndex ===0? "You": `Level ${levelIndex + 1}`}
              </h5>

              {/* Centered Grid */}
              <div className="flex justify-center">
                <div
                  className={`grid ${
                    levelData.length === 1
                      ? "grid-cols-1"
                      : levelData.length === 2
                      ? "grid-cols-2 sm:grid-cols-2"
                      : levelData.length <= 4
                      ? "grid-cols-2 sm:grid-cols-4"
                      : levelData.length <= 8
                      ? "grid-cols-3 sm:grid-cols-6 lg:grid-cols-8"
                      : "grid-cols-4 sm:grid-cols-8 lg:grid-cols-10"
                  } gap-4`}
                >
                  {levelData.map((user, idx) => (
                    <div
                      key={user.address}
                      className={`text-center p-3 rounded-lg border bg-gradient-to-br ${getLevelColor(
                        levelIndex
                      )}`}
                    >
                      <div
                        className={`${
                          levelIndex === 0
                            ? "w-14 h-14 text-sm"
                            : levelIndex === 1
                            ? "w-12 h-12 text-xs"
                            : "w-10 h-10 text-xs"
                        } bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow`}
                      >
                        <span className="font-bold">{`M${idx + 1}`}</span>
                      </div>
                      <div className="text-sm font-semibold">{user.short}</div>
                      <div className="text-xs text-gray-600">
                        Package: {user.packageId || "N/A"}
                      </div>
                      <div className="text-xs text-green-600">Active</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- Summary Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-8 pt-8 border-t border-gray-200 max-w-md mx-auto">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-600">{downlines.direct.length}</div>
            <div className="text-sm text-gray-600 font-medium">Direct</div>
            <div className="text-xs text-gray-500">Referrals</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
            <div className="text-2xl font-bold text-indigo-600">{downlines.indirect.length}</div>
            <div className="text-sm text-gray-600 font-medium">Total Team</div>
            <div className="text-xs text-gray-500">All Levels</div>
          </div>
        </div>

        {/* --- Team Summary --- */}
        {/* <div className="mt-8 pt-8 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-center mb-6 text-gray-800">
            Team Performance Summary
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
              <div className="text-xl font-bold text-emerald-600">16</div>
              <div className="text-sm text-gray-600 font-medium">
                Active Members
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div className="text-xl font-bold text-orange-600">$1,847</div>
              <div className="text-sm text-gray-600 font-medium">
                Team Volume
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200">
              <div className="text-xl font-bold text-pink-600">${totalIncome}</div>
              <div className="text-sm text-gray-600 font-medium">
                Your Earnings
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
