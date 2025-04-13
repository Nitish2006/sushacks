
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Place {
  id: number;
  name: string;
  image: string;
  description: string;
}

const trendingPlaces: Place[] = [
  {
    id: 1,
    name: 'Goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Famous for its beaches, nightlife, and Portuguese heritage',
  },
  {
    id: 2,
    name: 'Jaipur',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Known as the Pink City, famous for its colorful buildings',
  },
  {
    id: 3,
    name: 'Kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Famous for its backwaters, tea plantations and beaches',
  },
  {
    id: 4,
    name: 'Varanasi',
    image: 'https://images.unsplash.com/photo-1561361058-c24cecce58eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'One of the oldest cities in the world, spiritual capital of India',
  },
  {
    id: 5,
    name: 'Darjeeling',
    image: 'https://images.unsplash.com/photo-1544634076-a90160ddf44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Known for its tea plantations, spectacular views of Himalayas',
  },
  {
    id: 6,
    name: 'Udaipur',
    image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Known as the City of Lakes, famous for its palaces and architecture',
  },
  {
    id: 7,
    name: 'Agra',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Home to the Taj Mahal, one of the Seven Wonders of the World',
  },
  {
    id: 8,
    name: 'Manali',
    image: 'https://images.unsplash.com/photo-1626621214430-9485a5d3cb98?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Popular hill station with stunning mountain views',
  },
  {
    id: 9,
    name: 'Rishikesh',
    image: 'https://images.unsplash.com/photo-1544014356-6376b68b6cd4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'The Yoga Capital of the World, famous for spirituality and adventure',
  },
  {
    id: 10,
    name: 'Leh Ladakh',
    image: 'https://images.unsplash.com/photo-1513086288884-66ae5a4d2a5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Known for its remote mountain beauty and Buddhist culture',
  },
  {
    id: 11,
    name: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'India\'s financial capital with vibrant culture and history',
  },
  {
    id: 12,
    name: 'Delhi',
    image: 'https://images.unsplash.com/photo-1592639296346-560c37a0f711?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'India\'s capital with rich history spanning thousands of years',
  },
  {
    id: 13,
    name: 'Kolkata',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'City of Joy, known for its cultural heritage and colonial architecture',
  },
  {
    id: 14,
    name: 'Hampi',
    image: 'https://images.unsplash.com/photo-1605649461361-f0ef50eae1a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Ancient ruins of Vijayanagara Empire with stunning boulder landscape',
  },
  {
    id: 15,
    name: 'Amritsar',
    image: 'https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Home to the Golden Temple, the spiritual center of Sikhism',
  },
];

const TrendingPlaces = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredPlace, setHoveredPlace] = useState<number | null>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -current.clientWidth : current.clientWidth;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handlePlaceClick = (name: string) => {
    window.open(`https://www.google.com/search?q=${name}+tourism+india`, '_blank');
  };

  return (
    <div className="relative w-full py-6">
      <h2 className="text-2xl font-bold mb-4">Trending Places in India</h2>
      
      <div className="relative group">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 py-4 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trendingPlaces.map((place) => (
            <div
              key={place.id}
              className={`
                flex-none w-72 h-56 rounded-lg overflow-hidden relative 
                transform transition-all duration-300 cursor-pointer
                glowing-card
                ${hoveredPlace === place.id ? 'scale-105 z-10' : 'scale-100 z-0'}
              `}
              onMouseEnter={() => setHoveredPlace(place.id)}
              onMouseLeave={() => setHoveredPlace(null)}
              onClick={() => handlePlaceClick(place.name)}
            >
              <img 
                src={place.image} 
                alt={place.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-bold">{place.name}</h3>
                <p className="text-sm text-white/80 mt-1 line-clamp-2">{place.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-background/80 rounded-full shadow-md hidden md:flex"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-background/80 rounded-full shadow-md hidden md:flex"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default TrendingPlaces;
