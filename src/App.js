import './App.scss';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import Menu from './Menu/Menu';
import Hero from './Hero/Hero';
import Footer from './Footer/Footer';
import HomePage from './Homepage/Homepage';
import AboutPage from './AboutPage/AboutPage'
import LoginPage from './LoginPage/LoginPage'

function App() {
  return (
    <Router>
      <Menu/>
      <Hero/>
      <div className='mainContainer'>
        <Routes>
          <Route path='/' element={<HomePage/>}></Route>
          <Route path='/about' element={<AboutPage/>}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;
