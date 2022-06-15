import type { LocaleMessageObject } from 'vue-i18n';

const login: LocaleMessageObject = {
  _: 'Intake24 Login',
  title: 'Welcome to Intake24',
  subtitle: 'Please login with your username & password',

  err: {
    invalidCredentials: 'Invalid username & password credentials provided.',
    invalidToken: 'Invalid access token provided.',
    invalidSurvey: "This survey ({surveyId}) doesn't look like to be a valid survey login URL.",
    checkCredentials: 'Please check your provided login credentials.',
  },

  username: 'Username',
  email: 'Email',
  password: 'Password',

  continue: 'Continue',
};

export default login;
