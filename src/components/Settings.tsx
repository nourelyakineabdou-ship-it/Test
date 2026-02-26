import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { X, Globe, Volume2, Settings as SettingsIcon, MapPin, ChevronRight } from 'lucide-react';
import { CalculationMethod } from 'adhan';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  config: any;
  updateConfig: (key: string, value: any) => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, config, updateConfig }) => {
  const { t, i18n } = useTranslation();

  const methods = Object.keys(CalculationMethod).filter(k => typeof (CalculationMethod as any)[k] === 'function');

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-white dark:bg-neutral-950 flex flex-col"
    >
      <div className="flex items-center justify-between p-6 border-bottom border-black/5 dark:border-white/5">
        <h2 className="text-2xl font-bold">{t('settings')}</h2>
        <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Language Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 opacity-50">
            <Globe className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-bold">{t('language')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['fr', 'ar'].map((lang) => (
              <button
                key={lang}
                onClick={() => i18n.changeLanguage(lang)}
                className={`p-4 rounded-xl border transition-all ${
                  i18n.language === lang 
                    ? 'border-accent bg-accent/5 text-accent' 
                    : 'border-black/5 dark:border-white/5'
                }`}
              >
                {lang === 'fr' ? 'Français' : 'العربية'}
              </button>
            ))}
          </div>
        </section>

        {/* Calculation Method */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 opacity-50">
            <SettingsIcon className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-bold">{t('calculation_method')}</span>
          </div>
          <div className="space-y-2">
            {methods.map((method) => (
              <button
                key={method}
                onClick={() => updateConfig('method', method)}
                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                  config.method === method 
                    ? 'border-accent bg-accent/5 text-accent' 
                    : 'border-black/5 dark:border-white/5'
                }`}
              >
                <span className="text-sm">{method.replace(/([A-Z])/g, ' $1').trim()}</span>
                {config.method === method && <div className="w-2 h-2 bg-accent rounded-full" />}
              </button>
            ))}
          </div>
        </section>

        {/* Adhan Sound */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 opacity-50">
            <Volume2 className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-bold">{t('adhan_sound')}</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-black/5 dark:border-white/5">
            <span>{t('enabled')}</span>
            <button 
              onClick={() => updateConfig('adhanEnabled', !config.adhanEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${config.adhanEnabled ? 'bg-accent' : 'bg-gray-300'}`}
            >
              <motion.div 
                animate={{ x: config.adhanEnabled ? 26 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
        </section>

        {/* Location Info */}
        <section className="p-6 bg-accent/5 rounded-2xl border border-accent/10">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="font-semibold">{t('location_access')}</span>
          </div>
          <p className="text-sm opacity-60 mb-4">
            Prayer times are calculated based on your current GPS coordinates for maximum accuracy.
          </p>
          <button className="text-accent text-sm font-bold flex items-center gap-1">
            {t('use_current_location')} <ChevronRight className="w-4 h-4" />
          </button>
        </section>
      </div>
    </motion.div>
  );
};
