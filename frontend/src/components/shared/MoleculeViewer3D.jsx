import React, { useEffect, useRef } from 'react';
import * as $3Dmol from '3dmol';

const MoleculeViewer3D = ({ sdfData, isLoading }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (viewerRef.current && sdfData && !isLoading) {
      // Clear the div
      while (viewerRef.current.firstChild) {
        viewerRef.current.removeChild(viewerRef.current.firstChild);
      }

      // Create viewer
      const viewer = $3Dmol.createViewer(viewerRef.current, { backgroundColor: '#111113' });
      
      try {
        // Add SDF model
        viewer.addModel(sdfData, 'sdf');
        
        // Set style: stick and sphere
        viewer.setStyle({}, { 
          stick: { radius: 0.15, colorscheme: 'Jmol' }, 
          sphere: { scale: 0.25, colorscheme: 'Jmol' } 
        });
        
        // Finalize
        viewer.zoomTo();
        viewer.render();
        viewer.resize(); // Ensure correct dimensions
        viewer.spin('y', 0.5);
      } catch (error) {
        console.error('3Dmol error:', error);
      }

      // Cleanup on unmount
      return () => {
        if (viewer) viewer.clear();
      };
    }
  }, [sdfData, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full h-[280px] bg-[#18181b] rounded-lg animate-pulse flex items-center justify-center">
        <span className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">Initialising GPU environment...</span>
      </div>
    );
  }

  if (!sdfData) {
    return (
      <div className="w-full h-[280px] bg-[#111113] border border-white/5 rounded-lg flex items-center justify-center">
        <span className="text-[13px] text-[#52525b] font-medium">3D structure unavailable</span>
      </div>
    );
  }

  return (
    <div 
      ref={viewerRef} 
      className="relative w-full h-[280px] bg-[#111113] rounded-lg overflow-hidden border border-white/5"
    />
  );
};

export default MoleculeViewer3D;
