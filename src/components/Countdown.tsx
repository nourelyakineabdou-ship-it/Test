import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { formatRemainingTime } from '../utils';

interface CountdownProps {
  nextPrayerTime: Date;
  nextPrayerName: string;
}

export const Countdown: React.FC<CountdownProps> = ({ nextPrayerTime, nextPrayerName }) => {
  const { t, i18n } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(nextPrayerTime.getTime() - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = nextPrayerTime.getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextPrayerTime]);

  const { hours, minutes, seconds } = formatRemainingTime(timeLeft);
  const isArabic = i18n.language === 'ar';

  return (
    <div className="flex flex-col items-center py-8">
      <span className="text-sm uppercase tracking-widest opacity-50 mb-2">
        {t('next_prayer')}: <span className="text-accent font-bold">{t(nextPrayerName.toLowerCase())}</span>
      </span>
      
      <div className="flex items-baseline gap-4">
        <TimeUnit value={hours} label={t('hours')} />
        <span className="text-4xl font-light opacity-20">:</span>
        <TimeUnit value={minutes} label={t('minutes')} />
        <span className="text-4xl font-light opacity-20">:</span>
        <TimeUnit value={seconds} label={t('seconds')} />
      </div>
    </div>
  );
};

const TimeUnit = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center">
    <motion.span 
      key={value}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-6xl font-bold tracking-tighter"
    >
      {value}
    </motion.span>
    <span className="text-[10px] uppercase tracking-wider opacity-40 mt-1">{label}</span>
  </div>
);
