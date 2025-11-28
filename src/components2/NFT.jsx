import { useAppKitAccount } from "@reown/appkit/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useConfig } from "wagmi";
import { executeContract, extractRevertReason, formatAddress } from "../utils/contractExecutor";
import { readName } from "../slices/contractSlice";
import { formatEther, parseEther } from "ethers";
import { mlmcontractaddress, usdtContract } from "../config";
import toast from "react-hot-toast";
import Spinner from "./Spinner";


export const NFT = ({ nft, index, toggle, setToggle,revisedLimitUtilized,image,name }) => {
  const config = useConfig()
  // const [image, setImage] = useState()
  // const [name, setName] = useState()
  // const {  nfts  } = useSelector((state) => state.contract);
  const { address } = useAppKitAccount();
  const [loading, setLoading] = useState(false);
  const { Package, myNFTs, packages, downlines, registered, admin, allowance, NFTQueBalance, limitUtilized, NFTque

    , levelIncome,
    referralIncome,
    tradingIncome, walletBalance, packageExpiryLimit,
    status, error, 
  } = useSelector((state) => state.contract);

  const now = new Date().getTime() / 1000

  const canBuy = () => {
    const nowSec = Math.floor(Date.now() / 1000); // current time in seconds

    // 1️⃣ Check package expiry
    const packageValid = nowSec - Number(Package.packageUpgraded) <= packageExpiryLimit;

    // 2️⃣ Calculate remaining trading limit
    const remainingLimit = Number(formatEther(Package.limit)) - Number(revisedLimitUtilized);

    // 3️⃣ Calculate NFT total cost (price + 7%)
    const nftValue =
      Number(nft.price) * 0.07 + Number(formatEther(nft.premium));

    // 4️⃣ Now check both conditions sequentially
    if (!packageValid) {
      return {
        cond: false,
        msg: "Your package is expired.",
      };
    }
    console.log("object",remainingLimit,nftValue+50);

    if (remainingLimit < nftValue+50) {
      return {
        cond: false,
        msg: "Your trade limit is exceeding.",
      };
    }

    if (walletBalance < nftValue) {
      return {
        cond: false,
        msg: "Insufficient USDT Balance.",
      };
    }

    // ✅ Both conditions satisfied
    return {
      cond: true,
      msg: "You can buy this NFT.",
    };
  };






  const dispatch = useDispatch()
  // useEffect(() => {
  //   const abc = async () => {


  //     const res = await axios.get(nft.uri)


  //     if (nft._owner != "0x0000000000000000000000000000000000000000") {
  //       setImage(res.data.image)
  //       setName(res.data.name)
  //     }

  //   }

  //   abc()

  // }, [])


  const handleBuy2 = async (id) => {

    await executeContract({
      config,
      functionName: "buyNFT",
      args: [id],
      onSuccess: (txHash, receipt) => {
        console.log("🎉 Tx Hash:", txHash);
        console.log("🚀 Tx Receipt:", receipt);
        dispatch(readName({ address: receipt.from }));
        toast.success("NFT Bought Successfully")
        setToggle(!toggle)
        setLoading(false)
      },
      onError: (err) => {
        setLoading(false)
        let reason = extractRevertReason(err)
        toast.error("This Trade is not available", reason)
      },
    });
  }


  const handleBuy = async (id) => {
    // if (allowance >= (nfts[id].price+nfts[id].premium)) {

    //     handleBuy2(id, address)
    // } else {

    const { cond, msg } = canBuy()

    if (cond) {
      setLoading(true)
      const value = Number(nft.price * .07) + Number(formatEther(nft.premium))+0.001
      console.log("value", Number(value).toFixed(8))
      await executeContract({
        config,
        functionName: "approve",
        args: [mlmcontractaddress, parseEther(Number(value).toFixed(8))],
        onSuccess: () => handleBuy2(id, address),
        onError: (err) => {
          setLoading(false)
          let reason = extractRevertReason(err)
          toast.error("Transaction failed:", reason)
        },
        contract: usdtContract
      });
    } else {
      toast.error(msg)
    }

    //        }


  };

  console.log("nft",image,name);

  const isLoading = !image || !name;

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

    <div className="nft-card bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
      {/* Image Section */}
      <div className="h-48 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 relative">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info Section */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg truncate">
            {name} Token Id #{index}
          </h3>

          <div className="text-xs text-gray-500 mb-2 break-all">
            Owner: {formatAddress(nft._owner)}
          </div>

          <div className="text-2xl font-bold text-blue-600 mb-3">
            ${Number(nft.price * 1.07).toFixed(2)}
          </div>
        </div>

        {/* Buy Button */}
        {address !== nft._owner && (
          <button
            onClick={() => handleBuy(nft.id)}
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {loading ? (
              <>
                <Spinner size={20} color="#fff" />
                <span>Processing...</span>
              </>
            ) : (
              'Buy Now'
            )}
          </button>
        )}
      </div>
    </div>

    // <div
    //     key={index}
    //     className="collectionfulgrid  shadow-md rounded-xl overflow-hidden flex flex-col hover:shadow-xl transition"
    // >
    //     {/* Image (80% height) */}
    //     <div className="flex-1">
    //         <img
    //             src={image}
    //             alt={name}
    //             className="h-full w-full object-cover"
    //         />
    //     </div>

    //     {/* Info (20% height) */}
    //     <div className="p-3 bg-gray-100 text-sm space-y-1 nftgridss">
    //         <h3>
    //             <span className="font-semibold">Name:</span> {name}
    //         </h3>
    //         <p className="truncate">
    //             <span className="font-semibold">Owner:</span> {`${nft._owner.slice(0, 4)}...${nft._owner.slice(-4)}`}
    //         </p>

    //         {/* Price + Buy Button */}
    //         <div className="flex items-center justify-between">
    //             <h5>
    //                 <span className="font-semibold">Price:</span> {Number(formatEther(nft.price)*1.07).toFixed(2) } $
    //             </h5>
    //             {address != nft._owner && <button
    //                 onClick={() => handleBuy(nft.id)}
    //                 className="bg-blue-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-blue-700 transition"
    //             >
    //                 Buy
    //             </button>}
    //         </div>
    //     </div>
    // </div>


  )
}