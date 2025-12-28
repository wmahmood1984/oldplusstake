import React, { useEffect, useState } from 'react'
import Nav from './components2/Nav'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Home from './components2/Home'
import Auth from './components2/Auth'
import Dashboard from './components2/Dashboard'
import Trade from './components2/Trade'
import Create from './components2/Create'
import Asset from './components2/Asset'
import Tree from './components2/Tree'
import History from './components2/History'
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { init, readName } from './slices/contractSlice'
import { useAppKitAccount } from '@reown/appkit/react'
import Suck from './components2/Suck'
import CreateHistory from './components2/CreateHistory'
import NFTCreationDetails from './components2/NFTCreationDetails'
import Teamtree from './components2/Teamtree'
import Bulk from './components2/Bulk'
import NoteMarquee from './components2/Note'
import MyForm from './components2/Admin'
import Lists from './components2/Lists'

export default function App() {

    const dispatch = useDispatch()
    const { address } = useAppKitAccount();
    const navigate = useNavigate()
        const [createActive, setCreateActive] = useState(false)

    const {
        status,
    } = useSelector((state) => state.contract);

    //   useEffect(() => {
    //     dispatch(init()).then(() => {
    //       if (address) {
    //         dispatch(readName({ address }));
    //       } else {
    //         // dispatch(readName({ address: "0x0000000000000000000000000000000000000000" }));
    //         navigate("/")
    //       }
    //     });
    //   }, [dispatch, address]);




    //   if (status!="succeeded") {
    //     return (
    //       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
    //         <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
    //         <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
    //       </div>
    //     );
    //   }

    //   console.log("selector",status);

    return (
        <div>
            <Toaster position="top-right" reverseOrder={false} />
            <Nav createActive={createActive} setCreateActive={setCreateActive} />
            {/* <NoteMarquee/> */}


            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth createActive={createActive} setCreateActive={setCreateActive} />} />
                <Route path="/auth/:id" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tree" element={<Tree />} />
                <Route path="/trade" element={<Trade createActive={createActive} setCreateActive={setCreateActive}/>} />
                <Route path="/create" element={<Create />} />
                <Route path="/asset" element={<Asset />} />
                <Route path="/history" element={<History />} />
                <Route path="/suck" element={<Suck />} />
                <Route path="/createhistory" element={<CreateHistory />} />
                <Route path="/nftcreationdetails" element={<NFTCreationDetails />} />
                <Route path="/teamview" element={<Teamtree />} />
                <Route path="/bulk" element={<Bulk />} />
                <Route path="/admin" element={<MyForm />} />
                                <Route path="/lists" element={<Lists />} />
            </Routes>























        </div >
    )
}
