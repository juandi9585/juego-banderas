import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider countries={countries}>
        <AppHeader />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jugar" element={<GamePage />} />
            <Route path="/resultado" element={<ResultPage />} />
            <Route path="/explorar" element={<ExplorePage />} />
            <Route path="/explorar/:code" element={<CountryDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </GameProvider>
    </BrowserRouter>
  );
}
