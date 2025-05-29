import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { appWithTranslation } from 'next-i18next';
import { AuthProvider } from '@/context/AuthContext'; // ✅ 追加

function App({ Component, pageProps }) {
  return (
    <AuthProvider> {/* ✅ 全体を囲む */}
      <div>
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default appWithTranslation(App);