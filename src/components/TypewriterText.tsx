
import { useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
}

const TypewriterText = ({ text, className = "" }: TypewriterTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const textElement = container.querySelector('.typewriter-text');
    if (!textElement) return;

    textElement.textContent = text;
  }, [text]);

  return (
    <div ref={containerRef} className={`typewriter-container ${className}`}>
      <div className="typewriter-text">{text}</div>
      <div className="typewriter-cursor"></div>
    </div>
  );
};

export default TypewriterText;
