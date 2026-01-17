
import React from 'react';

// Using direct paths to avoid module resolution errors with non-JS assets
const thePillarTopo = 'assets/the-pillar/the-pillar.route.svg';
const happyEndingTopo = 'assets/happy-ending/happy-endings-graph.svg';

export const RouteTopo = ({ id }: { id: string }) => {
  if (id === 'the-pillar') {
    return (
      <img 
        src={thePillarTopo} 
        alt="The Pillar Topo" 
        className="w-full h-auto drop-shadow-[0_0_15px_rgba(68,173,194,0.3)]" 
      />
    );
  }
  if (id === 'happy-ending') {
    return (
      <img 
        src={happyEndingTopo} 
        alt="Happy Ending Topo" 
        className="w-full h-auto drop-shadow-[0_0_15px_rgba(68,173,194,0.3)]" 
      />
    );
  }
  return null;
};
