"use client"
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Pricing from '@/components/pricing';
import Header from '@/components/header';

/* ─── Custom Hooks ────────────────────────────────────────────────── */
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const update = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', update);
    return () => window.removeEventListener('mousemove', update);
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
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [hasAnimated]);
  return [ref, isVisible];
};

const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const handle = () => setOffset(window.pageYOffset * speed);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, [speed]);
  return offset;
};

/* ─── Custom Cursor ────────────────────────────────────────────────── */
const CustomCursor = () => {
  const mousePosition = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    const handle = (e) => {
      setIsHovering(
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'A' ||
        e.target.classList.contains('hoverable')
      );
    };
    document.addEventListener('mouseover', handle);
    return () => document.removeEventListener('mouseover', handle);
  }, []);
  if (isMobile) return null;
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.12s ease',
      }}
    >
      <div
        style={{
          width: isHovering ? 36 : 14,
          height: isHovering ? 36 : 14,
          borderRadius: '50%',
          background: isHovering ? 'transparent' : '#c8ff00',
          border: isHovering ? '1.5px solid #c8ff00' : 'none',
          transition: 'all 0.2s ease',
        }}
      />
    </div>
  );
};

/* ─── Ambient Background ───────────────────────────────────────────── */
const AmbientBackground = ({ scrollYProgress }) => {
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const orb3X = useTransform(scrollYProgress, [0, 1], [0, 55]);
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ background: '#080808' }}>
      <motion.div style={{
        position: 'absolute', width: '60vw', height: '60vw', top: '-10%', left: '-10%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
        y: orb1Y,
      }} />
      <motion.div style={{
        position: 'absolute', width: '50vw', height: '50vw', bottom: '5%', right: '-5%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,255,0,0.05) 0%, transparent 70%)',
        y: orb2Y,
      }} />
      <motion.div style={{
        position: 'absolute', width: '40vw', height: '40vw', top: '40%', left: '30%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)',
        x: orb3X,
      }} />
    </div>
  );
};

