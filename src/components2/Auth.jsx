// import { useAppKitAccount } from '@reown/appkit/react'
// import React, { useEffect, useState } from 'react'
// import ConnectButton from './ConnectButton';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { init, readName } from '../slices/contractSlice';


// export default function Auth() {
//     const { id } = useParams()
//     const navigate = useNavigate()

//     const [referrer, setReferrer] = useState(id)

//     const { registered } = useSelector((state) => state.contract);

//     const dispatch = useDispatch()

//     const { address,isConnected } = useAppKitAccount()


//     // useEffect(() => {
//     //     dispatch(init()).then(() => {
//     //         if (address) {
//     //             dispatch(readName({ address }));
//     //         }
//     //     });
//     // }, [address, dispatch]);

//     useEffect(() => {
//         if (registered && isConnected) {
//             navigate("/");
//         }
//     }, [registered,navigate,isConnected]);

//     console.log("nav", registered);

//     return (
//         <div>

//             <div id="auth-page" class="page">
//                 <div class="hidden lg:block min-h-screen">
//                     <div class="flex min-h-screen">
//                         <div class="flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
//                             <div class="absolute inset-0 bg-black/20"></div>
//                             <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-600/90"></div>
//                             <div class="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
//                             <div class="absolute bottom-40 right-32 w-48 h-48 bg-pink-400/20 rounded-full blur-2xl"></div>
//                             <div class="absolute top-1/2 left-10 w-24 h-24 bg-cyan-400/15 rounded-full blur-lg"></div>
//                             <div class="relative flex flex-col justify-center items-center h-full px-16 text-center">
//                                 <div class="mb-8">
//                                     <div class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
//                                         <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
//                                         </svg>
//                                     </div>
//                                     <h1 class="text-5xl font-bold font-display text-white mb-4">Welcome to HEXAWAY</h1>
//                                     <p class="text-xl text-indigo-100 max-w-md mx-auto leading-relaxed">The premier destination for NFT trading and digital asset management</p>
//                                 </div>
//                                 <div class="grid grid-cols-1 gap-6 max-w-sm w-full">
//                                     <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
//                                         <div class="text-3xl mb-3">
//                                             🎨
//                                         </div>
//                                         <h3 class="text-lg font-semibold text-white mb-2">Create &amp; Trade</h3>
//                                         <p class="text-indigo-100 text-sm">Mint your own NFTs and trade with confidence</p>
//                                     </div>
//                                     <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
//                                         <div class="text-3xl mb-3">
//                                             💰
//                                         </div>
//                                         <h3 class="text-lg font-semibold text-white mb-2">Earn Rewards</h3>
//                                         <p class="text-indigo-100 text-sm">Multiple income streams and referral bonuses</p>
//                                     </div>
//                                     <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
//                                         <div class="text-3xl mb-3">
//                                             🔒
//                                         </div>
//                                         <h3 class="text-lg font-semibold text-white mb-2">Secure Platform</h3>
//                                         <p class="text-indigo-100 text-sm">Enterprise-grade security for your assets</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="flex-1 bg-gray-50 flex items-center justify-center p-8">
//                             <div class="max-w-md w-full">
//                                 <div class="text-center mb-8">
//                                     <h2 class="text-3xl font-bold font-display text-gray-900 mb-3">Sign In</h2>
//                                     <p class="text-gray-600">Connect your wallet to access your account</p>
//                                 </div>
//                                 <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

//                                     <div class="space-y-6">
//                                         <div>
//                                             <label for="walletAddress" class="block text-sm font-semibold text-gray-700 mb-3">Wallet Address</label>
//                                             <input
//                                                 value={address}
//                                                 disabled
//                                                 type="text" id="walletAddress" name="walletAddress" placeholder="0x..." class="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-base transition-all" required />
//                                         </div>
//                                         <div>
//                                             <label for="referredBy" class="block text-sm font-semibold text-gray-700 mb-3">Referred By (Optional)</label>
//                                             <input
//                                                 value={referrer}
//                                                 onChange={(e) => { setReferrer(e.target.value) }}
//                                                 type="text" id="referredBy" name="referredBy" placeholder="Enter referrer's wallet address" class="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-base transition-all" />
//                                         </div>
//                                     </div>
//                                     <div class="mt-8 space-y-4">
//                                         {/* <button type="button" 
//                                             onclick="connectWallet()" 
//                                             class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-base"> 
//                                             🔗 Connect Wallet </button> */}
//                                         <ConnectButton referrer={referrer} />
//                                         <div class="relative">
//                                             <div class="absolute inset-0 flex items-center">
//                                                 <div class="w-full border-t border-gray-300"></div>
//                                             </div>
//                                             {/* <div class="relative flex justify-center text-sm"><span class="px-4 bg-white text-gray-500 font-medium">or</span>
//                                                 </div> */}
//                                         </div>
//                                         {/* <button type="submit" class="w-full bg-white text-gray-900 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-300 hover:border-gray-400 text-base"> 📝 Login with Address </button> */}
//                                     </div>

