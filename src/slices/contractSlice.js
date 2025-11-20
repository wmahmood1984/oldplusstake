import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { erc20abi, erc20Add, helperAbi, helperAddress, mlmabi, mlmcontractaddress, web3 } from "../config";
import { formatEther } from "ethers";

// Init thunk: create contract and save in state
export const init = createAsyncThunk("contract/init", async (_, thunkApi) => {
  try {
    const rContract = new web3.eth.Contract(helperAbi, helperAddress);

    const uContract = new web3.eth.Contract(erc20abi, erc20Add);


    thunkApi.dispatch(setContract(rContract));
    thunkApi.dispatch(setUSDTContract(uContract));

    return rContract;
  } catch (err) {
    console.error("❌ [init] Error initializing contracts:", err);
    throw new Error(`Init failed: ${err.message}`);
  }
});

// Read contract name + user data
export const readName = createAsyncThunk(
  "contract/readName",
  async (a, thunkApi) => {
    const state = thunkApi.getState();
    const contract = state.contract.contract;
    const uContract = state.contract.usdtContract;

    const nftContract = new web3.eth.Contract(mlmabi, mlmcontractaddress);

    if (!contract) throw new Error("Contract not initialized");

    try {
      const safeCall = async (label, fn) => {
        try {
          return await fn();
        } catch (err) {
          console.error(`❌ [readName:${label}] Error:, err`);
          throw new Error(`Failed at ${label}: ${err.message}`);
        }
      };

      const name = await safeCall("name", () => nftContract.methods.name().call());
      // const nfts = await safeCall("getNFTs", () => contract.methods.getNFTs().call());
      const packages = await safeCall("getPackages", () => contract.methods.getPackages().call());
      const admin = await safeCall("admin", () => contract.methods.owner().call());
      const NFTque = await safeCall("getNFTque", () => contract.methods.getNFTque().call());
      const registered = await safeCall("userRegistered", () => contract.methods.userRegistered(a.address).call());

      const NFTMayBeCreated = await safeCall("NFTMayBeCreated", () => contract.methods.NFTMayBeCreated().call());
      const nextTokenId = await safeCall("_nextTokenId", () => nftContract.methods._nextTokenId().call());
      const timeLimit = await safeCall("timelimit", () => contract.methods.timelimit().call());
      const packageExpiryLimit = await safeCall("packageExpiry", () => contract.methods.packageExpiry().call());
      const nftQueIndex = await safeCall("nftQueIndex", ()=>contract.methods.nftQueIndex().call())


      //      const nftused = await safeCall("nftused(0)", () => contract.methods.getNFTused().call());


      let Package = null;
      let uplines = [];
      let downlines = [];
      let allowance = 0;
      let directReferrals = [];
      let limitUtilized = 0;
      let myNFTs = [];
      let NFTQueBalance = 0
      let tradingReferralBonus = 0
      let packageReferralBonus = 0
      let tradingLevelBonus = 0
      let packageLevelBonus = 0
      let selfTradingProfit = 0
      let walletBalance = 0
      let nftListed = []
      let nftPurchaseTime = 0
      let incomeBlockTime = 0
      let userTradingTime = 0


      if (a.address && registered) {
        Package = await safeCall("userPackage", () => contract.methods.userPackage(a.address).call());
        uplines = await safeCall("getUplines", () => contract.methods.getUplines(a.address).call());
        downlines = await safeCall("getDownlines", () => contract.methods.getUser(a.address).call());
        allowance = await safeCall("allowance", () => uContract.methods.allowance(a.address, mlmcontractaddress).call());
        //      directReferrals = await safeCall("getDirectReferrals", () => contract.methods.getDirectReferrals(a.address).call());
        limitUtilized = await safeCall("userLimitUtilized", () => contract.methods.userLimitUtilized(a.address).call());
        myNFTs = await safeCall("getNFTs(address)", () => contract.methods.getNFTs(a.address).call());
        NFTQueBalance = await safeCall("NFTQueBalance", () => contract.methods.NFTQueBalance(a.address).call());
        tradingReferralBonus = await safeCall("levelIncome", () => contract.methods.tradingReferralBonus(a.address).call());
        packageReferralBonus = await safeCall("referralIncome", () => contract.methods.packageReferralBonus(a.address).call());
        tradingLevelBonus = await safeCall("tradingIncome", () => contract.methods.tradingLevelBonus(a.address).call());
        packageLevelBonus = await safeCall("tradingIncome", () => contract.methods.packageLevelBonus(a.address).call());
        selfTradingProfit = await safeCall("tradingIncome", () => contract.methods.selfTradingProfit(a.address).call());
        walletBalance = await safeCall("walletbalance", () => uContract.methods.balanceOf(a.address).call());
        nftListed = await safeCall("nftlisted", () => contract.methods.getNFTListed(a.address).call());
        nftPurchaseTime = await safeCall("nftPurchaseTime", () => contract.methods.userTradingTime(a.address).call());
        incomeBlockTime = await safeCall("userLevelIncomeBlockTime", () => contract.methods.userLevelIncomeBlockTime(a.address).call());
        userTradingTime = await safeCall("userTradingTime", () => contract.methods.userTradingTime(a.address).call());
        
      }



      console.log("✅ [readName] All calls succeeded", downlines);

      return {
        name,
        // nfts,
        Package,
        packages,
        uplines,
        downlines,
        registered,
        admin,
        allowance,
        directReferrals,

        limitUtilized: Number(formatEther(limitUtilized)).toFixed(4),
        NFTque,
        NFTQueBalance: Number(formatEther(NFTQueBalance)).toFixed(4),
        myNFTs,
        NFTMayBeCreated,
        nextTokenId,
        timeLimit,
        packageExpiryLimit,
userTradingTime,
        tradingReferralBonus: Number(formatEther(tradingReferralBonus)).toFixed(4),
        packageReferralBonus: Number(formatEther(packageReferralBonus)).toFixed(4),
        tradingLevelBonus: Number(formatEther(tradingLevelBonus)).toFixed(4),
        packageLevelBonus: Number(formatEther(packageLevelBonus)).toFixed(4),
        selfTradingProfit: Number(formatEther(selfTradingProfit)).toFixed(4),
        walletBalance: Number(formatEther(walletBalance)).toFixed(4),
        totalIncome: (
          Number(formatEther(tradingReferralBonus)) +
          Number(formatEther(packageReferralBonus)) +
          Number(formatEther(tradingLevelBonus)) +
          Number(formatEther(packageLevelBonus)) +
          Number(formatEther(selfTradingProfit))
        ).toFixed(4), nftListed,
        nftPurchaseTime,incomeBlockTime,nftQueIndex


        //      nftused,
      };
    } catch (err) {
      console.error("❌ [readName] General error:", err);
      throw new Error(`readName failed: ${err.message}`);
    }
  }
);

