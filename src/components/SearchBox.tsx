
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/input?destination=${encodeURIComponent(query)}`);
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto transform transition-all duration-300 hover:scale-105">
      <div className="relative card-spotlight bg-white dark:bg-card rounded-full shadow-lg p-1.5">
        <form onSubmit={handleSearch} className="flex items-center">
          <Input
            type="text"
            placeholder="Where to? (e.g., Goa, Kerala, Jaipur)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-none shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full pl-5 pr-16"
          />
          <Button 
            type="submit" 
            size="icon"
            className="absolute right-1.5 h-9 w-9 bg-trip-500 hover:bg-trip-600 text-white rounded-full"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SearchBox;
