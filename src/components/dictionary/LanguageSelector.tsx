// import React from 'react';
// import { Language } from '@/types';
// import { SUPPORTED_LANGUAGES } from '@/lib/utils';

// interface LanguageSelectorProps {
//   currentLanguage: string;
//   onLanguageChange: (language: string) => void;
//   languages?: Language[];
//   className?: string;
//   disabled?: boolean;
// }

// export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
//   currentLanguage,
//   onLanguageChange,
//   languages = SUPPORTED_LANGUAGES,
//   className = '',
//   disabled = false,
// }) => {
//   const handleLanguageChange = (languageCode: string) => {
//     if (!disabled) {
//       onLanguageChange(languageCode);
//     }
//   };

//   return (
//     <div className={`flex gap-2 ${className}`}>
//       {languages.map((language) => (
//         <button
//           key={language.code}
//           onClick={() => handleLanguageChange(language.code)}
//           disabled={disabled}
//           className={`px-3 py-1 rounded border transition-colors duration-200 ${
//             currentLanguage === language.code
//               ? 'bg-blue-500 text-white border-blue-500'
//               : 'bg-white text-blue-500 border-blue-300 hover:bg-blue-50'
//           } ${
//             disabled
//               ? 'opacity-50 cursor-not-allowed'
//               : 'cursor-pointer'
//           }`}
//           aria-label={`Switch to ${language.label}`}
//           aria-pressed={currentLanguage === language.code}
//         >
//           {language.label}
//         </button>
//       ))}
//     </div>
//   );
// }; 