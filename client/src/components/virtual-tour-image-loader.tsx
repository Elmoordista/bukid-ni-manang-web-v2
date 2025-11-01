import { useEffect, useState } from 'react';
import { VIRTUAL_TOUR_LOCATIONS } from '@/lib/constants';

export function useVirtualTourImagePreloader() {
  const [loadedImages, setLoadedImages] = useState<number>(0);
  const totalImages = VIRTUAL_TOUR_LOCATIONS.length;

  useEffect(() => {
    // Preload all images
    VIRTUAL_TOUR_LOCATIONS.forEach(location => {
      const img = new Image();
      img.src = location.image;
      img.onload = () => {
        setLoadedImages(prev => prev + 1);
      };
    });
  }, []);

  return {
    loadedImages,
    totalImages,
    isLoading: loadedImages < totalImages,
    progress: Math.round((loadedImages / totalImages) * 100)
  };
}