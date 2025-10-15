import React from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import AiTool from '../components/AiTool';
import Testimonial from '../components/Testimonial';
import Plan from '../components/Plan';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <>
            <NavBar />
            <Hero />
            <AiTool />
            <Testimonial />
            <Plan />
            <Footer />
        </>
    );
}

export default Home;
