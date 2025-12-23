import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { bulkAddAbi, bulkContractAdd, fetcherAbi, fetcherAddress, helperAbi, helperAddress, mlmcontractaddress, testweb3, usdtContract, web3 } from "../config";
import UserListDemo from "./UserListDemo";
import { formatEther, parseEther } from "ethers";
import { useAppKitAccount } from "@reown/appkit/react";
import { executeContract, formatWithCommas } from "../utils/contractExecutor";
import { useConfig } from "wagmi";
import { useDispatch } from "react-redux";
import { readName } from "../slices/contractSlice";
import toast from "react-hot-toast";



const contractABI = bulkAddAbi;
const contractAddress = bulkContractAdd;
const web31 = testweb3;
const contract = new web31.eth.Contract(contractABI, contractAddress);

const MyForm = () => {
    const [newList, setNewList] = useState("");
    const [populationSize, setPopulationSize] = useState(0);
    const [searchText, setSearchText] = useState("");
    const config = useConfig()
    const [nfts, setNFTs] = useState()
    const [oldElements, setOldElements] = useState("");
    const [loading, setLoading] = useState(false);
    const [array, setArray] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const fetcherContract = new web3.eth.Contract(fetcherAbi, fetcherAddress)
    const saveContract = new testweb3.eth.Contract(bulkAddAbi, bulkContractAdd);
    const [nftused, setNFTUsed] = useState()
    const [dateNftused, setDateNFTUsed] = useState()
    const [nftBurnt, setNFTBurnt] = useState(0)
    const [usersArray, setusersArray] = useState([]);
    const [ownerSucked, setOwnerSucked] = useState(0);
    const [totalTradingLimit, setTotalTradingLimit] = useState(0)
    const [Trades, setTrades] = useState(0)
    const { address } = useAppKitAccount();
    const [search, setSearch] = useState("");
    const [create, setCreate] = useState(false);
    const [nftNo, setnftNo] = useState(0);
    const dispatch = useDispatch()
    const [sortType, setSortType] = useState("All")

    useEffect(() => {
        const abc = async () => {
            try {
                const arrayStart = await contract.methods.arrayToStart().call();
                setNewList(arrayStart)
                const oldEle = await contract.methods.getUnitArray().call();
                const removedOldElement = oldEle.slice(10);



                const _nfts = await fetcherContract.methods.getNFTs().call();
                const populationSizeFromContract = await saveContract.methods.populationSize().call();
                setPopulationSize(populationSizeFromContract);

                const idThreshold = await saveContract.methods.arrayToStart().call();


                // Convert removedOldElement to a Set for O(1) lookup
                const removedSet = removedOldElement.map(id => String(id));

                const secondArray = _nfts
                    .filter(nft =>
                        Number(nft.id) < Number(idThreshold) &&
                        !removedSet.includes(String(nft.id))
                    )
                    .sort((a, b) => Number(a.purchasedTime) - Number(b.purchasedTime))
                    .map(nft => nft.id);



                console.log("Filtered secondArray:", secondArray, removedOldElement);




                setArray(secondArray)


            } catch (error) {
                console.log("error in use effect".error);
            }
        }

        abc();

    }, [loading]);



    const helperContract = new web3.eth.Contract(helperAbi, helperAddress)
    useEffect(() => {


        const abc = async () => {
            const _nftUsed = await helperContract.methods.getNFTused().call()
            setNFTUsed(_nftUsed)

            const _datenftued = await helperContract.methods.idPurchasedtime(_nftUsed[0]?.id).call()
            const _alfadatenftused = secondsToHMS(new Date().getTime() / 1000 - _datenftued)

            setDateNFTUsed(_alfadatenftused)

            const _nfts = await fetcherContract.methods.getNFTs().call()
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


    const now = Math.floor(Date.now() / 1000);

    const todayStart = () => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return Math.floor(d.getTime() / 1000);
    };

    const yesterdayStart = () => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        d.setHours(0, 0, 0, 0);
        return Math.floor(d.getTime() / 1000);
    };

    //const TTV24Hrs = Trades && Trades.filter(t => t.returnValues._type == "1").map(t => Number(formatEther(t.returnValues.amount)) + 50).reduce((a, b) => a + b, 0);

    const TTV24Hrs =
        Trades &&
        Trades
            .filter(t =>
                t.returnValues._type === "1" &&
                Number(t.returnValues.time) >= now - 24 * 60 * 60
            )
            .map(t => Number(formatEther(t.returnValues.amount)) + 50)
            .reduce((a, b) => a + b, 0);




    const TTV12Hrs =
        Trades &&
        Trades
            .filter(t =>
                t.returnValues._type === "1" &&
                Number(t.returnValues.time) >= now - 12 * 60 * 60
            )
            .map(t => Number(formatEther(t.returnValues.amount)) + 50)
            .reduce((a, b) => a + b, 0);

    const TTV6Hrs =
        Trades &&
        Trades
            .filter(t =>
                t.returnValues._type === "1" &&
                Number(t.returnValues.time) >= now - 6 * 60 * 60
            )
            .map(t => Number(formatEther(t.returnValues.amount)) + 50)
            .reduce((a, b) => a + b, 0);

    const TTV1Hr =
        Trades &&
        Trades
            .filter(t =>
                t.returnValues._type === "1" &&
                Number(t.returnValues.time) >= now - 1 * 60 * 60
            )
            .map(t => Number(formatEther(t.returnValues.amount)) + 50)
            .reduce((a, b) => a + b, 0);

    const TTVToday =
        Trades &&
        Trades
            .filter(t =>
                t.returnValues._type === "1" &&
                Number(t.returnValues.time) >= todayStart()
            )
            .map(t => Number(formatEther(t.returnValues.amount)) + 50)
            .reduce((a, b) => a + b, 0);

    const TTVYesterday =
        Trades &&
        Trades
            .filter(t =>
                t.returnValues._type === "1" &&
                Number(t.returnValues.time) >= yesterdayStart() &&
                Number(t.returnValues.time) < todayStart()
            )
            .map(t => Number(formatEther(t.returnValues.amount)) + 50)
            .reduce((a, b) => a + b, 0);




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


    const lastTraded1 = nfts && [...nfts].sort((a, b) =>
        Number(a.purchasedTime) - Number(b.purchasedTime)
    )  // && analyzeLastNFTTransaction(Trades);

    const selected = nfts && lastTraded1[lastTraded1.length - 1]; // most recent event

    const selectedFiltered = Trades && Trades.filter(ev => ev.returnValues.id === selected?.id);

    const previous = selectedFiltered && selectedFiltered[selectedFiltered.length - 3];

    const diffSeconds = Number(selected?.purchasedTime) - Number(previous?.returnValues?.time);

    let lastTraded;

    if (Number.isFinite(diffSeconds)) {
        lastTraded = secondsToHMS(diffSeconds);
    } else {
        lastTraded = "More than 24 hours ago.";
    }

    const handleSetArrayStart = async () => {
        setLoading(true);
        try {
            const account = web31.eth.accounts.privateKeyToAccount(
                import.meta.env.VITE_PRIVATE_KEY
            );
            web31.eth.accounts.wallet.add(account);

            const tx = contract.methods.setArrayStart(Number(newList));
            const gas = await tx.estimateGas({ from: account.address });
            const data = tx.encodeABI();

            const txData = {
                from: account.address,
                to: contract.options.address,
                data,
                gas,
            };

            const signedTx = await account.signTransaction(txData);
            const receipt = await web31.eth.sendSignedTransaction(
                signedTx.rawTransaction
            );

            console.log("tx hash:", receipt.transactionHash);
        } catch (error) {
            console.error("Error in setArrayStart:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnitToEnter = async () => {
        setLoading(true);
        try {
            const account = web31.eth.accounts.privateKeyToAccount(
                import.meta.env.VITE_PRIVATE_KEY
            );
            web31.eth.accounts.wallet.add(account);

            const tx = contract.methods.unitToEnter(Number(oldElements));
            const gas = await tx.estimateGas({ from: account.address });
            const data = tx.encodeABI();

            const txData = {
                from: account.address,
                to: contract.options.address,
                data,
                gas,
            };

            const signedTx = await account.signTransaction(txData);
            const receipt = await web31.eth.sendSignedTransaction(
                signedTx.rawTransaction
            );

            console.log("tx hash:", receipt.transactionHash);
        } catch (error) {
            console.error("Error in unitToEnter:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredArray = array && array.filter((value) =>
        value.toString().includes(searchText)
    );


    const handlePopulationSize = async () => {
        setLoading(true);
        try {
            const account = web31.eth.accounts.privateKeyToAccount(
                import.meta.env.VITE_PRIVATE_KEY
            );
            web31.eth.accounts.wallet.add(account);

            const tx = contract.methods.setPopulation(Number(populationSize));
            const gas = await tx.estimateGas({ from: account.address });
            const data = tx.encodeABI();

            const txData = {
                from: account.address,
                to: contract.options.address,
                data,
                gas,
            };

            const signedTx = await account.signTransaction(txData);
            const receipt = await web31.eth.sendSignedTransaction(
                signedTx.rawTransaction
            );

            console.log("tx hash:", receipt.transactionHash);
        } catch (error) {
            console.error("Error in handlePopulationSize:", error);
        } finally {
            setLoading(false);
        }
    };


    const filteredNFTs = nfts && nfts.filter(nft => nft._owner != "0x0000000000000000000000000000000000000000").map(v => Number(formatEther(v.price)) * 1.07).reduce((a, b) => a + b, 0);


    const filteredNFTs1 = nftused?.filter((nft) => {
        const query = search.toLowerCase();
        return (
            nft.id.toString().includes(query) ||
            nft._owner.toLowerCase().includes(query)
        );
    });


    const handleUpdate2 = async () => {
        await executeContract({
            config,
            functionName: "ownerSettlement",
            args: [nftNo],
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



    return (
        <div

class="relative hero-gradient py-12 sm:py-20 overflow-hidden"
        // style={{
            //     maxWidth: "450px",
            //     margin: "50px auto",
            //     padding: "30px",
            //     borderRadius: "12px",
            //     boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            //     backgroundColor: "#f9f9f9",
            //     fontFamily: "Arial, sans-serif",
            // }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>
                NFT Array Manager
            </h2>

            {/* <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                    New List to Start With:
                </label>
                <input
                    type="number"
                    value={newList}
                    onChange={(e) => setNewList(e.target.value)}
                    placeholder="Enter a number"
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        marginBottom: "10px",
                        fontSize: "16px",
                    }}
                />
                <button
                    onClick={handleSetArrayStart}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    {loading ? "Processing..." : "Set Array Start"}
                </button>
            </div> */}


            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                    Total size of population for random selection:
                </label>
                <input
                    type="number"
                    value={populationSize}
                    onChange={(e) => setPopulationSize(e.target.value)}
                    placeholder="Enter a population size"
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        marginBottom: "10px",
                        fontSize: "16px",
                    }}
                />
                <button
                    onClick={handlePopulationSize}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    {loading ? "Processing..." : "Set Population Size"}
                </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                    Number of NFT to Include in new list:
                </label>

                <div style={{ position: "relative" }}>
                    {/* Dropdown Trigger */}
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            fontSize: "16px",
                            cursor: "pointer",
                            background: "#fff",
                        }}
                    >
                        {oldElements ? oldElements : "Select number nft id of old list"}
                    </div>

                    {/* Dropdown Panel */}
                    {isOpen && (
                        <div
                            style={{
                                position: "absolute",
                                width: "100%",
                                background: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                marginTop: "4px",
                                zIndex: 10,
                                maxHeight: "220px",
                                overflowY: "auto",
                            }}
                        >
                            {/* Search inside dropdown */}
                            <input
                                type="text"
                                placeholder="Search NFT ID..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    border: "none",
                                    borderBottom: "1px solid #eee",
                                    outline: "none",
                                }}
                            />

                            {/* Options */}
                            {filteredArray.length === 0 ? (
                                <div style={{ padding: "8px", color: "#888" }}>
                                    No results found
                                </div>
                            ) : (
                                filteredArray.map((value) => (
                                    <div
                                        key={value}
                                        onClick={() => {
                                            setOldElements(value);
                                            setIsOpen(false);
                                            setSearchText("");
                                        }}
                                        style={{
                                            padding: "8px 10px",
                                            cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background = "#f5f5f5")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = "#fff")
                                        }
                                    >
                                        {value}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>



                <button
                    onClick={handleUnitToEnter}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#2196F3",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    {loading ? "Processing..." : "Enter Units"}
                </button>
            </div>


            <>
                <div class="text-center mb-8 sm:mb-12">
                    <h3 id="marketplace-title" class="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-4">NFT Marketplace</h3>
                    <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Discover and trade unique digital assets from creators worldwide</p>
                </div>
                <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-8 sm:mb-12 border border-indigo-200">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

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
                                    {nfts && nfts.length}
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
                                    {Number(TTV24Hrs).toFixed(0)}
                                </div>
                                <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                    TTV- 24 hours
                                </div>
                            </div>
                            <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                <div id="total-created" class="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                                    {Number(TTV12Hrs).toFixed(0)}
                                </div>
                                <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                    TTV- 12 hours
                                </div>
                            </div>
                            <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                <div id="total-created" class="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                                    {Number(TTV6Hrs).toFixed(0)}
                                </div>
                                <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                    TTV- 6 hours
                                </div>
                            </div>
                            <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                <div id="total-created" class="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                                    {Number(TTV1Hr).toFixed(0)}
                                </div>
                                <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                    TTV- 1 hour
                                </div>
                            </div>
                            <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                <div id="total-created" class="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                                    {Number(TTVToday).toFixed(0)}
                                </div>
                                <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                    TTV- Today
                                </div>
                            </div>
                            <div class="text-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                                <div id="total-created" class="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                                    {Number(TTVYesterday).toFixed(0)}
                                </div>
                                <div class="text-xs sm:text-sm text-gray-600 font-medium">
                                    TTV- yesterday
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
            </>


        </div>
    );
};

export default MyForm;
