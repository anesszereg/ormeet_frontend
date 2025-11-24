import { useState, useRef, useEffect } from 'react';
import Logo from '../assets/Svgs/navbar/Logo.svg';
import LangueIcon from '../assets/Svgs/navbar/langue.svg';
import ProfilePhoto from '../assets/imges/photoProfil.jpg';

const Navbar = () => {
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageMenuOpen(false);
  };

  return (
    // Navbar container: full width, white background, shadow as per Figma (Y:4, Blur:8, #000000 8%)
    // Height: 64px for comfortable spacing, padding horizontal for content alignment
    // Bottom border for visual separation
    <nav className="w-full h-16 bg-white px-8 flex items-center justify-between shadow-md border-b border-[#EEEEEE]" style={{ boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.08)' }}>
      {/* Left section: Logo + Brand name */}
      <div className="flex items-center gap-2">
        {/* Logo: Slightly reduced size for Figma accuracy, vertically centered */}
        <img src={Logo} alt="Ormeet Logo" className="w-6 h-8" />
        {/* Brand text: 20px font size, bold weight, black color, vertically aligned with logo */}
        <span className="text-xl font-bold text-black leading-none">Ormeet</span>
      </div>

      {/* Center section: Navigation links */}
      <div className="flex items-center gap-8">
        <a href="/browse-events" className="text-sm font-medium text-black hover:text-[#FF4000] transition-colors">
          Browse events
        </a>
        <a href="/host-events" className="text-sm font-medium text-black hover:text-[#FF4000] transition-colors">
          Host events
        </a>
        <a href="/support" className="text-sm font-medium text-black hover:text-[#FF4000] transition-colors">
          Support
        </a>
      </div>

      {/* Right section: Language selector + Profile icon */}
      {/* Adjusted spacing for better visual alignment */}
      <div className="flex items-center gap-3 mr-8">
        {/* Language selector with dropdown */}
        <div className="relative" ref={languageMenuRef}>
          {/* Language button: 36x36px circular background with icon */}
          <button
            onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {/* Language icon: 36x36px */}
            <img src={LangueIcon} alt="Language" className="w-9 h-9" />
            {/* Selected language text: 14px, medium weight */}
            <span className="text-sm font-medium text-[#4F4F4F]">{selectedLanguage}</span>
          </button>

          {/* Dropdown menu: appears below the button when open */}
          {isLanguageMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-24 bg-white rounded-lg shadow-lg border border-[#EEEEEE] py-1 z-50">
              {['EN', 'FR', 'AR'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    selectedLanguage === lang
                      ? 'bg-[#FFF4F3] text-[#FF4000] font-medium'
                      : 'text-[#4F4F4F] hover:bg-[#F8F8F8]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile photo with dropdown menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#FF4000] transition-all"
          >
            <img src={ProfilePhoto} alt="Profile" className="w-full h-full object-cover" />
          </button>

          {/* Profile Dropdown menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#EEEEEE] py-1 z-50">
              <a
                href="/profile"
                className="block px-4 py-2.5 text-sm text-[#4F4F4F] hover:bg-[#F8F8F8] hover:text-[#FF4000] transition-colors"
              >
                Profile
              </a>
              <a
                href="/dashboard-attendee"
                className="block px-4 py-2.5 text-sm text-[#4F4F4F] hover:bg-[#F8F8F8] hover:text-[#FF4000] transition-colors"
              >
                My Tickets
              </a>
              <a
                href="/settings"
                className="block px-4 py-2.5 text-sm text-[#4F4F4F] hover:bg-[#F8F8F8] hover:text-[#FF4000] transition-colors"
              >
                Settings
              </a>
              <a
                href="/help"
                className="block px-4 py-2.5 text-sm text-[#4F4F4F] hover:bg-[#F8F8F8] hover:text-[#FF4000] transition-colors"
              >
                Help / Support
              </a>
              <div className="border-t border-[#EEEEEE] my-1"></div>
              <button
                onClick={() => {
                  // Add logout logic here
                  console.log('Logging out...');
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-[#FF4000] hover:bg-[#FFF4F3] transition-colors font-medium"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
