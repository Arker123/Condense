import React,{useState} from 'react'
import img from './img1.jpg';
import img1 from './img4.jpg';
import { motion } from 'framer-motion';
const SignUp = () => {
const[toggle,setToggle]=useState(false);
const[open,setOpen]=useState(false);
  return (
    <div className=''>
  <motion.div
  className=" flex flex-row bg-gradient-to-b from-red-500 via-red-900 to-black"
  // style={{ backgroundImage: `url(${img})` }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
  >
    
    <div className="w-[500px] h-screen bg-gradient-to-b from-red-500 via-red-900 to-black">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="text-[40px] flex flex-row items-start gap-1 text-white relative font-serif font-bold mb-4"
      // style={{ marginLeft: '20px', marginTop: '50px' }}
    >
      <motion.div
        className="w-[70px] mt-[270px] ml-[80px] h-[70px] rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src={img1}
          alt="Your Image Alt Text"
          className="w-full h-full object-cover"
        />
      </motion.div>
      <motion.div className="mt-[275px] ml-2 ">CONDENSE</motion.div>
    </motion.h1>
  </div>


<div className="flex justify-center items-center flex-1 w-[1000px] border-4 border-blue-100 rounded-l-3xl bg-white" >

       <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-[440px]  bg-white border   items-center rounded-2xl border-black shadow-md px-10 pb-8 pt-6 mb-4 ml-[150px] shadow-lg"
    >
        <div className='flex flex-row mb-5 justify-center items-center text-black text-semibold text-[23px] font-serif font-medium'>
              <div
                className={`px-5 py-1 border ${
                  toggle ? 'border-gray-200' : 'border-black'
                } cursor-pointer`}
                onClick={() => setToggle(false)}
              >
                Login
              </div>
              <div
                className={`px-5 py-1 border ${
                  toggle ? 'border-black' : 'border-gray-200'
                } cursor-pointer`}
                onClick={() => setToggle(true)}
              >
                Register
              </div>
            </div>

        {toggle && (
  <div>
    <div className="mb-2">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="email"
      >
        Email ID
      </label>
      <input
        className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        id="email"
        type="text"
        placeholder=""
        required
      />
    </div>
    <div className="mb-2">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="username"
      >
        Username
      </label>
      <input
        className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        id="username"
        type="text"
        placeholder=""
        required
      />
    </div>
    <div className="mb-2">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="password"
      >
        Password
      </label>
      <input
        className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        id="password"
        type="password"
        placeholder=""
        required
      />
    </div>
    <div className="flex items-center justify-center">
      <button
        className="text-white bg-black text-[15px] font-bold py-4 px-6 rounded-xl focus:outline-none focus:shadow-outline"
        type="button"
       
      >
        Sign Up
      </button>
    </div>
  </div>
)}
{!toggle && (
  <div>
    <div className="mb-2">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="username"
      >
        Username
      </label>
      <input
        className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        id="username"
        type="text"
        placeholder=""
        required
      />
    </div>
    <div className="mb-2">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="password"
      >
        Password
      </label>
      <input
        className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        id="password"
        type="password"
        placeholder=""
        required
      />
    </div>
    <div className="flex justify-center items-center  ">
      <button
        className={`text-white bg-black text-[15px] font-bold py-4 px-6 rounded-xl focus:outline-none focus:shadow-outline"
        type="button`}
      >
        Login
      </button>
      
    </div>
  </div>
)}

      </motion.div>
    </div>

  </motion.div>
 
</div>
  )
}

export default SignUp
