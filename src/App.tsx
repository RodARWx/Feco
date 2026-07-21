import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { useEffect } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import UnitView from './pages/UnitView';
import QuizSession from './pages/QuizSession';
import QuizReport from './pages/QuizReport';
import Statistics from './pages/Statistics';
import Simulator from './pages/Simulator';
import QuestionBank from './pages/QuestionBank';
import './index.css';

function App() {
  const theme = useAppStore(state => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="unit/:unitId" element={<UnitView />} />
          <Route path="quiz/:unitId" element={<QuizSession />} />
          <Route path="report/:attemptId" element={<QuizReport />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="bank" element={<QuestionBank />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
