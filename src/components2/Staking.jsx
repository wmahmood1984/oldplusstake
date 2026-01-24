import React, { useEffect, useState } from 'react'
import "./Staking.css"
import { helperContract, helperContractR, helperContractV2, HEXAContractR, priceOracleContractR, stakingV1Abi, stakingV1Add, stakingV1Contract, stakingV1ContractR, USDTContractR } from '../config'
import { useAppKitAccount } from '@reown/appkit/react';
import { executeContract, formatWithCommas, secondsToDHMSDiff, secondsToDMY } from '../utils/contractExecutor';
import { formatEther, parseEther } from 'ethers';
import { useConfig, useSimulateContract, useWriteContract } from 'wagmi';
import { useDispatch } from 'react-redux';
import { readName } from '../slices/contractSlice';
import toast from 'react-hot-toast';

export default function Staking() {
  const { address } = useAppKitAccount();
  const [stakesIndex, setStakesIndex] = useState(0)
  const [walletBalance, setWalletBalance] = useState(0)
  const [USDTBalance, setUSDTBalance] = useState(0)
  const [myStake, setMyStake] = useState()
  const [price, setPrice] = useState(0)
  const [stakable, setStakable] = useState(0)
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState("history")
  const [myClaims, setMyClaims] = useState()
  const [assetStats, setAssetStats] = useState({
  market: { count: 0, value: 0 },
  burnt: { count: 0, value: 0 },
  queue: { count: 0, value: 0 },
  totalHexa: 0,
  totalUsd: 0,
});

  const config = useConfig()
  const dispatch = useDispatch()


  const [hexaPrice, setHexaPrice] = useState(100)
  useEffect(() => {
    if (address) {

      fetchWalletBalance()
      fetchMyStake()
      fetchUSDTbalance()
      fetchStakeable()
      fetchMyClaims()
    }
    fetchStakesIndex()
    fetchPrice()

  }, [address])

  const fetchStakesIndex = async () => {
    const _data = await stakingV1ContractR.methods.stakeIndex().call()
    setStakesIndex(_data)
  }

  const fetchWalletBalance = async () => {
    const _data = await HEXAContractR.methods.balanceOf(address).call()
    setWalletBalance(formatWithCommas(formatEther(_data)))

  }

  const fetchMyStake = async () => {

    const _data = await stakingV1ContractR.methods.getTicketsByUser(address).call()
    if(_data.length>0){
    setMyStake(_data[0])
    }else{
      setMyStake({amount:0,id:"",time:0,lastClaimTime:0,claimable:0,amountClaimed:0})
    }


  }



  const fetchUSDTbalance = async () => {
    const _data = await USDTContractR.methods.balanceOf(address).call()
    setUSDTBalance(formatWithCommas(formatEther(_data)))

  }

  const fetchMyClaims = async () => {
    const _data = await stakingV1ContractR.methods.getClaims(address).call()
      if(_data.length>0){
    setMyClaims(_data[0])
    }else{
      setMyClaims({time:0,user:"",amountClaimed:0})
    }

  }

  const fetchPrice = async () => {
    const _data = await priceOracleContractR.methods.price().call()
    setPrice(formatEther(_data))

  }

const fetchStakeable = async () => {
  const data = await stakingV1ContractR.methods.getData(address).call();

  const marketValue = Number(formatEther(data.marketTotal));
  const burntValue  = Number(formatEther(data.burnt));
  const queueValue  = Number(formatEther(data.que));

  const marketCount = Number(data.marketCount);
  const burntCount  = Number(data.burntCount);
  const queueCount  = Number(data.queueCount);

  const totalHexa =
    marketValue +
    burntValue +
    queueValue;

  const totalUsd = totalHexa * hexaPrice;

  setAssetStats({
    market: {
      count: marketCount,
      value: marketValue,
    },
    burnt: {
      count: burntCount,
      value: burntValue,
    },
    queue: {
      count: queueCount,
      value: queueValue,
    },
    totalHexa: totalHexa.toFixed(2),
    totalUsd: totalUsd.toFixed(2),
  });
};


  // const myTotalStaked = myStake && Number(myStake.reduce((sum, stake) => sum + Number(formatEther(stake.amount)).toFixed(2), 0));
  // const myTotalEarned = myStake && myStake.reduce((sum, stake) => sum + Number(formatEther(stake.claimable)), 0);

  const isLoading = !myStake || !myClaims


          console.log("log",{myStake,myClaims})

  const handleStake = async () => {
    const stakedone = await helperContractR.methods.stakeEligible(address).call()
    if(!stakedone){
      toast.error("Please trade on the new module first before staking")
      return
    }
    ///
    await executeContract({
      config,
      functionName: "stake",
      args: [
        parseEther(assetStats.market.value.toString()),
                parseEther(assetStats.burnt.value.toString()),
                        parseEther(assetStats.queue.value.toString())
      ],
      gasLimit: 150_000_000,
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
      contract: stakingV1Contract,
      onError: (err) => {
        setLoading(false)

        toast.error("This Trade is not available")
      },
    });
  }

 const { data: simulation, error: simError } = useSimulateContract({
  address: stakingV1Add,
  abi: stakingV1Abi,
  functionName: "stake",
  args: [],
})

const { writeContract } = useWriteContract()

const extractRevertReason = (error) => {
  if (!error) return "Transaction reverted"

  // Convert entire error object to searchable text
  const text = JSON.stringify(
    error,
    Object.getOwnPropertyNames(error),
    2
  )

  // Most common viem format
  let match =
    text.match(/reverted with the following reason:\\n(.*?)(\\n|")/) ||
    text.match(/reverted with reason string '(.*?)'/) ||
    text.match(/reason:\s*(.*?)(\\n|")/) ||
    text.match(/"reason":"(.*?)"/)

  return match?.[1]?.trim() || "Transaction reverted"
}


const handleStake1 = async () => {
  if (!simulation) {
    
    console.log("staking", simError);
    const reason = extractRevertReason(simError)
    toast.error(reason)
    return
  }

  writeContract(simulation.request)
}

//

  const handleClaim = async (id) => {
    console.log("id",id)
    await executeContract({
      config,
      functionName: "claim",
      args: [id],
      onSuccess: (txHash, receipt) => {
        console.log("🎉 Tx Hash:", txHash);
        console.log("🚀 Tx Receipt:", receipt);
        dispatch(readName({ address: receipt.from }));
        toast.success("Claim done Successfully")
        fetchStakeable();
        fetchMyStake();
        fetchStakesIndex();
        setLoading(false)
        fetchMyClaims();
      },
      contract: stakingV1Contract,
      onError: (err) => {
        setLoading(false)

        toast.error("Claim not successful")
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
                        ${price}
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
                  {formatWithCommas(formatEther(myStake.amount))} HEXA
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "16px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", border: "2px solid rgba(6, 182, 212, 0.4)" }}>
                <div style={{ fontSize: "12px", color: "#0f172a", opacity: 0.7, marginBottom: "8px", fontWeight: 600 }}>
                  💰 Total Earned
                </div>
                <div id="totalEarnedDisplay" style={{ fontSize: "clamp(18px, 4vw, 24px)", color: "#06b6d4", fontWeight: 900 }}>
                  {formatWithCommas(formatEther(myStake.claimable))} HEXA
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


            {myStake.amount==0 &&  
            
            <div style={{background: "#ffffff", padding: "16px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginBottom: "16px"}}>
          <h2 style={{fontSize: "clamp(18px, 4vw, 20px)", color: "#0f172a", fontWeight: "900", textAlign: "center", marginBottom: "16px"}}>
            🎯 NFT Staking
          </h2>

          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px", maxWidth: "600px", margin: "0 auto"}}>
            <div class="stake-card" style={{background: "linear-gradient(135deg, #f8fafc, rgba(139, 92, 246, 0.2))", padding: "20px", borderRadius: "16px", border: "3px solid rgba(139, 92, 246, 0.4)"}}>
              
              <div style={{textAlign: "center", marginBottom: "16px"}}>
                <div style={{display: "flex", justifyContent: "center", marginBottom: "8px"}}>
                  <img width="200" src="image.png" alt="Hexa Coin" style={{maxWidth: "100%", height: "auto"}}/>
                </div>

                <h3 style={{fontSize: "clamp(16px, 3vw, 18px)", color: "#0f172a", fontWeight: "900", marginBottom: "6px"}}>
                  HEXA NFT Staking
                </h3>
               
                <div style={{fontSize: "clamp(18px, 4vw, 24px)", color: "#8b5cf6", fontWeight: "900", marginBottom: "16px"}}>
                  Your Asset Value
                </div>
              </div>

              <div style={{background: "#ffffff", padding: "12px", borderRadius: "12px", marginBottom: "16px"}}>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: "8px"}}>
                  <span style={{fontSize: "12px", color: "#0f172a", opacity: "0.7"}}>Stake Amount:</span>
                  <span style={{fontSize: "14px", color: "#0f172a", fontWeight: "700;"}}>{Number(assetStats.totalHexa) / price } HEXA</span>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: "8px"}}>
                  <span style={{fontSize: "12px", color: "#0f172a", opacity: "0.7"}}>Duration:</span>
                  <span style={{fontSize: "14px", color: "#0f172a", fontWeight: "700"}}>200 Days</span>
                </div>
              </div>


              <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "8px"}}>
                <div style={{background: "#f8fafc", padding: "12px", borderRadius: "8px", textAlign: "center", border: "1px solid rgba(16, 185, 129, 0.2)"}}>
                  <div style={{fontSize: "10px", color: "#0f172a", opacity: "0.7", marginBottom: "4px"}}>Purchased</div>
                  <div style={{fontSize: "14px", color: "#10b981", fontWeight: "700"}}>${assetStats.market.value}</div>
                </div>
                <div style={{background: "#f8fafc", padding: "12px", borderRadius: "8px", textAlign: "center", border: "1px solid rgba(245, 158, 11, 0.2)"}}>
                  <div style={{fontSize: "10px", color: "#0f172a", opacity: "0.7", marginBottom:" 4px"}}>Created</div>
                  <div style={{fontSize: "14px", color: "#f59e0b", fontWeight: "700"}}>${assetStats.queue.value}</div>
                </div>
                <div style={{background: "#f8fafc", padding: "12px", borderRadius: "8px", textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.2)"}}>
                  <div style={{fontSize: "10px", color: "#0f172a", opacity: "0.7", marginBottom: "4px"}}>Burned</div>
                  <div style={{fontSize: "14px", color: "#ef4444", fontWeight: "700"}}>${assetStats.burnt.value}</div>
                </div>
              </div>

              <div class="full-row-box" style={{background: "#f8fafc", padding: "16px", borderRadius: "12px", textAlign: "center", border: "2px solid rgba(139, 92, 246, 0.4)", marginBottom: "16px", gridColumn: "1 / -1 "}}>
                <div style={{fontSize: "12px", color: "#8b5cf6", opacity: "1", marginBottom: "8px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px"}}>
                  Total Value
                </div>
                <div style={{fontSize: "24px", color: "#8b5cf6", fontWeight: "900"}}>
                  ${assetStats. totalHexa}
                </div>
                <div style={{fontSize: "10px", color: "#0f172a", opacity: "0.6", marginTop: "4px"}}>
                  Combined Asset Worth
                </div>
              </div>

              <button 
              onClick={handleStake}
              id="stakeNowBtn" style={{width: "100%", background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", color: "white", border: "none", padding: "14px", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "700", boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)"}}>
                Stake Now
              </button>
            </div>
          </div>
        </div>
            
            }


            <div style={{ textAlign: "center", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => { setShow("history") }}
                id="viewHistoryBtn" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", color: "white", border: "none", padding: "14px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 700, boxShadow: "0 8px 20px rgba(139, 92, 246, 0.4)", minWidth: "180px" }}>
                View Staking History
              </button>
              <button
                onClick={() => { setShow("reward") }}
                id="viewRewardsBtn" style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)", color: "white", border: "none", padding: "14px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 700, boxShadow: "0 8px 20px rgba(6, 182, 212, 0.4)", minWidth: "180px" }}>
                Staking Received
              </button>
            </div>


            {show === "history" && Number(formatEther(myStake.amount))>0 && 

              <div id="stakingHistory" style={{ background: "#ffffff", padding: "16px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginTop: "16px" }}>
                <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>
                  Your Staking History
                </h2>
                <div id="historyContent">

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    
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
                              {formatWithCommas(formatEther(myStake.amount))} HEXA
                            </div>
                            <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 700 }}>
                              Active
                            </div>
                          </div>
                        </div>
                        <div style={{ background: "rgba(139, 92, 246, 0.2)", padding: "8px 12px", borderRadius: "8px", marginBottom: "8px" }}>
                          <div id="countdown-0" style={{ fontSize: "12px", color: "#8b5cf6", fontWeight: 700, textAlign: "center" }}>
                            ⏱️ {secondsToDHMSDiff(Number(myStake.time) + 200 * 24 * 60 * 60 - new Date().getTime() / 1000)} remaining
                          </div>
                        </div>
                        <div style={{ fontSize: "10px", color: "#0f172a", opacity: 0.6 }}>
                          Staked on: {secondsToDMY(myStake.time)}
                        </div>
                      </div>

                    


                  </div>
                </div>
              </div>

            }


            {show === "reward" && Number(formatEther(myStake.amount))>0 &&
            
            <div id="stakingRewards" style={{ background: "#ffffff", padding: "16px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginTop: "16px" }}>
              <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>
                💰 Staking Received History
              </h2>
              <div id="rewardsContent">

                <div
                  style={{
                    background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.1))",
                    padding: "16px",
                    borderRadius: "12px",
                    marginBottom: "16px",
                    border: "2px solid rgba(6, 182, 212, 0.4)",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    {/* Total Earned */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "13px", color: "#0f172a", opacity: 0.7, fontWeight: 600 }}>
                        Total Earned
                      </div>
                      <div style={{ fontSize: "22px", color: "#06b6d4", fontWeight: 900 }}>
                        {myStake.length>0? formatWithCommas(formatEther( myStake.claimable)):0} HEXA
                      </div>
                    </div>

                    {/* Total Claimed */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "13px", color: "#0f172a", opacity: 0.7, fontWeight: 600 }}>
                        Total Claimed
                      </div>
                      <div style={{ fontSize: "22px", color: "#10b981", fontWeight: 900 }}>
                        {myStake.length>0? formatWithCommas(formatEther(myStake.amountClaimed)):0} HEXA
                      </div>
                    </div>

                    {/* Claimable */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "13px", color: "#0f172a", opacity: 0.7, fontWeight: 600 }}>
                        Claimable
                      </div>
                      <div style={{ fontSize: "22px", color: "#f59e0b", fontWeight: 900 }}>
                        { Number(Number(formatEther(myStake.claimable)) - Number(formatEther(myStake.amountClaimed))).toFixed(2)} HEXA
                      </div>
                      <div style={{ fontSize: "11px", opacity: 0.6 }}>
                        ≈ $
                        {myStake.length>0? formatWithCommas(
                          Number(formatEther(myStake.claimable)) / hexaPrice
                        ):0}{" "}
                        USDT
                      </div>
                    </div>

                    {/* Claim Button */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <button
                        onClick={()=>handleClaim(myStake.id)}
                        disabled={Number(myStake.claimable) - Number(myStake.amountClaimed) <= 0}
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: "10px",
                          background:  
                            Number(myStake.claimable) - Number(myStake.amountClaimed) > 0
                              ? "linear-gradient(135deg, #06b6d4, #0ea5e9)"
                              : "grey",
                          color: "#ffffff",
                          fontWeight: 800,
                          border: "none",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          cursor: "pointer",
                        }}
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                </div>


                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* {myClaims.map((v, e) => */}
                    <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #06b6d4" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontSize: "32px" }}>🎨</span>
                          <div>
                            <div style={{ fontSize: "16px", color: "#0f172a", fontWeight: 900 }}>
                              HEXA Staking
                            </div>
                            {/* <div style={{ fontSize: "12px", color: "#0f172a", opacity: 0.7 }}>
                              {formatWithCommas(formatEther(myClaims[0]?.amountClaimed))} HEXA staked • 200 Days
                            </div> */}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", marginTop: "8px" }}>
                          <div style={{ fontSize: "18px", color: "#06b6d4", fontWeight: 900 }}>
                            +{myClaims.length >0 ? formatWithCommas(formatEther(myClaims.amountClaimed)):0} HEXA
                          </div>
                          <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 700 }}>
                            Earning
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: "10px", color: "#0f172a", opacity: 0.6 }}>
                        Started: {secondsToDMY(myClaims.time)}• Est. Completion: {secondsToDMY(Number(myClaims.time) + 200 * 24 * 60 * 60)}
                      </div>
                    </div>
                  {/* )

                  } */}


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



const TriangleCard = ({ title, count, value, color, style }) => (
  <div
    style={{
      background: "#ffffff",
      borderRadius: "16px",
      padding: "14px 18px",
      minWidth: "160px",
      textAlign: "center",
      border: `2px solid ${color}55`,
      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
      zIndex:"100",
      ...style,
    }}
  >
    <div style={{ fontSize: "13px", fontWeight: 800, color }}>
      {title}
    </div>

    <div style={{ fontSize: "22px", fontWeight: 900, marginTop: "4px" }}>
      {count}
    </div>

    <div style={{ fontSize: "13px", opacity: 0.7 }}>
      ${formatWithCommas(value)}
    </div>
  </div>
);
