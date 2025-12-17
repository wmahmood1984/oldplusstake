import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { bulkAddAbi, bulkContractAdd, fetcherAbi, fetcherAddress, testweb3, web3 } from "../config";



const contractABI = bulkAddAbi;
const contractAddress = bulkContractAdd;
const web31 = testweb3;
const contract = new web31.eth.Contract(contractABI, contractAddress);

const MyForm = () => {
    const [newList, setNewList] = useState("");
    const [oldElements, setOldElements] = useState("");
    const [loading, setLoading] = useState(false);
    const [array, setArray] = useState([]);

    const fetcherContract = new web3.eth.Contract(fetcherAbi, fetcherAddress)
    const saveContract = new testweb3.eth.Contract(bulkAddAbi, bulkContractAdd);


    useEffect(() => {
        const abc = async () => {
            try {
                const arrayStart = await contract.methods.arrayToStart().call();
                setNewList(arrayStart)
                const oldEle = await contract.methods.unitsToEnter().call();
                setOldElements(oldEle)


                const _nfts = await fetcherContract.methods.getNFTs().call();



                const idThreshold = await saveContract.methods.arrayToStart().call();
                const unitsTotake = await saveContract.methods.unitsToEnter().call();

                // Array with NFTs having id <= 2500


                // Array with NFTs having id > 2500
                const secondArray = _nfts.filter(nft => Number(nft.id) < idThreshold).sort(
                    (a, b) => Number(a.purchasedTime) - Number(b.purchasedTime)
                ).map(nft => nft.id);

                console.log("admin", secondArray);

                setArray(secondArray)


            } catch (error) {
                console.log("error in use effect".error);
            }
        }

        abc();

    }, []);

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

            <div style={{ marginBottom: "20px" }}>
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
            </div>

            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                    Number of NFT to Include:
                </label>
                <select
                    value={oldElements}
                    onChange={(e) => setOldElements(Number(e.target.value))}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        marginBottom: "10px",
                        fontSize: "16px",
                    }}
                >
                    <option value="" disabled>
                        Select number nft id of old list
                    </option>

                    {array.map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>

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