//                                     <div class="mt-8 pt-6 border-t border-gray-200">
//                                         <div class="text-center">
//                                             <p class="text-sm text-gray-600 mb-4">Supported Wallets</p>
//                                             <div class="flex justify-center space-x-6">
//                                                 <div class="flex items-center space-x-2 text-sm text-gray-500">
//                                                     <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-md"><span class="text-white text-xs font-bold">M</span>
//                                                     </div><span class="font-medium">MetaMask</span>
//                                                 </div>
//                                                 <div class="flex items-center space-x-2 text-sm text-gray-500">
//                                                     <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md"><span class="text-white text-xs font-bold">T</span>
//                                                     </div><span class="font-medium">Trust Wallet</span>
//                                                 </div>
//                                                 <div class="flex items-center space-x-2 text-sm text-gray-500">
//                                                     <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-md"><span class="text-white text-xs font-bold">W</span>
//                                                     </div><span class="font-medium">WalletConnect</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div class="text-center mt-6">
//                                     <p class="text-sm text-gray-600">By connecting your wallet, you agree to our <a href="#" class="text-indigo-600 hover:text-indigo-800 font-medium">Terms of Service</a> and <a href="#" class="text-indigo-600 hover:text-indigo-800 font-medium">Privacy Policy</a></p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="lg:hidden min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative">
//                     <div class="absolute inset-0 bg-black/20"></div>
//                     <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-600/90"></div>
//                     <div class="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
//                     <div class="absolute bottom-20 left-8 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl"></div>
//                     <div class="absolute top-1/3 right-6 w-16 h-16 bg-cyan-400/15 rounded-full blur-lg"></div>
//                     <div class="relative flex flex-col min-h-screen">
//                         <div class="flex-shrink-0 text-center pt-12 pb-8 px-6">
//                             <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
//                                 <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
//                                 </svg>
//                             </div>
//                             <h1 class="text-3xl sm:text-4xl font-bold font-display text-white mb-2">Join HEXAWAY</h1>
//                             <p class="text-base sm:text-lg text-indigo-100 max-w-sm mx-auto">Connect your wallet to get started with NFT trading</p>
//                         </div>
//                         <div class="flex-1 px-4 sm:px-6 pb-8">
//                             <div class="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md mx-auto">

//                                 <div class="space-y-5 sm:space-y-6">
//                                     <div>
//                                         <label for="mobileWalletAddress" class="block text-sm font-semibold text-gray-700 mb-2">Wallet Address</label>
//                                         <input
//                                                 value={address}
//                                                 disabled
//                                         type="text" id="mobileWalletAddress" name="walletAddress" placeholder="0x..." class="w-full px-4 py-3 sm:py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-base transition-all" required />
//                                     </div>
//                                     <div><label for="mobileReferredBy" class="block text-sm font-semibold text-gray-700 mb-2">Referred By (Optional)</label>

//                                         <input
//                                             value={referrer}
//                                             onChange={(e) => { setReferrer(e.target.value) }}
//                                             type="text" id="mobileReferredBy" name="referredBy" placeholder="Enter referrer's wallet address" class="w-full px-4 py-3 sm:py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-base transition-all" />
//                                     </div>
//                                 </div>
//                                 <div class="mt-6 sm:mt-8 space-y-4">
//                                     {/* <button type="button" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform active:scale-95 text-base"> 
//                                         🔗 Connect Wallet </button> */}
//                                     <ConnectButton referrer={referrer} />
//                                     <div class="relative">
//                                         <div class="absolute inset-0 flex items-center">
//                                             <div class="w-full border-t border-gray-300"></div>
//                                         </div>
//                                         <div class="relative flex justify-center text-sm">
//                                             <span class="px-4 bg-white text-gray-500 font-medium">or</span>
//                                         </div>
//                                     </div>
//                                     {/* <button type="submit" class="w-full bg-white text-gray-900 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-300 hover:border-gray-400 text-base transform active:scale-95"> 📝 Login with Address </button> */}
//                                 </div>

