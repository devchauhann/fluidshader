import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Router, { type RouteType } from './Router';
import './index.css';

function MainApp() {
  const [currentRoute, setCurrentRoute] = useState<RouteType>(() => {
    const path = window.location.pathname;
    if (path.includes('/examples')) return 'examples';
    return 'home';
  });

  // Handle navigation via browser back/forward buttons
  window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    if (path.includes('/examples')) setCurrentRoute('examples');
    else setCurrentRoute('home');
  });

  return (
    <Router currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
);
