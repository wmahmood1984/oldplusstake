import React, { useState } from "react";
import Web3 from "web3";
import { bulkAddAbi, bulkContractAdd, testweb3 } from "../config";



const contractABI = bulkAddAbi;
const contractAddress = bulkContractAdd;
const web3 = testweb3;
const contract = new web3.eth.Contract(contractABI, contractAddress);

const MyForm = () => {
  const [newList, setNewList] = useState("");
  const [oldElements, setOldElements] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetArrayStart = async () => {
    setLoading(true);
    try {
      const account = web3.eth.accounts.privateKeyToAccount(
        import.meta.env.VITE_PRIVATE_KEY
      );
      web3.eth.accounts.wallet.add(account);

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
      const receipt = await web3.eth.sendSignedTransaction(
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
      const account = web3.eth.accounts.privateKeyToAccount(
        import.meta.env.VITE_PRIVATE_KEY
      );
      web3.eth.accounts.wallet.add(account);

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
      const receipt = await web3.eth.sendSignedTransaction(
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
          Number of Old Elements to Include:
        </label>
        <input
          type="number"
          value={oldElements}
          onChange={(e) => setOldElements(e.target.value)}
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
