import { useEffect, useState } from 'react';
import '../styles/globals.css';
import Head from 'next/head';
import CookieConsent from '../components/CookieConsent';
import MobileCostSummary from '../components/MobileCostSummary';

function ClientOnly({ children }) {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return null;
  }
  
  return children;
}

export default function App({ Component, pageProps }) {
  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    }
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#2563eb" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e40af" media="(prefers-color-scheme: dark)" />
        
        {/* Primary Meta Tags */}
        <meta name="title" content="Mellow Quote - Website Quote Calculator" />
        <meta name="description" content="Get instant, accurate website development quotes. Our easy-to-use calculator helps you estimate costs for single-page and multi-page websites." />
        <meta name="keywords" content="website quote, web development pricing, website cost calculator, web design estimate, website builder quote" />
        <meta name="author" content="Mellow Quote" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mellowquote.netlify.app/" />
        <meta property="og:title" content="Mellow Quote - Website Quote Calculator" />
        <meta property="og:description" content="Get instant, accurate website development quotes. Our easy-to-use calculator helps you estimate costs for single-page and multi-page websites." />
        <meta property="og:site_name" content="Mellow Quote" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://mellowquote.netlify.app/" />
        <meta property="twitter:title" content="Mellow Quote - Website Quote Calculator" />
        <meta property="twitter:description" content="Get instant, accurate website development quotes. Our easy-to-use calculator helps you estimate costs for single-page and multi-page websites." />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        
        {/* PWA / Mobile Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mellow Quote" />
        <meta name="application-name" content="Mellow Quote" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://mellowquote.netlify.app/" />
      </Head>
      
      <Component {...pageProps} />
      <ClientOnly>
        <MobileCostSummary />
      </ClientOnly>
      <CookieConsent />
    </>
  );
}
