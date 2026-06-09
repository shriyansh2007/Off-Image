"use client"
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Pricing from '@/components/pricing';
import Header from '@/components/header'; 
// Custom Hooks
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return mousePosition;
};

const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setIsVisible(true);
        setHasAnimated(true);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated, options]);

  return [ref, isVisible];
};

const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
};

// Custom Cursor Component
const CustomCursor = () => {
  const mousePosition = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    
    const handleMouseOver = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.classList.contains('hoverable')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  if (isMobile) return null;

  return (
    <div
      className="fixed w-5 h-5 bg-blue-500 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-150"
      style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        transform: `translate(-50%, -50%) scale(${isHovering ? 2 : 1})`,
      }}
    >
      <div className="w-full h-full bg-cyan-400 rounded-full animate-ping opacity-75"></div>
    </div>
  );
};

// Floating Shapes Component
const FloatingShapes = () => {
  const parallaxOffset = useParallax(0.3);
  
  const shapes = useMemo(() => [
    { color: 'from-blue-500 to-cyan-500', size: 'w-96 h-96', top: '10%', left: '5%', delay: 0 },
    { color: 'from-purple-500 to-pink-500', size: 'w-80 h-80', top: '50%', right: '10%', delay: 1 },
    { color: 'from-cyan-500 to-blue-600', size: 'w-72 h-72', bottom: '10%', left: '15%', delay: 2 },
    { color: 'from-pink-500 to-purple-600', size: 'w-64 h-64', top: '30%', right: '20%', delay: 1.5 },
  ], []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.size} bg-gradient-to-r ${shape.color} blur-3xl opacity-20 rounded-full`}
          style={{
            top: shape.top,
            left: shape.left,
            right: shape.right,
            bottom: shape.bottom,
            transform: `translateY(${parallaxOffset}px)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Glass Navigation Component
const GlassNavigation = () => {
  const [activeSection, setActiveSection] = useState('home');

  const navItems = ['Home', 'Features', 'Pricing', 'Contact'];

  const scrollToSection = (section) => {
    const element = document.getElementById(section.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(section.toLowerCase());
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 backdrop-blur-lg bg-white/10 border border-white/20 rounded-full px-8 py-3">
      <ul className="flex space-x-8">
        {navItems.map((item) => (
          <li key={item}>
            <button
              onClick={() => scrollToSection(item)}
              className={`hoverable text-sm font-medium transition-all duration-300 ${
                activeSection === item.toLowerCase()
                  ? 'text-cyan-400 scale-110'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ target, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver();

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return (
    <div ref={ref} className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
      {count}{suffix}
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  const [glitchActive, setGlitchActive] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const demoRef = useRef(null);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!demoRef.current) return;
    const rect = demoRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setTilt({ x: -y, y: x });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <motion.h1
            className={`text-7xl md:text-9xl font-black mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent ${
              glitchActive ? 'animate-pulse' : ''
            }`}
            style={{
              textShadow: glitchActive ? '2px 2px #ff00de, -2px -2px #00ffff' : 'none',
            }}
          >
            The Future of
            <br />
            Image Creation
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto"
          >
            Harness the power of quantum-powered AI to transform your creative vision into reality
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <button className="hoverable px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-lg font-bold hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300">
              Experience the Magic
            </button>
            <button className="hoverable px-10 py-4 backdrop-blur-lg bg-white/10 border border-white/20 rounded-full text-lg font-bold hover:scale-105 hover:bg-white/20 transition-all duration-300">
              Watch Demo
            </button>
          </motion.div>

          {/* 3D Demo Interface */}
          <motion.div
            ref={demoRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="hoverable relative max-w-5xl mx-auto perspective-1000"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.2s ease-out',
            }}
          >
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="hoverable group backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/30 hover:scale-105 hover:rotate-1 transition-all duration-500"
    >
      <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-white/70 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: '🧠',
      title: 'Neural Background Removal',
      description: 'Advanced AI algorithms detect and remove backgrounds with pixel-perfect precision in microseconds.',
    },
    {
      icon: '⚡',
      title: 'Quantum Upscaling',
      description: 'Enhance image resolution up to 16K using quantum-inspired neural networks without quality loss.',
    },
    {
      icon: '🎨',
      title: 'Generative Fill',
      description: 'Fill, expand, or replace any part of your image with AI-generated content that seamlessly blends.',
    },
    {
      icon: '✨',
      title: 'Smart Object Detection',
      description: 'Automatically identify and isolate objects, people, or elements for precise editing control.',
    },
    {
      icon: '🌈',
      title: 'Color Grading AI',
      description: 'Professional-grade color correction and grading powered by machine learning models.',
    },
    {
      icon: '🔮',
      title: 'Style Transfer',
      description: 'Apply artistic styles from famous paintings or create custom looks with neural style transfer.',
    },
  ];

  return (
    <section id="features" className="relative py-32">
      <div className="container mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Superpowers Unlocked
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Cutting-edge AI capabilities that redefine what's possible in image editing
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Interactive Stats Section
const InteractiveStats = () => {
  const stats = [
    { target: 50, suffix: 'M+', label: 'Images Created' },
    { target: 99, suffix: '%', label: 'Accuracy Rate' },
    { target: 120, suffix: 'K+', label: 'Active Users' },
    { target: 4, suffix: '.9★', label: 'User Rating' },
  ];

  return (
    <section className="relative py-20">
      <div className="container mx-auto px-6 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              <p className="text-white/60 mt-4 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Card Component
const PricingCard = ({ plan, price, features, featured = false, buttonText = 'Get Started' }) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`hoverable relative backdrop-blur-lg ${
        featured
          ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-cyan-500 scale-105'
          : 'bg-white/5 border border-white/10'
      } rounded-3xl p-8 hover:scale-110 transition-all duration-500`}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-sm font-bold">
          MOST POPULAR
        </div>
      )}
      
      <h3 className="text-2xl font-bold mb-2">{plan}</h3>
      <div className="mb-6">
        <span className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          ${price}
        </span>
        <span className="text-white/60">/month</span>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-white/80">
            <span className="mr-3 text-cyan-400">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      
      <button className={`w-full py-4 rounded-full font-bold transition-all duration-300 ${
        featured
          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/50'
          : 'backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20'
      }`}>
        {buttonText}
      </button>
    </motion.div>
  );
};

// Pricing Section
const PricingSection = () => {
  const plans = [
    {
      plan: 'Starter',
      price: 19,
      features: [
        '100 AI generations/month',
        'Basic background removal',
        '2K upscaling',
        'Standard support',
      ],
    },
    {
      plan: 'Pro',
      price: 49,
      features: [
        'Unlimited AI generations',
        'Advanced neural tools',
        '16K upscaling',
        'Priority support',
        'API access',
        'Custom models',
      ],
      featured: true,
      buttonText: 'Unleash Power',
    },
    {
      plan: 'Enterprise',
      price: 199,
      features: [
        'Everything in Pro',
        'Dedicated infrastructure',
        'Custom integrations',
        'White-label options',
        '24/7 premium support',
      ],
    },
  ];

  return (
    <section id="pricing" className="relative py-32">
      <div className="container mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Choose Your Power Level
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Scale your creative capabilities with plans designed for every ambition
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section id="contact" className="relative py-32">
      <div className="container mx-auto px-6 z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Let's Create Together
          </h2>
          <p className="text-xl text-white/70 text-center mb-12">
            Ready to revolutionize your creative workflow? Get in touch.
          </p>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-500 transition-colors duration-300"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-500 transition-colors duration-300"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows="6"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-500 transition-colors duration-300 resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="hoverable w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-lg font-bold hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
              >
                Send Message
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="relative py-12 border-t border-white/10">
      <div className="container mx-auto px-6 z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4 md:mb-0">
            AI IMAGE STUDIO
          </div>
          <div className="flex space-x-8 text-white/60">
            <a href="#" className="hoverable hover:text-cyan-400 transition-colors duration-300">Privacy</a>
            <a href="#" className="hoverable hover:text-cyan-400 transition-colors duration-300">Terms</a>
            <a href="#" className="hoverable hover:text-cyan-400 transition-colors duration-300">Support</a>
          </div>
        </div>
        <div className="text-center mt-8 text-white/40 text-sm">
          © 2025 AI Image Studio. Powered by Quantum Neural Networks.
        </div>
      </div>
    </footer>
  );
};

// Main App Component
export default function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-900 text-white overflow-x-hidden">
      <CustomCursor />
      <FloatingShapes />
      {/* <Header /> */}
      {/* <GlassNavigation /> */}
      
      <main className="relative z-10">
        <HeroSection />
        <InteractiveStats />
        <FeaturesSection />
        <Pricing />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
}