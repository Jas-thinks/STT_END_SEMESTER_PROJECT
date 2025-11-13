import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Chatbot from './components/chatbot/Chatbot';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage';
import Practice from './pages/Practice';
import Leaderboard from './pages/Leaderboard';
import './style.css';

const App = () => {
  return (
    <AuthProvider>
      <QuizProvider>
        <Router>
          <Navbar />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/quiz/:id" component={QuizPage} />
            <Route path="/practice" component={Practice} />
            <Route path="/leaderboard" component={Leaderboard} />
          </Switch>
          <Footer />
          <Chatbot />
        </Router>
      </QuizProvider>
    </AuthProvider>
  );
};

export default App;