import React from 'react'

export default function AdminCreation() {
  return (
    <div>
<div id="app" className="h-full w-full overflow-auto">
  <div className="min-h-full w-full p-4 md:p-8">
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8 text-center">
        <h1
          className="text-4xl md:text-6xl font-black text-slate-900 mb-3"
          style={{ textShadow: "0 4px 20px #8b5cf6" }}
        >
          Admin Creation Portal
        </h1>
        <p className="text-lg md:text-xl text-slate-700 opacity-80 font-medium">
          Welcome to Admin Creation
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-8">
        {[
          { label: "📋 Total in Queue", value: 50, bg: "from-purple-500 to-purple-700 shadow-purple-500/40" },
          { label: "💵 Total Amount", value: "$91.00", bg: "from-emerald-500 to-emerald-600 shadow-emerald-500/40" },
          { label: "🟢 Active No", value: 5, bg: "from-cyan-500 to-cyan-600 shadow-cyan-500/40" },
          { label: "🟣 Processing", value: 45, bg: "from-purple-500 to-purple-600 shadow-purple-500/40" },
          { label: "🔵 Complete", value: 4, bg: "from-blue-500 to-blue-600 shadow-blue-500/40" },
        ].map((item, i) => (
          <div
            key={i}
            className={`rounded-2xl p-6 bg-gradient-to-br ${item.bg} shadow-xl`}
          >
            <div className="text-sm text-white opacity-90 mb-2 font-semibold">
              {item.label}
            </div>
            <div className="text-3xl md:text-4xl text-white font-black">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Title Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl mb-6 shadow-xl border-3 border-purple-500">
        <h2 className="text-2xl md:text-4xl font-black text-slate-900">
          📊 Queue Management System
        </h2>
      </div>

      {/* Queue List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            className={`queue-card flex items-center gap-4 p-4 sm:p-6 ${
              num % 2 === 0 ? "bg-slate-50" : "bg-white"
            } border-b-2 border-purple-500/20 queue-grid`}
          >
            <div className="queue-number flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-xl text-xl font-black flex-shrink-0">
              {num}
            </div>

            <div className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold flex-shrink-0 min-w-[100px] justify-center h-fit">
              🔵 Complete
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-700 opacity-60 font-semibold uppercase mb-1">
                📍 Address:
              </div>
              <div className="flex items-center gap-2">
                <div className="font-mono text-xs sm:text-sm text-slate-900 font-semibold overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                  0xExampleAddressHere...
                </div>
                <button className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  📋 Copy
                </button>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-700 opacity-60 font-semibold uppercase mb-1">
                🎫 Token ID:
              </div>
              <div className="flex items-center gap-2">
                <div className="font-mono text-xs sm:text-sm text-cyan-500 font-bold overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                  TKNXXXXXXX
                </div>
                <button className="bg-cyan-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  📋 Copy
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-700 opacity-60 font-semibold uppercase mb-1">
                  💰 Amount
                </div>
                <div className="text-lg md:text-xl text-emerald-500 font-black">
                  $45.00
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-700 opacity-60 font-semibold uppercase mb-1">
                  📅 Date
                </div>
                <div className="text-xs sm:text-sm text-slate-900 opacity-90 font-semibold">
                  Dec 5, 2024
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 bg-white p-5 rounded-2xl shadow-lg">
        <div className="text-sm text-slate-900 font-semibold text-center sm:text-left">
          Showing 1–6 of 50 entries
        </div>

        <div className="flex gap-2 items-center flex-wrap justify-center mt-4">
          <button disabled className="bg-slate-300 text-white px-4 py-2.5 rounded-lg font-bold">
            ⏮️ First
          </button>
          <button disabled className="bg-slate-300 text-white px-4 py-2.5 rounded-lg font-bold">
            ◀️ Previous
          </button>
          <button className="bg-purple-500 text-white px-4 py-2.5 rounded-lg font-bold">
            Next ▶️
          </button>
          <button className="bg-purple-500 text-white px-4 py-2.5 rounded-lg font-bold">
            Last ⏭️
          </button>
        </div>
      </div>

    </div>
  </div>
</div>


    </div>
  )
}
