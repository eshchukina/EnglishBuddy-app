import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to the Mystic Orb, where you can get predictions',
      share: 'share',
      connect: 'connect with us',
      review: 'review',
      instructions: 'about the app',
      close: 'close',
      mainButton: 'open cards',

      level_start: "Let's get started. Good luck!",
      level_novice: 'Your level: Novice',
      text_novice: 'A good start, everything is ahead!',
      level_intermediate: 'Your level: Intermediate',
      text_intermediate: 'Excellent, keep it up!',
      level_advanced: 'Your level: Advanced',
      text_advanced: 'Incredible, the finish line is near!',
      evel_expert: 'Expert',
      text_expert: "You've done it all!",
      description:
        "Swipe the card to the left if you don't know the word, and to the right if you know it!",
      restart: 'are you sure you want to restart?',
      add: 'add your word and translation',
      yes: 'yes',
      no: ' no ',
      word: 'word',
      translation: 'translation',
      create: 'create',
      text1:
        'Mystic Orb - your personal guide in the world of predictions! Receive unique forecasts for each day!',
      text2:
        'The built-in feature for saving predictions will allow you not only to recall them at any time but also to track their fulfillment ',
      text3:
        "Don't miss the opportunity to immerse yourself in the amazing world of divinations with Mystic Orb!",
    },
  },
  ru: {
    translation: {
      welcome:
        'Добро пожаловать в Mystic Orb, где вы можете получить предсказания',
      share: 'поделиться',
      connect: 'свяжитесь с нами',
      review: 'отзыв',
      instructions: 'о приложении',
      close: 'закрыть',
      mainButton: 'карточки',
      level_start: 'Давайте начнем. Удачи!',
      level_novice: 'Ваш уровень: Новичок',
      text_novice: 'Хорошее начало, все впереди!',
      level_intermediate: 'Ваш уровень: Средний',
      text_intermediate: 'Отлично, продолжайте в том же духе!',
      level_advanced: 'Ваш уровень: Продвинутый',
      text_advanced: 'Невероятно, финишная прямая близко!',
      level_expert: 'Эксперт',
      text_expert: 'Вы сделали все!',
      description:
        'Проведите карточку влево, если вы не знаете слово, и вправо, если знаете его!',
      restart: 'вы уверены, что хотите начать заново?',
      yes: ' да ',
      no: 'нет',
      add: 'добавьте ваше слово и перевод',
      word: 'слово',
      translation: 'перевод',
      create: 'создать',
      text1:
        'Mystic Orb - ваш личный гид в мире предсказаний! Получайте уникальные прогнозы на каждый день!',
      text2:
        'Встроенная функция сохранения предсказаний позволит вам не только вспоминать их в любое время, но и отслеживать их исполнение',
      text3:
        'Не упустите возможность погрузиться в удивительный мир гаданий с Mystic Orb!',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
});

export default i18n;
