import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GameProvider } from './features/game/GameProvider';
import { RecordsProvider } from './features/records/RecordsProvider';
import { OnlineProvider } from './features/online/OnlineProvider';
import { countries } from './data/dataset';
import { AppHeader } from './components/AppHeader';
import { PlayPage } from './pages/play/PlayPage';
import { GamePage } from './pages/GamePage';
import { ResultPage } from './pages/ResultPage';
import { ExplorePage } from './pages/ExplorePage';
import { RankingPage } from './pages/RankingPage';
import { RecordsPage } from './pages/RecordsPage';
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
          <Route path="/" element={<PlayPage />} />
          <Route path="/jugar" element={<GamePage />} />
          <Route path="/resultado" element={<ResultPage />} />
          {/* La pestaña Jugar>Competitivo se retiró: competir vive en /ranking
              (docs/design.md §19.4). El redirect conserva enlaces guardados. */}
          <Route path="/competitivo" element={<Navigate to="/ranking" replace />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/records" element={<RecordsPage />} />
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
      {/* RecordsProvider (récords locales) y OnlineProvider (ranking) envuelven por
          fuera: ambos son independientes del motor de juego (docs/competitivo.md §5,
          roadmap §C). La ResultPage les entrega el resultado ya hecho; lo online es
          adicional y asíncrono, y se apaga con gracia si faltan las env vars. */}
      <RecordsProvider>
        <OnlineProvider>
          <GameProvider countries={countries}>
            <AppContent />
          </GameProvider>
        </OnlineProvider>
      </RecordsProvider>
    </BrowserRouter>
  );
}
