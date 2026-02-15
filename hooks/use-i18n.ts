import { useTranslation } from "react-i18next";

export const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "uz", name: "O'zbek", flag: "🇺🇿" },
  { code: "uz-Cyrl", name: "Ўзбек", flag: "🇺🇿" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export function useI18n() {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (languageCode: string) => {
    const { changeLanguage: changeLang } = await import("../lib/i18n");
    await changeLang(languageCode);
  };

  const getCurrentLanguage = () => {
    return languages.find((lang) => lang.code === i18n.language) || languages[0];
  };

  return {
    t,
    i18n,
    languages,
    changeLanguage,
    getCurrentLanguage,
    currentLanguage: getCurrentLanguage(),
  };
}
