import React, {useState} from 'react'
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

export const EnterURL = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [URL, setURL] = useState('');
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    const handleSubmit = (URL) => {
        console.log(URL);
        if (!URL || URL === ''){
            console.log("url required");
            return;
        }
        // Navigate to other page and pass state
        navigate('/summary', { state: URL});
    };

  return (
    <div>
        <motion.div
        className=" flex flex-col justify-center items-center bg-gradient-to-b from-red-500 via-red-900 to-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        >
            <div className="w-[500px] h-screen bg-gradient-to-b from-red-500 via-red-900 to-black mb-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-[40px] flex flex-row items-start gap-1 text-white relative font-serif font-bold mb-6"
                >
                    <motion.div
                    className="w-[70px] mt-[270px] ml-[80px] h-[70px] rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    >
                        <img
                            src={"/images/logo_condense.jpg"}
                            alt="Your Image Alt Text"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    <motion.div className="mt-[275px] ml-2 ">CONDENSE</motion.div>
                </motion.h1>
                
                <input
                    type='text'
                    placeholder='Enter URL...'
                    id='urlInput'
                    name='urlInput'
                    value={URL}
                    className='flex justify-center items-center flex-1 w-[500px] h-14 border-4 border-blue-100 rounded-3xl bg-white mt-6 mb-6 p-3'
                    onChange={(e) => setURL(e.target.value)}
                />
                
                <div className='flex flex-row justify-center mt-6'>
                    <label class="inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            value="" 
                            className="sr-only peer"
                            checked={isChecked}
                            onChange={handleToggle}
                        />
                        <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer ${isChecked ? 'dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white' : ''} after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`}></div>
                        <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {isChecked ? 'Audio' : 'Video'} {/* Conditional rendering */}
                        </span>
                    </label>
                </div>

                <div className='flex flex-row justify-center mt-4'>
                    <button
                        type="button"
                        className={`text-white bg-black text-[15px] font-bold p-4 h-14 w-[120px] rounded-xl focus:outline-none focus:shadow-outline transition duration-300 type="button" hover:bg-red-700`}
                        onClick={() => handleSubmit(URL)}
                    >
                        Submit
                    </button>
                </div>
                
                
            </div>
        </motion.div>
    </div>
  )
}
