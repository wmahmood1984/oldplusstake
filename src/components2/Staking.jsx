import React, { useEffect, useState } from 'react'
import "./Staking.css"
import { hexaContractR, stakingContract, stakingContractR, USDTContractR } from '../config'
import { useAppKitAccount } from '@reown/appkit/react';
import { executeContract, formatWithCommas, secondsToDHMSDiff, secondsToDMY } from '../utils/contractExecutor';
import { formatEther } from 'ethers';
import { useConfig } from 'wagmi';
import { useDispatch } from 'react-redux';
import { readName } from '../slices/contractSlice';
import toast from 'react-hot-toast';

export default function Staking() {
  const { address } = useAppKitAccount();
  const [stakesIndex, setStakesIndex] = useState(0)
  const [walletBalance, setWalletBalance] = useState(0)
  const [USDTBalance, setUSDTBalance] = useState(0)
  const [myStake, setMyStake] = useState()
  const [stakable, setStakable] = useState(0)
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState("none")
  const config = useConfig()
  const dispatch = useDispatch()


  const [hexaPrice, setHexaPrice] = useState(100)
  useEffect(() => {
    if (address) {

      fetchWalletBalance()
      fetchMyStake()
      fetchUSDTbalance()
      fetchStakeable()
    }
    fetchStakesIndex()

  }, [address])

  const fetchStakesIndex = async () => {
    const _data = await stakingContractR.methods.stakeIndex().call()
    setStakesIndex(_data)
  }

  const fetchWalletBalance = async () => {
    const _data = await hexaContractR.methods.balanceOf(address).call()
    setWalletBalance(formatWithCommas(formatEther(_data)))

  }

  const fetchMyStake = async () => {
    const _data = await stakingContractR.methods.getTicketsByUser(address).call()
    setMyStake(_data)

  }

  const fetchUSDTbalance = async () => {
    const _data = await USDTContractR.methods.balanceOf(address).call()
    setUSDTBalance(formatWithCommas(formatEther(_data)))

  }

  const fetchStakeable = async () => {
    const { marketTotal, burnt, que } = await stakingContractR.methods.getData(address).call()
    const total = Number(formatEther(marketTotal)) +
      Number(formatEther(burnt)) +
      Number(formatEther(que))
    setStakable(Number(total).toFixed(2))

  }

  const myTotalStaked = myStake && Number(myStake.reduce((sum, stake) => sum + Number(formatEther(stake.amount)).toFixed(2), 0));
  const myTotalEarned = myStake && myStake.reduce((sum, stake) => sum + Number(formatEther(stake.claimable)), 0);

  const isLoading = !myStake

  const handleStake = async () => {
    await executeContract({
      config,
      functionName: "stake",
      args: [],
      onSuccess: (txHash, receipt) => {
        console.log("🎉 Tx Hash:", txHash);
        console.log("🚀 Tx Receipt:", receipt);
        dispatch(readName({ address: receipt.from }));
        toast.success("Stake done Successfully")
        fetchStakeable();
        fetchMyStake();
        fetchStakesIndex();
        setLoading(false)
      },
      contract: stakingContract,
      onError: (err) => {
        setLoading(false)

        toast.error("This Trade is not available")
      },
    });
  }



  if (isLoading) {
    // show a waiting/loading screen
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
      </div>
    );
  }

