import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import Problem from '../components/Problem';
import Solution from '../components/Solution';
import TechStack from '../components/TechStack';
import LearnMore from '../components/LearnMore';


const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200">
      <Navbar />
      <HeroSection />
      <Problem/>
      <Solution />
      <TechStack />
      <LearnMore />
      <Footer />
    </div>
  );
};


export default Home;
