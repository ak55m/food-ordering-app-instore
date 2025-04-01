
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, MenuSquare, ShoppingCart, Bell } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section with Cartoon Style */}
      <div className="relative pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/80 to-amber-500/70 h-3/4"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:max-w-3xl mx-auto font-omnes">
              <span className="block">Seamless Self-Service</span>
              <span className="block">Ordering for Restaurants & Bars</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-amber-50 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              In house food ordering process automated.
            </p>
            <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center">
              <div className="rounded-md shadow-lg transform rotate-1">
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white bg-brand-orange hover:bg-amber-600 md:py-4 md:text-lg md:px-10"
                >
                  Get Started <ArrowRight className="ml-2" />
                </Button>
              </div>
              <div className="mt-3 rounded-md shadow-lg transform -rotate-1 sm:mt-0 sm:ml-3">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/home')}
                  className="w-full flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-brand-orange bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Browse Menu
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Cartoon App Mockup */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-xl shadow-2xl transform rotate-1 border-4 border-gray-800">
            <div className="relative z-10">
              <img 
                src="/placeholder.svg"
                alt="App mockup"
                className="w-full"
                style={{
                  filter: "drop-shadow(0px 5px 15px rgba(0,0,0,0.2))",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-brand-orange/20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works with Cartoon Style */}
      <div className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-brand-orange font-semibold tracking-wide uppercase font-omnes">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-omnes">
              Order in 4 Simple Steps
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-700 lg:mx-auto">
              A seamless experience from arrival to enjoyment
            </p>
          </div>

          <div className="mt-16">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-4 md:gap-x-8 md:gap-y-10">
              {/* Step 1 */}
              <div className="relative transform hover:scale-105 transition duration-300">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-full bg-brand-orange text-white transform -rotate-3 border-2 border-gray-800">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 font-omnes">Arrive at the location</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  The app detects their location automatically.
                </dd>
              </div>
              
              {/* Step 2 */}
              <div className="relative transform hover:scale-105 transition duration-300">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-full bg-amber-500 text-white transform rotate-3 border-2 border-gray-800">
                    <MenuSquare className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 font-omnes">Browse the menu</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  They see the menu of the restaurant they're at.
                </dd>
              </div>
              
              {/* Step 3 */}
              <div className="relative transform hover:scale-105 transition duration-300">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-full bg-brand-orange text-white transform -rotate-3 border-2 border-gray-800">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 font-omnes">Place an order</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Directly through the app with customization options.
                </dd>
              </div>
              
              {/* Step 4 */}
              <div className="relative transform hover:scale-105 transition duration-300">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-full bg-amber-500 text-white transform rotate-3 border-2 border-gray-800">
                    <Bell className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 font-omnes">Get notified</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  No waiting in line, just pick up the order when it's ready.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Benefits for Restaurants with Cartoon Style */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-brand-orange font-semibold tracking-wide uppercase font-omnes">Benefits for Restaurants</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-omnes">
              Transform Your Business
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Benefit 1 */}
              <div className="relative">
                <div className="p-6 rounded-lg bg-amber-50 border-2 border-gray-800 transform rotate-1 shadow-lg hover:shadow-xl transition duration-300">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 font-omnes">Reduce Labor Costs</h3>
                  <p className="text-base text-gray-500">
                    Less reliance on cashiers & servers means more efficient staffing and reduced costs.
                  </p>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="relative">
                <div className="p-6 rounded-lg bg-amber-50 border-2 border-gray-800 transform -rotate-1 shadow-lg hover:shadow-xl transition duration-300">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 font-omnes">Faster Order Processing</h3>
                  <p className="text-base text-gray-500">
                    Orders go straight to the kitchen, reducing wait times and increasing table turnover.
                  </p>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="relative">
                <div className="p-6 rounded-lg bg-amber-50 border-2 border-gray-800 transform -rotate-1 shadow-lg hover:shadow-xl transition duration-300">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 font-omnes">Increase Revenue</h3>
                  <p className="text-base text-gray-500">
                    Customers can order more conveniently, leading to higher average order values.
                  </p>
                </div>
              </div>
              
              {/* Benefit 4 */}
              <div className="relative">
                <div className="p-6 rounded-lg bg-amber-50 border-2 border-gray-800 transform rotate-1 shadow-lg hover:shadow-xl transition duration-300">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 font-omnes">Improve Customer Experience</h3>
                  <p className="text-base text-gray-500">
                    Shorter wait times & no manual errors create a better dining experience for customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews with Cartoon Style */}
      <div className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-brand-orange font-semibold tracking-wide uppercase font-omnes">Customer Reviews</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-omnes">
              People Love OrderU
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8">
              {/* Review 1 */}
              <div className="bg-white p-6 rounded-lg border-2 border-gray-800 shadow-lg transform rotate-1">
                <div className="flex items-center mb-4">
                  <div className="text-amber-500 flex">
                    {"★★★★★"}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Game changer for our restaurant! Our staff can now focus on service, and customers love the seamless ordering."
                </p>
                <p className="font-semibold">— David R., Restaurant Owner</p>
              </div>

              {/* Review 2 */}
              <div className="bg-white p-6 rounded-lg border-2 border-gray-800 shadow-lg transform -rotate-1">
                <div className="flex items-center mb-4">
                  <div className="text-amber-500 flex">
                    {"★★★★★"}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "I placed my order in seconds and didn't have to wait in line. Super convenient!"
                </p>
                <p className="font-semibold">— Samantha L., Customer</p>
              </div>

              {/* Review 3 */}
              <div className="bg-white p-6 rounded-lg border-2 border-gray-800 shadow-lg transform rotate-1">
                <div className="flex items-center mb-4">
                  <div className="text-amber-500 flex">
                    {"★★★★★"}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "OrderU helped us handle high volumes efficiently. We've cut down wait times significantly!"
                </p>
                <p className="font-semibold">— Michael T., Bar Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* For Customers Section with Cartoon Style */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-brand-orange font-semibold tracking-wide uppercase font-omnes">For Customers</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-omnes">
              A Faster, Easier Way to Order
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="p-6 rounded-lg bg-amber-50 border-2 border-gray-800 transform -rotate-1 shadow-lg hover:shadow-xl transition duration-300">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 font-omnes">Skip the Line</h3>
                  <p className="text-base text-gray-500">
                    Order directly from your phone, no waiting in queues.
                  </p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="relative">
                <div className="p-6 rounded-lg bg-amber-50 border-2 border-gray-800 transform rotate-1 shadow-lg hover:shadow-xl transition duration-300">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 font-omnes">Customize Your Meal</h3>
                  <p className="text-base text-gray-500">
                    Add special requests and preferences easily through the app.
                  </p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="relative">
                <div className="p-6 rounded-lg bg-amber-50 border-2 border-gray-800 transform rotate-1 shadow-lg hover:shadow-xl transition duration-300">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 font-omnes">Track Your Order in Real Time</h3>
                  <p className="text-base text-gray-500">
                    Get updates from the kitchen as your food is being prepared.
                  </p>
                </div>
              </div>
              
              {/* Feature 4 */}
              <div className="relative">
                <div className="p-6 rounded-lg bg-amber-50 border-2 border-gray-800 transform -rotate-1 shadow-lg hover:shadow-xl transition duration-300">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 font-omnes">Seamless Payment</h3>
                  <p className="text-base text-gray-500">
                    Pay directly in the app, no need for cash or cards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA with Cartoon Style */}
      <div className="py-16 bg-gradient-to-r from-brand-orange/80 to-amber-500/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl font-omnes">
              <span className="block">Ready to Revolutionize Your Ordering System?</span>
            </h2>
            <div className="mt-8 flex justify-center">
              <div className="rounded-md shadow-lg transform rotate-2">
                <Button 
                  onClick={() => navigate('/login')}
                  className="px-5 py-3 border-2 border-white text-base font-medium rounded-md text-brand-orange bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-8"
                >
                  Get Started
                </Button>
              </div>
              <div className="ml-3 rounded-md shadow-lg transform -rotate-2">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/home')}
                  className="px-5 py-3 border-2 border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-brand-orange/60 md:py-4 md:text-lg md:px-8"
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
