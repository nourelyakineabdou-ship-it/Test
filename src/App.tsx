import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  Settings as SettingsIcon, 
  MapPin, 
  Compass as CompassIcon, 
  LayoutGrid, 
  Moon, 
  Sun,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Video,
  Users
} from 'lucide-react';
import { useLocation, usePrayerData } from './hooks/usePrayer';
import { PrayerCard } from './components/PrayerCard';
import { ProgressCircle } from './components/ProgressCircle';
import { QiblaCompass } from './components/QiblaCompass';
import { Settings } from './components/Settings';
import { getHijriDate, getHijriDateArabic, cn } from './utils';
import './i18n';

const ADHAN_URL = "https://www.islamcan.com/audio/adhan/azan1.mp3";

export default function App() {
  const { t, i18n } = useTranslation();
  const { location, setLocation } = useLocation();
  const [config, setConfig] = useState({
    method: 'MuslimWorldLeague',
    adhanEnabled: true,
    theme: 'dark', // Default to dark as per image
    notifications: {
      fajr: true,
      dhuhr: true,
      asr: true,
      maghrib: true,
      isha: true,
    },
    completedPrayers: [] as string[]
  });

  const [activeTab, setActiveTab] = useState<'times' | 'qibla'>('times');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { prayerTimes, qiblaDirection } = usePrayerData(location.coords, config.method);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleComplete = (name: string) => {
    setConfig(prev => {
      const isCompleted = prev.completedPrayers.includes(name);
      return {
        ...prev,
        completedPrayers: isCompleted 
          ? prev.completedPrayers.filter(p => p !== name)
          : [...prev.completedPrayers, name]
      };
    });
  };

  const prayers = useMemo(() => {
    if (!prayerTimes) return [];
    return [
      { name: 'Fajr', time: prayerTimes.fajr },
      { name: 'Sunrise', time: prayerTimes.sunrise },
      { name: 'Dhuhr', time: prayerTimes.dhuhr },
      { name: 'Asr', time: prayerTimes.asr },
      { name: 'Maghrib', time: prayerTimes.maghrib },
      { name: 'Isha', time: prayerTimes.isha },
    ];
  }, [prayerTimes]);

  const currentPrayer = useMemo(() => {
    if (!prayerTimes) return null;
    const current = prayerTimes.currentPrayer();
    if (current === 'none') return null;
    return { name: current, time: (prayerTimes as any)[current.toLowerCase()] };
  }, [prayerTimes, currentTime]);

  const nextPrayer = useMemo(() => {
    if (!prayerTimes) return null;
    const next = prayerTimes.nextPrayer();
    if (next === 'none') return { name: 'Fajr', time: prayerTimes.fajr }; 
    return { name: next, time: (prayerTimes as any)[next.toLowerCase()] };
  }, [prayerTimes, currentTime]);

  const isArabic = i18n.language === 'ar';

  return (
    <div className={cn(
      "min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden bg-primary text-white",
      isArabic ? "font-sans text-right" : "font-sans"
    )} dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-accent/20 -z-10 overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute top-[100px] left-[-30px] w-48 h-48 bg-accent/20 rounded-full blur-2xl" />
      </div>

      {/* Top Heading */}
      <div className="p-8 pt-12 space-y-2">
        <h1 className="text-4xl font-bold leading-tight tracking-tight">
          Priez à l'heure avec des alertes de prière précises
        </h1>
      </div>

      {/* Main Container (Rounded Top) */}
      <div className="flex-1 bg-primary rounded-t-[40px] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Date & Navigation */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold opacity-80">
              {currentTime.toLocaleDateString(i18n.language, { day: 'numeric', month: 'long' })}
            </span>
            <span className="text-xs opacity-50">
              {isArabic ? getHijriDateArabic(currentTime) : getHijriDate(currentTime)}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-1 opacity-40 hover:opacity-100"><ChevronLeft className="w-5 h-5" /></button>
            <button className="p-1 opacity-40 hover:opacity-100"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Hero Cards */}
        <div className="px-6 grid grid-cols-2 gap-4 mb-6">
          {/* Current Prayer Card */}
          <div className="bg-secondary rounded-3xl p-6 flex flex-col justify-between min-h-[180px]">
            <div>
              <span className="text-[10px] uppercase tracking-widest opacity-40 mb-1 block">Maintenant</span>
              <h3 className="text-xl font-bold flex items-center gap-2">
                {currentPrayer ? t(currentPrayer.name.toLowerCase()) : '---'}
                <span className="text-yellow-500">☀️</span>
              </h3>
            </div>
            <div className="text-4xl font-bold tracking-tighter">
              {currentPrayer ? currentPrayer.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </div>
            <div className="text-[10px] opacity-40">
              {nextPrayer ? `${t(nextPrayer.name.toLowerCase())} dans ...` : ''}
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-secondary rounded-3xl p-4 flex items-center justify-center min-h-[180px]">
            <ProgressCircle 
              current={config.completedPrayers.length} 
              total={5} 
              label="prié" 
            />
          </div>
        </div>

        {/* Prayer List */}
        <div className="flex-1 px-6 space-y-3 overflow-y-auto scrollbar-hide pb-24">
          <AnimatePresence mode="wait">
            {activeTab === 'times' ? (
              <motion.div
                key="times"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {prayers.filter(p => p.name !== 'Sunrise').map((prayer) => {
                  const icons: Record<string, string> = {
                    'Fajr': '✨',
                    'Dhuhr': '☀️',
                    'Asr': '⛅',
                    'Maghrib': '🌅',
                    'Isha': '🌙'
                  };
                  return (
                    <PrayerCard
                      key={prayer.name}
                      name={prayer.name}
                      icon={icons[prayer.name]}
                      time={prayer.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      isActive={currentPrayer?.name === prayer.name}
                      isPassed={prayer.time < currentTime}
                      isCompleted={config.completedPrayers.includes(prayer.name)}
                      notificationEnabled={(config.notifications as any)[prayer.name.toLowerCase()] ?? false}
                      onToggleNotification={() => {
                        const key = prayer.name.toLowerCase();
                        setConfig(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            [key]: !(prev.notifications as any)[key]
                          }
                        }));
                      }}
                      onToggleComplete={() => handleToggleComplete(prayer.name)}
                    />
                  );
                })}
                
                <button 
                  onClick={() => setConfig(prev => ({ ...prev, completedPrayers: prayers.filter(p => p.name !== 'Sunrise').map(p => p.name) }))}
                  className="w-full py-4 bg-accent text-primary font-bold rounded-2xl mt-4 hover:opacity-90 transition-opacity"
                >
                  Marquer tout comme prié
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="qibla"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <QiblaCompass qiblaDirection={qiblaDirection || 0} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-primary border-t border-white/5 px-6 py-4 flex items-center justify-between z-50">
        <NavItem icon={<LayoutGrid />} label="Heute" active={activeTab === 'times'} onClick={() => setActiveTab('times')} />
        <NavItem icon={<CompassIcon />} label="Gebete" active={activeTab === 'qibla'} onClick={() => setActiveTab('qibla')} />
        <NavItem icon={<BookOpen />} label="Koran" />
        <NavItem icon={<Video />} label="Videos" />
        <NavItem icon={<Users />} label="Ummah" />
      </nav>

      {/* Settings Overlay */}
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        updateConfig={(key, value) => setConfig(prev => ({ ...prev, [key]: value }))}
      />
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 transition-all",
      active ? "text-accent" : "text-white/30"
    )}
  >
    {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);
