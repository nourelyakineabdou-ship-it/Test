import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass as CompassIcon, Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QiblaProps {
  qiblaDirection: number;
}

export const QiblaCompass: React.FC<QiblaProps> = ({ qiblaDirection }) => {
  const { t } = useTranslation();
  const [heading, setHeading] = useState(0);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // Use webkitCompassHeading if available (iOS), otherwise alpha
      const compass = (e as any).webkitCompassHeading || (360 - (e.alpha || 0));
      setHeading(compass);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
      setIsSupported(true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const relativeQibla = (qiblaDirection - heading + 360) % 360;

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-2 border-accent/20 rounded-full" />
        
        {/* Compass Face */}
        <motion.div 
          className="relative w-full h-full flex items-center justify-center"
          animate={{ rotate: -heading }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        >
          {/* Cardinal Points */}
          <span className="absolute top-2 font-bold text-xs opacity-50">N</span>
          <span className="absolute bottom-2 font-bold text-xs opacity-50">S</span>
          <span className="absolute left-2 font-bold text-xs opacity-50">W</span>
          <span className="absolute right-2 font-bold text-xs opacity-50">E</span>
          
          {/* Qibla Indicator */}
          <motion.div 
            className="absolute flex flex-col items-center"
            style={{ rotate: qiblaDirection }}
          >
            <div className="w-1 h-24 bg-accent rounded-full mb-[-12px]" />
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg">
              <Navigation className="w-4 h-4 text-white fill-current" />
            </div>
          </motion.div>
        </motion.div>

        {/* Center Point */}
        <div className="absolute w-4 h-4 bg-primary dark:bg-white rounded-full border-2 border-accent z-10" />
      </div>

      <div className="text-center">
        <h3 className="text-xl font-semibold text-accent">{t('qibla')}</h3>
        <p className="text-sm opacity-60">
          {Math.round(relativeQibla)}° {t('remaining')}
        </p>
      </div>

      {!isSupported && (
        <p className="text-xs text-red-500 opacity-70">
          Compass not supported on this device/browser
        </p>
      )}
    </div>
  );
};