//                                 <div class="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
//                                     <div class="text-center">
//                                         <p class="text-sm text-gray-600 mb-4">Supported Wallets</p>
//                                         <div class="flex justify-center space-x-4 sm:space-x-6">
//                                             <div class="flex flex-col items-center space-y-1">
//                                                 <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-md"><span class="text-white text-xs font-bold">M</span>
//                                                 </div><span class="text-xs text-gray-500">MetaMask</span>
//                                             </div>
//                                             <div class="flex flex-col items-center space-y-1">
//                                                 <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md"><span class="text-white text-xs font-bold">T</span>
//                                                 </div><span class="text-xs text-gray-500">Trust Wallet</span>
//                                             </div>
//                                             <div class="flex flex-col items-center space-y-1">
//                                                 <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-md"><span class="text-white text-xs font-bold">W</span>
//                                                 </div><span class="text-xs text-gray-500">WalletConnect</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div class="text-center mt-6 px-4">
//                                 <p class="text-sm text-white/80">By connecting your wallet, you agree to our <a href="#" class="text-white font-medium underline">Terms of Service</a> and <a href="#" class="text-white font-medium underline">Privacy Policy</a></p>
//                             </div>
//                         </div>
//                         <div class="flex-shrink-0 px-6 pb-8">
//                             <div class="grid grid-cols-3 gap-3 max-w-sm mx-auto">
//                                 <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
//                                     <div class="text-2xl mb-1">
//                                         🎨
//                                     </div>
//                                     <div class="text-xs text-white font-medium">
//                                         Create &amp; Trade
//                                     </div>
//                                 </div>
//                                 <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
//                                     <div class="text-2xl mb-1">
//                                         💰
//                                     </div>
//                                     <div class="text-xs text-white font-medium">
//                                         Earn Rewards
//                                     </div>
//                                 </div>
//                                 <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
//                                     <div class="text-2xl mb-1">
//                                         🔒
//                                     </div>
//                                     <div class="text-xs text-white font-medium">
//                                         Secure Platform
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }


import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { useDispatch, useSelector } from 'react-redux';
import { formatAddress } from '../utils/contractExecutor';
import { init, readName, setRegisteredFalse } from '../slices/contractSlice';
import { mlmabi, mlmcontractaddress, helperContract, web3 } from '../config';

export default function Nav() {
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    registered,
    NFTMayBeCreated,
    admin,
    status,
  } = useSelector((state) => state.contract);

  const { address, isConnected } = useAppKitAccount();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminRep, setAdminrep] = useState(false);
  const [shouldForceCreate, setShouldForceCreate] = useState(false);

  const mlmContract = new web3.eth.Contract(mlmabi, mlmcontractaddress);

  useEffect(() => {
    const abc = async () => {
      const _adminrep = await mlmContract.methods.adminRep().call();
      setAdminrep(_adminrep);
    };
    abc();
  }, [address]);

  useEffect(() => {
    dispatch(init()).then(() => {
      if (address) {
        dispatch(readName({ address }));
      }

      if (address && !registered && status === "succeeded") {
        navigate("/auth");
      }
    });
  }, [dispatch, address, isConnected, registered]);

  // ============================================
  // CORE LOGIC: FORCE USER TO /create IF ELIGIBLE
  // ============================================
//   useEffect(() => {
//     const checkUserEligibility = async () => {
//       if (!address || !registered) return;

//       // 1) Check if package >= $20
//       const userPkg = await helperContract.methods.userPackage(address).call();
//       const hasTwentyDollarPkg = Number(userPkg.id) >= 2;

//       // 2) Check last minted NFT
//       const userMints = await helperContract.methods.userMint(address).call();

//       let mintedBefore7Days = true;

//       if (userMints.length > 0) {
//         const lastMint = userMints[userMints.length - 1];
//         const lastMintInfo = await helperContract.methods.idPurchasedTime(lastMint.id).call();

//         const purchasedTime = Number(lastMintInfo);
//         const now = Math.floor(Date.now() / 1000);
//         const sevenDays = 7 * 24 * 60 * 60;

//         mintedBefore7Days = now - purchasedTime >= sevenDays;
//       }

//       // 3) If eligible → force create page
//       if (hasTwentyDollarPkg && mintedBefore7Days) {
//         setShouldForceCreate(true);
//         navigate("/create");
//       }
//     };

