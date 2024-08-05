import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome!',
      share: 'share',
      connect: 'connect with us',
      review: 'review',
      instructions: 'about the app',
      close: 'close',
      mainButton: 'open cards',
      start: 'start',
      level_start: "Let's get started. Good luck!",
      level_novice: 'Your level: Novice',
      text_novice: 'A good start, everything is ahead!',
      level_intermediate: 'Your level: Intermediate',
      text_intermediate: 'Excellent, keep it up!',
      level_advanced: 'Your level: Advanced',
      text_advanced: 'Incredible, the finish line is near!',
      level_expert: 'Expert',
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
      startText:
        "Each swipe to the right marks a word as learned. After swiping right three times, the card disappears, and the word is considered learned. If you swipe left, it means you haven't learned the word yet. Your goal is to reach 100% learned words",
      text1:
        'Embark on a language-learning journey with our app designed to teach you the 1000 most commonly used English words. Immerse yourself in an interactive experience where you not only learn the words but also their translations.',
      text2:
        "The learning process involves a dynamic swipe mechanism – swipe right if you've mastered the word, and left if you're still working on it.",
      text3:
        "Your ultimate goal is to achieve a perfect 100% mastery of the vocabulary. Track your progress and strive to elevate your rating to the highest possible mark. The app provides a user-friendly interface, making the learning process engaging and effective.",
        text4:"Reinforce your English language skills, broaden your vocabulary, and witness your proficiency soar as you work towards achieving the top rating. Download now and embark on a transformative language-learning adventure!",
        text5:"Image of a button to go to the page with cards:",
        text6:"Swipe the card to the right three times for full memorization of the new word:",
        on:"disable notifications",
        off:"enable notifications",
    },
  },
  ru: {
    translation: {
      welcome:
        'Добро пожаловать!',
      share: 'поделиться',
      connect: 'свяжитесь с нами',
      review: 'отзыв',
      instructions: 'о приложении',
      close: 'закрыть',
      mainButton: 'карточки',
      start: 'начать',
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
      startText:
        'При каждом свайпе вправо вы отмечаете слово как выученное. Если вы свайпаете три раза вправо, карточка пропадает, и слово считается выученным. Если свайпаете влево, это означает, что слово вы еще не выучили. Ваша цель — достичь 100% выученных слов',
        text1: 'Начните путешествие по изучению языка с нашим приложением, разработанным для обучения вас 1000 самым часто используемым английским словам. Погрузитесь в интерактивный опыт, где вы не только учите слова, но и их переводы.',
        text2: "Процесс обучения включает в себя динамическую механику свайпов — свайп вправо, если вы освоили слово, и влево, если все еще работаете над ним.",
        text3: "Ваша главная цель — достичь идеального 100% освоения словарного запаса. Отслеживайте свой прогресс и стремитесь поднять свой рейтинг до самой высокой отметки. Приложение предоставляет удобный интерфейс, делая процесс обучения увлекательным и эффективным.",
        text4: "Укрепляйте свои знания английского языка, расширяйте словарный запас и наблюдайте, как растет ваша компетентность, стремясь к высшему рейтингу. Скачайте сейчас и начните трансформирующее путешествие по изучению языка!",
        text5: "Изображение кнопки для перехода на страницу с карточками:",
        text6: "Свайпните карточку вправо три раза для полного запоминания нового слова:",
        on:"выключить уведомления",
        off:"включить уведомления",

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
