
import { useEffect, useRef } from 'react';

const connections = [
  { from: { lat: 28.6139, lng: 77.2090 }, to: { lat: 19.0760, lng: 72.8777 }, name: 'Delhi to Mumbai' },
  { from: { lat: 19.0760, lng: 72.8777 }, to: { lat: 15.2993, lng: 74.1240 }, name: 'Mumbai to Goa' },
  { from: { lat: 15.2993, lng: 74.1240 }, to: { lat: 26.9124, lng: 75.7873 }, name: 'Goa to Jaipur' },
  { from: { lat: 26.9124, lng: 75.7873 }, to: { lat: 28.6139, lng: 77.2090 }, name: 'Jaipur to Delhi' },
];

const cities = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Goa', lat: 15.2993, lng: 74.1240 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
];

const SimpleWorldMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // India's approximate bounds
    const bounds = {
      minLat: 6,
      maxLat: 35,
      minLng: 68,
      maxLng: 97,
    };
    
    // Convert geo coordinates to canvas coordinates
    const geoToCanvas = (lat: number, lng: number) => {
      const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * canvas.width;
      const y = canvas.height - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * canvas.height;
      return { x, y };
    };
    
    // Initialize animation progress
    const progress = { value: 0 };
    
    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw India outline (simplified)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(128, 128, 128, 0.3)';
      ctx.lineWidth = 1;
      
      // Very simplified India outline points
      const indiaOutline = [
        { lat: 35, lng: 76 }, // North
        { lat: 32, lng: 79 }, // Northeast
        { lat: 28, lng: 97 }, // East
        { lat: 21, lng: 88 }, // East-central
        { lat: 14, lng: 80 }, // Southeast
        { lat: 8, lng: 77 }, // South
        { lat: 12, lng: 74 }, // Southwest
        { lat: 21, lng: 69 }, // West
        { lat: 23, lng: 68 }, // Northwest
        { lat: 29, lng: 70 }, // North-northwest
        { lat: 35, lng: 76 }, // Back to North
      ];
      
      // Draw the outline
      indiaOutline.forEach((point, i) => {
        const { x, y } = geoToCanvas(point.lat, point.lng);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw cities
      cities.forEach(city => {
        const { x, y } = geoToCanvas(city.lat, city.lng);
        
        // Draw city dot
        ctx.beginPath();
        ctx.fillStyle = 'rgba(13, 141, 227, 0.7)';
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pulse effect
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(13, 141, 227, 0.3)';
        ctx.lineWidth = 1;
        ctx.arc(x, y, 10 + Math.sin(Date.now() / 500) * 3, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw city name
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.font = '10px Arial';
        ctx.fillText(city.name, x + 10, y + 5);
      });
      
      // Draw connections
      connections.forEach(connection => {
        const from = geoToCanvas(connection.from.lat, connection.from.lng);
        const to = geoToCanvas(connection.to.lat, connection.to.lng);
        
        // Draw connection line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(13, 141, 227, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw animated dot
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate animated position
        const animProgress = (Date.now() % 3000) / 3000;
        const dotX = from.x + dx * animProgress;
        const dotY = from.y + dy * animProgress;
        
        ctx.beginPath();
        ctx.fillStyle = 'rgba(13, 141, 227, 0.9)';
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(draw);
    };
    
    draw();
    
    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="relative w-full h-[400px] overflow-hidden bg-gray-50 dark:bg-gray-900/20 rounded-xl">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium">Travel Connectivity in India</h3>
      </div>
    </div>
  );
};

export default SimpleWorldMap;
