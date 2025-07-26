import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; 
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}