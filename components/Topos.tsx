
import React from 'react';

// Use absolute string paths to reference assets in the public directory
// or full URLs for external assets
const thePillarTopo = 'https://raw.githubusercontent.com/tomthias/gfaletti-website/615c9153b1dedbaa5f4b22013cb8cd0f3a741d30/assets/the-pillar/the-pillar.route.svg';
const happyEndingTopo = 'https://raw.githubusercontent.com/tomthias/gfaletti-website/refs/heads/tomthias-patch-1/assets/happy-ending/happy-endings-graph.svg';

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
