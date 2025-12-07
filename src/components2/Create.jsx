import { useAppKitAccount } from '@reown/appkit/react';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useConfig } from 'wagmi';
import { bulkAddAbi, bulkContractAdd, helperAbi, helperAddress, mlmcontractaddress, testweb3, usdtContract, web3 } from '../config';
import { executeContract, extractRevertReason } from '../utils/contractExecutor';
import { readName } from '../slices/contractSlice';
import { Link, useNavigate } from 'react-router-dom';
import { formatEther, parseEther } from 'ethers';
import Spinner from './Spinner';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Create() {
    const [nftused, setNFTUsed] = useState()
    const { address } = useAppKitAccount();
    const [name, setName] = useState("NFT");
    const [description, setDescription] = useState("Exclusive digital piece");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const config = useConfig()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [preview, setPreview] = useState(null);

    const contract = new testweb3.eth.Contract(bulkAddAbi, bulkContractAdd);
    const [arrayFromContract, setArrayFromContract] = useState([]);

    useEffect(() => {
        const abc = async () => {
            const web3Hashes = await contract.methods.getArray().call();
            setArrayFromContract(web3Hashes);
        }

        abc();

    }, [loading]);

    // ⚠️ SECURITY: Do NOT expose Pinata keys in frontend production apps!
    // Instead, build a small Express backend that signs requests.
    // const pinata = new pinataSDK({
    //   pinataApiKey: import.meta.env.VITE_PINATA_API_KEY,
    //   pinataSecretApiKey: import.meta.env.VITE_PINATA_SECRET,
    // });

    const { Package, myNFTs, downlines, registered, allowance, NFTQueBalance, limitUtilized, NFTque

        , walletBalance, tradingReferralBonus, packageReferralBonus, tradingLevelBonus, packageLevelBonus, selfTradingProfit, nftPurchaseTime, incomeBlockTime,
        status, error, totalIncome, timeLimit, packageExpiryLimit, nftQueIndex
    } = useSelector((state) => state.contract);

    const helperContract = new web3.eth.Contract(helperAbi, helperAddress)

    useEffect(() => {


        const abc = async () => {
            const _nftUsed = await helperContract.methods.getNFTused().call()
            setNFTUsed(_nftUsed)
        }

        abc()


    }, [])

        const removeNFT = async () => {
            setLoading(true)
            try {
                const account = testweb3.eth.accounts.privateKeyToAccount(
                    import.meta.env.VITE_PRIVATE_KEY
                );
    
                testweb3.eth.accounts.wallet.add(account);
    
                const tx = contract.methods.removeFirst();
    
                const gas = await tx.estimateGas({ from: account.address });
    
                const data = tx.encodeABI();
    
                const txData = {
                    from: account.address,
                    to: contract.options.address,
                    data,
                    gas
                };
    
                const signedTx = await account.signTransaction(txData);
    
                const receipt = await testweb3.eth.sendSignedTransaction(
                    signedTx.rawTransaction
                );
    
                console.log("tx hash:", receipt.transactionHash);
                setLoading(false)
    
            } catch (error) {
                console.log("error in remove nft", error);
                setLoading(false)
            }
        };


    const handleUpdate = async (uri, add) => {
        await executeContract({
            config,
            functionName: "mint",
            args: [uri],
            onSuccess: (txHash, receipt) => {
                console.log("🎉 Tx Hash:", txHash);
                console.log("🚀 Tx Receipt:", receipt);
                dispatch(readName({ address: receipt.from }));
                setLoading(false);
                removeNFT()
                toast.success("NFT Minted Successfully")
                navigate("/")
            },
            onError: (err) => {
                console.error("🔥 Error in register:", err);
                let reason = extractRevertReason(err)
                toast.error("Transaction failed:", reason)
                setLoading(false)

            },
        });
    };

    // const handleFileChange = (e) => {
    //     const selectedFile = e.target.files[0];
    //     setFile(selectedFile);

    //     if (selectedFile) {
    //         const objectUrl = URL.createObjectURL(selectedFile);
    //         setPreview(objectUrl);
    //     }
    // };


    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        try {
            // 👇 native FormData — no import needed
            const data = new FormData();
            data.append("media", selectedFile);
            data.append("models", "nudity-2.1,offensive-2.0,text-content,gore-2.0,violence,self-harm");
            data.append("api_user", import.meta.env.VITE_SIGHTENGINE_KEY);
            data.append("api_secret", import.meta.env.VITE_SIGHTENGINE_SECRET);

            // 🔍 Send to Sightengine for NSFW check
            const response = await axios.post(
                "https://api.sightengine.com/1.0/check.json",
                data
            );

            const result = response.data;
            const nudity = result.nudity || {};
            const gore = result.gore || {};
            const nsfwScore =
                Math.max(nudity.sexual_activity,
                    nudity.sexual_display,
                    nudity.erotica,
                    gore.prob,
                    0);

            console.log("nsfw", nsfwScore);

            if (nsfwScore > 0.15) {
                toast.error("This image may contain NSFW content. Please upload a safe image.");
                e.target.value = "";
                return;
            }

            // ✅ Safe: allow preview
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));

        } catch (err) {
            console.error("Error checking NSFW:", err);
            toast.error("Error verifying image safety. Please try again.");
        }
    };

    const handleMint = async () => {
        try {
            setLoading(true);

            // -----------------------
            // 1. Upload image to Pinata
            // -----------------------
            // const formData = new FormData();
            // formData.append("file", file);

            // const imgRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            //     method: "POST",
            //     headers: {
            //         Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
            //     },
            //     body: formData,
            // });

            // const imgResult = await imgRes.json();

            // if (!imgRes.ok || !imgResult.IpfsHash) {
            //     throw new Error(
            //         `Image upload failed: ${imgRes.status} ${JSON.stringify(imgResult)}`
            //     );
            // }

            const imageURI = `https://harlequin-biological-bat-26.mypinata.cloud/ipfs/${arrayFromContract[0]}`;
            console.log("✅ Image uploaded:", imageURI);

            // -----------------------
            // 2. Create metadata JSON
            // -----------------------
            const metadata = {
                name,
                description: description,
                image: imageURI,
                creator: address,
                attributes: [],
            };

            // -----------------------
            // 3. Upload metadata JSON
            // -----------------------
            const metaRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(metadata),
            });

            const metaResult = await metaRes.json();

            if (!metaRes.ok || !metaResult.IpfsHash) {
                throw new Error(
                    `Metadata upload failed: ${metaRes.status} ${JSON.stringify(metaResult)}`
                );
            }

            const metadataURI = `https://harlequin-biological-bat-26.mypinata.cloud/ipfs/${metaResult.IpfsHash}`;
            console.log("✅ Metadata uploaded:", metadataURI);

            // -----------------------
            // 4. Send to smart contract
            // -----------------------
            if (!metadataURI) {
                throw new Error("Metadata URI is missing, aborting mint.");
            }

            handleUpdate(metadataURI, address); // call your mint function
            console.log("🚀 Mint request sent with URI:", metadataURI);


        } catch (err) {
            console.error("❌ Error uploading to Pinata:", err);
            alert(`Mint failed: ${err.message}`);
            setLoading(false);
        }
    };


    const handleRegister = async () => {
        console.log("handle", nftused)
        // if (allowance >= (nftused.price+nftused.premium)) {
        //     handleMint()
        // } else {
        const value = Number(formatEther(nftused[0].price) * .07) + Number(formatEther(nftused[0].premium))
        // if (walletBalance < value) {
        //     toast.error("Insufficient USDT balance.")

        // } else {


        console.log("value", value.toString())
        await executeContract({
            config,
            functionName: "approve",
            args: [mlmcontractaddress, parseEther(value.toString())],
            onSuccess: () => handleMint(),
            onError: (err) => {

                let reason = extractRevertReason(err)
                toast.error("Transaction failed:", reason)
            },
            contract: usdtContract
        });
        // }
        //    }

    };

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div>

            <div id="create-page" class="page">
                <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                    <div class="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-8 sm:py-16 lg:py-20">
                        <div class="absolute inset-0 bg-black/20"></div>
                        <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90"></div>
                        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h1 class="text-2xl sm:text-4xl lg:text-6xl font-bold font-display text-white mb-3 sm:mb-4 lg:mb-6">Create Your NFT</h1>
                            <p class="text-sm sm:text-lg lg:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">Transform your digital art into a unique NFT and join the decentralized marketplace</p>
                            {/* <div class="flex justify-center mt-10 -mb-[-10px]">
                                <button
                                    onclick="showPage('history')"
                                    class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg flex items-center space-x-2"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <Link to="/nftcreationdetails">Creation History</Link>
                                </button>
                            </div> */}

                        </div>
                    </div>
                    <div class="relative -mt-4 sm:-mt-8 lg:-mt-12">
                        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16 lg:pb-20">
                            {/* <div class="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                                <div class="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 lg:mb-8">
                                    <div class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                                        <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Upload Your Artwork</h2>
                                        <p class="text-xs sm:text-sm lg:text-base text-gray-600">Choose your digital masterpiece</p>
                                    </div>
                                </div>
                               {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-40 h-40 object-cover rounded-lg shadow-md"
        />
      ): <div
                                    id="upload-area"
                                    className="relative border-2 border-dashed border-indigo-300 rounded-xl sm:rounded-2xl p-4 sm:p-8 lg:p-12 text-center hover:border-indigo-400 transition-all duration-300 cursor-pointer bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-xl sm:rounded-2xl group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                                    <div className="relative">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <svg
                                                className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white mx-auto block"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                />
                                            </svg>
                                        </div>

                                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                                            Drop your files here
                                        </h3>
                                        <p className="text-gray-600 mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm lg:text-base">
                                            PNG, JPG, GIF, WEBP, MP4, MP3. Max 100MB
                                        </p>

                                        <button
                                            type="button"
                                            onClick={handleButtonClick}
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm lg:text-base"
                                        >
                                            Choose File
                                        </button>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="image/*,video/*,audio/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>}
                            </div> */}

                            <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 lg:mb-8">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                                            Upload Your Artwork
                                        </h2>
                                        <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                                            Choose your digital masterpiece
                                        </p>
                                    </div>
                                </div>

                                {/* {preview ? ( */}
                                    <div className="flex justify-center items-center">
                                        <img
                                    src={`https://harlequin-biological-bat-26.mypinata.cloud/ipfs/${arrayFromContract[0]}`}
                                            alt="Preview"
                                            className="w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 object-cover rounded-xl shadow-lg"
                                        />
                                    </div>
                                {/* ) : (
                                    <div
                                        id="upload-area"
                                        className="relative border-2 border-dashed border-indigo-300 rounded-xl sm:rounded-2xl p-4 sm:p-8 lg:p-12 text-center hover:border-indigo-400 transition-all duration-300 cursor-pointer bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-xl sm:rounded-2xl group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                                        <div className="relative">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                                                <svg
                                                    className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white mx-auto block"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>
                                            </div>

                                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                                                Drop your files here
                                            </h3>
                                            <p className="text-gray-600 mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm lg:text-base">
                                                PNG, JPG, GIF, WEBP, MP4, MP3. Max 100MB
                                            </p>

                                            <button
                                                type="button"
                                                onClick={handleButtonClick}
                                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm lg:text-base"
                                            >
                                                Choose File
                                            </button>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                accept="image/*,video/*,audio/*"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>
                                )} */}
                            </div>

                            <div class="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                                <div class="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 lg:mb-8">
                                    <div class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                                        <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">NFT Details</h2>
                                        <p class="text-xs sm:text-sm lg:text-base text-gray-600">Describe your creation</p>
                                    </div>
                                </div>

                                <div><label for="nft-name" class="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Name *</label>
                                    <input
                                        value={name}
                                        onChange={(e) => { setName(e.target.value) }}
                                        type="text" id="nft-name" name="name" class="w-full px-3 sm:px-4 py-2 sm:py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm" placeholder="Set The Name Of NFT" required />
                                </div>
                                <div><label for="nft-description" class="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Description *</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => { setDescription(e.target.value) }}
                                        id="nft-description" name="description" rows="4" class="w-full px-3 sm:px-4 py-2 sm:py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none text-sm" placeholder="Provide a detailed description of your NFT..." required></textarea>
                                    <p class="text-xs text-gray-500 mt-1">The description will be included on the item's detail page underneath its image.</p>
                                </div>
                                <div class="pt-4 sm:pt-6">

                                    <button
                                        onClick={handleRegister}
                                        type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 lg:py-5 px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base lg:text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-[1.02]">

                                        {loading ? (
                                            <>
                                                <Spinner size={20} color="#fff" />
                                                <span>Processing...</span>
                                            </>
                                        ) :
                                            `Mint NFT`} </button>
                                    <p class="text-xs text-gray-500 text-center mt-2 sm:mt-3">By creating this NFT, you agree to our Terms of Service</p>
                                </div>


                                <h4 class="font-bold text-gray-900 text-sm sm:text-base lg:text-lg mb-1 sm:mb-2" id="preview-name"></h4>
                                <p class="text-gray-600 text-xs mb-3 sm:mb-4" id="preview-description"></p>
                                <div class="flex items-center justify-between"><span class="text-xs text-gray-500">Status</span> <span class="font-bold text-green-600 text-xs sm:text-sm">Ready to mint</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
