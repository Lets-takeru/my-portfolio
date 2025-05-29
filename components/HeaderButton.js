import { useTranslation } from 'next-i18next';

export default function HeaderButton() {
  const { t } = useTranslation('common');

  return (
    <button className="text-white px-4 py-2 bg-cyan-600 rounded">
      {t('buttons.contact')}
    </button>
  );
}