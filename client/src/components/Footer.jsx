import React from 'react'
import { FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import {Link} from "react-router-dom"
const Footer = () => {
  return (
   
    
    <div className='w-full h-[300px] bg-[#6f0000]   flex flex-col items-center justify-center '>
      
      <div className='w-[1270px] h-[1px] bg-white mr-[20px]'></div>

      <div className='  w-full h-[250px]  rounded-xl flex flex-row  '>

        <div className='ml-[170px] mt-[50px]'>
            <div className='flex flex-row gap-2'>
                <div className='w-[30px] h-[30px] rounded-full overflow-hidden mt-1'>
                <img src={"./images/logo_condense.jpg"}/>
                </div>
                <p className='text-[25px] text-white '>CONDENSE</p>
            </div>

            <p className='w-[230px] h-[100px] text-white text-[15px] mt-3'>Condense - YouTube Summary,
            Podcast Summary and Notes 
            with Condense AI. Boost 
            learning efficiency by a factor of 10. </p>
        </div>

        <div className='flex flex-col mt-[50px] ml-[170px]'>
            <p className='text-[20px] text-white'>Useful Links</p>
            <div className='ml-[10px] mt-3 cursor-pointer'>
            <p className='text-[15px] text-gray-300 hover:text-white'> 
              <Link to='/dashboard'>Dashboard</Link>
            </p>
            <p className='text-[15px] text-gray-300 hover:text-white'>
              <Link to='/'>Chat with AI</Link>
            </p>
            <p className='text-[15px] text-gray-300 hover:text-white'>
              <Link to='/feedback'>Feedback</Link>
            </p>
            <p className='text-[15px] text-gray-300 hover:text-white'>
              <Link to='/'>Chrome Extension</Link>
            </p>
            <p className='text-[15px] text-gray-300 hover:text-white'>
              <Link to='/summary'>Youtube Summaries</Link>
            </p>
            </div>
        </div>
 
        <div className='flex flex-col mt-[50px] ml-[170px]'>
            <p className='text-[20px] text-white'>About</p>
            <div className='ml-[0px] mt-3 cursor-pointer'>
            <p className='text-[15px] text-gray-300 hover:text-white'> <Link to='/contact'>Contact Us</Link></p>
            <p className='text-[15px] text-gray-300 hover:text-white'>Privacy</p>
            <p className='text-[15px] text-gray-300 hover:text-white'>Terms</p>
            <p className='text-[15px] text-gray-300 hover:text-white'>Extension Privacy</p>
            
            </div>
        </div>

        <div className='text-[20px] ml-[170px] mt-[50px] text-white flex flex-col gap-3 mb-[90px]'>
            <p>Get to Know us</p>
            <div className='flex flex-row gap-2 cursor-pointer text-[30px] ml-[5px]'>
            <FaInstagramSquare className=' hover:text-gray-300' />
            <FaSquareFacebook className=' hover:text-gray-300'/>
            <FaLinkedin className=' hover:text-gray-300'/>
            </div>
        </div>

      </div>

    </div>
    
  )
}

export default Footer
