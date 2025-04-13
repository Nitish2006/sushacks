
import { useRef, useState, ReactNode } from 'react';

interface CardSpotlightProps {
  children: ReactNode;
  className?: string;
}

const CardSpotlight = ({ children, className = "" }: CardSpotlightProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--mouse-x': `${position.x}px`,
        '--mouse-y': `${position.y}px`,
      } as React.CSSProperties}
    >
      <div 
        className="absolute pointer-events-none inset-0 opacity-0 transition-opacity duration-300 bg-gradient-radial from-trip-400/20 to-transparent" 
        style={{ 
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(13, 141, 227, 0.15), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

export default CardSpotlight;
