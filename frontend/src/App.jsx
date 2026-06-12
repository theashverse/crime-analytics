import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import ChatBot from './components/ChatBot';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0E1A',
      color: '#FFFFFF',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <Toaster position="top-right" />
      <Navbar />
      <Dashboard />
      <Footer />
      <ChatBot />
    </div>
  );
}

export default App;