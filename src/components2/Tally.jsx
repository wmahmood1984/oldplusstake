import React, { useState } from "react";

const Tally = () => {
  const [search, setSearch] = useState("");
  const [showClear, setShowClear] = useState(false);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setShowClear(e.target.value.length > 0);
  };

  const clearSearch = () => {
    setSearch("");
    setShowClear(false);
  };

  // Example static data (replace with your dynamic data)
  const users = [
    {
      id: 1,
      address: "0x7a3b9c8d1e2f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8",
      balance: 2847.15,
      deposit: 3214.65,
      withdrawal: 278.5,
      spending: 89,
      bg: "#ffffff",
    },
    {
      id: 2,
      address: "0x2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b",
      balance: 1234.56,
      deposit: 2000,
      withdrawal: 500,
      spending: 265.44,
      bg: "#f8fafc",
    },
    // Add more rows...
  ];

  const filteredUsers = users.filter((user) =>
    user.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full w-full p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1
            style={{
              fontSize: "40px",
              color: "#0f172a",
              fontWeight: 900,
              marginBottom: "12px",
              textShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            Tally by Address
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#0f172a",
              opacity: 0.8,
              fontWeight: 500,
            }}
          >
            User Balance Overview
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="🔍 Search by address..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-6 py-4 rounded-xl border-2 transition-all focus:outline-none"
            style={{
              borderColor: "#3b82f6",
              background: "#ffffff",
              color: "#0f172a",
              paddingRight: "100px",
            }}
          />
          {showClear && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 px-4 py-2 rounded-lg transition-all"
              style={{
                transform: "translateY(-50%)",
                background: "#3b82f6",
                color: "#ffffff",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Total Users Card */}
        <div
          className="mb-8 rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "white",
              opacity: 0.9,
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            👥 Total Users
          </div>
          <div style={{ fontSize: "48px", color: "white", fontWeight: 900 }}>
            100
          </div>
        </div>

        {/* Balance Summary */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Deposits */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "white",
                opacity: 0.9,
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              💰 Total Deposits
            </div>
            <div style={{ fontSize: "32px", color: "white", fontWeight: 900 }}>
              $275,432.65
            </div>
          </div>

          {/* Total Withdrawals */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              boxShadow: "0 10px 30px rgba(239, 68, 68, 0.4)",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "white",
                opacity: 0.9,
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              📤 Total Withdrawals
            </div>
            <div style={{ fontSize: "32px", color: "white", fontWeight: 900 }}>
              $148,765.32
            </div>
          </div>

          {/* Total Spending */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              boxShadow: "0 10px 30px rgba(245, 158, 11, 0.4)",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "white",
                opacity: 0.9,
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              🛒 Total Spending
            </div>
            <div style={{ fontSize: "32px", color: "white", fontWeight: 900 }}>
              $73,214.89
            </div>
          </div>
        </div>

        {/* Address Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#ffffff",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            className="table-container overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <table className="w-full" style={{ minWidth: "320px" }}>
              <thead
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                }}
              >
                <tr>
                  <th
                    className="px-3 py-4 text-left font-bold uppercase"
                    style={{
                      fontSize: "10.4px",
                      color: "white",
                      letterSpacing: "0.05em",
                    }}
                  >
                    #
                  </th>
                  <th
                    className="px-3 py-4 text-left font-bold uppercase"
                    style={{
                      fontSize: "10.4px",
                      color: "white",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Address
                  </th>
                  <th
                    className="px-3 py-4 text-left font-bold uppercase"
                    style={{
                      fontSize: "10.4px",
                      color: "white",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Available Balance
                  </th>
                  <th
                    className="px-3 py-4 text-left font-bold uppercase"
                    style={{
                      fontSize: "10.4px",
                      color: "white",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Deposit
                  </th>
                  <th
                    className="px-3 py-4 text-left font-bold uppercase"
                    style={{
                      fontSize: "10.4px",
                      color: "white",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Withdrawal
                  </th>
                  <th
                    className="px-3 py-4 text-left font-bold uppercase"
                    style={{
                      fontSize: "10.4px",
                      color: "white",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Spending
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="table-row border-b transition-all"
                    style={{
                      borderColor: "rgba(59, 130, 246, 0.3)",
                      background: user.bg,
                    }}
                  >
                    <td
                      className="px-3 py-4"
                      style={{ fontSize: "12px", color: "#0f172a", fontWeight: 600 }}
                    >
                      {user.id}
                    </td>
                    <td className="px-3 py-4">
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div
                          style={{
                            fontFamily: "'Courier New', monospace",
                            fontSize: "10.4px",
                            color: "#1e293b",
                            fontWeight: 700,
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.address}
                        </div>
                        <button
                          className="copy-table-btn"
                          data-address={user.address}
                          style={{
                            background: "#3b82f6",
                            color: "white",
                            border: "none",
                            padding: "5px 8px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "10.4px",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                            transition: "all 0.2s",
                          }}
                          onClick={() => navigator.clipboard.writeText(user.address)}
                        >
                          📋
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 12px",
                          background: "#10b981",
                          color: "white",
                          borderRadius: "6px",
                          fontSize: "11.2px",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        💰 ${user.balance.toLocaleString()}
                      </span>
                    </td>
                    <td
                      className="px-3 py-4"
                      style={{
                        fontSize: "11.2px",
                        color: "#10b981",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      +${user.deposit.toLocaleString()}
                    </td>
                    <td
                      className="px-3 py-4"
                      style={{
                        fontSize: "11.2px",
                        color: "#ef4444",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      -${user.withdrawal.toLocaleString()}
                    </td>
                    <td
                      className="px-3 py-4"
                      style={{
                        fontSize: "11.2px",
                        color: "#f59e0b",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      -${user.spending.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2"
            style={{ borderColor: "rgba(59, 130, 246, 0.3)" }}
          >
            <div style={{ fontSize: "12px", color: "#0f172a", opacity: 0.8, textAlign: "center" }}>
              <strong>1</strong>-<strong>20</strong> of <strong>100</strong>
            </div>
            <div className="flex gap-2 items-center">
              <button
                className="px-4 py-2 rounded-lg font-bold transition-all"
                style={{
                  background: "#3b82f6",
                  color: "white",
                  fontSize: "12px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                }}
              >
                ← Prev
              </button>
              <div
                style={{
                  padding: "8px 16px",
                  background: "rgba(59, 130, 246, 0.2)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#0f172a",
                  fontWeight: 700,
                }}
              >
                1/5
              </div>
              <button
                className="px-4 py-2 rounded-lg font-bold transition-all"
                style={{
                  background: "#3b82f6",
                  color: "white",
                  fontSize: "12px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tally;
