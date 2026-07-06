import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GameProvider } from './features/game/GameProvider';
import { countries } from './data/dataset';
import { AppHeader } from './components/AppHeader';
import { HomePage } from './pages/HomePage';
import { GamePage } from './pages/GamePage';
import { ResultPage } from './pages/ResultPage';
import { ExplorePage } from './pages/ExplorePage';
import { CountryDetailPage } from './pages/CountryDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import styles from './App.module.css';

function AppContent() {
  // En /jugar la partida ocupa el viewport sin scroll (§11): sin AppHeader y con
  // un <main> a pantalla completa (sin el padding ni el max-width habituales).
  const isGame = useLocation().pathname === '/jugar';

  return (
    <>
      {!isGame && <AppHeader />}
      <main className={isGame ? styles.mainGame : styles.main}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jugar" element={<GamePage />} />
          <Route path="/resultado" element={<ResultPage />} />
          <Route path="/explorar" element={<ExplorePage />} />
          <Route path="/explorar/:code" element={<CountryDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider countries={countries}>
        <AppContent />
      </GameProvider>
    </BrowserRouter>
  );
}
