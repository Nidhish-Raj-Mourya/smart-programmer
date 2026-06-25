import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProblemPage } from './pages/ProblemPage';

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problem/:problemId" element={<ProblemPage />} />
      </Routes>
    </BrowserRouter>
  );
}
