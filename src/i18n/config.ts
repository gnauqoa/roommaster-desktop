import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translation files
import commonEN from './locales/en/common.json';
import authEN from './locales/en/auth.json';
import dashboardEN from './locales/en/dashboard.json';
import roomsEN from './locales/en/rooms.json';
import reservationsEN from './locales/en/reservations.json';
import checkInEN from './locales/en/checkIn.json';
import checkOutEN from './locales/en/checkOut.json';
import servicesEN from './locales/en/services.json';
import employeesEN from './locales/en/employees.json';
import invoicesEN from './locales/en/invoices.json';
import navigationEN from './locales/en/navigation.json';
import validationEN from './locales/en/validation.json';
import errorsEN from './locales/en/errors.json';

import commonVI from './locales/vi/common.json';
import authVI from './locales/vi/auth.json';
import dashboardVI from './locales/vi/dashboard.json';
import roomsVI from './locales/vi/rooms.json';
import reservationsVI from './locales/vi/reservations.json';
import checkInVI from './locales/vi/checkIn.json';
import checkOutVI from './locales/vi/checkOut.json';
import servicesVI from './locales/vi/services.json';
import employeesVI from './locales/vi/employees.json';
import invoicesVI from './locales/vi/invoices.json';
import navigationVI from './locales/vi/navigation.json';
import validationVI from './locales/vi/validation.json';
import errorsVI from './locales/vi/errors.json';

const resources = {
  en: {
    common: commonEN,
    auth: authEN,
    dashboard: dashboardEN,
    rooms: roomsEN,
    reservations: reservationsEN,
    checkIn: checkInEN,
    checkOut: checkOutEN,
    services: servicesEN,
    employees: employeesEN,
    invoices: invoicesEN,
    navigation: navigationEN,
    validation: validationEN,
    errors: errorsEN,
  },
  vi: {
    common: commonVI,
    auth: authVI,
    dashboard: dashboardVI,
    rooms: roomsVI,
    reservations: reservationsVI,
    checkIn: checkInVI,
    checkOut: checkOutVI,
    services: servicesVI,
    employees: employeesVI,
    invoices: invoicesVI,
    navigation: navigationVI,
    validation: validationVI,
    errors: errorsVI,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18n_language',
    },
    
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;

