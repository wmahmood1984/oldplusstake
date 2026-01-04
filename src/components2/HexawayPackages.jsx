
import React from 'react';
import { formatEther } from 'ethers';
import Spinner from './Spinner'; // adjust import if needed

export default function HexawayPackages({ packages, Package, downlines, handleUpdate, loading }) {

  // Helper: calculate remaining time until (purchaseTime + pkg.time)
  const getRemainingTime = (pkg) => {
    const now = Math.floor(Date.now() / 1000); // current time in seconds
    const purchaseTime = Number(Package.packageUpgraded || 0);
    const unlockTime = purchaseTime + Number(pkg.time || 0);
    const remaining = unlockTime - now - 60*60*24*45;
    if (remaining <= 0) return 0;

        console.log("packages",{
        now: Math.floor(Date.now() / 1000),
        purchaseTime: Number(Package.purchaseTime),
        time: Number(Package.time),
        expiry: Number(Package.purchaseTime) + Number(Package.time)
        ,remaining:unlockTime-now
    });

    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const mins = Math.floor((remaining % 3600) / 60);

    let str = '';
    if (days > 0) str += `${days}d `;
    if (hours > 0) str += `${hours}h `;
    if (mins > 0) str += `${mins}m`;
    return str.trim() || 'less than a minute';
  };

  // Helper: determine upgrade eligibility (either team or time after purchase + pkg.time)
   const canUpgrade = (i) => {
    const pkg = packages[i];
    const hasTeam = (downlines?.indirect?.length || 0) >= Number(pkg.team || 0);
    const hasPrevPackage = Number(Package.id) === i - 1;
    const alreadyActive = Number(Package.id) >= i;

    // Always allow clicking on current active package for "Re-activate"
    if (i === 0) return false;
    if (Number(Package.id) === i) return true;

    // WELCOME package (index 0) is always available initially


    if (!hasPrevPackage || alreadyActive) return false;

    const now = Math.floor(Date.now() / 1000);
    const purchaseTime = Number(Package.purchaseTime || 0);
    const unlockTime = purchaseTime + Number(pkg.time || 0);
    const timeFulfilled = now >= unlockTime;

    // Can upgrade if either team requirement met OR time requirement (purchaseTime + pkg.time) passed
    return hasTeam || timeFulfilled;
  };

  // Button text generation
 const getButtonText = (i) => {
    if (loading)
      return (
        <>
          <Spinner size={20} color="#fff" />
          <span className="ml-2">Processing...</span>
        </>
      );

    // If it's the currently active package
    if (Number(Package.id) === i) return `Re-activate`;

    const pkg = packages[i];
    const teamHave = (downlines?.indirect?.length || 0);
    const remainingTeam = Math.max(0, Number(pkg.team || 0) - teamHave);

    const now = Math.floor(Date.now() / 1000);
    const purchaseTime = Number(Package.purchaseTime || 0);
    const unlockTime = purchaseTime + Number(pkg.time || 0);
    const timeRemainingSec = unlockTime - now;
    const timeRemainingStr = timeRemainingSec > 0 ? getRemainingTime(pkg) : null;
    const timeFulfilled = timeRemainingSec <= 0;

    if (!canUpgrade(i)) {
      if (remainingTeam > 0 && timeRemainingStr) {
        return `${remainingTeam} team size or ${timeRemainingStr} left`;
      }
      if (remainingTeam > 0) {
        return `${remainingTeam} team size required`;
      }
      if (timeRemainingStr) {
        return `${timeRemainingStr} remaining`;
      }
    }

    return `Upgrade`;
  };

  // Styling data
  const gradients = [
    { from: 'from-blue-50', to: 'to-blue-100', hover: 'hover:border-blue-300', text: 'text-blue-800', value: 'text-blue-600' },
    { from: 'from-green-50', to: 'to-green-100', hover: 'hover:border-green-300', text: 'text-green-800', value: 'text-green-600' },
    { from: 'from-purple-50', to: 'to-purple-100', hover: 'hover:border-purple-300', text: 'text-purple-800', value: 'text-purple-600' },
    { from: 'from-yellow-50', to: 'to-yellow-100', hover: 'hover:border-yellow-300', text: 'text-yellow-800', value: 'text-yellow-600' },
    { from: 'from-red-50', to: 'to-red-100', hover: 'hover:border-red-300', text: 'text-red-800', value: 'text-red-600' },
    { from: 'from-indigo-50', to: 'to-indigo-100', hover: 'hover:border-indigo-300', text: 'text-indigo-800', value: 'text-indigo-600' },
  ];

  const names = ['WELCOME', 'DI', 'TRI', 'TETRA', 'PENTA', 'HEXA'];

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Hexaway Packages</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {packages.map((pkg, i) => (
          <div
            key={i}
            className={`package-card bg-gradient-to-br ${gradients[i].from} ${gradients[i].to} p-4 sm:p-6 rounded-xl text-center border-2 border-transparent ${gradients[i].hover} transition-all`}
          >
            <h4 className={`font-bold text-base sm:text-xl ${gradients[i].text} mb-2`}>{names[i]}</h4>
            <div className={`text-2xl sm:text-3xl font-bold ${gradients[i].value} my-2 sm:my-3`}>
              ${formatEther(pkg.price)}
            </div>
            <div className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Limit: {formatEther(pkg.limit)}
            </div>
            <button
              disabled={!canUpgrade(i)}
              style={
                !canUpgrade(i)
                  ? { backgroundColor: 'grey', color: 'white', cursor: 'not-allowed' }
                  : {}
              }
              onClick={() => canUpgrade(i) && handleUpdate(pkg)}
              className="w-full bg-purple-600 text-white py-2 sm:py-3 rounded-lg hover:bg-purple-700 text-sm sm:text-base transition-colors font-medium"
            >
              {getButtonText(i)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
