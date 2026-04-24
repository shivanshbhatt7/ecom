import { Headphones, Shield,Truck } from 'lucide-react'
import React from 'react'

const Features = () => {
  return (
    <section className='py-12 bg-muted/50'>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className='h-6 w-6 text-blue-600'></Truck>
                </div>
                <div>
                    <h3 className="font-bold">Free Shipping</h3>
                    <p className="text-muted-foreground font-semibold">On order over ₹500</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className='h-6 w-6 text-green-600'/>
                </div>
                <div>
                    <h3 className="font-bold">Secure Payment</h3>
                    <p className="text-muted-foreground font-semibold">Your data is safe with us</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Headphones className='h-6 w-6 text-purple-600'/>
                </div>
                <div>
                    <h3 className="font-bold">24/7 Support</h3>
                    <p className="text-muted-foreground font-semibold">Get help whenever you need it</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}

export default Features;
