import React, { useEffect, useState } from 'react'
import { helperAbi, helperAddress, incomeKeys, mlmabi, mlmcontractaddress, tradeKeys, url, web3, web31 } from '../config';
import { useAppKitAccount } from '@reown/appkit/react';
import { formatEther } from 'ethers';
import { formatDate } from '../utils/contractExecutor';
import axios from 'axios';

export default function History() {
    const { address } = useAppKitAccount();
    const [transactions, setTransaction] = useState()
    const [trades, setTrades] = useState()
    const [filter, setFilter] = useState("All Transactions")

    const helperContract = new web31.eth.Contract(helperAbi, helperAddress)

    useEffect(() => {
        const bringTransaction = async () => {
            if (!address) return;


            const latestBlock = await web3.eth.getBlockNumber();
            const fromBlock = latestBlock - 50000;
            const step = 5000; // or smaller if node still complains
            let allEvents = [];

            for (let i = fromBlock; i <= latestBlock; i += step) {
                const toBlock = Math.min(i + step - 1, latestBlock);

                try {
                    const events = await helperContract.getPastEvents("Incomes",

                        {

                            fromBlock: i,
                            toBlock: toBlock,
                        });
                    allEvents = allEvents.concat(events);
                    setTransaction(allEvents)
                    // console.log(`Fetched ${events.length} events from ${i} to ${toBlock}`);
                } catch (error) {
                    console.warn(`Error fetching from ${i} to ${toBlock}`, error);
                }
            }

            console.log("All events:", allEvents);
        };

        const bringTrades = async () => {
            if (!address) return;


            const latestBlock = await web3.eth.getBlockNumber();
            const fromBlock = latestBlock - 50000;
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

            console.log("All trandes:", allEvents);
        };

        bringTransaction();
        bringTrades()
    }, [address]);


    const filteredTransactions = transactions && transactions.filter(e => e.
        returnValues.
        _user === address).map((v, e) => {
            console.log("object", v.returnValues.level);
            return (
                {
                    eventType: "Income",
                    time: Number(v.returnValues.time),
                    amount: formatEther(v.returnValues.amount),
                    details: v.returnValues._type == '3' ? `Level ${v.returnValues.level} Commission` : 
                        v.returnValues._type == '2'? `Level ${v.returnValues.level} Commission for Toke id# ${v.returnValues.id}`
                         :v.returnValues._type == '4'? `Self Trading profit for Token id# ${v.returnValues.id}`
                         :v.returnValues._type == '0'? `For Token id# ${v.returnValues.id}`
                        :`Package Upgrade Bonus`,
                    svg: incomeKeys[v.returnValues._type].svg,
                    class: incomeKeys[v.returnValues._type].class,

                    name: incomeKeys[v.returnValues._type].name
                    , hash: v.transactionHash,
                    values: v.returnValues
                })
        })

    const filteredTrades = trades && trades.filter(e => e.
        returnValues.
        _user === address).map((v, e) => {
            return ({
                eventType: "Trade",
                time: Number(v.returnValues.time),
                amount: formatEther(v.returnValues.amount),
                details: `Token ID : ${v.returnValues.id}`,
                svg: tradeKeys[v.returnValues._type].svg,
                class: tradeKeys[v.returnValues._type].class,
                name: tradeKeys[v.returnValues._type].name,
                hash: v.transactionHash,
                values: v.returnValues
            })
        })







    const merged = transactions && trades && [...filteredTransactions, ...filteredTrades].sort(
        (a, b) => b.time - a.time
    ).filter((e) => {
        console.log("filter", filter);
        if (filter == `All Transactions`) {
            return true
        } else {
            return e.name == filter
        }
    })
        ;




    const isLoading = !transactions || !trades;

    if (isLoading) {
        // show a waiting/loading screen
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
            </div>
        );
    }

    console.log("NFT", merged);

    return (
        <div>


            <div id="history-page" class="page">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div>
                            <h2 class="text-3xl font-bold text-gray-900 mb-2">Transaction History</h2>
                            <p class="text-gray-600">View all your transactions and earnings</p>
                        </div>
                        <div class="mt-4 sm:mt-0">
                            <select id="transaction-filter"
                                onChange={(e) => { setFilter(e.target.value) }}
                                class="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="All Transactions">All Transactions</option>
                                <option value="NFT Trade">NFT Trade</option>
                                <option value="Trading Referral Bonus">Trading Referral Bonus</option>
                                <option value="Package Referral Bonus">Package Referral Bonus</option>

                                <option value="NFT Purchase">NFT Purchase</option>
                                <option value="NFT Creation">NFT Creation</option>
                                <option value="Package Level Bonus">Package Level Bonus</option>
                                <option value="Self Trading Profit">Self Trading Profit</option>
                                <option value="Trading Level Bonus">Trading Level Bonus</option>  </select>
                        </div>
                    </div>
                    <div id="transaction-list" class="space-y-4">
                        {merged.map((v, e) => {

                            return (
                                <div class="transaction-card bg-white rounded-xl shadow-lg p-6 border border-gray-100" data-type="nft-trade">
                                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div class="flex items-center space-x-4 mb-4 sm:mb-0">
                                            <div class={v.class}>
                                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={v.svg}></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 class="font-semibold text-gray-900">{v.name}</h3>
                                                <p class="text-sm text-gray-600">{v.details}</p>
                                                <p class="text-xs text-gray-500">{formatDate(v.time)}</p>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <div class="text-2xl font-bold text-green-600">
                                                +${v.amount}
                                            </div>
                                            <div class="text-xs text-gray-500 mt-1">
                                                Hash: <a href={`${url}/${v.hash}`} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline cursor-pointer">{`${v.hash.slice(0, 10)}...`}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {/* <div class="transaction-card bg-white rounded-xl shadow-lg p-6 border border-gray-100" data-type="nft-trade">
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div class="flex items-center space-x-4 mb-4 sm:mb-0">
                                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-gray-900">NFT Trade</h3>
                                        <p class="text-sm text-gray-600">Sold Cyber Genesis #001</p>
                                        <p class="text-xs text-gray-500">Dec 15, 2024 at 2:30 PM</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-green-600">
                                        +$53.5
                                    </div>
                                    <div class="text-xs text-gray-500 mt-1">
                                        Hash: <a href="https://opbnbscan.com/tx/0xa1b2c3d4e5f6789abcdef123456789abcdef1234" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline cursor-pointer">0xa1b2c3d4e5f6...</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="transaction-card bg-white rounded-xl shadow-lg p-6 border border-gray-100" data-type="level-income">
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div class="flex items-center space-x-4 mb-4 sm:mb-0">
                                    <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-gray-900">Level Bonus</h3>
                                        <p class="text-sm text-gray-600">Level 2 Commission</p>
                                        <p class="text-xs text-gray-500">Dec 13, 2024 at 4:45 PM</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-green-600">
                                        +$15.75
                                    </div>
                                    <div class="text-xs text-gray-500 mt-1">
                                        Hash: <a href="https://opbnbscan.com/tx/0xc3d4e5f6a7b8901cdef345678901cdef23456" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline cursor-pointer">0xc3d4e5f6a7b8...</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="transaction-card bg-white rounded-xl shadow-lg p-6 border border-gray-100" data-type="direct-income">
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div class="flex items-center space-x-4 mb-4 sm:mb-0">
                                    <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-gray-900">Direct Referral Bonus</h3>
                                        <p class="text-sm text-gray-600">Package Upgrade Bonus</p>
                                        <p class="text-xs text-gray-500">Dec 12, 2024 at 11:20 AM</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-green-600">
                                        +$50.0
                                    </div>
                                    <div class="text-xs text-gray-500 mt-1">
                                        Hash: <a href="https://opbnbscan.com/tx/0xd4e5f6a7b8c9012def456789012def345678" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline cursor-pointer">0xd4e5f6a7b8c9...</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="transaction-card bg-white rounded-xl shadow-lg p-6 border border-gray-100" data-type="nft-purchase">
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div class="flex items-center space-x-4 mb-4 sm:mb-0">
                                    <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-gray-900">NFT Purchase</h3>
                                        <p class="text-sm text-gray-600">Bought Abstract Dreams #247</p>
                                        <p class="text-xs text-gray-500">Dec 11, 2024 at 3:15 PM</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-red-600">
                                        -$47.8
                                    </div>
                                    <div class="text-xs text-gray-500 mt-1">
                                        Hash: <a href="https://opbnbscan.com/tx/0xe5f6a7b8c9d0123ef567890123ef456789" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline cursor-pointer">0xe5f6a7b8c9d0...</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="transaction-card bg-white rounded-xl shadow-lg p-6 border border-gray-100" data-type="nft-creation">
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div class="flex items-center space-x-4 mb-4 sm:mb-0">
                                    <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-gray-900">NFT Creation</h3>
                                        <p class="text-sm text-gray-600">Minted Digital Badge #006</p>
                                        <p class="text-xs text-gray-500">Dec 10, 2024 at 9:30 AM</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-orange-600">
                                        -$5.0
                                    </div>
                                    <div class="text-xs text-gray-500 mt-1">
                                        Hash: <a href="https://opbnbscan.com/tx/0xf6a7b8c9d0e1234f678901234f567890" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline cursor-pointer">0xf6a7b8c9d0e1...</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="transaction-card bg-white rounded-xl shadow-lg p-6 border border-gray-100" data-type="level-income">
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div class="flex items-center space-x-4 mb-4 sm:mb-0">
                                    <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-gray-900">Level Bonus</h3>
                                        <p class="text-sm text-gray-600">Level 3 Commission</p>
                                        <p class="text-xs text-gray-500">Dec 8, 2024 at 5:20 PM</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-green-600">
                                        +$8.25
                                    </div>
                                    <div class="text-xs text-gray-500 mt-1">
                                        Hash: <a href="https://opbnbscan.com/tx/0xb8c9d0e1f2a3456h890123456h789012" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline cursor-pointer">0xb8c9d0e1f2a3...</a>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <div class="text-center mt-8"><button class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"> Load More Transactions </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
