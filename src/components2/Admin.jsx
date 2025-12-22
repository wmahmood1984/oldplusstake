import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { bulkAddAbi, bulkContractAdd, fetcherAbi, fetcherAddress, testweb3, web3 } from "../config";
import UserListDemo from "./UserListDemo";



const contractABI = bulkAddAbi;
const contractAddress = bulkContractAdd;
const web31 = testweb3;
const contract = new web31.eth.Contract(contractABI, contractAddress);

const MyForm = () => {
    const [newList, setNewList] = useState("");
    const [populationSize, setPopulationSize] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [oldElements, setOldElements] = useState("");
    const [loading, setLoading] = useState(false);
    const [array, setArray] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const fetcherContract = new web3.eth.Contract(fetcherAbi, fetcherAddress)
    const saveContract = new testweb3.eth.Contract(bulkAddAbi, bulkContractAdd);



    useEffect(() => {
        const abc = async () => {
            try {
                const arrayStart = await contract.methods.arrayToStart().call();
                setNewList(arrayStart)
                const oldEle = await contract.methods.getUnitArray().call();
                const removedOldElement = oldEle.slice(10);



                const _nfts = await fetcherContract.methods.getNFTs().call();

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



    return (
        <div
            style={{
                maxWidth: "450px",
                margin: "50px auto",
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                backgroundColor: "#f9f9f9",
                fontFamily: "Arial, sans-serif",
            }}
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


        </div>
    );
};

export default MyForm;
