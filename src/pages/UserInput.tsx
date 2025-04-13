import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import NavBar from "@/components/NavBar";
import CardSpotlight from "@/components/CardSpotlight";
import MovingBorderButton from "@/components/MovingBorderButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

const indianCities = [
  "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Ahmedabad", 
  "Jaipur", "Lucknow", "Goa", "Kochi", "Agra", "Varanasi", "Shimla", "Rishikesh", 
  "Darjeeling", "Udaipur", "Amritsar", "Mysore", "Pondicherry", "Ooty", "Manali", 
  "Munnar", "Pune", "Leh", "Srinagar", "Andaman & Nicobar Islands", "Kerala", "Jodhpur"
];

const popularPlaces: Record<string, string[]> = {
  "Delhi": ["Red Fort", "Qutub Minar", "India Gate", "Lotus Temple", "Akshardham Temple", "Humayun's Tomb"],
  "Mumbai": ["Gateway of India", "Marine Drive", "Elephanta Caves", "Juhu Beach", "Sanjay Gandhi National Park"],
  "Bangalore": ["Cubbon Park", "Lalbagh", "Bangalore Palace", "Nandi Hills", "Bannerghatta National Park"],
  "Goa": ["Baga Beach", "Calangute Beach", "Fort Aguada", "Basilica of Bom Jesus", "Dudhsagar Falls"],
  "Kerala": ["Alleppey Backwaters", "Munnar", "Wayanad", "Kovalam Beach", "Thekkady"],
  "Jaipur": ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Albert Hall Museum"],
  // Add more cities and their popular places
};

// Default budget estimates
const baseBudgets = {
  hotel: {
    budget: 1500, // per night
    standard: 3000, // per night
    luxury: 6000, // per night
  },
  food: {
    budget: 500, // per day per person
    standard: 1000, // per day per person
    luxury: 2000, // per day per person
  },
  transport: {
    local: 300, // per day
    rental: 600, // per day
  },
  attractions: 500, // per day
};

