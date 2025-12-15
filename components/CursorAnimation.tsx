import React, { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

const HAPPY_EMOJIS = ['😀', '😃', '😄', '😁', '😆', '😊', '🥰', '🤩'];

const CursorAnimation: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate distance moved
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Only spawn if moved significant distance (reduced to 15px for frequent "every time" feel)
      if (dist > 15) {
        lastPos.current = { x: e.clientX, y: e.clientY };
        
        const newParticle: Particle = {
          id: Date.now() + Math.random(), // Unique ID
          // Add slight randomness to position for natural scatter
          x: e.clientX + (Math.random() * 12 - 6),
          y: e.clientY + (Math.random() * 12 - 6),
          emoji: HAPPY_EMOJIS[Math.floor(Math.random() * HAPPY_EMOJIS.length)]
        };

        setParticles(prev => {
          // Increase max particles to handle higher density
          const next = [...prev, newParticle];
          if (next.length > 30) return next.slice(next.length - 30);
          return next;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAnimationEnd = (id: number) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-emoji-drop text-2xl select-none"
          style={{
            left: p.x,
            top: p.y,
            // Centering adjustment handled in keyframes translate(-50%, -50%)
            textShadow: '0 0 10px rgba(255,255,255,0.5)'
          }}
          onAnimationEnd={() => handleAnimationEnd(p.id)}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

export default CursorAnimation;