console.log("staking",show);

  return (
    <div>

     <div id="app" class="h-full w-full overflow-auto">
    
    <div class="min-h-full w-full p-4 md:p-8">
      <div class="max-w-6xl mx-auto">
        
        
        <div class="mb-8 text-center">
          <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)", color: "#0f172a", fontWeight: 900, marginBottom: "8px", textShadow: "0 4px 20px #8b5cf6" }}>
            HEXA Staking Platform
          </h1>
          <p style={{ fontSize: "clamp(14px, 3vw, 16px)", color: "#0f172a", opacity: 0.8 }}>
            Stake HEXA tokens and earn rewards
          </p>
        </div>

        
        <div style={{ background: "linear-gradient(135deg, #ffffff, rgba(6, 182, 212, 0.3))", padding: "16px", borderRadius: "20px", marginBottom: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", border: "3px solid #06b6d4" }}>
          
          <div style={{ display: "flex", alignItems: "stretch", justifyContent: "space-between", gap: "16px", flexDirection: "column" }}>
            
            
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }} class="responsive-flex">
              <div style={{ flex: 1, minWidth: "140px" }}>
                <div style={{ fontSize: "12px", color: "#0f172a", opacity: 0.7, marginBottom: "4px", fontWeight: 600 }}>
                  📊 HEXA Live Price
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div id="liveHexaPrice" style={{ fontSize: "clamp(18px, 4vw, 24px)", color: "#0f172a", fontWeight: 900 }}>
                    $6500.00
                  </div>
                  <div id="priceChangeIndicator" style={{ fontSize: "clamp(16px, 3vw, 20px)", fontWeight: 900 }}>
                    →
                  </div>
                </div>
              </div>
              
              <div style={{ flex: 1, minWidth: "140px", textAlign: "right" }}>
                <div style={{ fontSize: "12px", color: "#0f172a", opacity: 0.7, marginBottom: "4px", fontWeight: 600 }}>
                  💼 wallet balance
                </div>
                <div id="walletBalanceDisplay" style={{ fontSize: "clamp(18px, 4vw, 24px)", color: "#8b5cf6", fontWeight: 900 }}>
                  {walletBalance} HEXA
                </div>
              </div>
            </div>

          </div>
        </div>

        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "20px" }} class="responsive-grid">
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", border: "2px solid rgba(139, 92, 246, 0.4)" }}>
            <div style={{ fontSize: "12px", color: "#0f172a", opacity: 0.7, marginBottom: "8px", fontWeight: 600 }}>
              🔒 Total Staked
            </div>
            <div id="totalStakedDisplay" style={{ fontSize: "clamp(18px, 4vw, 24px)", color: "#8b5cf6", fontWeight: 900 }}>
              {myTotalStaked} HEXA
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", border: "2px solid rgba(6, 182, 212, 0.4)" }}>
            <div style={{ fontSize: "12px", color: "#0f172a", opacity: 0.7, marginBottom: "8px", fontWeight: 600 }}>
              💰 Total Earned
            </div>
            <div id="totalEarnedDisplay" style={{ fontSize: "clamp(18px, 4vw, 24px)", color: "#06b6d4", fontWeight: 900 }}>
              {myTotalEarned} HEXA
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", border: "2px solid rgba(16, 185, 129, 0.4)" }}>
            <div style={{ fontSize: "12px", color: "#0f172a", opacity: 0.7, marginBottom: "8px", fontWeight: 600 }}>
              💵 Wallet Balance in (USDT)
            </div>
            <div id="walletBalanceUsdt" style={{ fontSize: "clamp(18px, 4vw, 24px)", color: "#10b981", fontWeight: 900 }}>
              ${USDTBalance}
            </div>
          </div>
        </div>

        
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>
            🎯 NFT Staking
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px", maxWidth: "600px", margin: "0 auto" }}>
            <div class="stake-card" style={{ background: "linear-gradient(135deg, #f8fafc, rgba(139, 92, 246, 0.2))", padding: "20px", borderRadius: "16px", border: "3px solid rgba(139, 92, 246, 0.4)" }}>
              
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                  <img width="200" src="image.png" alt="Hexa Coin" style={{ maxWidth: "100%", height: "auto" }} />
                </div>

                <h3 style={{ fontSize: "clamp(16px, 3vw, 18px)", color: "#0f172a", fontWeight: 900, marginBottom: "6px" }}>
                  HEXA NFT Staking
                </h3>
                <div style={{ fontSize: "clamp(18px, 4vw, 24px)", color: "#8b5cf6", fontWeight: 900, marginBottom: "4px" }}>
                  Your Asset Value
                </div>
                <div style={{ fontSize: "clamp(18px, 4vw, 24px)", color: "#8b5cf6", fontWeight: 900, marginBottom: "4px" }}>
                  ${stakable}
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "12px", borderRadius: "12px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#0f172a", opacity: 0.7 }}>Stake Amount:</span>
                  <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: 700 }}>{stakable} HEXA</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#0f172a", opacity: 0.7 }}>Duration:</span>
                  <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: 700 }}>200 Days</span>
                </div>
 
              </div>

              <button 
              onClick={handleStake}
              id="stakeNowBtn" style={{ width: "100%", background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", color: "white", border: "none", padding: "14px", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: 700, boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)" }}>
                Stake Now
              </button>
            </div>
          </div>
        </div>

        
        <div style={{ textAlign: "center", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button 
          onClick={()=>{setShow("history")}}
          id="viewHistoryBtn" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", color: "white", border: "none", padding: "14px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 700, boxShadow: "0 8px 20px rgba(139, 92, 246, 0.4)", minWidth: "180px" }}>
            View Staking History
          </button>
          <button 
          onClick={()=>{setShow("reward")}}
          id="viewRewardsBtn" style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)", color: "white", border: "none", padding: "14px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 700, boxShadow: "0 8px 20px rgba(6, 182, 212, 0.4)", minWidth: "180px" }}>
            Staking Received
          </button>
        </div>

        
       {show==="history" &&  
       
       <div id="stakingHistory" style={{ background: "#ffffff", padding: "16px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginTop: "16px"}}>
          <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>
            Your Staking History
          </h2>
          <div id="historyContent">
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {myStake.map((v,e)=>
            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #8b5cf6" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "32px" }}>🎨</span>
                    <div>
                      <div style={{ fontSize: "16px", color: "#0f172a", fontWeight: 900 }}>
                        HEXA Staking
                      </div>
                      <div style={{ fontSize: "12px", color: "#0f172a", opacity: 0.7 }}>
                        200 Days
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", marginTop: "8px" }}>
                    <div style={{ fontSize: "18px", color: "#8b5cf6", fontWeight: 900 }}>
                      {formatWithCommas(formatEther(v.amount))} HEXA
                    </div>
                    <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 700 }}>
                      Active
                    </div>
                  </div>
                </div>
                <div style={{ background: "rgba(139, 92, 246, 0.2)", padding: "8px 12px", borderRadius: "8px", marginBottom: "8px" }}>
                  <div id="countdown-0" style={{ fontSize: "12px", color: "#8b5cf6", fontWeight: 700, textAlign: "center" }}>
                    ⏱️ {secondsToDHMSDiff(Number(v.time)+200*24*60*60- new Date().getTime()/1000)} remaining
                  </div>
                </div>
                <div style={{ fontSize: "10px", color: "#0f172a", opacity: 0.6 }}>
                  Staked on: {secondsToDMY(v.time)}
                </div>
              </div>
            
            )  }


            </div>
          </div>
        </div>
        
        }

        
       {show==="reward" &&  <div id="stakingRewards" style={{ background: "#ffffff", padding: "16px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginTop: "16px" }}>
          <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>
            💰 Staking Received History
          </h2>
          <div id="rewardsContent">
            
            <div style={{ background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.1))", padding: "16px", borderRadius: "12px", marginBottom: "16px", border: "2px solid rgba(6, 182, 212, 0.4)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "14px", color: "#0f172a", opacity: 0.7, marginBottom: "8px", fontWeight: 600 }}>
                  Total Earnings
                </div>
                <div style={{ fontSize: "32px", color: "#06b6d4", fontWeight: 900 }}>
                  {formatWithCommas(formatEther(myStake[0].claimable))} HEXA
                </div>
                <div style={{ fontSize: "12px", color: "#0f172a", opacity: 0.6, marginTop: "4px" }}>
                  ≈ ${formatWithCommas(Number(formatEther(myStake[0].claimable))/hexaPrice)} USDT
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {myStake.map((v,e)=>
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #06b6d4" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "32px" }}>🎨</span>
                    <div>
                      <div style={{ fontSize: "16px", color: "#0f172a", fontWeight: 900 }}>
                        HEXA Staking
                      </div>
                      <div style={{ fontSize: "12px", color: "#0f172a", opacity: 0.7 }}>
                        {formatWithCommas(formatEther(v.amount))} HEXA staked • 200 Days
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", marginTop: "8px" }}>
                    <div style={{ fontSize: "18px", color: "#06b6d4", fontWeight: 900 }}>
                      +{formatWithCommas(formatEther(v.claimable))} HEXA
                    </div>
                    <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 700 }}>
                      Earning
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: "10px", color: "#0f172a", opacity: 0.6 }}>
                  Started: {secondsToDMY(v.time)}• Est. Completion: {secondsToDMY(Number(v.time)+200*24*60*60)}
                </div>
              </div>
            )
              
              }


            </div>
          </div>
        </div>}

      </div>
    </div>
  </div>

  
  <div id="messageOverlay" style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", background: "#3b82f6", color: "white", padding: "12px 24px", borderRadius: "12px", fontWeight: "bold", zIndex: 9999, boxShadow: "0 10px 40px rgba(0,0,0,0.3)", display: "none", animation: "slideUp 0.3s ease", maxWidth: "90vw", textAlign: "center" }}>
  </div>
    </div>
  )
}