const UserInput = () => {
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get("destination") || "";
  const [session, setSession] = useState<any>(null);

  const [formData, setFormData] = useState({
    destination: initialDestination,
    mustVisitPlaces: [] as string[],
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
    maxDuration: 5,
    numPeople: 2,
    maxBudget: 20000,
  });
  
  const [placeInput, setPlaceInput] = useState("");
  const [suggestedPlaces, setSuggestedPlaces] = useState<string[]>([]);
  const [estimatedBudget, setEstimatedBudget] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error checking auth session:", error);
      }
      setSession(data.session);
    };
    checkSession();
  }, []);

  useEffect(() => {
    calculateEstimatedBudget();
  }, [formData.destination, formData.maxDuration, formData.numPeople, formData.mustVisitPlaces]);

  useEffect(() => {
    if (formData.destination && popularPlaces[formData.destination]) {
      setSuggestedPlaces(popularPlaces[formData.destination]);
    } else {
      setSuggestedPlaces([]);
    }
  }, [formData.destination]);

  const calculateEstimatedBudget = () => {
    if (!formData.destination || !formData.maxDuration || !formData.numPeople) {
      setEstimatedBudget(0);
      return;
    }

    // Hotel cost: nights * rate
    const hotelCost = formData.maxDuration * baseBudgets.hotel.standard;
    
    // Food cost: days * people * rate
    const foodCost = formData.maxDuration * formData.numPeople * baseBudgets.food.standard;
    
    // Transport cost: days * rate
    const transportCost = formData.maxDuration * baseBudgets.transport.local;
    
    // Attractions cost: based on number of must-visit places (or days if no places selected)
    const attractionsBaseCost = formData.maxDuration * baseBudgets.attractions;
    const attractionsCost = formData.mustVisitPlaces.length
      ? formData.mustVisitPlaces.length * 300 + attractionsBaseCost
      : attractionsBaseCost;
    
    // Total budget
    const totalBudget = hotelCost + foodCost + transportCost + attractionsCost;
    
    setEstimatedBudget(totalBudget);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, destination: value });
  };

  const handleAddPlace = () => {
    if (placeInput && !formData.mustVisitPlaces.includes(placeInput)) {
      setFormData({
        ...formData,
        mustVisitPlaces: [...formData.mustVisitPlaces, placeInput],
      });
      setPlaceInput("");
    }
  };

  const handleRemovePlace = (place: string) => {
    setFormData({
      ...formData,
      mustVisitPlaces: formData.mustVisitPlaces.filter((p) => p !== place),
    });
  };

  const handleSelectSuggestion = (place: string) => {
    if (!formData.mustVisitPlaces.includes(place)) {
      setFormData({
        ...formData,
        mustVisitPlaces: [...formData.mustVisitPlaces, place],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.destination) {
      toast({
        title: "Destination Required",
        description: "Please enter a destination for your trip.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.dateRange.from || !formData.dateRange.to) {
      toast({
        title: "Date Range Required",
        description: "Please select travel dates for your trip.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save trip data to Supabase if user is logged in
      if (session) {
        const { data, error } = await supabase
          .from('trips')
          .insert({
            user_id: session.user.id,
            destination: formData.destination,
            must_visit_places: formData.mustVisitPlaces,
            date_from: formData.dateRange.from?.toISOString(),
            date_to: formData.dateRange.to?.toISOString(),
            max_duration: formData.maxDuration,
            num_people: formData.numPeople,
            max_budget: formData.maxBudget
          })
          .select();
          
        if (error) {
          console.error("Error saving trip:", error);
          toast({
            title: "Error saving trip",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // Store trip ID in localStorage
        if (data && data[0]) {
          localStorage.setItem('currentTripId', data[0].id);
        }
      } else {
        // For non-authenticated users, store in localStorage
        localStorage.setItem('tripData', JSON.stringify(formData));
      }
      
      // Navigate to results page
      setTimeout(() => {
        setIsLoading(false);
        navigate('/results');
      }, 1000);
    } catch (error) {
      console.error("Error in form submission:", error);
      setIsLoading(false);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-2">Plan Your Trip</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Enter your preferences to get personalized budget-friendly recommendations
        </p>
        
        <CardSpotlight className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Destination */}
            <div>
              <Label htmlFor="destination" className="text-lg">Destination</Label>
              <div className="relative mt-1">
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={handleDestinationChange}
                  placeholder="Enter city or state in India"
                  className="w-full"
                  list="destinations"
                />
                <datalist id="destinations">
                  {indianCities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
            </div>
            
            {/* Must Visit Places */}
            <div>
              <Label htmlFor="places" className="text-lg">Must Visit Places</Label>
              <div className="flex mt-1 mb-2">
                <Input
                  id="places"
                  value={placeInput}
                  onChange={(e) => setPlaceInput(e.target.value)}
                  placeholder="Add places you want to visit"
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full"
                />
                <Button
                  type="button"
                  onClick={handleAddPlace}
                  className="ml-2 whitespace-nowrap"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              {/* Suggestions */}
              {showSuggestions && suggestedPlaces.length > 0 && (
                <div className="mb-4">
                  <Label className="text-sm mb-1 block">Suggested Places:</Label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPlaces.map((place) => (
                      <Button
                        key={place}
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`text-sm transition-all ${
                          formData.mustVisitPlaces.includes(place)
                            ? 'bg-trip-100 text-trip-700 dark:bg-trip-900/30 dark:text-trip-400'
                            : ''
                        }`}
                        onClick={() => handleSelectSuggestion(place)}
                      >
                        {place}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Selected places */}
              {formData.mustVisitPlaces.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.mustVisitPlaces.map((place) => (
                    <div
                      key={place}
                      className="group bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full text-sm flex items-center hover:scale-105 transition-transform duration-200"
                    >
                      {place}
                      <button
                        type="button"
                        onClick={() => handleRemovePlace(place)}
                        className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Date Range */}
            <div>
              <Label className="text-lg">Travel Dates</Label>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-1">
                <div className="grid gap-2 w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateRange.from ? (
                          format(formData.dateRange.from, "PPP")
                        ) : (
                          <span>Start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dateRange.from}
                        onSelect={(date) => setFormData({
                          ...formData,
                          dateRange: { ...formData.dateRange, from: date }
                        })}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2 w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateRange.to ? (
                          format(formData.dateRange.to, "PPP")
                        ) : (
                          <span>End date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dateRange.to}
                        onSelect={(date) => setFormData({
                          ...formData,
                          dateRange: { ...formData.dateRange, to: date }
                        })}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            {/* Max Trip Duration */}
            <div>
              <Label htmlFor="maxDuration" className="text-lg">Max Trip Duration (days)</Label>
              <Input
                id="maxDuration"
                type="number"
                min="1"
                max="30"
                value={formData.maxDuration}
                onChange={(e) => setFormData({ ...formData, maxDuration: parseInt(e.target.value) || 1 })}
                className="mt-1 w-full"
              />
            </div>
            
            {/* Number of People */}
            <div>
              <Label htmlFor="numPeople" className="text-lg">Number of People</Label>
              <Input
                id="numPeople"
                type="number"
                min="1"
                max="20"
                value={formData.numPeople}
                onChange={(e) => setFormData({ ...formData, numPeople: parseInt(e.target.value) || 1 })}
                className="mt-1 w-full"
              />
            </div>
            
            {/* Max Budget */}
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="maxBudget" className="text-lg">Max Budget (₹)</Label>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Estimated: ₹{estimatedBudget.toLocaleString()}
                </div>
              </div>
              <Input
                id="maxBudget"
                type="number"
                min="5000"
                step="1000"
                value={formData.maxBudget}
                onChange={(e) => setFormData({ ...formData, maxBudget: parseInt(e.target.value) || 5000 })}
                className="mt-1 w-full"
              />
            </div>
            
            <div className="pt-4">
              <MovingBorderButton
                type="submit"
                className="w-full py-6 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Generating recommendations..." : "Get Personalized Trip Plan"}
              </MovingBorderButton>
            </div>
          </form>
        </CardSpotlight>
      </div>
    </div>
  );
};

export default UserInput;
