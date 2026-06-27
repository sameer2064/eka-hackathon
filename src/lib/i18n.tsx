"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Lang = "en" | "np";

const I18nContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof dictionary.en;
} | null>(null);

const dictionary = {
  en: {
    navHome: "Home",
    navProviders: "Providers",
    navJobs: "Jobs",
    navDashboard: "Dashboard",
    navAdmin: "Admin",
    login: "Login",
    logout: "Logout",
    switchLang: "नेपाली",

    heroBadge: "Nepal’s AI-Powered Service Marketplace",
    heroTitle: "Hire trusted local professionals in minutes.",
    heroText:
      "EKA connects customers with verified plumbers, electricians, CCTV installers, cleaners, technicians and more across Nepal.",
    explore: "Explore Providers",
    become: "Become Provider",
    browseJobs: "Browse Jobs",

    statProviders: "Verified Providers",
    statCities: "Cities Covered",
    statBookings: "Bookings Managed",
    statTrust: "Trust Score Engine",

    whyTitle: "Why EKA works",
    why1: "AI provider matching",
    why1Text: "Rank providers by trust score, rating, category and location.",
    why2: "Nepal-first booking",
    why2Text: "Built for local services, phone-based contact and city search.",
    why3: "Admin control",
    why3Text: "Manage providers, premium status, verification and marketplace quality.",

    adminBadge: "EKA Control Center",
    adminTitle: "Admin Dashboard",
    adminText:
      "Manage providers, bookings, AI score, trust score, premium visibility and marketplace quality.",
    totalProviders: "Total Providers",
    totalBookings: "Total Bookings",
    revenue: "Estimated Revenue",
    pending: "Pending Providers",
    providerControl: "Provider Control",
    liveBookings: "Live Bookings",
    approve: "Approve",
    verify: "Verify",
    unverify: "Unverify",
    makePremium: "Make Premium",
    removePremium: "Remove Premium",
    feature: "Feature",
    unfeature: "Unfeature",
    boostAI: "Boost AI",
    boostTrust: "Boost Trust",
    remove: "Remove",
  },

  np: {
    navHome: "गृहपृष्ठ",
    navProviders: "सेवा प्रदायक",
    navJobs: "कामहरू",
    navDashboard: "ड्यासबोर्ड",
    navAdmin: "एडमिन",
    login: "लगइन",
    logout: "लगआउट",
    switchLang: "English",

    heroBadge: "नेपालको AI सेवा मार्केटप्लेस",
    heroTitle: "विश्वसनीय स्थानीय पेशेवर छिट्टै खोज्नुहोस्।",
    heroText:
      "EKA ले ग्राहकलाई प्लम्बर, इलेक्ट्रिसियन, CCTV टेक्निसियन, क्लिनर र अन्य प्रमाणित सेवा प्रदायकसँग जोड्छ।",
    explore: "प्रदायकहरू हेर्नुहोस्",
    become: "प्रदायक बन्नुहोस्",
    browseJobs: "कामहरू हेर्नुहोस्",

    statProviders: "प्रमाणित प्रदायक",
    statCities: "समेटिएका शहर",
    statBookings: "बुकिङ व्यवस्थापन",
    statTrust: "ट्रस्ट स्कोर प्रणाली",

    whyTitle: "EKA किन उपयोगी छ",
    why1: "AI प्रदायक मिलान",
    why1Text: "ट्रस्ट स्कोर, रेटिङ, श्रेणी र स्थान अनुसार प्रदायक क्रमबद्ध गर्छ।",
    why2: "नेपाल-केंद्रित बुकिङ",
    why2Text: "स्थानीय सेवा, फोन सम्पर्क र शहर खोजका लागि बनाइएको।",
    why3: "एडमिन नियन्त्रण",
    why3Text: "प्रदायक, प्रिमियम, प्रमाणिकरण र मार्केटप्लेस गुणस्तर व्यवस्थापन।",

    adminBadge: "EKA नियन्त्रण केन्द्र",
    adminTitle: "एडमिन ड्यासबोर्ड",
    adminText:
      "प्रदायक, बुकिङ, AI स्कोर, ट्रस्ट स्कोर, प्रिमियम दृश्यता र गुणस्तर व्यवस्थापन गर्नुहोस्।",
    totalProviders: "जम्मा प्रदायक",
    totalBookings: "जम्मा बुकिङ",
    revenue: "अनुमानित आम्दानी",
    pending: "पेन्डिङ प्रदायक",
    providerControl: "प्रदायक नियन्त्रण",
    liveBookings: "लाइभ बुकिङ",
    approve: "स्वीकृत",
    verify: "प्रमाणित",
    unverify: "हटाउनुहोस्",
    makePremium: "प्रिमियम बनाउनुहोस्",
    removePremium: "प्रिमियम हटाउनुहोस्",
    feature: "फिचर गर्नुहोस्",
    unfeature: "फिचर हटाउनुहोस्",
    boostAI: "AI बढाउनुहोस्",
    boostTrust: "ट्रस्ट बढाउनुहोस्",
    remove: "हटाउनुहोस्",
  },
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("eka_lang") as Lang | null;
    if (saved === "en" || saved === "np") setLangState(saved);
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    localStorage.setItem("eka_lang", next);
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t: dictionary[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);

  if (!ctx) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return ctx;
}