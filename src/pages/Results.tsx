
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, MapPin, Utensils, Hotel, Car, ArrowDown, Calendar, Users, Droplets, ThermometerSun } from "lucide-react";
import NavBar from "@/components/NavBar";
import CardSpotlight from "@/components/CardSpotlight";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, differenceInDays } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define types for data structures
interface TripData {
  destination: string;
  mustVisitPlaces: string[];
  dateRange: {
    from: Date;
    to: Date;
  };
  maxDuration: number;
  numPeople: number;
  maxBudget: number;
}

interface HotelOption {
  name: string;
  pricePerNight: number;
  totalPrice: number;
  rating: number;
  amenities: string[];
  image: string;
}

interface RestaurantOption {
  name: string;
  pricePerMeal: number;
  totalPrice: number;
  rating: number;
  cuisine: string;
  image: string;
}

interface Attraction {
  name: string;
  price: number;
  rating: number;
  image: string;
  description: string;
}

interface TravelMode {
  mode: string;
  pricePerDay: number;
  totalPrice: number;
  icon: React.ReactNode;
}

interface WeatherInfo {
  condition: string;
  temperature: number;
  precipitation: number;
  humidity: number;
  icon: React.ReactNode;
}

const Results = () => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [hotelOptions, setHotelOptions] = useState<HotelOption[]>([]);
  const [restaurantOptions, setRestaurantOptions] = useState<RestaurantOption[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [travelModes, setTravelModes] = useState<TravelMode[]>([]);
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [hotelPricesData, setHotelPricesData] = useState<any[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get trip data from localStorage
    const storedTripData = localStorage.getItem('tripData');
    
    if (!storedTripData) {
      toast({
        title: "No trip data found",
        description: "Please plan a trip first",
        variant: "destructive",
      });
      navigate('/input');
      return;
    }
    
    try {
      const parsedData = JSON.parse(storedTripData);
      
      // Format dates properly
      const formattedData = {
        ...parsedData,
        dateRange: {
          from: new Date(parsedData.dateRange.from),
          to: new Date(parsedData.dateRange.to),
        },
      };
      
      setTripData(formattedData);
      
      // Simulate API call to get recommendations
      setTimeout(() => {
        generateRecommendations(formattedData);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error parsing trip data:', error);
      navigate('/input');
    }
  }, []);

  const generateRecommendations = (data: TripData) => {
    // Calculate number of nights
    const nights = differenceInDays(data.dateRange.to, data.dateRange.from);
    
    // Generate hotel options
    const hotels: HotelOption[] = [
      {
        name: "Budget Inn",
        pricePerNight: 1200 + Math.floor(Math.random() * 300),
        totalPrice: 0, // Will calculate below
        rating: 3.5,
        amenities: ["Free WiFi", "Air Conditioning", "TV"],
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
      },
      {
        name: "Comfort Stay",
        pricePerNight: 2200 + Math.floor(Math.random() * 400),
        totalPrice: 0,
        rating: 4.2,
        amenities: ["Free WiFi", "Air Conditioning", "Pool", "Breakfast", "Parking"],
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
      },
      {
        name: "Luxury Resort",
        pricePerNight: 4500 + Math.floor(Math.random() * 800),
        totalPrice: 0,
        rating: 4.8,
        amenities: ["Free WiFi", "Air Conditioning", "Pool", "Spa", "Restaurant", "Gym", "Room Service"],
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
      },
    ];
    
    // Calculate total price for each hotel
    hotels.forEach(hotel => {
      hotel.totalPrice = hotel.pricePerNight * nights;
    });
    
    setHotelOptions(hotels);
    
    // Generate restaurant options (per person per day)
    const restaurants: RestaurantOption[] = [
      {
        name: "Local Eats",
        pricePerMeal: 250 + Math.floor(Math.random() * 100),
        totalPrice: 0,
        rating: 4.0,
        cuisine: "Local Indian",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
      },
      {
        name: "Family Restaurant",
        pricePerMeal: 450 + Math.floor(Math.random() * 150),
        totalPrice: 0,
        rating: 4.3,
        cuisine: "Multi-cuisine",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
      },
      {
        name: "Fine Dining",
        pricePerMeal: 800 + Math.floor(Math.random() * 200),
        totalPrice: 0,
        rating: 4.7,
        cuisine: "Fine Dining",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
      },
    ];
    
    // Calculate total food price (3 meals per day per person)
    restaurants.forEach(restaurant => {
      restaurant.totalPrice = restaurant.pricePerMeal * data.numPeople * nights * 3;
    });
    
    setRestaurantOptions(restaurants);
    
    // Generate attractions (these will be popular places or other tourist spots)
    const generatedAttractions: Attraction[] = [];
    
    // Add must-visit places first
    data.mustVisitPlaces.forEach((place, index) => {
      generatedAttractions.push({
        name: place,
        price: 100 + Math.floor(Math.random() * 300), // Random price
        rating: 4 + Math.random(),
        image: `https://source.unsplash.com/300x200/?india,${place.replace(/\s/g, '')}`,
        description: `A popular attraction in ${data.destination}. Must-visit for tourists.`,
      });
    });
    
    // Add some additional attractions if needed
    if (generatedAttractions.length < 5) {
      const extraAttractions = [
        {
          name: "Local Museum",
          price: 150,
          rating: 4.2,
          image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
          description: "Explore the rich culture and history of the region.",
        },
        {
          name: "Heritage Site",
          price: 300,
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1609948543931-f1f1a2af8c74?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
          description: "Ancient site with historical significance.",
        },
        {
          name: "Adventure Park",
          price: 500,
          rating: 4.4,
          image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
          description: "Fun activities for all age groups.",
        },
        {
          name: "Local Beach",
          price: 0,
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
          description: "Relax on the beautiful sandy shores.",
        },
        {
          name: "City Tour",
          price: 250,
          rating: 4.3,
          image: "https://images.unsplash.com/photo-1611821064430-0d40291138e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
          description: "Guided tour of the city's highlights.",
        },
      ];
      
      // Add some extra attractions
      for (let i = 0; i < Math.min(5 - generatedAttractions.length, extraAttractions.length); i++) {
        generatedAttractions.push(extraAttractions[i]);
      }
    }
    
    setAttractions(generatedAttractions);
    
    // Generate travel modes
    setTravelModes([
      {
        mode: "Cab",
        pricePerDay: 1200,
        totalPrice: 1200 * data.maxDuration,
        icon: <Car className="h-6 w-6" />,
      },
      {
        mode: "Auto Rickshaw",
        pricePerDay: 800,
        totalPrice: 800 * data.maxDuration,
        icon: <Car className="h-6 w-6" />,
      },
      {
        mode: "Two Wheeler Rental",
        pricePerDay: 500,
        totalPrice: 500 * data.maxDuration,
        icon: <Car className="h-6 w-6" />,
      },
    ]);
    
    // Generate weather info
    setWeatherInfo({
      condition: Math.random() > 0.5 ? "Sunny" : "Partly Cloudy",
      temperature: Math.floor(Math.random() * 10) + 25, // 25-35°C
      precipitation: Math.floor(Math.random() * 20), // 0-20%
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      icon: Math.random() > 0.5 ? <ThermometerSun className="h-6 w-6" /> : <Droplets className="h-6 w-6" />,
    });
    
    // Generate price data for chart
    const chartData = [];
    const startDate = new Date(data.dateRange.from);
    
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i);
      const formatted = format(currentDate, "MMM d");
      
      chartData.push({
        date: formatted,
        "Budget Inn": 1200 + Math.floor(Math.random() * 300),
        "Comfort Stay": 2200 + Math.floor(Math.random() * 400),
        "Luxury Resort": 4500 + Math.floor(Math.random() * 800),
      });
    }
    
    setHotelPricesData(chartData);
    
    // Calculate total budget (using the budget options)
    const hotelCost = hotels[0].totalPrice; // Budget hotel
    const foodCost = restaurants[0].totalPrice; // Budget restaurant
    const attractionsCost = generatedAttractions.reduce((sum, attr) => sum + attr.price, 0);
    const transportCost = travelModes[2].totalPrice; // Two wheeler (cheapest)
    
    const total = hotelCost + foodCost + attractionsCost + transportCost;
    setTotalBudget(total);
  };

  if (isLoading || !tripData) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Generating your personalized trip plan...</h2>
            <div className="animate-pulse flex space-x-4 justify-center">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
              <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-12 w-12"></div>
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Trip to {tripData.destination}</h1>
            <div className="flex items-center mt-2 space-x-6 text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {format(tripData.dateRange.from, "MMM d")} - {format(tripData.dateRange.to, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{tripData.numPeople} {tripData.numPeople === 1 ? 'Person' : 'People'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate('/input')}>
              Modify Trip
            </Button>
            <Button onClick={() => {
              toast({
                title: "Trip plan shared",
                description: "Link copied to clipboard!",
              });
            }}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Plan
            </Button>
          </div>
        </div>
        
        {/* Budget Summary */}
        <div className="mb-8">
          <CardSpotlight className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">Trip Budget Summary</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Budget-optimized plan for {differenceInDays(tripData.dateRange.to, tripData.dateRange.from)} days
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 text-center">
                <div className="text-3xl font-bold text-trip-500">₹{totalBudget.toLocaleString()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {totalBudget <= tripData.maxBudget 
                    ? `₹${(tripData.maxBudget - totalBudget).toLocaleString()} under your max budget` 
                    : `₹${(totalBudget - tripData.maxBudget).toLocaleString()} over your max budget`}
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Hotel</div>
                <div className="text-lg font-semibold">₹{hotelOptions[0].totalPrice.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Food</div>
                <div className="text-lg font-semibold">₹{restaurantOptions[0].totalPrice.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Attractions</div>
                <div className="text-lg font-semibold">
                  ₹{attractions.reduce((sum, attr) => sum + attr.price, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Transport</div>
                <div className="text-lg font-semibold">₹{travelModes[2].totalPrice.toLocaleString()}</div>
              </div>
            </div>
          </CardSpotlight>
        </div>
        
        {/* Hotel and Restaurant Section */}
        <div className="mb-8">
          <Tabs defaultValue="hotels">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Accommodation & Dining</h2>
              <TabsList>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                <TabsTrigger value="priceChart">Price Chart</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="hotels" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hotelOptions.map((hotel, index) => (
                  <CardSpotlight key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="relative h-40">
                      <img 
                        src={hotel.image} 
                        alt={hotel.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs font-semibold">
                        {hotel.rating} ★
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{hotel.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hotel.amenities.slice(0, 3).map((amenity, i) => (
                          <span 
                            key={i} 
                            className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <span className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded-full">
                            +{hotel.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Per night</div>
                          <div className="font-semibold">₹{hotel.pricePerNight.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
                          <div className="font-semibold">₹{hotel.totalPrice.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </CardSpotlight>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Recommended: <span className="font-semibold text-trip-500">Budget Inn</span> - best balance of comfort and value
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="restaurants" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {restaurantOptions.map((restaurant, index) => (
                  <CardSpotlight key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="relative h-40">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs font-semibold">
                        {restaurant.rating} ★
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {restaurant.cuisine}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Per meal/person</div>
                          <div className="font-semibold">₹{restaurant.pricePerMeal.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Total (trip)</div>
                          <div className="font-semibold">₹{restaurant.totalPrice.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </CardSpotlight>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Recommended: <span className="font-semibold text-trip-500">Local Eats</span> - authentic local cuisine at budget-friendly prices
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="priceChart">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 overflow-hidden">
                <h3 className="text-lg font-semibold mb-4">Hotel Price Comparison</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={hotelPricesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Budget Inn" fill="#3B82F6" />
                      <Bar dataKey="Comfort Stay" fill="#10B981" />
                      <Bar dataKey="Luxury Resort" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      Budget Inn
                    </div>
                    <div>
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Comfort Stay
                    </div>
                    <div>
                      <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                      Luxury Resort
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <p>
                      <ArrowDown className="inline h-4 w-4 mr-1" />
                      Best dates: {format(tripData.dateRange.from, "MMM d")} - {format(tripData.dateRange.to, "MMM d")} (lowest prices)
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Must Visit Places Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Must Visit Places</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 glowing-card"
              >
                <div className="relative h-48">
                  <img 
                    src={attraction.image} 
                    alt={attraction.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white">{attraction.name}</h3>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-white/80">
                        {attraction.rating.toFixed(1)} ★
                      </div>
                      <div className="font-medium text-white">
                        {attraction.price > 0 ? `₹${attraction.price}` : 'Free'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {attraction.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Travel Options and Climate Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Local Transportation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {travelModes.map((mode, index) => (
                <CardSpotlight key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-trip-100 dark:bg-trip-900/30 flex items-center justify-center text-trip-500">
                      {mode.icon}
                    </div>
                    <h3 className="ml-3 text-lg font-semibold">{mode.mode}</h3>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Per day</div>
                    <div className="font-semibold">₹{mode.pricePerDay}</div>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total (for {tripData.maxDuration} days)</div>
                    <div className="font-semibold">₹{mode.totalPrice}</div>
                  </div>
                  {index === 2 && (
                    <div className="mt-3 text-xs text-trip-500 font-medium">
                      Recommended: Most economical option
                    </div>
                  )}
                </CardSpotlight>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Climate Information</h2>
            
            {weatherInfo && (
              <CardSpotlight className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Expected Weather</div>
                    <div className="text-xl font-semibold">{weatherInfo.condition}</div>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-trip-100 dark:bg-trip-900/30 flex items-center justify-center text-trip-500">
                    {weatherInfo.icon}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                    <div className="text-sm">Temperature</div>
                    <div className="font-medium">{weatherInfo.temperature}°C</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                    <div className="text-sm">Precipitation</div>
                    <div className="font-medium">{weatherInfo.precipitation}%</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                    <div className="text-sm">Humidity</div>
                    <div className="font-medium">{weatherInfo.humidity}%</div>
                  </div>
                </div>
                
                <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-trip-500" />
                    <div>
                      Pack accordingly for {tripData.destination}'s {weatherInfo.condition.toLowerCase()} weather during your trip dates.
                    </div>
                  </div>
                </div>
              </CardSpotlight>
            )}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Book Your Trip?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
            We've optimized your trip to fit within your budget while maximizing experiences. Book now to secure the best rates!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="px-8">
              <Hotel className="h-5 w-5 mr-2" />
              Book Hotel
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              <Utensils className="h-5 w-5 mr-2" />
              Book Restaurants
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