const contractSlice = createSlice({
  name: "contract",
  initialState: {
    contract: null,
    usdtContract: null,
    name: null,
    // nfts: [],
    Package: null,
    packages: [],
    uplines: [],
    downlines: [],
    registered: null,
    admin: null,
    allowance: 5,
    directReferrals: [],
    limitUtilized: 0,
    NFTque: [],
    NFTQueBalance: 0,
    myNFTs: [],
    nftListed: [],
    NFTMayBeCreated: false,
    nextTokenId: 0,
    tradingReferralBonus: 0,
    packageReferralBonus: 0,
    tradingLevelBonus: 0,
    packageLevelBonus: 0,
    selfTradingProfit: 0,
    walletBalance: 0,
    totalIncome: 0,
    nftPurchaseTime: 0,
    incomeBlockTime:0,
    timeLimit:0,
    packageExpiryLimit:0,
    userTradingTime:0,
    nftQueIndex:0,
    //nftused: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setContract: (state, action) => {
      state.contract = action.payload;
    },
    setUSDTContract: (state, action) => {
      state.usdtContract = action.payload;
    },
     setRegisteredFalse: (state) => {
      state.registered = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readName.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(readName.fulfilled, (state, action) => {
        state.status = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(readName.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setContract, setUSDTContract,setRegisteredFalse } = contractSlice.actions;
export default contractSlice.reducer;