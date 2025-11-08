import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { useDispatch, useSelector } from 'react-redux';
import { formatAddress } from '../utils/contractExecutor';
import { init, readName } from '../slices/contractSlice';
import { mlmabi, mlmcontractaddress, web3 } from '../config';

export default function Nav() {
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    registered,
    NFTMayBeCreated, admin,status
  } = useSelector((state) => state.contract);

  const { address, isConnected } = useAppKitAccount();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminRep, setAdminrep] = useState(false);


      const mlmContract = new web3.eth.Contract(mlmabi,mlmcontractaddress)
  
      useEffect(() => {
  
  
          const abc = async () => {
              const _adminrep = await mlmContract.methods.adminRep().call()
              setAdminrep(_adminrep)
  

          }
  
          abc()
  
  
      }, [address])

  useEffect(() => {
    dispatch(init()).then(() => {
      if (address) {
        dispatch(readName({ address }));
      }

      if(address && !registered && status=="succeeded"){
        navigate("/auth")
      }


    });
  }, [dispatch, address,isConnected,registered]);


  // useEffect(() => {
  //     if (registered) {
  //         navigate("/");
  //     }
  // }, [registered, navigate]);

  const handleClick = async () => {
    if (isConnected) {
      await disconnect();
      navigate("/")
    } else {
      navigate("/auth");
    }
  };

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };


  console.log("nav",status);


  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 premium-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo + Brand */}
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

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {registered && (
              <>
                {address == adminRep && <Link to="/suck" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm xl:text-base">Suck</Link>}
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm xl:text-base">Dashboard</Link>
                <Link to="/trade" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm xl:text-base">Trade</Link>
                {NFTMayBeCreated && (
                  <Link to="/create" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm xl:text-base">Create</Link>
                )}
                <Link to="/asset" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm xl:text-base">Assets</Link>
                <Link to="/tree" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm xl:text-base">Team Tree</Link>
              </>
            )}

            <button
              onClick={handleClick}
              id="auth-btn"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg text-sm xl:text-base"
            >
              {(address || isConnected) && registered? formatAddress(address) : "Get Started"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-indigo-600 p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {registered && (
              <>
                {address == admin &&
                  <Link
                    to="/suck"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  >
                    Suck
                  </Link>

                }

                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/trade"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Trade
                </Link>
                <Link
                  to="/create"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Create
                </Link>
                <Link
                  to="/asset"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Assets
                </Link>
                <Link
                  to="/tree"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Team Tree
                </Link>
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
                {(address || isConnected) && registered ? formatAddress(address) : "Get Started"}
              </button>
            </div>
          </div>
        </div>
      )}

    </nav>
  );
}
