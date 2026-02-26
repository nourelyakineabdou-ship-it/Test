import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ar: {
    translation: {
      "prayer_times": "أوقات الصلاة",
      "fajr": "الفجر",
      "sunrise": "الشروق",
      "dhuhr": "الظهر",
      "asr": "العصر",
      "maghrib": "المغرب",
      "isha": "العشاء",
      "next_prayer": "الصلاة القادمة",
      "qibla": "القبلة",
      "settings": "الإعدادات",
      "language": "اللغة",
      "theme": "المظهر",
      "calculation_method": "طريقة الحساب",
      "offsets": "التعديلات",
      "adhan_sound": "صوت الأذان",
      "enabled": "مفعل",
      "disabled": "معطل",
      "search_city": "بحث عن مدينة...",
      "location_access": "الوصول إلى الموقع",
      "use_current_location": "استخدام الموقع الحالي",
      "minutes": "دقائق",
      "seconds": "ثواني",
      "hours": "ساعات",
      "remaining": "متبقي",
      "hijri_date": "التاريخ الهجري"
    }
  },
  fr: {
    translation: {
      "prayer_times": "Heures de Prière",
      "fajr": "Fajr",
      "sunrise": "Chourouk",
      "dhuhr": "Dhuhr",
      "asr": "Asr",
      "maghrib": "Maghrib",
      "isha": "Isha",
      "next_prayer": "Prochaine Prière",
      "qibla": "Qibla",
      "settings": "Paramètres",
      "language": "Langue",
      "theme": "Thème",
      "calculation_method": "Méthode de calcul",
      "offsets": "Ajustements",
      "adhan_sound": "Son de l'Adhan",
      "enabled": "Activé",
      "disabled": "Désactivé",
      "search_city": "Rechercher une ville...",
      "location_access": "Accès à la position",
      "use_current_location": "Utiliser ma position",
      "minutes": "minutes",
      "seconds": "secondes",
      "hours": "heures",
      "remaining": "restant",
      "hijri_date": "Date Hijri"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
