"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "np";

type I18nContextType = {
  lang: Lang;
  isNp: boolean;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (en: string, np: string) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("eka-lang");

    if (savedLang === "np" || savedLang === "en") {
      setLangState(savedLang);
      document.documentElement.setAttribute("data-lang", savedLang);
    }
  }, []);

  function setLang(nextLang: Lang) {
    setLangState(nextLang);
    localStorage.setItem("eka-lang", nextLang);
    document.documentElement.setAttribute("data-lang", nextLang);
  }

  function toggleLang() {
    setLang(lang === "en" ? "np" : "en");
  }

  const value = useMemo<I18nContextType>(() => {
    return {
      lang,
      isNp: lang === "np",
      setLang,
      toggleLang,
      t: (en: string, np: string) => (lang === "np" ? np : en),
    };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}