import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Bell, BellOff, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../utils';

interface PrayerCardProps {
  name: string;
  time: string;
  icon?: string;
  isActive: boolean;
  isPassed: boolean;
  isCompleted: boolean;
  notificationEnabled: boolean;
  onToggleNotification: () => void;
  onToggleComplete: () => void;
}

export const PrayerCard: React.FC<PrayerCardProps> = ({
  name,
  time,
  icon,
  isActive,
  isPassed,
  isCompleted,
  notificationEnabled,
  onToggleNotification,
  onToggleComplete,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative flex items-center justify-between p-4 rounded-2xl transition-all duration-300",
        isActive 
          ? "bg-secondary border border-accent/30 shadow-lg" 
          : "bg-secondary/50 border border-white/5",
        isPassed && !isActive && "opacity-60"
      )}
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleComplete}
          className={cn(
            "transition-colors",
            isCompleted ? "text-accent" : "text-white/20"
          )}
        >
          {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>
        
        <div>
          <h4 className={cn(
            "text-base font-semibold flex items-center gap-2",
            isArabic ? "font-bold" : ""
          )}>
            {t(name.toLowerCase())}
            {icon && <span>{icon}</span>}
            {isActive && <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full uppercase tracking-tighter">Maintenant</span>}
          </h4>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium opacity-80">{time}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleNotification();
          }}
          className={cn(
            "p-2 rounded-full transition-colors hover:bg-white/5",
            notificationEnabled ? "text-accent" : "text-white/20"
          )}
        >
          {notificationEnabled ? (
            <Bell className="w-4 h-4" />
          ) : (
            <BellOff className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.div>
  );
};
