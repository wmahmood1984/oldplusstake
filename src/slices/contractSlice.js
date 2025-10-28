import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { erc20abi, erc20Add, helperAbi, helperAddress, mlmabi, mlmcontractaddress, web3 } from "../config";

// Init thunk: create contract and save in state
export const init = createAsyncThunk("contract/init", async (_, thunkApi) => {
  try {
    const rContract = new web3.eth.Contract(helperAbi, helperAddress);
    const uContract = new web3.eth.Contract(erc20abi, erc20Add);

    thunkApi.dispatch(setContract(rContract));
    thunkApi.dispatch(setUSDTContract(uContract));

    return { contract: rContract, usdtContract: uContract };
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
          console.error(`❌ [readName:${label}] Error:`, err);
          throw new Error(`Failed at ${label}: ${err.message}`);
        }
      };

      const name = await safeCall("name", () => nftContract.methods.name().call());
      const packages = await safeCall("getPackages", () => contract.methods.getPackages().call());
      const admin = await safeCall("admin", () => contract.methods.owner().call());
      const NFTque = await safeCall("getNFTque", () => contract.methods.getNFTque().call());
      const registered = await safeCall("userRegistered", () => contract.methods.userRegistered(a.address).call());

      const NFTMayBeCreated = await safeCall("NFTMayBeCreated", () => contract.methods.NFTMayBeCreated().call());
      const nextTokenId = await safeCall("_nextTokenId", () => nftContract.methods._nextTokenId().call());

      // prepare safe defaults
      let Package = null;
      let uplines = [];
      let downlines = null;
      let allowance = 0;
      let directReferrals = [];
      let limitUtilized = 0;
      let myNFTs = [];
      let NFTQueBalance = 0;
      let levelIncome = 0;
      let referralIncome = 0;
      let tradingIncome = 0;

      if (a.address && registered) {
        Package = await safeCall("userPackage", () => contract.methods.userPackage(a.address).call());
        uplines = await safeCall("getUplines", () => contract.methods.getUplines(a.address).call());
        downlines = await safeCall("getDownlines", () => contract.methods.getUser(a.address).call());
        allowance = await safeCall("allowance", () => uContract.methods.allowance(a.address, mlmcontractaddress).call());
        limitUtilized = await safeCall("userLimitUtilized", () => contract.methods.userLimitUtilized(a.address).call());
        myNFTs = await safeCall("getNFTs(address)", () => contract.methods.getNFTs(a.address).call());
        NFTQueBalance = await safeCall("NFTQueBalance", () => contract.methods.NFTQueBalance(a.address).call());
        levelIncome = await safeCall("userLevelIncome", () => contract.methods.userLevelIncome(a.address).call());
        referralIncome = await safeCall("userReferralIncome", () => contract.methods.userReferralIncome(a.address).call());
        tradingIncome = await safeCall("userTradingIncome", () => contract.methods.userTradingIncome(a.address).call());
      }

      console.log("✅ [readName] All calls succeeded", { Package, downlines });

      return {
        name,
        Package,
        packages,
        uplines,
        downlines,
        registered,
        admin,
        allowance,
        directReferrals,
        limitUtilized,
        NFTque,
        NFTQueBalance,
        myNFTs,
        NFTMayBeCreated,
        nextTokenId,
        levelIncome,
        referralIncome,
        tradingIncome,
      };
    } catch (err) {
      console.error("❌ [readName] General error:", err);
      throw new Error(`readName failed: ${err.message}`);
    }
  }
);

const initialState = {
  contract: null,
  usdtContract: null,
  name: null,
  Package: { id: 0, price: "0", limit: "0", team: 0 },
  packages: [],
  uplines: [],
  downlines: { direct: [], indirect: [] },
  registered: false,
  admin: null,
  allowance: "0",
  directReferrals: [],
  limitUtilized: 0,
  NFTque: [],
  NFTQueBalance: "0",
  myNFTs: [],
  NFTMayBeCreated: false,
  nextTokenId: 0,
  levelIncome: "0",
  referralIncome: "0",
  tradingIncome: "0",
  status: "idle",
  error: null,
};

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    setContract: (state, action) => {
      state.contract = action.payload;
    },
    setUSDTContract: (state, action) => {
      state.usdtContract = action.payload;
    },
    // safe merge helper: merges only present keys and avoids setting fields to null/undefined
    setContractData: (state, action) => {
      const payload = action.payload || {};
      // merge Package
      if (payload.Package !== undefined && payload.Package !== null) {
        state.Package = { ...state.Package, ...payload.Package };
      }
      if (Array.isArray(payload.packages)) state.packages = payload.packages;
      if (payload.uplines !== undefined) state.uplines = payload.uplines;
      if (payload.downlines !== undefined && payload.downlines !== null) {
        // if downlines is an object try to preserve structure
        if (Array.isArray(payload.downlines)) {
          // older code may return array; keep compatibility by placing into direct
          state.downlines = { direct: payload.downlines, indirect: state.downlines.indirect ?? [] };
        } else {
          state.downlines = {
            direct: payload.downlines.direct ?? state.downlines.direct,
            indirect: payload.downlines.indirect ?? state.downlines.indirect,
          };
        }
      }
      if (payload.registered !== undefined) state.registered = payload.registered;
      if (payload.admin !== undefined) state.admin = payload.admin;
      if (payload.allowance !== undefined) state.allowance = payload.allowance;
      if (payload.directReferrals !== undefined) state.directReferrals = payload.directReferrals;
      if (payload.limitUtilized !== undefined) state.limitUtilized = payload.limitUtilized;
      if (payload.NFTque !== undefined) state.NFTque = payload.NFTque;
      if (payload.NFTQueBalance !== undefined) state.NFTQueBalance = payload.NFTQueBalance;
      if (payload.myNFTs !== undefined) state.myNFTs = payload.myNFTs;
      if (payload.NFTMayBeCreated !== undefined) state.NFTMayBeCreated = payload.NFTMayBeCreated;
      if (payload.nextTokenId !== undefined) state.nextTokenId = payload.nextTokenId;
      if (payload.levelIncome !== undefined) state.levelIncome = payload.levelIncome;
      if (payload.referralIncome !== undefined) state.referralIncome = payload.referralIncome;
      if (payload.tradingIncome !== undefined) state.tradingIncome = payload.tradingIncome;
      if (payload.name !== undefined) state.name = payload.name;
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
        // Use merge helper rather than Object.assign which can overwrite fields with null
        contractSlice.caseReducers.setContractData(state, action);
        console.log("✅ [readName.fulfilled] merged payload into state", action.payload);
      })
      .addCase(readName.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message ?? String(action.payload ?? action.error);
        console.error("❌ [readName.rejected]", state.error);
      })
      .addCase(init.fulfilled, (state, action) => {
        // store contract instances safely
        if (action.payload) {
          if (action.payload.contract) state.contract = action.payload.contract;
          if (action.payload.usdtContract) state.usdtContract = action.payload.usdtContract;
        }
      });
  },
});

export const { setContract, setUSDTContract, setContractData } = contractSlice.actions;
export default contractSlice.reducer;
