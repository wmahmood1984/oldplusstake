import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { executeContract, extractRevertReason } from "../utils/contractExecutor";
import { useConfig } from "wagmi";
import { useEffect, useState } from "react";
import { erc20abi, erc20Add, helperAbi, helperAddress, mlmcontractaddress, usdtContract, web3 } from "../config";
import { useDispatch } from "react-redux";
import { readName } from "../slices/contractSlice";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import toast from "react-hot-toast";
import { formatEther } from "ethers";

export default function ConnectButton({ referrer }) {
    const { open } = useAppKit()
    const navigate = useNavigate()
    // const { disconnect } = useDisconnect()
    const config = useConfig()
    const { isConnected, address } = useAppKitAccount()
    const [admin, setAdmin] = useState()
    const [packages, setPackages] = useState([])
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);

    const contract = new web3.eth.Contract(helperAbi, helperAddress)

    useEffect(() => {

        const abc = async () => {

            const _admin = await contract.methods.owner().call()
            setAdmin(_admin)
            const _packages = await contract.methods.getPackages().call()
            setPackages(_packages)
        }

        abc()
    }, [])


    const handleRegister2 = async () => {
        await executeContract({
            config,
            functionName: "register",
            args: [referrer ? referrer : admin],
            onSuccess: (txHash, receipt) => {
                console.log("🎉 Tx Hash:", txHash);
                console.log("🚀 Tx Receipt:", receipt);
                dispatch(readName({ address: receipt.from }));
                toast.success("Registration successful!")
                navigate("/")
                setLoading(false)
            },
            onError: (err) => {
                let reason = extractRevertReason(err)
                toast.error("Transaction failed:")
                console.log("Transaction failed:", err)
                setLoading(false)
            },
        });
    };






    const handleRegister = async (e) => {
        e.preventDefault(); // stop form submission
        setLoading(true)
        const contract = new web3.eth.Contract(erc20abi, erc20Add)
        const balance = await contract.methods.balanceOf(address).call();
        console.log("object", formatEther(balance), formatEther(packages[0].price), formatEther(balance) < formatEther(packages[0].price));
        const bal = BigInt(balance);            // raw units
        const price = BigInt(packages[0].price);

        if (bal < price) {
            toast.error("Insufficient USDT balance.")
            setLoading(false)
            return
        }

        if(!referrer){
            toast.error("Referrer address is required.")
            setLoading(false)
            return
        }



        await executeContract({
            config,
            functionName: "approve",
            args: [mlmcontractaddress, packages[0].price],
            onSuccess: () => handleRegister2(),
            onError: (err) => {
                let reason = extractRevertReason(err)
                toast.error("Transaction failed:", reason)

                setLoading(false)


            },
            contract: usdtContract
        });

        // handleRegister2()
    }




    return (
        <div>
            {<button

                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-base"
                onClick={async (e) => {
                    // if (isConnected) {
                    //     handleRegister(e);
                    // } else {
                    //     await open()
                    // }
                    open()
                }}
                // style={{
                //     border: "2px solid blue",
                //     padding: "10px 20px",
                //     backgroundColor: "transparent",
                //     cursor: "pointer",
                //     transition: "border-color 0.3s"
                // }}
                onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "green";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "blue";
                }}
            >
                {loading ? (
                    <>
                        <Spinner size={20} color="#fff" />
                        <span>Processing...</span>
                    </>
                ) : "🔗 Connect Wallet" 
                //isConnected ? `Register` : "🔗 Connect Wallet"
                }
            </button>}

        </div>
    )
}
