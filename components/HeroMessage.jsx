import { useRouter } from 'next/router';

export default function HeroMessage({ message }) {
  const { locale } = useRouter();
  const isLongLang = locale === 'en' || locale === 'fr';

  return (
    <div className="leading-relaxed drop-shadow-xl">
      {message.map((word, idx) =>
        word.break ? (
          <br key={`br-${idx}`} />
        ) : (
          <span
            key={idx}
            className={`font-bold ${
              word.small
                ? 'text-sm md:text-4xl' // 助詞など
                : isLongLang
                ? 'text-2xl md:text-8xl' // 英仏の主語
                : 'text-4xl md:text-8xl' // 日本語の主語
            } drop-shadow mr-1 md:mr-2`}
          >
            {word.text}
          </span>
        )
      )}

      <style jsx>{`
        .drop-shadow {
          text-shadow: 3px 3px 10px rgba(0, 255, 255, 0.9);
        }
      `}</style>
    </div>
  );
}