//     checkUserEligibility();
//   }, [address, registered]);


useEffect(() => {
  const checkUserEligibility = async () => {
    if (!address || !registered) return;

    // 1) Check package ID
    const userPkg = await helperContract.methods.userPackage(address).call();
    const pkgId = Number(userPkg.id);

    // Determine cooldown days based on package
    let cooldownDays = 9999; // default large number

    if (pkgId === 1) cooldownDays = 10; 
    if (pkgId === 2) cooldownDays = 7;  
    if (pkgId === 3) cooldownDays = 5;  
    if (pkgId === 4) cooldownDays = 3;  
    if (pkgId === 5) cooldownDays = 1;  

    // 2) Check last mint
    const userMints = await helperContract.methods.userMint(address).call();
    let canMint = true;

    if (userMints.length > 0) {
      const lastMint = userMints[userMints.length - 1];
      const lastMintInfo = await helperContract.methods.idPurchasedTime(lastMint.id).call();

      const purchasedTime = Number(lastMintInfo);
      const now = Math.floor(Date.now() / 1000);
      const seconds = cooldownDays * 24 * 60 * 60;

      canMint = now - purchasedTime >= seconds;
    }

    // 3) If eligible → force create
    if (canMint) {
      setShouldForceCreate(true);
      navigate("/create");
    }
  };

  checkUserEligibility();
}, [address, registered]);


  const handleClick = async () => {
    if (isConnected) {
      await disconnect();
      dispatch(setRegisteredFalse());
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  // =====================================================
  // RENDER STARTS HERE
  // =====================================================
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 premium-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          
          {/* LOGO */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/HEXA.png"
                alt="Hexaway Logo"
                className="w-12 h-12 sm:w-14 sm:h-14"
              />
              <h1
                id="company-name"
                className="text-2xl sm:text-3xl font-bold font-display bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-none"
              >
                HEXAWAY
              </h1>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">

            {/* HIDE ALL MENU WHEN FORCING CREATE */}
            {registered && !shouldForceCreate && (
              <>
                {address === adminRep && (
                  <Link to="/suck" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm xl:text-base">
                    Suck
                  </Link>
                )}

                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium text-sm xl:text-base">Dashboard</Link>
                <Link to="/trade" className="text-gray-600 hover:text-indigo-600 font-medium text-sm xl:text-base">Trade</Link>

                {NFTMayBeCreated && (
                  <Link to="/create" className="text-gray-600 hover:text-indigo-600 font-medium text-sm xl:text-base">Create</Link>
                )}

                <Link to="/asset" className="text-gray-600 hover:text-indigo-600 font-medium text-sm xl:text-base">Assets</Link>
                <Link to="/tree" className="text-gray-600 hover:text-indigo-600 font-medium text-sm xl:text-base">Team Tree</Link>
                <Link to="/teamview" className="text-gray-600 hover:text-indigo-600 font-medium text-sm xl:text-base">Team View</Link>
              </>
            )}

            <button
              onClick={handleClick}
              id="auth-btn"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg text-sm xl:text-base"
            >
              {formatAddress(address)}
            </button>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="lg:hidden">
            <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-indigo-600 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-1">

            {registered && !shouldForceCreate && (
              <>
                {address === adminRep && (
                  <Link
                    to="/suck"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg font-medium"
                  >
                    Suck
                  </Link>
                )}

                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-3 hover:bg-gray-50">Dashboard</Link>
                <Link to="/trade" onClick={() => setMobileOpen(false)} className="block px-3 py-3 hover:bg-gray-50">Trade</Link>

                {NFTMayBeCreated && (
                  <Link to="/create" onClick={() => setMobileOpen(false)} className="block px-3 py-3 hover:bg-gray-50">Create</Link>
                )}

                <Link to="/asset" onClick={() => setMobileOpen(false)} className="block px-3 py-3 hover:bg-gray-50">Assets</Link>
                <Link to="/tree" onClick={() => setMobileOpen(false)} className="block px-3 py-3 hover:bg-gray-50">Team Tree</Link>
                <Link to="/teamview" onClick={() => setMobileOpen(false)} className="block px-3 py-3 hover:bg-gray-50">Team View</Link>
              </>
            )}

            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => {
                  handleClick();
                  setMobileOpen(false);
                }}
                id="mobile-auth-btn"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                {formatAddress(address)}
              </button>
            </div>

          </div>
        </div>
      )}

    </nav>
  );
}
