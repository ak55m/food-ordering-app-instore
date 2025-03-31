
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Map, Star, Clock, UtensilsCrossed, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Hero Section with Cartoon Style */}
      <header className="relative overflow-hidden bg-gradient-to-b from-brand-cyan to-brand-light pt-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-orange rounded-full -ml-10 -mb-10"></div>
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-block bg-white/30 px-4 py-1 rounded-full backdrop-blur-sm">
                <span className="text-brand-cyan font-bold text-sm">Discover & Order</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-omnes tracking-tight text-gray-900">
                <span className="text-brand-cyan">Munch</span>Map
              </h1>
              <p className="text-xl text-gray-700 max-w-lg">
                Find and order from the best restaurants near you with our cartoon-style food delivery app!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button 
                  onClick={() => navigate('/login')} 
                  className="bg-brand-cyan hover:bg-brand-cyan/90 text-white font-medium px-6 py-3 rounded-full text-lg shadow-lg shadow-brand-cyan/30"
                  size="lg"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const featuresSection = document.getElementById('features');
                    featuresSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="border-brand-cyan text-brand-cyan font-medium px-6 py-3 rounded-full text-lg"
                  size="lg"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="relative">
                {/* Cartoon Food Image with Speech Bubble */}
                <div className="absolute -right-6 -top-10 transform rotate-12 bg-white p-3 rounded-xl shadow-lg">
                  <div className="text-brand-orange font-bold">Yummy!</div>
                  <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white transform rotate-45"></div>
                </div>
                
                <div className="bg-white p-4 rounded-3xl shadow-xl border-4 border-brand-cyan relative">
                  <img 
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop" 
                    alt="Delicious food" 
                    className="rounded-2xl h-[300px] w-[250px] md:h-[350px] md:w-[300px] object-cover"
                  />
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    <span>🍕</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cartoon Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ebf7fd" fillOpacity="1" d="M0,96L48,122.7C96,149,192,203,288,208C384,213,480,171,576,144C672,117,768,107,864,128C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </header>

      {/* Features Section with Cartoon Icons */}
      <section id="features" className="py-16 md:py-24 bg-brand-light relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-omnes text-brand-cyan">
              Why choose MunchMap?
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Experience a better way to discover and order from restaurants in your area.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards with Cartoon Style */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-brand-cyan/20 hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light text-brand-cyan mb-5">
                <Map className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-omnes mb-3 text-gray-800">Discover local gems</h3>
              <p className="text-gray-600">
                Find hidden culinary treasures in your neighborhood that you never knew existed!
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-brand-cyan/20 hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light text-brand-cyan mb-5">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-omnes mb-3 text-gray-800">Restaurant ratings</h3>
              <p className="text-gray-600">
                Make informed choices with our community-driven restaurant ratings and reviews.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-brand-cyan/20 hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light text-brand-cyan mb-5">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-omnes mb-3 text-gray-800">Real-time tracking</h3>
              <p className="text-gray-600">
                Follow your order from the kitchen to your doorstep with our real-time tracking.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-brand-cyan/20 hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light text-brand-cyan mb-5">
                <UtensilsCrossed className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-omnes mb-3 text-gray-800">Wide selection</h3>
              <p className="text-gray-600">
                Browse menus from hundreds of restaurants offering various cuisines and dishes.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-brand-cyan/20 hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light text-brand-cyan mb-5">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-omnes mb-3 text-gray-800">Location-based search</h3>
              <p className="text-gray-600">
                Find restaurants near your current location or any address you specify.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-brand-cyan/20 hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light text-brand-cyan mb-5">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-omnes mb-3 text-gray-800">Seamless ordering</h3>
              <p className="text-gray-600">
                Enjoy a smooth ordering process from menu browsing to checkout and payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Cartoon Elements */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full rotate-180">
            <path fill="#ebf7fd" fillOpacity="1" d="M0,96L48,122.7C96,149,192,203,288,208C384,213,480,171,576,144C672,117,768,107,864,128C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-gradient-to-r from-brand-cyan to-brand-cyan/80 rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold font-omnes text-white mb-4">
                  Ready to discover amazing restaurants?
                </h2>
                <p className="text-xl text-white/90">
                  Join thousands of food lovers who use MunchMap everyday to find their next favorite meal!
                </p>
              </div>
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-300 rounded-full animate-bounce"></div>
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-white hover:bg-white/90 text-brand-cyan font-bold px-8 py-4 rounded-full text-lg shadow-lg"
                  size="lg"
                >
                  Start Exploring
                </Button>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-brand-orange rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Cartoon Avatars */}
      <section className="py-16 md:py-24 bg-brand-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-omnes text-brand-cyan">
              What our users say
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from people who have discovered great food with MunchMap
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah J.",
                role: "Food Enthusiast",
                quote: "MunchMap helped me discover amazing restaurants in my neighborhood that I never knew existed!",
                emoji: "😋"
              },
              {
                name: "Michael T.",
                role: "Busy Professional",
                quote: "The real-time tracking feature is a game-changer. I always know exactly when my food will arrive.",
                emoji: "🕒"
              },
              {
                name: "Priya K.",
                role: "Foodie Explorer",
                quote: "I love the rating system! It's helped me find the best hidden gems in my city.",
                emoji: "⭐"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-brand-cyan rounded-full flex items-center justify-center text-white text-2xl shadow-md">
                    {testimonial.emoji}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-brand-cyan">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer with Cartoon Style */}
      <footer className="bg-brand-cyan text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full opacity-30 -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 rounded-full opacity-30 -ml-10 -mb-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold font-omnes mb-4">MunchMap</h3>
              <p className="text-white/80 max-w-xs">
                Connecting food lovers with great restaurants since 2024.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white/80 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="text-white/80 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-white/80 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white/80 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-white/80 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white/80 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-white/80 hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80">&copy; 2024 MunchMap. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
