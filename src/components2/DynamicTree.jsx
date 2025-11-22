const levelColors = [
  { bg: "from-purple-50", border: "border-purple-200" },
  { bg: "from-green-50", border: "border-green-200" },
  { bg: "from-yellow-50", border: "border-yellow-200" },
  { bg: "from-pink-50", border: "border-pink-200" },
];

export default function DynamicMatrixTree({ data  }) {
  // Helper to recursively build levels

  const levels = data;

                    console.log("object1",levels);

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 bg-gradient-to-r from-blue-50 to-blue-100 py-3 rounded-lg border border-blue-200">
        Matrix Tree
      </h3>

      <div className="text-center mb-6">
        <h4 className="text-xl font-semibold text-gray-700 bg-gradient-to-r from-indigo-50 to-indigo-100 py-2 px-4 rounded-lg inline-block border border-indigo-200">
          Indirect Referrals
        </h4>
      </div>

      {levels.map((levelNodes, levelIdx) => {
        const color = levelColors[levelIdx % levelColors.length];
        const gridCols =
          levelIdx === 0
            ? "grid-cols-1"
            : levelIdx === 1
            ? "grid-cols-2 sm:grid-cols-4"
            : "grid-cols-4 sm:grid-cols-6 lg:grid-cols-8";

        return (
          <div key={levelIdx} className="mb-8">
            <h5
              className={`text-lg font-semibold text-center mb-6 text-gray-700 bg-${color.bg} py-2 rounded-lg`}
            >
              {levelIdx ===0? "You": `Level ${levelIdx + 1}`}
            </h5>

            <div className={`grid ${gridCols} gap-4 max-w-5xl mx-auto`}>
              {levelNodes.map((user, i) => (
                <div
                  key={user.address}
                  className={`text-center p-4 bg-gradient-to-br ${color.bg} to-white rounded-lg ${color.border} border`}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow">
                    <span className="text-sm font-bold">M{i + 1}</span>
                  </div>
                  <div className="text-sm font-semibold">{user.short}</div>
                  <div className="text-xs text-gray-600">
                    Package ID: {user.packageId}
                  </div>
                  <div className="text-xs text-green-600">Active</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}