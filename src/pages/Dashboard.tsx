
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Hotel, Map, Users, Play, Pause, PlaneTakeoff } from 'lucide-react';
import NavBar from '@/components/NavBar';
import SearchBox from '@/components/SearchBox';
import TypewriterText from '@/components/TypewriterText';
import TrendingPlaces from '@/components/TrendingPlaces';
import SimpleWorldMap from '@/components/SimpleWorldMap';
import FeatureCard from '@/components/FeatureCard';
import CardSpotlight from '@/components/CardSpotlight';

const Dashboard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({
    features: false,
    trending: false,
    map: false,
    testimonials: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      
      const featuresSectionEl = document.getElementById('features-section');
      const trendingSectionEl = document.getElementById('trending-section');
      const mapSectionEl = document.getElementById('map-section');
      const testimonialsSectionEl = document.getElementById('testimonials-section');
      
      if (featuresSectionEl) {
        const featuresPosition = featuresSectionEl.offsetTop + 200;
        setIsVisible(prev => ({ 
          ...prev, 
          features: scrollPosition > featuresPosition 
        }));
      }
      
      if (trendingSectionEl) {
        const trendingPosition = trendingSectionEl.offsetTop + 200;
        setIsVisible(prev => ({ 
          ...prev, 
          trending: scrollPosition > trendingPosition 
        }));
      }
      
      if (mapSectionEl) {
        const mapPosition = mapSectionEl.offsetTop + 200;
        setIsVisible(prev => ({ 
          ...prev, 
          map: scrollPosition > mapPosition 
        }));
      }
      
      if (testimonialsSectionEl) {
        const testimonialsPosition = testimonialsSectionEl.offsetTop + 200;
        setIsVisible(prev => ({ 
          ...prev, 
          testimonials: scrollPosition > testimonialsPosition 
        }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleVideo = () => {
    const videoElement = document.getElementById('promotional-video') as HTMLVideoElement;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5 select-none pointer-events-none grid grid-cols-5 gap-4">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center text-9xl font-bold text-trip-500">
              TripSync
            </div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 pt-8 sm:pt-16 max-w-7xl">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white break-words px-2">
              <TypewriterText text="Plan your dream trip with personalized preferences" />
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 px-4">
              Your journey, your way. Discover, plan, and enjoy budget-friendly travel experiences in India.
            </p>
            
            <div className="mb-12 md:mb-16">
              <SearchBox />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 bg-gradient-to-br from-soft-purple-50 to-soft-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create Your Perfect Journey
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Transform your travel dreams into reality with our intelligent trip planning tools. 
                Personalize every aspect of your adventure, from destination selection to detailed itineraries.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/input" 
                  className="px-6 py-3 bg-trip-500 text-white rounded-full hover:bg-trip-600 transition-colors flex items-center space-x-2"
                >
                  <PlaneTakeoff className="h-5 w-5" />
                  <span>Start Planning</span>
                </Link>
                <Link 
                  to="/dashboard" 
                  className="px-6 py-3 border border-trip-500 text-trip-500 rounded-full hover:bg-trip-50 transition-colors flex items-center space-x-2"
                >
                  <Users className="h-5 w-5" />
                  <span>Explore Trips</span>
                </Link>
              </div>
            </div>
            
            <CardSpotlight className="rounded-xl overflow-hidden shadow-xl">
              <div className="bg-white dark:bg-gray-800 p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <Brain className="h-10 w-10 text-trip-500" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    AI-Powered Trip Recommendations
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Get smart, personalized travel suggestions based on your preferences, budget, and interests.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center space-x-2">
                    <Map className="h-5 w-5 text-trip-500" />
                    <span>Customized Destination Matching</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Hotel className="h-5 w-5 text-trip-500" />
                    <span>Tailored Accommodation Suggestions</span>
                  </li>
                </ul>
              </div>
            </CardSpotlight>
          </div>
        </div>
      </section>
      
      <section 
        id="features-section" 
        className={`py-16 px-4 transition-all duration-1000 transform ${
          isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Experience Smart Travel Planning</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              title="AI Recommendations"
              description="Get personalized recommendations with our smart AI algorithms based on your preferences."
            />
            <FeatureCard
              icon={<Hotel className="h-6 w-6" />}
              title="Save Places"
              description="Bookmark hotels, restaurants, and attractions to plan your perfect itinerary."
            />
            <FeatureCard
              icon={<Map className="h-6 w-6" />}
              title="Custom Maps"
              description="View all your saved locations on an interactive map for easy navigation."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Collaborate & Share"
              description="Plan trips with friends and family by sharing your itineraries easily."
            />
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-8">Experience India's Beauty</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            From bustling cities to serene beaches, discover the diversity of incredible India.
          </p>
          
          <div className="relative rounded-2xl overflow-hidden mx-auto max-w-4xl shadow-xl">
            <video
              id="promotional-video"
              className="w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              loop
              muted
            >
              <source src="https://static.videezy.com/system/resources/previews/000/041/899/original/22.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <button
              onClick={toggleVideo}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            >
              <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white" />
                )}
              </div>
            </button>
          </div>
        </div>
      </section>
      
      <section 
        id="trending-section" 
        className={`py-16 px-4 transition-all duration-1000 transform ${
          isVisible.trending ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <TrendingPlaces />
        </div>
      </section>
      
      <section 
        id="map-section" 
        className={`py-16 px-4 transition-all duration-1000 transform ${
          isVisible.map ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-8">Explore Travel Routes</h2>
          <SimpleWorldMap />
        </div>
      </section>
      
      <section 
        id="testimonials-section" 
        className={`py-16 px-4 bg-gray-50 dark:bg-gray-900/30 transition-all duration-1000 transform ${
          isVisible.testimonials ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Travelers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                location: "Mumbai",
                comment: "TripSync helped me plan a perfect weekend getaway to Goa within my budget. The hotel recommendations were on point!",
                avatar: "https://randomuser.me/api/portraits/women/32.jpg"
              },
              {
                name: "Rahul Verma",
                location: "Delhi",
                comment: "I loved how easy it was to find budget-friendly options for my trip to Kerala. The must-visit places feature saved me hours of research.",
                avatar: "https://randomuser.me/api/portraits/men/45.jpg"
              },
              {
                name: "Ananya Patel",
                location: "Bangalore",
                comment: "The travel cost breakdown feature is amazing! It helped me plan my Rajasthan trip with accurate estimates and no surprises.",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{testimonial.comment}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/signup">
              <button className="bg-trip-500 hover:bg-trip-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
                Start Planning Your Trip
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-100 dark:bg-gray-800 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">TripSync</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your personalized budget-friendly travel companion for exploring India.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-trip-500 dark:hover:text-trip-400">Home</Link></li>
                <li><Link to="/input" className="text-gray-600 dark:text-gray-300 hover:text-trip-500 dark:hover:text-trip-400">Plan a Trip</Link></li>
                <li><Link to="/signup" className="text-gray-600 dark:text-gray-300 hover:text-trip-500 dark:hover:text-trip-400">Sign Up</Link></li>
                <li><Link to="/signin" className="text-gray-600 dark:text-gray-300 hover:text-trip-500 dark:hover:text-trip-400">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Popular Destinations</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-trip-500 dark:hover:text-trip-400">Goa</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-trip-500 dark:hover:text-trip-400">Kerala</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-trip-500 dark:hover:text-trip-400">Rajasthan</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-trip-500 dark:hover:text-trip-400">Himachal Pradesh</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">support@tripsync.example</p>
              <p className="text-gray-600 dark:text-gray-300">+91 1234567890</p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} TripSync. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
