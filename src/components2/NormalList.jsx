import React from 'react'

export default function NormalList() {
  return (
    <div>


         <div class="min-h-full w-full p-4 md:p-8">
    <div class="max-w-7xl mx-auto">

      <div class="mb-6 md:mb-8 text-center">
        <h1 style="font-size: 40px; color: #0f172a; font-weight: 900; margin-bottom: 12px; text-shadow: 0 4px 12px rgba(0,0,0,0.3);">
          NFT Marketplace
        </h1>
        <p style="font-size: 18px; color: #0f172a; opacity: 0.8; font-weight: 500;">
          Active NFT Listings
        </p>
      </div>


      <div class="mb-6">
        <div class="relative">
          <input 
            type="text" 
            id="searchInput" 
            placeholder="🔍 Search by token number or owner address..." 
            class="w-full px-6 py-4 rounded-xl border-2 transition-all focus:outline-none"
            style="border-color: #3b82f6; background: #ffffff; color: #0f172a; padding-right: 100px;"
          />
          <button 
            id="clearSearch"
            class="absolute right-2 top-1/2 px-4 py-2 rounded-lg transition-all"
            style="transform: translateY(-50%); background: #3b82f6; color: #ffffff; font-weight: 600; border: none; cursor: pointer; display: none;"
          >
            Clear
          </button>
        </div>
        <div id="searchResults" style="font-size: 14px; color: #0f172a; margin-top: 8px; opacity: 0.7;"></div>
      </div>


      <div class="mb-8 rounded-2xl p-6" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);">
        <div style="font-size: 14px; color: white; opacity: 0.9; margin-bottom: 8px; font-weight: 600;">
          🎨 Total NFTs in Marketplace
        </div>
        <div style="font-size: 48px; color: white; font-weight: 900;">
          100
        </div>
      </div>


      <div class="mb-8">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="font-size: 16px; color: #0f172a; font-weight: 700;">
            💰 Filter by Price
          </div>
        </div>
        <div class="price-filter-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;">

          <div class="price-filter-card rounded-lg p-4 border-2 transition-all" 
               style="background: #ffffff; border: 3px solid #3b82f6; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            <div style="font-size: 20px; color: #3b82f6; font-weight: 900; margin-bottom: 8px;">
              $53.50
            </div>
            <div style="font-size: 12px; color: #0f172a; opacity: 0.7; font-weight: 600;">
              👥 20 NFTs
            </div>
          </div>


          <div class="price-filter-card rounded-lg p-4 border-2 transition-all" 
               style="background: #ffffff; border: 3px solid #3b82f6; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            <div style="font-size: 20px; color: #3b82f6; font-weight: 900; margin-bottom: 8px;">
              $57.24
            </div>
            <div style="font-size: 12px; color: #0f172a; opacity: 0.7; font-weight: 600;">
              👥 20 NFTs
            </div>
          </div>


          <div class="price-filter-card rounded-lg p-4 border-2 transition-all" 
               style="background: #ffffff; border: 3px solid #3b82f6; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            <div style="font-size: 20px; color: #3b82f6; font-weight: 900; margin-bottom: 8px;">
              $61.24
            </div>
            <div style="font-size: 12px; color: #0f172a; opacity: 0.7; font-weight: 600;">
              👥 20 NFTs
            </div>
          </div>


          <div class="price-filter-card rounded-lg p-4 border-2 transition-all" 
               style="background: #ffffff; border: 3px solid #3b82f6; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            <div style="font-size: 20px; color: #3b82f6; font-weight: 900; margin-bottom: 8px;">
              $65.04
            </div>
            <div style="font-size: 12px; color: #0f172a; opacity: 0.7; font-weight: 600;">
              👥 20 NFTs
            </div>
          </div>


          <div class="price-filter-card rounded-lg p-4 border-2 transition-all" 
               style="background: #ffffff; border: 3px solid #3b82f6; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            <div style="font-size: 20px; color: #3b82f6; font-weight: 900; margin-bottom: 8px;">
              $75.28
            </div>
            <div style="font-size: 12px; color: #0f172a; opacity: 0.7; font-weight: 600;">
              👥 20 NFTs
            </div>
          </div>
        </div>
      </div>


      <div class="rounded-2xl overflow-hidden" style="background: #ffffff; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);">
        <div class="table-container overflow-x-auto" style="-webkit-overflow-scrolling: touch;">
          <table class="w-full" style="min-width: 320px;">
            <thead style="background: linear-gradient(135deg, #3b82f6, #8b5cf6);">
              <tr>
                <th class="px-3 py-4 text-left font-bold uppercase" style="font-size: 10.4px; color: white; letter-spacing: 0.05em;">S.no</th>
                <th class="px-3 py-4 text-left font-bold uppercase" style="font-size: 10.4px; color: white; letter-spacing: 0.05em;">NFT Token</th>
                <th class="px-3 py-4 text-left font-bold uppercase" style="font-size: 10.4px; color: white; letter-spacing: 0.05em;">Buy Time</th>
                <th class="px-3 py-4 text-left font-bold uppercase" style="font-size: 10.4px; color: white; letter-spacing: 0.05em;">Trade Time</th>
                <th class="px-3 py-4 text-left font-bold uppercase" style="font-size: 10.4px; color: white; letter-spacing: 0.05em;">Owner</th>
                <th class="px-3 py-4 text-left font-bold uppercase" style="font-size: 10.4px; color: white; letter-spacing: 0.05em;">Value</th>
              </tr>
            </thead>
            <tbody>

              <tr class="table-row border-b transition-all" style="border-color: rgba(59, 130, 246, 0.3); background: #ffffff;">
                <td class="px-3 py-4" style="font-size: 12px; color: #0f172a; font-weight: 600;">
                  #1
                </td>
                <td class="px-3 py-4">
                  <span 
                    class="token-clickable"
                    style="display: inline-block; padding: 8px 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-radius: 8px; font-size: 12px; font-weight: 700; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);"
                  >
                    NFT-1001
                  </span>
                </td>
                <td class="px-3 py-4" style="font-size: 11.2px; color: #0f172a; opacity: 0.8; white-space: nowrap;">
                  Jan 15, 2024, 14:30
                </td>
                <td class="px-3 py-4">
                  <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #f59e0b; color: white; border-radius: 6px; font-size: 10.4px; font-weight: 700; white-space: nowrap;">
                    ⏱️ 120h
                  </span>
                </td>
                <td class="px-3 py-4">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="font-family: 'Courier New', monospace; font-size: 10.4px; color: #1e293b; font-weight: 700; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      0x7a3b9c8d1e2f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8
                    </div>
                    <button 
                      class="copy-table-btn"
                      data-address="0x7a3b9c8d1e2f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8"
                      style="background: #3b82f6; color: white; border: none; padding: 5px 8px; border-radius: 5px; cursor: pointer; font-size: 10.4px; font-weight: 600; white-space: nowrap; transition: all 0.2s; flex-shrink: 0;"
                    >
                      📋
                    </button>
                  </div>
                </td>
                <td class="px-3 py-4" style="font-size: 13.6px; color: #10b981; font-weight: 800; white-space: nowrap;">
                  $53.50
                </td>
              </tr>

              <tr class="table-row border-b transition-all" style="border-color: rgba(59, 130, 246, 0.3); background: #f8fafc;">
                <td class="px-3 py-4" style="font-size: 12px; color: #0f172a; font-weight: 600;">
                  #2
                </td>
                <td class="px-3 py-4">
                  <span 
                    class="token-clickable"
                    style="display: inline-block; padding: 8px 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-radius: 8px; font-size: 12px; font-weight: 700; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);"
                  >
                    NFT-1002
                  </span>
                </td>
                <td class="px-3 py-4" style="font-size: 11.2px; color: #0f172a; opacity: 0.8; white-space: nowrap;">
                  Feb 28, 2024, 09:15
                </td>
                <td class="px-3 py-4">
                  <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #f59e0b; color: white; border-radius: 6px; font-size: 10.4px; font-weight: 700; white-space: nowrap;">
                    ⏱️ 96h
                  </span>
                </td>
                <td class="px-3 py-4">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="font-family: 'Courier New', monospace; font-size: 10.4px; color: #1e293b; font-weight: 700; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      0x2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b
                    </div>
                    <button 
                      class="copy-table-btn"
                      data-address="0x2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b"
                      style="background: #3b82f6; color: white; border: none; padding: 5px 8px; border-radius: 5px; cursor: pointer; font-size: 10.4px; font-weight: 600; white-space: nowrap; transition: all 0.2s; flex-shrink: 0;"
                    >
                      📋
                    </button>
                  </div>
                </td>
                <td class="px-3 py-4" style="font-size: 13.6px; color: #10b981; font-weight: 800; white-space: nowrap;">
                  $57.24
                </td>
              </tr>



              <tr class="table-row border-b transition-all" style="border-color: rgba(59, 130, 246, 0.3); background: #ffffff;">
                <td class="px-3 py-4" style="font-size: 12px; color: #0f172a; font-weight: 600;">
                  #20
                </td>
                <td class="px-3 py-4">
                  <span 
                    class="token-clickable"
                    style="display: inline-block; padding: 8px 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-radius: 8px; font-size: 12px; font-weight: 700; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);"
                  >
                    NFT-1020
                  </span>
                </td>
                <td class="px-3 py-4" style="font-size: 11.2px; color: #0f172a; opacity: 0.8; white-space: nowrap;">
                  Aug 24, 2024, 09:35
                </td>
                <td class="px-3 py-4">
                  <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #f59e0b; color: white; border-radius: 6px; font-size: 10.4px; font-weight: 700; white-space: nowrap;">
                    ⏱️ 24h
                  </span>
                </td>
                <td class="px-3 py-4">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="font-family: 'Courier New', monospace; font-size: 10.4px; color: #1e293b; font-weight: 700; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      0x0a2b4d6f8a0c2e4a6c8e0a2b4d6f8a0c2e4a6c
                    </div>
                    <button 
                      class="copy-table-btn"
                      data-address="0x0a2b4d6f8a0c2e4a6c8e0a2b4d6f8a0c2e4a6c"
                      style="background: #3b82f6; color: white; border: none; padding: 5px 8px; border-radius: 5px; cursor: pointer; font-size: 10.4px; font-weight: 600; white-space: nowrap; transition: all 0.2s; flex-shrink: 0;"
                    >
                      📋
                    </button>
                  </div>
                </td>
                <td class="px-3 py-4" style="font-size: 13.6px; color: #10b981; font-weight: 800; white-space: nowrap;">
                  $75.28
                </td>
              </tr>
            </tbody>
          </table>
        </div>


        <div class="px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2" style="border-color: rgba(59, 130, 246, 0.3);">
          <div style="font-size: 12px; color: #0f172a; opacity: 0.8; text-align: center;">
            <strong>1</strong>-<strong>20</strong> of <strong>100</strong>
          </div>
          <div class="flex gap-2 items-center">
            <button 
              id="prevBtn" 
              class="px-4 py-2 rounded-lg font-bold transition-all"
              style="background: #3b82f6; color: white; font-size: 12px; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);"
            >
              ← Prev
            </button>
            <div style="padding: 8px 16px; background: rgba(59, 130, 246, 0.2); border-radius: 8px; font-size: 12px; color: #0f172a; font-weight: 700;">
              1/5
            </div>
            <button 
              id="nextBtn" 
              class="px-4 py-2 rounded-lg font-bold transition-all"
              style="background: #3b82f6; color: white; font-size: 12px; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  

  <div id="nftModal" class="nft-image-container">
    <div class="nft-card rounded-2xl overflow-hidden" style="background: white;">
      <div id="nftModalContent"></div>
    </div>
  </div>
    </div>
  )
}
