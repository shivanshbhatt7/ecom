import React from 'react'
import { Button } from './button'

const Hero = () => {
  return (
    <section className='bg-gradient-to-br from-[#D16BA5] via-[#86A8E7] to-[#5FFBF1] min-h-screen from-blue-600 to-purple-600 text-white py-16'>
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h1 className='text-4xl md:text-6xl font-bold mb-4'>Latest Electronics at best prices</h1>
                    <p className="text-xl mb-6 text-blue-100">Discover the latest gadgets and electronics at unbeatable prices. Shop now and save big! </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button className='bg-white text-blue-600 hover:bg-grey-100 '>Shop Now</Button>
                        <Button variant="outline" className='border-white text-white hover:bg-white hover:text-blue-600 bg-transparent'>View Deals  </Button>
                        </div>
                </div>
                <div className='relative'>
                    <img src="" alt="" width={500} height={400} className='rounded-lg shadow-2xl'/>
                </div>
            </div>
        </div>
      
    </section>
  )
}

export default Hero
