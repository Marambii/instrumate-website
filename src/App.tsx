import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";

// Layout & Pages
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import SignDetection from "./pages/SignDetection";
import Translation from "./pages/Translation";
import Learn from "./pages/Learn";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Demo from "./demo/demo";
import TeamPage from './pages/Team';


function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on route change
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* All pages inside here will automatically have the Header, Footer, and correct Padding */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sign-detection" element={<SignDetection />} />
          <Route path="/translation" element={<Translation />} />
          <Route path='/team' element={<TeamPage />} />
          <Route path="/Learn" element={<Learn />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/demo" element={<Demo />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;