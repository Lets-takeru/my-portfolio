import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const { locale, asPath } = useRouter();
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ja', label: 'JA' },
    { code: 'fr', label: 'FR' },
  ];

  const navLinks = [
    { href: '/', label: t('nav.top') },
    { href: '/profile', label: t('nav.profile') },
    { href: '/artworks', label: t('nav.artworks') },
    { href: '/news', label: t('nav.news') },
    
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray backdrop-blur-sm text-white h-16 z-50">
      <div className="flex items-center justify-between h-full">
        {/* ロゴ */}
        <div className="text-base sm:text-xl font-bold flex items-center h-full whitespace-nowrap pl-4">
          Let.s_la_vie_art
        </div>

        {/* モバイルアイコン */}
        <button
          className="sm:hidden text-white flex items-center h-full pr-4"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* PCメニュー */}
        <nav className="hidden sm:flex items-center py-0 gap-6 text-lg h-full pr-4">
          <ul className="flex space-x-5">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
          <div className="flex space-x-1">
            {languages.map(({ code, label }) =>
              code !== locale ? (
                <Link key={code} href={asPath} locale={code} scroll={false}>
                  <span className="px-3 py-0 rounded border text-gray-300 border-gray-600 hover:bg-gray-700 cursor-pointer text-sm">
                    {label}
                  </span>
                </Link>
              ) : (
                <span
                  key={code}
                  className="px-3 py-1 rounded border bg-cyan-600 text-white border-cyan-400 text-sm"
                >
                  {label}
                </span>
              )
            )}
          </div>
        </nav>
      </div>

      {/* モバイルメニュー */}
      {isOpen && (
        <div className="sm:hidden bg-black/80 backdrop-blur-md px-4 pb-4 pt-2 text-lg space-y-0">
          <ul className="space-y-3">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} onClick={() => setIsOpen(false)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex space-x-2 pt-4">
            {languages.map(({ code, label }) =>
              code !== locale ? (
                <Link key={code} href={asPath} locale={code} scroll={false}>
                  <span className="text-sm px-3 py-1 rounded border bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 cursor-pointer">
                    {label}
                  </span>
                </Link>
              ) : (
                <span
                  key={code}
                  className="text-sm px-3 py-1 rounded border bg-cyan-600 text-white border-cyan-400"
                >
                  {label}
                </span>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}