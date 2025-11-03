import axios from "axios";
import { formatEther } from "ethers";
import { useEffect, useState } from "react";



export const NFT = ({ nft }) => {

    const [image, setImage] = useState()
    const [name, setName] = useState()
    const [description, setDescription] = useState()

    useEffect(() => {
        const abc = async () => {


            const res = await axios.get(nft.uri)


            if (nft._owner != "0x0000000000000000000000000000000000000000") {
                setImage(res.data.image)
                setName(res.data.name)
                setDescription(res.data.description)
            }

        }

        abc()

    }, [])




    const isLoading = !image || !name || !description;

    if (isLoading) {
        // show a waiting/loading screen
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
            </div>
        );
    }

console.log("nav",nft,nft.id);

    return (

        <div class="nft-card bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
            
                <div class="h-48 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 relative">
                    {/* <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div> */}
                    {/* <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> */}
                        <img
                            src={image}
                            alt={name}
                            className="h-full w-full object-cover"
                        />                   
                         {/* </div> */}
                    {/* <div class="absolute top-2 sm:top-3 right-2 sm:right-3"><span class="bg-green-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">Listed</span>
                    </div> */}
                </div>
                {/* <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div class="flex space-x-1 sm:space-x-2">
                        <button 
                        class="bg-white/90 backdrop-blur-sm text-gray-900 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg font-medium hover:bg-white transition-colors text-xs sm:text-sm"> 
                        View </button> 
                        <button class="bg-indigo-600/90 backdrop-blur-sm text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-xs sm:text-sm"> 
                        Edit </button>
                    </div>
                </div> */}
            
            <div class="p-3 sm:p-4">
                <h3 class="font-bold text-gray-900 mb-1 text-sm sm:text-base">{name} #{nft.id}</h3>
                <p class="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{description}</p>
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-xs text-gray-500">
                            Live Price
                        </div>
                        <div class="font-bold text-indigo-600 text-sm sm:text-base">
                            {(Number(formatEther(nft.price))*1.07).toFixed(4)} $
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-gray-500">
                            Last Sale
                        </div>
                        <div class="font-bold text-gray-900 text-sm sm:text-base">
                            {Number(formatEther(nft.price))} $
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}