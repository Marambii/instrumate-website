import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import SignDetection from "./pages/SignDetection";
import Translation from "./pages/Translation";
import Learn from "./pages/Learn";

import { useEffect } from "react";
import AuthPage from "./pages/AuthPage";

// Wrap Routes with AnimatePresence
function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on route change
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/home" element={<Home />} />
        <Route path="/sign-detection" element={<SignDetection />} />
        <Route path="/translation" element={<Translation />} />
        <Route path="/" element={<AuthPage />} />
        <Route path="/Learn" element={<Learn />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <AnimatedRoutes />
      <Footer />
    </Router>
  );
}

export default App;
