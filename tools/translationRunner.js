import manageTranslations from 'react-intl-translations-manager';

manageTranslations({
  messagesDirectory: './src/assets-front/languages/src',
  // messagesDirectory: './languages',
  translationsDirectory: './src/assets-front/languages/',
  // translationsDirectory: './languages',
  languages: ['default'], // any language you need
});