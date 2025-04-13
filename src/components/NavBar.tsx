
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

interface NavLink {
  name: string;
  href: string;
  dropdown?: { name: string; href: string }[];
}

const navLinks: NavLink[] = [
  {
    name: "Discover",
    href: "#",
    dropdown: [
      { name: "Travellers' Choice", href: "/dashboard" },
      { name: "Travel Stories", href: "/dashboard" },
    ],
  },
  {
    name: "Trips",
    href: "#",
    dropdown: [
      { name: "View My Trips", href: "/dashboard" },
      { name: "Start a New Trip", href: "/input" },
    ],
  },
  {
    name: "Review",
    href: "#",
    dropdown: [
      { name: "Write a Review", href: "/dashboard" },
      { name: "Post Photos", href: "/dashboard" },
    ],
  },
  {
    name: "Forums",
    href: "/dashboard",
  },
];

const NavBar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > prevScrollY && currentScrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Close dropdowns when navigating to a new route
  useEffect(() => {
    setActiveDropdown(null);
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav 
      className={`fixed w-full bg-background/80 backdrop-blur-md z-50 transition-transform duration-300 shadow-sm ${
        visible ? "transform-none" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-trip-500">
                TripSync
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.dropdown ? (
                    <button
                      className="floating-dock px-3 py-2 rounded-md text-sm font-medium hover:text-trip-500 focus:outline-none flex items-center"
                      onClick={() => toggleDropdown(link.name)}
                      aria-expanded={activeDropdown === link.name}
                    >
                      {link.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className="px-3 py-2 rounded-md text-sm font-medium hover:text-trip-500 focus:outline-none"
                    >
                      {link.name}
                    </Link>
                  )}
                  
                  {link.dropdown && (
                    <div
                      className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-background ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ease-in-out ${
                        activeDropdown === link.name
                          ? "transform opacity-100 scale-100"
                          : "transform opacity-0 scale-95 pointer-events-none"
                      }`}
                    >
                      <div className="py-1">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block px-4 py-2 text-sm hover:bg-muted"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <ThemeToggle />
            
            <div className="flex items-center space-x-2">
              <Link to="/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.dropdown ? (
                  <button
                    className="block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    onClick={() => toggleDropdown(link.name)}
                  >
                    <div className="flex justify-between items-center">
                      {link.name}
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>
                ) : (
                  <Link
                    to={link.href}
                    className="block px-3 py-2 rounded-md text-base font-medium w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
                
                {link.dropdown && activeDropdown === link.name && (
                  <div className="ml-4 space-y-1 mt-1">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                        onClick={() => {
                          setActiveDropdown(null);
                          setIsOpen(false);
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-5 space-x-2">
              <Link to="/signin" className="w-full">
                <Button variant="ghost" className="w-full">Sign In</Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
