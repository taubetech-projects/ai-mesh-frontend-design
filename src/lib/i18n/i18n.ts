export type Language = "en" | "de" | "bn";

export interface Translations {
  // Navigation
  nav: {
    newChat: string;
    project: string;
    history: string;
    settings: string;
    upgrade: string;
  };
  // Model selection
  models: {
    selectModels: string;
    availableModels: string;
    addModel: string;
  };
  // Chat interface
  chat: {
    readyToChat: string;
    sendMessage: string;
    askAnything: string;
    send: string;
    whatIsAI: string;
    whatIsAIAnswer: string;
    howDoesMLWork: string;
    howDoesMLWorkAnswer: string;
    explainQuantum: string;
    explainQuantumAnswer: string;
    whatIsFuture: string;
    whatIsFutureAnswer: string;
    howToLearn: string;
    howToLearnAnswer: string;
    whatIsClimate: string;
    whatIsClimateAnswer: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    save: string;
    delete: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      newChat: "New Chat",
      project: "Projects",
      history: "History",
      settings: "Settings",
      upgrade: "Upgrade Plan",
    },
    models: {
      selectModels: "Select Models",
      availableModels: "Available Models",
      addModel: "Add Model",
    },
    chat: {
      readyToChat: "Ready to chat with",
      sendMessage: "Send a message to get started",
      askAnything: "Ask me anything...",
      send: "Send",
      whatIsAI: "What is artificial intelligence?",
      whatIsAIAnswer:
        "Artificial intelligence (AI) is a branch of computer science that aims to create machines capable of performing tasks that typically require human intelligence, such as learning, reasoning, and problem-solving.",
      howDoesMLWork: "How does machine learning work?",
      howDoesMLWorkAnswer:
        "Machine learning works by training algorithms on large datasets to identify patterns and make predictions or decisions without being explicitly programmed for each specific task.",
      explainQuantum: "Can you explain quantum computing?",
      explainQuantumAnswer:
        "Quantum computing uses quantum mechanical phenomena like superposition and entanglement to process information in ways that classical computers cannot, potentially solving certain problems exponentially faster.",
      whatIsFuture: "What is the future of technology?",
      whatIsFutureAnswer:
        "The future of technology likely includes advances in AI, quantum computing, biotechnology, renewable energy, and space exploration, fundamentally changing how we live and work.",
      howToLearn: "How can I learn programming?",
      howToLearnAnswer:
        "Start with a beginner-friendly language like Python, practice regularly with coding exercises, build projects, and use online resources like tutorials, documentation, and coding communities.",
      whatIsClimate: "What is climate change?",
      whatIsClimateAnswer:
        "Climate change refers to long-term shifts in global temperatures and weather patterns, primarily caused by human activities that increase greenhouse gas concentrations in the atmosphere.",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      retry: "Retry",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
    },
  },
  de: {
    nav: {
      newChat: "Neuer Chat",
      project: "Projekte",
      history: "Verlauf",
      settings: "Einstellungen",
      upgrade: "Plan upgraden",
    },
    models: {
      selectModels: "Modelle auswählen",
      availableModels: "Verfügbare Modelle",
      addModel: "Modell hinzufügen",
    },
    chat: {
      readyToChat: "Bereit zum Chatten mit",
      sendMessage: "Senden Sie eine Nachricht, um zu beginnen",
      askAnything: "Fragen Sie mich alles...",
      send: "Senden",
      whatIsAI: "Was ist künstliche Intelligenz?",
      whatIsAIAnswer:
        "Künstliche Intelligenz (KI) ist ein Bereich der Informatik, der darauf abzielt, Maschinen zu schaffen, die Aufgaben ausführen können, die normalerweise menschliche Intelligenz erfordern, wie Lernen, Schlussfolgern und Problemlösen.",
      howDoesMLWork: "Wie funktioniert maschinelles Lernen?",
      howDoesMLWorkAnswer:
        "Maschinelles Lernen funktioniert, indem Algorithmen auf großen Datensätzen trainiert werden, um Muster zu identifizieren und Vorhersagen oder Entscheidungen zu treffen, ohne explizit für jede spezifische Aufgabe programmiert zu werden.",
      explainQuantum: "Können Sie Quantencomputing erklären?",
      explainQuantumAnswer:
        "Quantencomputing nutzt quantenmechanische Phänomene wie Superposition und Verschränkung, um Informationen auf Weise zu verarbeiten, die klassische Computer nicht können, und löst möglicherweise bestimmte Probleme exponentiell schneller.",
      whatIsFuture: "Was ist die Zukunft der Technologie?",
      whatIsFutureAnswer:
        "Die Zukunft der Technologie umfasst wahrscheinlich Fortschritte in KI, Quantencomputing, Biotechnologie, erneuerbaren Energien und Weltraumforschung, die grundlegend verändern, wie wir leben und arbeiten.",
      howToLearn: "Wie kann ich programmieren lernen?",
      howToLearnAnswer:
        "Beginnen Sie mit einer anfängerfreundlichen Sprache wie Python, üben Sie regelmäßig mit Programmierübungen, erstellen Sie Projekte und nutzen Sie Online-Ressourcen wie Tutorials, Dokumentation und Programmiergemeinschaften.",
      whatIsClimate: "Was ist Klimawandel?",
      whatIsClimateAnswer:
        "Klimawandel bezieht sich auf langfristige Veränderungen der globalen Temperaturen und Wettermuster, die hauptsächlich durch menschliche Aktivitäten verursacht werden, die die Treibhausgaskonzentrationen in der Atmosphäre erhöhen.",
    },
    common: {
      loading: "Laden...",
      error: "Fehler",
      retry: "Wiederholen",
      cancel: "Abbrechen",
      save: "Speichern",
      delete: "Löschen",
    },
  },
  bn: {
    nav: {
      newChat: "নতুন চ্যাট",
      project: "প্রকল্প",
      history: "ইতিহাস",
      settings: "সেটিংস",
      upgrade: "প্ল্যান আপগ্রেড",
    },
    models: {
      selectModels: "মডেল নির্বাচন করুন",
      availableModels: "উপলব্ধ মডেল",
      addModel: "মডেল যোগ করুন",
    },
    chat: {
      readyToChat: "চ্যাট করার জন্য প্রস্তুত",
      sendMessage: "শুরু করতে একটি বার্তা পাঠান",
      askAnything: "আমাকে যেকোনো কিছু জিজ্ঞাসা করুন...",
      send: "পাঠান",
      whatIsAI: "কৃত্রিম বুদ্ধিমত্তা কী?",
      whatIsAIAnswer:
        "কৃত্রিম বুদ্ধিমত্তা (AI) হল কম্পিউটার বিজ্ঞানের একটি শাখা যা এমন মেশিন তৈরি করার লক্ষ্য রাখে যা সাধারণত মানুষের বুদ্ধিমত্তার প্রয়োজন হয় এমন কাজ সম্পাদন করতে পারে, যেমন শেখা, যুক্তি এবং সমস্যা সমাধান।",
      howDoesMLWork: "মেশিন লার্নিং কীভাবে কাজ করে?",
      howDoesMLWorkAnswer:
        "মেশিন লার্নিং বড় ডেটাসেটে অ্যালগরিদম প্রশিক্ষণ দিয়ে প্যাটার্ন চিহ্নিত করে এবং প্রতিটি নির্দিষ্ট কাজের জন্য স্পষ্টভাবে প্রোগ্রাম না করেই ভবিষ্যদ্বাণী বা সিদ্ধান্ত নেয়।",
      explainQuantum: "আপনি কি কোয়ান্টাম কম্পিউটিং ব্যাখ্যা করতে পারেন?",
      explainQuantumAnswer:
        "কোয়ান্টাম কম্পিউটিং সুপারপজিশন এবং এনট্যাঙ্গলমেন্টের মতো কোয়ান্টাম যান্ত্রিক ঘটনা ব্যবহার করে তথ্য প্রক্রিয়া করে যা ক্লাসিক্যাল কম্পিউটার পারে না, সম্ভাব্যভাবে নির্দিষ্ট সমস্যা দ্রুততার সাথে সমাধান করে।",
      whatIsFuture: "প্রযুক্তির ভবিষ্যৎ কী?",
      whatIsFutureAnswer:
        "প্রযুক্তির ভবিষ্যৎ সম্ভবত AI, কোয়ান্টাম কম্পিউটিং, বায়োটেকনোলজি, নবায়নযোগ্য শক্তি এবং মহাকাশ অনুসন্ধানে অগ্রগতি অন্তর্ভুক্ত করে, যা আমাদের জীবনযাত্রা এবং কাজের পদ্ধতি মৌলিকভাবে পরিবর্তন করবে।",
      howToLearn: "আমি কীভাবে প্রোগ্রামিং শিখতে পারি?",
      howToLearnAnswer:
        "পাইথনের মতো একটি শিক্ষানবিস-বান্ধব ভাষা দিয়ে শুরু করুন, কোডিং অনুশীলনের সাথে নিয়মিত অনুশীলন করুন, প্রকল্প তৈরি করুন এবং টিউটোরিয়াল, ডকুমেন্টেশন এবং কোডিং কমিউনিটির মতো অনলাইন সংস্থান ব্যবহার করুন।",
      whatIsClimate: "জলবায়ু পরিবর্তন কী?",
      whatIsClimateAnswer:
        "জলবায়ু পরিবর্তন বলতে বৈশ্বিক তাপমাত্রা এবং আবহাওয়ার ধরণে দীর্ঘমেয়াদী পরিবর্তনকে বোঝায়, যা প্রধানত মানুষের কার্যকলাপের কারণে ঘটে যা বায়ুমণ্ডলে গ্রিনহাউস গ্যাসের ঘনত্ব বৃদ্ধি করে।",
    },
    common: {
      loading: "লোড হচ্ছে...",
      error: "ত্রুটি",
      retry: "পুনরায় চেষ্টা",
      cancel: "বাতিল",
      save: "সংরক্ষণ",
      delete: "মুছুন",
    },
  },
};

export function getTranslation(language: Language): Translations {
  return translations[language] || translations.en;
}
