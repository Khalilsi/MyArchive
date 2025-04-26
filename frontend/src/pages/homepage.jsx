import React from 'react';
import Navbar from '../components/homepage/navbar/Navbar';
import HeroSection from '../components/homepage/HeroSection/HeroSection';
import SecondSection from '../components/homepage/SecondSection/SecondSection';
import ThirdSection from '../components/homepage/ThirdSection/ThirdSection';
import FourSection from '../components/homepage/FourSection/FourSection';
import ContactSection from '../components/homepage/ContactSection/ContactSection';
import Footer from '../components/homepage/Footer/Footer';
import './style/homepage.css'; 

const Homepage = () => {
  return (
    <div className="homepage">

        <Navbar />
        <HeroSection />
        <SecondSection />
        <ThirdSection />
        <FourSection />
        <ContactSection />
        <Footer />
    </div>
  );
};

export default Homepage;