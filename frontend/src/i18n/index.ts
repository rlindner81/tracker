import { createI18n } from "vue-i18n";

const messages = {
  en: {
    login: {
      email: "Email",
      password: "Password",
      button: "Login",
    },
    register: {
      button: "Register",
    },
    tabs: {
      tracking: "Tracking",
      settings: "Settings",
    },
    nav: {
      dashboard: "Dashboard",
    },
    track: {
      first: "Add your first track",
      add: "Add a track",
      create: "Create Track",
      cancel: "Cancel",
    },
    step: {
      plural: "Steps",
      add: "Add a Step",
      track: "Track It",
      cancel: "Cancel",
      noData: "You don't have any step tracked yet.",
    },
  },
  "en-US": {
    login: {
      email: "Email",
      password: "Password",
      button: "Login",
    },
    register: {
      button: "Register",
    },
    tabs: {
      tracking: "Tracking",
      settings: "Settings",
    },
    nav: {
      dashboard: "Dashboard",
    },
    track: {
      first: "Add your first track",
      add: "Add a track",
      create: "Create Track",
      cancel: "Cancel",
    },
    step: {
      plural: "Steps",
      add: "Add a Step",
      track: "Track It",
      cancel: "Cancel",
      noData: "You don't have any step tracked yet.",
    },
  },
  de: {
    login: {
      email: "E-Mail",
      password: "Passwort",
      button: "Anmeldung",
    },
    register: {
      button: "Registrierung",
    },
    tabs: {
      tracking: "Wege",
      settings: "Einstellungen",
    },
    nav: {
      dashboard: "Dashboard",
    },
    track: {
      first: "Füge deine erste Nachverfolgung hinzu",
      add: "Nachverfolgung hinzufügen",
      create: "Nachverfolgung erstellen",
      cancel: "Abbrechen",
    },
    step: {
      plural: "Schritte",
      add: "Schritt hinzufügen",
      track: "Verfolg Es Nach",
      cancel: "Abbrechen",
      noData: "Du hast bisher keinen Schritt hinzugefügt.",
    },
  },
};

export default createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
  messages,
});