/* ─── Animated Counter ─────────────────────────────────────────────── */
const AnimatedCounter = ({ target, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver();
  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    const animate = (t) => {
      if (!startTime) startTime = t;
      const progress = Math.min((t - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(target);
    };
    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);
  return (
    <div ref={ref} style={{
      fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, fontFamily: "'Syne', sans-serif",
      background: 'linear-gradient(135deg, #fff 0%, #c8ff00 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1,
    }}>
      {count}{suffix}
    </div>
  );
};

/* ─── Hero Section ──────────────────────────────────────────────────── */
const HeroSection = ({ scrollYProgress }) => {
  const [glitchActive, setGlitchActive] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const demoRef = useRef(null);
  const parallaxFloat = useParallax(0.03);
  const heroMove = useTransform(scrollYProgress, [0, 0.24], [0, -48]);
  const heroScale = useTransform(scrollYProgress, [0, 0.28], [1, 0.96]);
  const gridMove = useTransform(scrollYProgress, [0, 0.25], [0, -22]);
  const gridRotate = useTransform(scrollYProgress, [0, 0.25], [0, 5]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 120);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!demoRef.current) return;
    const rect = demoRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = (e.clientY - rect.top - rect.height / 2) / 25;
    setTilt({ x: -y, y: x });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <motion.section id="home" style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '80px 20px 40px',
      y: heroMove,
      scale: heroScale,
    }}>
      <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center' }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(200,255,0,0.06)', border: '1px solid rgba(200,255,0,0.2)',
              borderRadius: 9999, padding: '6px 16px', marginBottom: 32,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8ff00', display: 'inline-block', boxShadow: '0 0 8px #c8ff00' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#c8ff00', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI-Powered Image Editing
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(3.2rem, 9vw, 8rem)',
            fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.03em',
            marginBottom: 28, color: '#fff',
          }}>
            <span style={{ display: 'block' }}>Edit images</span>
            <span style={{
              display: 'block',
              background: 'linear-gradient(90deg, #c8ff00 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              without limits.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.45)',
              maxWidth: 560, margin: '0 auto 44px', lineHeight: 1.7, fontWeight: 400,
            }}
          >
            Harness the power of AI to transform your creative vision — background removal, upscaling, style transfer and more, in seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 72 }}
          >
            <button className="hoverable" style={{
              padding: '14px 32px', background: '#c8ff00', color: '#080808', border: 'none',
              borderRadius: 9999, fontSize: 15, fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.25s ease', letterSpacing: '0.01em',
              boxShadow: '0 0 32px rgba(200,255,0,0.25)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 48px rgba(200,255,0,0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(200,255,0,0.25)'; }}
            >
              Start Editing Free
            </button>
            <button className="hoverable" style={{
              padding: '14px 32px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)',
              color: 'rgba(255,255,255,0.8)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: 9999, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              Watch Demo
            </button>
          </motion.div>

          {/* 3D Demo Interface */}
          <motion.div
            ref={demoRef}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="hoverable"
            style={{
              maxWidth: 860, margin: '0 auto',
              transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${parallaxFloat}px)`,
              transition: 'transform 0.25s ease-out',
              y: gridMove,
              rotate: gridRotate,
            }}
          >
            <div style={{
              backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 28, padding: 'clamp(20px, 4vw, 36px)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}>
              {/* Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
                  ))}
                </div>
                <div style={{ flex: 1, height: 28, background: 'rgba(255,255,255,0.04)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }} />
                <div style={{ width: 28, height: 28, background: 'rgba(200,255,0,0.12)', borderRadius: 6, border: '1px solid rgba(200,255,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c8ff00', boxShadow: '0 0 6px #c8ff00' }} />
                </div>
              </div>

              {/* Image grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { from: 'rgba(200,255,0,0.08)', to: 'rgba(139,92,246,0.12)', delay: 0, badge: 'PROCESSING', badgeColor: '#c8ff00', badgeBg: 'rgba(200,255,0,0.15)', badgeBorder: 'rgba(200,255,0,0.3)' },
                  { from: 'rgba(139,92,246,0.12)', to: 'rgba(200,255,0,0.06)', delay: 0.15, badge: 'DONE ✓', badgeColor: '#a78bfa', badgeBg: 'rgba(139,92,246,0.15)', badgeBorder: 'rgba(139,92,246,0.3)' },
                  { from: 'rgba(255,255,255,0.04)', to: 'rgba(200,255,0,0.1)', delay: 0.3, badge: null },
                ].map((item, i) => (
                  <motion.div key={i}
                    style={{
                      aspectRatio: '4/3', borderRadius: 14,
                      background: `linear-gradient(135deg, ${item.from}, ${item.to})`,
                      border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden',
                    }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
                  >
                    <motion.div
                      style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,255,0,0.5), transparent)' }}
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: item.delay, ease: 'linear' }}
                    />
                    {item.badge && (
                      <div style={{
                        position: 'absolute', bottom: 8, left: 8,
                        background: item.badgeBg, border: `1px solid ${item.badgeBorder}`,
                        borderRadius: 6, padding: '3px 8px', fontSize: 9, fontWeight: 700,
                        color: item.badgeColor, letterSpacing: '0.06em',
                      }}>{item.badge}</div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress bar */}
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 9999, height: 3, overflow: 'hidden', marginBottom: 12 }}>
                <motion.div
                  style={{ height: '100%', background: 'linear-gradient(90deg, #c8ff00, #8B5CF6)', borderRadius: 9999 }}
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                {[{ label: 'Removed BG', val: '3 items' }, { label: 'Upscaled', val: '2×' }, { label: 'Time saved', val: '~4 min' }].map((s, i) => (
                  <div key={i} style={{
                    flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10, padding: '10px 14px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 'clamp(11px, 2vw, 13px)', fontWeight: 700, color: '#fff' }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

/* ─── Feature Card ──────────────────────────────────────────────────── */
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const [ref, isVisible] = useIntersectionObserver();
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="hoverable"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? 'rgba(200,255,0,0.2)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 24, padding: 'clamp(20px, 3vw, 32px)',
        transition: 'all 0.35s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(200,255,0,0.08)' : '0 4px 24px rgba(0,0,0,0.2)',
        cursor: 'default', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,255,0,0.4), transparent)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease' }} />
      <div style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: 18, display: 'inline-block', transition: 'transform 0.3s ease', transform: hovered ? 'scale(1.1)' : 'scale(1)' }}>{icon}</div>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 700, marginBottom: 10, color: '#fff', letterSpacing: '-0.01em' }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0 }}>{description}</p>
    </motion.div>
  );
};

/* ─── Features Section ──────────────────────────────────────────────── */
const FeaturesSection = () => {
  const features = [
    { icon: '🧠', title: 'Neural Background Removal', description: 'Advanced AI algorithms detect and remove backgrounds with pixel-perfect precision in microseconds.' },
    { icon: '⚡', title: 'Quantum Upscaling', description: 'Enhance image resolution up to 16K using quantum-inspired neural networks without quality loss.' },
    { icon: '🎨', title: 'Generative Fill', description: 'Fill, expand, or replace any part of your image with AI-generated content that seamlessly blends.' },
    { icon: '✨', title: 'Smart Object Detection', description: 'Automatically identify and isolate objects, people, or elements for precise editing control.' },
    { icon: '🌈', title: 'Color Grading AI', description: 'Professional-grade color correction and grading powered by machine learning models.' },
    { icon: '🔮', title: 'Style Transfer', description: 'Apply artistic styles from famous paintings or create custom looks with neural style transfer.' },
  ];
  const [titleRef, titleVisible] = useIntersectionObserver();
  return (
    <section id="features" style={{ position: 'relative', padding: 'clamp(60px, 10vw, 120px) 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div ref={titleRef} initial={{ opacity: 0, y: 30 }} animate={titleVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 72px)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8B5CF6', marginBottom: 16 }}>Capabilities</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', margin: '0 auto 16px', maxWidth: 640 }}>
            Everything you need to edit images at scale.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto' }}>Cutting-edge AI capabilities that redefine what's possible in image editing.</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
          {features.map((feature, index) => <FeatureCard key={index} {...feature} delay={index * 0.08} />)}
        </div>
      </div>
    </section>
  );
};

/* ─── Stats Section ─────────────────────────────────────────────────── */
const InteractiveStats = () => {
  const stats = [
    { target: 50, suffix: 'M+', label: 'Images Created' },
    { target: 99, suffix: '%', label: 'Accuracy Rate' },
    { target: 120, suffix: 'K+', label: 'Active Users' },
    { target: 4, suffix: '.9★', label: 'User Rating' },
  ];
  return (
    <section style={{ position: 'relative', padding: 'clamp(40px, 6vw, 80px) 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 24, padding: 'clamp(28px, 4vw, 48px)',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 32,
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              <p style={{ color: 'rgba(255,255,255,0.35)', marginTop: 8, fontSize: 13, fontWeight: 500, letterSpacing: '0.04em' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


/* ─── Contact Section ───────────────────────────────────────────────── */
const ContactSection = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); console.log('Form submitted:', formData); };
  const inputStyle = {
    width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.04)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.08)', borderRadius: 14, color: '#fff', fontSize: 15,
    outline: 'none', transition: 'border-color 0.25s ease', boxSizing: 'border-box', fontFamily: 'inherit',
  };
  return (
    <section id="contact" style={{ position: 'relative', padding: 'clamp(60px, 10vw, 120px) 20px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8B5CF6', marginBottom: 16 }}>Contact</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 16 }}>Let's create together.</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>Ready to revolutionize your creative workflow? Get in touch.</p>
          </div>
          <div style={{
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 28, padding: 'clamp(24px, 4vw, 44px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(200,255,0,0.4)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(200,255,0,0.4)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }} />
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" rows="5" style={{ ...inputStyle, resize: 'none' }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(200,255,0,0.4)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }} />
              <button onClick={handleSubmit} className="hoverable" style={{
                padding: '14px 0', background: '#c8ff00', color: '#080808', border: 'none',
                borderRadius: 9999, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.25s ease', boxShadow: '0 0 24px rgba(200,255,0,0.2)', marginTop: 4,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(200,255,0,0.35)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(200,255,0,0.2)'; }}
              >Send Message</button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Footer ────────────────────────────────────────────────────────── */
const Footer = () => (
  <footer style={{ position: 'relative', padding: 'clamp(28px, 4vw, 48px) 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
          Off<span style={{ color: '#c8ff00' }}>Image</span>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Privacy', 'Terms', 'Support'].map((link) => (
            <a key={link} href="#" className="hoverable" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => { e.target.style.color = '#c8ff00'; }} onMouseLeave={(e) => { e.target.style.color = 'rgba(255,255,255,0.35)'; }}>
              {link}
            </a>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 28, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
        © 2025 OffImage. Powered by Quantum Neural Networks.
      </div>
    </div>
  </footer>
);

/* ─── Font + Global Styles ──────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
    * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
    ::placeholder { color: rgba(255,255,255,0.28) !important; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0d0d0d; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(200,255,0,0.3); }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
    }
    /* Ensure payment panels / auth modals render above the fixed navbar and containers */
    dialog, [role="dialog"], [aria-modal="true"], .clerk-modal, .clerk-portal, .clerk-root, .clerk-dialog, .ClerkModal, .clerk-modal__overlay {
      position: fixed !important;
      z-index: 99999 !important;
      top: 0 !important;
      left: 0 !important;
    }
    /* Fallback for any portal-like element created by 3rd-party widgets */
    [data-portal], [data-clerk-portal], .portal-root {
      position: fixed !important;
      z-index: 99999 !important;
    }
  `}</style>
);

/* ─── Main App ──────────────────────────────────────────────────────── */
export default function App() {
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // Handle query parameter navigation from other pages
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    if (section) {
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <>
      <FontLoader />
      <div style={{ position: 'relative', minHeight: '100vh', background: '#080808', color: '#fff', overflowX: 'hidden' }}>
        <CustomCursor />
        <AmbientBackground scrollYProgress={scrollYProgress} />

        <main style={{ position: 'relative', zIndex: 10 }}>
          <HeroSection scrollYProgress={scrollYProgress} />
          <InteractiveStats />
          <FeaturesSection />
          <Pricing />
          <ContactSection />
        </main>

        <Footer />
      </div>
    </>
  );
}
