import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'pill' | 'compact' | 'expanded';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'pill', className = '' }) => {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <button
        id="btn-language-switcher-compact"
        onClick={toggleLanguage}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141417] hover:bg-[#1c1c22] border border-[#27272a] text-xs font-bold text-zinc-200 transition-all shadow-xs ${className}`}
        title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        aria-label="Toggle language"
      >
        <Globe className="w-3.5 h-3.5 text-indigo-400" />
        <span className="font-mono">{language.toUpperCase()}</span>
      </button>
    );
  }

  return (
    <div
      id="btn-language-switcher-group"
      className={`inline-flex items-center p-0.5 rounded-xl bg-[#121215] border border-[#27272a] shadow-xs ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        id="btn-lang-es"
        onClick={() => setLanguage('es')}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          language === 'es'
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
        }`}
        title="Cambiar a Español"
      >
        <span>ES</span>
        {language === 'es' && <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5"></span>}
      </button>

      <button
        id="btn-lang-en"
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          language === 'en'
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
        }`}
        title="Switch to English"
      >
        <span>EN</span>
        {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5"></span>}
      </button>
    </div>
  );
};
