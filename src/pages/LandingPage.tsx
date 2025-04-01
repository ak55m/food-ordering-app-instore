
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Seamless Self-Service</span>
              <span className="block text-cyan-600">Ordering for Restaurants & Bars</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              OrderU eliminates expensive kiosks & long wait times, making food ordering faster and smarter.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started Today
                </Button>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/home')}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-cyan-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Browse Menu
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="relative h-64 sm:h-72 md:h-96 bg-cyan-100 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/placeholder.svg" 
                alt="App mockup"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-2xl font-bold text-gray-800">App Mockup</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-cyan-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple 3-Step Process
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Scan & Order</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Customers scan a QR code or use the app to place orders directly from their table.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 text-white">
                  <span className="text-xl font-bold">2</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Real-Time Kitchen Updates</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Orders go directly to the kitchen for faster processing and preparation.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 text-white">
                  <span className="text-xl font-bold">3</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Enjoy & Pay with Ease</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Customers receive updates and check out seamlessly when they're ready to pay.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits for Restaurants */}
      <div className="py-12 bg-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-cyan-600 font-semibold tracking-wide uppercase">Benefits for Restaurants</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              Transform Your Business
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Benefit 1 */}
              <div className="relative">
                <div className="mt-2 mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Reduce Labor Costs</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Less reliance on cashiers & servers means more efficient staffing and reduced costs.
                  </p>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="relative">
                <div className="mt-2 mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Faster Order Processing</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Orders go straight to the kitchen, reducing wait times and increasing table turnover.
                  </p>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="relative">
                <div className="mt-2 mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Increase Revenue</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Customers can order more conveniently, leading to higher average order values.
                  </p>
                </div>
              </div>
              
              {/* Benefit 4 */}
              <div className="relative">
                <div className="mt-2 mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Improve Customer Experience</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Shorter wait times & no manual errors create a better dining experience for customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-cyan-600 font-semibold tracking-wide uppercase">Customer Reviews</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              People Love OrderU
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8">
              {/* Review 1 */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="text-amber-500 flex">
                    {"★★★★★"}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Game changer for our restaurant! Our staff can now focus on service, and customers love the seamless ordering."
                </p>
                <p className="font-semibold">— David R., Restaurant Owner</p>
              </div>

              {/* Review 2 */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="text-amber-500 flex">
                    {"★★★★★"}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "I placed my order in seconds and didn't have to wait in line. Super convenient!"
                </p>
                <p className="font-semibold">— Samantha L., Customer</p>
              </div>

              {/* Review 3 */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="text-amber-500 flex">
                    {"★★★★★"}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "OrderU helped us handle high volumes efficiently. We've cut down wait times significantly!"
                </p>
                <p className="font-semibold">— Michael T., Bar Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* For Customers Section */}
      <div className="py-12 bg-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-cyan-600 font-semibold tracking-wide uppercase">For Customers</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              A Faster, Easier Way to Order
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="mt-2 mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Skip the Line</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Order directly from your phone, no waiting in queues.
                  </p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="relative">
                <div className="mt-2 mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Customize Your Meal</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Add special requests and preferences easily through the app.
                  </p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="relative">
                <div className="mt-2 mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Track Your Order in Real Time</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get updates from the kitchen as your food is being prepared.
                  </p>
                </div>
              </div>
              
              {/* Feature 4 */}
              <div className="relative">
                <div className="mt-2 mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Seamless Payment</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Pay directly in the app, no need for cash or cards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 bg-gradient-to-r from-cyan-600 to-cyan-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to Revolutionize Your Ordering System?</span>
            </h2>
            <div className="mt-8 flex justify-center">
              <div className="rounded-md shadow">
                <Button 
                  onClick={() => navigate('/login')}
                  className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-cyan-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-8"
                >
                  Get Started
                </Button>
              </div>
              <div className="ml-3 rounded-md shadow">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/home')}
                  className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-700 hover:bg-cyan-800 md:py-4 md:text-lg md:px-8"
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
