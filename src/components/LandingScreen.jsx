import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

export default function LandingScreen({ onEnter }) {
  const [showButton, setShowButton] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleEnterClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  return (
    <main className="fixed inset-0 z-[100] bg-[#0a1012] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Video (Local Asset) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/VenueQ_Hero_Animation_Video_Creation.mp4" type="video/mp4" />
        </video>
      </motion.div>
      
      {/* Dynamic Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a1012] via-transparent to-transparent opacity-95"></div>

      {/* Hero Title */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        className="relative z-20 text-center mb-16"
      >
        <h1 className="text-8xl md:text-10xl font-headline font-black tracking-tighter text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          VENUE<span className="text-primary italic" aria-hidden="true">Q</span>
        </h1>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ duration: 1, delay: 1 }}
          className="h-[2px] bg-primary mx-auto mt-4"
        />
        <p className="text-secondary font-label uppercase tracking-[0.4em] text-xs mt-6 opacity-70">
          Advanced Stadium Intelligence
        </p>
      </motion.div>

      {/* Enter Button */}
      <AnimatePresence mode="wait">
        {showButton && !isTransitioning && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="relative z-20"
          >
            <button 
              onClick={handleEnterClick}
              aria-label="Enter Mission Control"
              className="group relative bg-primary text-on-primary px-12 py-5 rounded-full text-xl font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-[0_20px_60px_rgba(1,105,111,0.4)] flex items-center gap-4 border border-white/5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <span className="relative z-10">Initialize Command</span>
              <motion.span 
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="material-symbols-outlined relative z-10"
              >
                bolt
              </motion.span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portal Transition Overlay */}
      <motion.div 
        className="pointer-events-none absolute z-50 rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: isTransitioning ? 60 : 0 }}
        transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
        style={{
          top: '50%',
          left: '50%',
          width: '100px',
          height: '100px',
          marginTop: '-50px',
          marginLeft: '-50px',
          background: 'radial-gradient(circle, #01696f 0%, #0a1012 100%)',
        }}
        aria-hidden="true"
      />
    </main>
  );
}

LandingScreen.propTypes = {
  onEnter: PropTypes.func.isRequired,
};
