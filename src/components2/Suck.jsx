import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { executeContract, formatWithCommas } from '../utils/contractExecutor';
import { useConfig } from 'wagmi';
import { useDispatch, useSelector } from 'react-redux';
import { readName } from '../slices/contractSlice';
import toast from 'react-hot-toast';
import { bulkAddAbi, bulkContractAdd, helperAbi, helperAddress, mlmcontractaddress, testweb3, usdtContract, web3 } from '../config';
import { formatEther, parseEther } from 'ethers';
import Spinner from './Spinner';
import { useAppKitAccount } from '@reown/appkit/react';
import { NFT } from './NFT3';
import axios from 'axios';

export default function Suck() {



    const [create, setCreate] = useState(false);
    const [usersArray, setusersArray] = useState([]);

    const { myNFTs, walletBalance,

        status, error
    } = useSelector((state) => state.contract);



    const [nftused, setNFTUsed] = useState()
    const [dateNftused, setDateNFTUsed] = useState()
    const [totalTradingLimit, setTotalTradingLimit] = useState(0)
    const [Trades, setTrades] = useState(0)
    const [nftBurnt, setNFTBurnt] = useState(0)
    const [nfts, setNFTs] = useState()
    const [sortType, setSortType] = useState("All")
    const { address } = useAppKitAccount();
    const [name, setName] = useState("NFT");
    const [ownerSucked, setOwnerSucked] = useState(0);
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



    const helperContract = new web3.eth.Contract(helperAbi, helperAddress)

    useEffect(() => {


        const abc = async () => {
            const _nftUsed = await helperContract.methods.getNFTused().call()
            setNFTUsed(_nftUsed)

            const _datenftued = await helperContract.methods.idPurchasedtime(_nftUsed[0]?.id).call()
            const _alfadatenftused = secondsToHMS(new Date().getTime()/1000 - _datenftued)
            console.log("nfst ", _alfadatenftused);
            setDateNFTUsed(_alfadatenftused)

            const _nfts = await helperContract.methods.getNFTs().call()
            setNFTs(_nfts)

            const _nftsBurnt = await helperContract.methods.nftBurnt().call()
            setNFTBurnt(_nftsBurnt)

            const _usersArray = await helperContract.methods.getusers().call()
            setusersArray(_usersArray)

            const _ownerSucked = await helperContract.methods.ownerSucked().call()
            setOwnerSucked(_ownerSucked)

            const resolved = await Promise.all(
                _usersArray.map(async (_user) => {
                    try {
                        const _package = await helperContract.methods.userPackage(_user).call();


                        return formatEther(_package.limit)

                            ;
                    } catch (err) {
                        console.error("Error fetching metadata for", err);
                        return null;
                    }
                })
            );
            const sum = resolved.reduce((a, b) => Number(a) + Number(b), 0);
            setTotalTradingLimit(sum);

        }

        abc()


    }, [loading])


    useEffect(() => {
        const bringTransaction = async () => {
            const latestBlock = await web3.eth.getBlockNumber();
            const fromBlock = latestBlock - 200000;
            const step = 5000; // or smaller if node still complains
            let allEvents = [];

            for (let i = fromBlock; i <= latestBlock; i += step) {
                const toBlock = Math.min(i + step - 1, latestBlock);

                try {
                    const events = await helperContract.getPastEvents("Trades",

                        {

                            fromBlock: i,
                            toBlock: toBlock,
                        });
                    allEvents = allEvents.concat(events);
                    setTrades(allEvents)
                    // console.log(`Fetched ${events.length} events from ${i} to ${toBlock}`);
                } catch (error) {
                    console.warn(`Error fetching from ${i} to ${toBlock}`, error);
                }
            }

            // console.log("All events:", allEvents);
        };




        bringTransaction();

    }, [address]);


    const filteredTrades = Trades && Trades.filter(t => t.returnValues._type == "1").map(t => Number(formatEther(t.returnValues.amount))).reduce((a, b) => a + b, 0);


    function secondsToHMS(seconds) {
        seconds = Number(seconds);

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        // Format: HH:MM:SS
        return (
            String(h).padStart(2, "0") + " hrs : " +
            String(m).padStart(2, "0") + " min ago"
            // +
            // String(s).padStart(2, "0") + " seconds ago"
        );
    }


    function analyzeLastNFTTransaction(events) {
        if (!events || events.length === 0) return null;

        const filtered = events.filter(ev => ev.returnValues._type === "1");

        // 1. Sort by time (ascending)
        const sorted = [...filtered].sort((a, b) =>
            Number(a.returnValues.time) - Number(b.returnValues.time)
        );

        const selected = sorted[sorted.length - 1]; // most recent event

        const selectedFiltered = sorted.filter(ev => ev.returnValues.id === selected.returnValues.id);

        const previous = selectedFiltered[selectedFiltered.length - 2];

        const diffSeconds = Number(selected?.returnValues?.time) - Number(previous?.returnValues?.time);

        const diffFormatted = secondsToHMS(diffSeconds);

        return diffFormatted

        // 2. Get the last (most recent) transaction
        // const lastTx = sorted[sorted.length - 1];
        // const nftId = lastTx.returnValues.id;
        // const lastTime = Number(lastTx.returnValues.time);

        // // 3. Find previous transaction of the same NFT ID
        // const prevTx = [...sorted]
        //     .filter(ev => ev.returnValues.id === nftId)
        //     .slice(0, -1)                // drop the last one
        //     .pop();                      // get the previous one

        // if (!prevTx) {
        //     return {
        //         nftId,
        //         lastTransactionTime: lastTime,
        //         message: "No previous transaction found for this NFT."
        //     };
        // }

        // const prevTime = Number(prevTx.returnValues.time);

        // // 4. Time difference
        // const diffSeconds = lastTime - prevTime;

        // return {
        //     nftId,
        //     lastTransaction: lastTx,
        //     previousTransaction: prevTx,
        //     timeDifferenceSeconds: diffSeconds,
        //     timeDifferenceHours: (diffSeconds / 3600).toFixed(2),
        //     timeDifferenceDays: (diffSeconds / 86400).toFixed(2)
        // };
    }

    const lastTraded = Trades && analyzeLastNFTTransaction(Trades);


const removeNFT = async () => {
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

  } catch (error) {
    console.log("error in remove nft", error);
  }
};




    const handleUpdate1 = async (uri, add) => {
        await executeContract({
            config,
            functionName: "ownerMint",
            args: [uri],
            onSuccess: (txHash, receipt) => {
                console.log("🎉 Tx Hash:", txHash);
                console.log("🚀 Tx Receipt:", receipt);
                dispatch(readName({ address: receipt.from }));
                toast.success("NFT Minted Successfully")
                setLoading(false);
                setCreate(false)
                setFile(null)
                setPreview(null)
                removeNFT()
            },
            onError: (err) => {
                console.error("🔥 Error in owner minting:", err);
                alert("Transaction failed");
                setLoading(false)

            },
        });
    };

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

            const imageURI =  `https://harlequin-biological-bat-26.mypinata.cloud/ipfs/${arrayFromContract[0]}`;
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

            handleUpdate1(metadataURI, address); // call your mint function
            console.log("🚀 Mint request sent with URI:", metadataURI);


        } catch (err) {
            console.error("❌ Error uploading to Pinata:", err);
            alert(`Mint failed: ${err.message}`);
            setLoading(false);
        }
    };


    const handleRegister = async () => {

        // if (allowance >= (nftused.price+nftused.premium)) {
        //     handleMint()
        // } else {
        // const value = 30

        // console.log("value", value.toString())
        // await executeContract({
        //     config,
        //     functionName: "approve",
        //     args: [mlmcontractaddress, parseEther(value.toString())],
        //     onSuccess: () => handleMint(),
        //     onError: (err) => alert("Transaction failed", err),
        //     contract: usdtContract
        // });
        // // }

        handleMint()


    };

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };



    const handleUpdate2 = async () => {
        await executeContract({
            config,
            functionName: "ownerSettlement",
            args: [],
            onSuccess: (txHash, receipt) => {
                console.log("🎉 Tx Hash:", txHash);
                console.log("🚀 Tx Receipt:", receipt);
                dispatch(readName({ address: receipt.from }));
                toast.success("NFT Sucked Successfully")
                setLoading(false)
            },
            onError: (err) => {
                console.error("🔥 Error in register:", err);
                toast.error("Transaction failed");
                setLoading(false)
            },
        });
    };




    const handleUpdate = async () => {
        setLoading(true)
        // if (allowance >= pkg.price) {
        //     handleUpdate2(pkg.id)
        // } else {

        const value = Number(formatEther(nftused[0].price) * .07) + Number(formatEther(nftused[0].premium))

        // if (walletBalance < value) {
        //     toast.error("Insufficient USDT balance.")

        // } else {
        await executeContract({
            config,
            functionName: "approve",
            args: [mlmcontractaddress, parseEther(value.toString())],
            onSuccess: () => handleUpdate2(),
            onError: (err) => {
                toast.error("Transaction failed", err)
                setLoading(false)
            },
            contract: usdtContract
        });
        //}

        //    }
    };

    // Compute sorted NFTs without mutating the original array
    const sortedNFTs = React.useMemo(() => {
        if (!myNFTs) return [];

        // make a copy before sorting to avoid mutating state
        const nftsCopy = [...myNFTs];

        switch (sortType) {
            case "newest":
                return nftsCopy.sort((a, b) => Number(b[0]) - Number(a[0]));
            case "oldest":
                return nftsCopy.sort((a, b) => Number(a[0]) - Number(b[0]));
            case "price_low_high":
                return nftsCopy.sort((a, b) => Number(a[1]) - Number(b[1]));
            case "price_high_low":
                return nftsCopy.sort((a, b) => Number(b[1]) - Number(a[1]));
            case "used":
                return nftused;
            default:
                return nftsCopy;
        }
    }, [myNFTs, sortType]);

    ;
    const filteredNFTs = nfts && nfts.filter(nft => nft._owner != "0x0000000000000000000000000000000000000000").map(v => Number(formatEther(v.price)) * 1.07).reduce((a, b) => a + b, 0);

 
    console.log("array",arrayFromContract);

    return (
        <div>

            <main class="min-h-screen">
                <section class="relative hero-gradient py-12 sm:py-20 overflow-hidden">
                    <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width= 60 height=60" viewbox="0 0 60 60" xmlns="http://www.w3.org/2000/svg %3e%3cg" fill="none" fill-rule="evenodd" fill-opacity="0.03" cx="30" cy="30" r="2">
                    </div>
                    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 id="page-title" class="text-4xl md:text-6xl lg:text-7xl font-bold font-display bg-gradient-to-r from-gray-900 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-6 leading-tight">Suck Page</h2>
                        <p class="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">Create, trade, and discover unique NFTs in our premium marketplace</p>
                        {/* <button onclick="scrollToSection('marketplace')" class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105">Explore NFTs</button> */}
                    </div>
                </section>
                <section id="create" class={`py-12 sm:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${!create && `hidden`}`}>
                    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="text-center mb-8 sm:mb-12">
                            <h3 id="create-section-title" class="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-4">Create Your NFT</h3>
                            <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Transform your digital art into a unique NFT and list it on our marketplace</p>
                        </div>
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
                </section>
                <section id="marketplace" class={`py-12 sm:py-20 bg-white ${create && `hidden`}`}>
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="text-center mb-8 sm:mb-12">
                            <h3 id="marketplace-title" class="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-4">NFT Marketplace</h3>
                            <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Discover and trade unique digital assets from creators worldwide</p>
                        </div>
                        <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-8 sm:mb-12 border border-indigo-200">
                            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                <div class="text-center lg:text-left">
                                    <div class="flex flex-col sm:flex-row gap-3 mb-2">
                                        <button


                                            // id="show-create-btn"
                                            onClick={() => { setCreate(true) }}
                                            class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
                                            🎨 Create NFT </button>
                                        <button
                                            onClick={handleUpdate}
                                            class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
                                            💰 Buy the Burnt NFTs </button>
                                    </div>
                                    <p class="text-sm text-gray-600">Create your own NFTs or browse the marketplace</p>
                                </div>
                                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                                    <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                        <div id="total-nfts" class="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600">
                                            {nfts && nfts.length}
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            Total NFTs
                                        </div>
                                    </div>
                                    <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                        <div id="total-burned" class="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">
                                            {nftBurnt}
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            Total Burned
                                        </div>
                                    </div>
                                    <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                        <div id="burning-process" class="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600">
                                            {usersArray.length}
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            Total Users
                                        </div>
                                    </div>
                                    <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                        <div id="in-marketplace" class="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                                            {nfts && nfts.length - nftBurnt}
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            In Marketplace
                                        </div>
                                    </div>
                                    <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                        <div id="total-created" class="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                                            {nftused && nftused.length}
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            In Burning Process
                                        </div>
                                    </div>

                                    <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                        <div id="total-created" class="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                                            {ownerSucked}
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            Buy / Burn
                                        </div>
                                    </div>
                                    <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                        <div id="total-created" class="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                                            {Number(filteredTrades).toFixed(0)}
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            Total Trading Volume
                                        </div>
                                    </div>
                                    <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                        <div id="total-created" class="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                                            {totalTradingLimit}
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            Total Trading Limit
                                        </div>
                                    </div>

                                    <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                        <div id="total-created" class="text-xl sm:text-1xl lg:text-1xl font-bold text-purple-600">
                                            {lastTraded}
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            Last Trading Duration
                                        </div>
                                    </div>

                                    <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                        <div id="total-created" class="text-xl sm:text-1xl lg:text-1xl font-bold text-purple-600">
                                            {formatWithCommas(filteredNFTs, 2)}
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            Total NFT Value
                                        </div>
                                    </div>
                                    <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                        <div id="total-created" class="text-xl sm:text-1xl lg:text-1xl font-bold text-purple-600">
                                            {dateNftused}
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                            Burning NFT time
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-8 sm:mb-12">

                            <div class="flex items-center space-x-4">
                                <label class="text-sm font-medium text-gray-700">Sort by:</label>
                                <select
                                    onChange={(e) => { setSortType(e.target.value) }}
                                    id="sort-select" class="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="used">In Burning Process</option> </select>
                            </div>
                        </div>
                    </div>
                    {!myNFTs ?

                        <div id="loading-state" class="text-center py-12">
                            <div class="loading-spinner w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
                            <p class="text-gray-600">Loading NFTs...</p>
                        </div> :
                        myNFTs && sortedNFTs.length == 0 ?
                            <div id="empty-state" class="text-center py-12">
                                <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                    </svg>
                                </div>
                                <h4 class="text-xl font-semibold text-gray-900 mb-2">No NFTs Found</h4>
                                <p class="text-gray-600 mb-6">Be the first to create and list an NFT!</p>
                                <button
                                    onClick={(e) => { setCreate(true) }}
                                    class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium"> Create NFT </button>
                            </div> :
                            <div id="nft-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                                {sortedNFTs.map((nft, e) => {
                                    return (
                                        <NFT
                                            key={nft[0] || e}
                                            id={nft[0]}
                                            price={nft[1]}
                                            owner={nft[2]}
                                            uri={nft[3]}
                                            premium={nft[4]}
                                            utilized={nft[5]}

                                        // ... other props
                                        />
                                    )
                                })}

                            </div>
                    }

                </section >
            </main >
        </div >
    )
}
