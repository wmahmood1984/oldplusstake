// utils/contractExecutor.js
import {
  BaseError ,
  writeContract, waitForTransactionReceipt } from "@wagmi/core";

import { mlmContract } from "../config.js";


export async function executeContract({
  config,
  functionName,
  args = [],
  contract = mlmContract,
  onSuccess = () => {},
  onError = () => {},
}) {
  try {
    const txHash = await writeContract(config, {
      ...contract,
      functionName,
      args,
    });

    const receipt = await waitForTransactionReceipt(config, { hash: txHash });

    console.log("✅ Tx confirmed:", receipt);

    await onSuccess(txHash, receipt); // <-- pass both hash and receipt
    return txHash;
  } catch (error) {
    console.error("❌ Contract execution error:", error);
    onError(error);
    throw error;
  }
}

export function extractRevertReason(error) {
  if (error.shortMessage) return error.shortMessage;
  const match = error.message?.match(/reverted with reason string '([^']+)'/);
  return match ? match[1] : "Transaction failed";
}

export function formatAddress(add) {
  return add ? `${add.slice(0,4)}...${add.slice(-4)}`: `...`
}

export function formatWithCommas(value, decimals = 2) {
  if (value === null || value === undefined || value === "") return "";
  
  const num = Number(value).toFixed(decimals);
  if (isNaN(num)) return value; // return original if not a valid number

  return num.toLocaleString("en-US");
}

export function formatDate(dat) {
  return `${new Date(dat * 1000).getDate()}-${new Date(dat * 1000).getMonth()+1}-${new Date(dat * 1000).getFullYear()}`
}

export     function shuffleArray(arr) {
        // make a shallow copy so we can safely modify
        const array = [...arr];

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

export     function secondsToHMSDiff(seconds) {

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


export function secondsToDMY(seconds) {
    const date = new Date(Number(seconds) * 1000); // convert to milliseconds

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}