import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram,FaWhatsapp } from 'react-icons/fa'

const Footer = () => {
    
  return (
    <footer className='bg-black text-gray-200 py-10'>
      <div className="max-w-7xl mx-auto px-4 md:flex md:justify-between">
        {/*info */}
        <div className="mb-6 md:mb-0">
            
            <p className="mt-2 text-sm"> Powering Your World with Innovation</p>
            <p className="mt-2 text-sm"> Omega Marketing, Bhajanpura,New Delhi</p>
            <p className=" text-sm"> Email: mosa@gmail.com</p>
            <p className=" text-sm"> Phone: +91 93124-48758</p>
        </div>
        {/*custromer service links */}
        <div className="mb-6 md:mb-0">
            <h3 className="text-xl  font-semibold">Customer Service</h3>
            <ul className="mt-2 text-sm space-y-2">
                <li>Contact Us</li>
                <li>Shipping & Returns</li>
                <li>FAQs</li>
                <li>Order Tracking</li>
            </ul>
        </div>
        {/*social media links */}
        <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-semibold">Follow us</h3>
            <div className="flex space-x-4 mt-2">
                <a href="https://www.facebook.com/abhinay.saini.35/">
                <FaFacebook className='hover:scale-145 cursor-pointer hover:text-blue-600'/>
                </a>
                <a href="https://instagram.com/harvi_international1/">
                <FaInstagram className='hover:scale-145 cursor-pointer hover:text-pink-700'/>
                </a>
                <a href="https://wa.me/919643081041/">
                <FaWhatsapp className='hover:scale-145 cursor-pointer hover:text-green-500'/>
                </a>
            </div>
        </div>
        {/*newsletter subscription */}
        <div>
            <h3 className="text-xl font-semibold">Stay in loop</h3>
            <p className="mt-2 text-sm">Subscribe to get special offers, free giveaways, and more</p>
            <form action="" className='mt-4 flex'>
                <input type="email"
                placeholder='Your email address'
                className='w-full p-2 rounded-l-md text-gray-800 bg-gray-100 focus:ring-2 focus:ring-blue-500  ' />
                <button type='submit' className="bg-red-900  text-white px-4 rounded-r-md hover:bg-red-700">Subscribe</button>
            </form>
        </div>
      </div>
        <div className="mt-8 text-center text-sm border-t border-gray-700 pt-6">
            <p>&copy; {new Date().getFullYear()} <span className="text-red-700">  Upkarran</span> . All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer;
