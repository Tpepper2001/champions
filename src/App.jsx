import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    // Scroll Animation Logic
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    // Smooth scroll for nav links
    const handleScroll = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => link.addEventListener('click', handleScroll));

    return () => links.forEach(link => link.removeEventListener('click', handleScroll));
  }, []);

  const teamMembers = [
    {
      name: "James Oluwapelumi Olatunbosun",
      role: "Program Director",
      bio: "James is a science communicator and Engineering Physics student at OAU. He is committed to seeing young people thrive in career and character.",
      linkedin: "https://www.linkedin.com/in/james-olatunbosun",
      initial: "J"
    },
    {
      name: "Ogbaudu Oghenefegor Believe",
      role: "Corp Member",
      bio: "A faith-based writer and founder of GAP INITIATIVE. She empowers youth to discover their gifts through NGO work and creative writing.",
      linkedin: null,
      initial: "O"
    },
    {
      name: "Oluwatoyin Oluwabukola Yakubu",
      role: "Head, Content",
      bio: "Oluwatoyin is passionate about helping people find healing from trauma and low self-esteem through honest conversations and mentorship.",
      linkedin: "https://www.linkedin.com/in/oluwatoyin-yakubu-a2b1b6258",
      initial: "T"
    },
    {
      name: "Joseph Temitope Deborah",
      role: "Community Manager",
      bio: "A communication advocate and leadership enthusiast. Deborah is passionate about purpose discovery and building impactful leaders.",
      linkedin: "https://www.linkedin.com/in/temitope-deborah-joseph-b24580227",
      initial: "D"
    },
    {
      name: "Promise Nseobong",
      role: "Human Resource",
      bio: "An accounting student focused on finance and taxation. Promise is also a creative voice running a motivational YouTube channel.",
      linkedin: "https://www.linkedin.com/in/nseobong-promise-02498a338",
      initial: "P"
    },
    {
      name: "Grace Temitope Babatunde",
      role: "Admin",
      bio: "A communication specialist and Business Admin postgraduate. Grace combines language mastery with a passion for people-management.",
      linkedin: "https://www.linkedin.com/in/gracetemibabatunde",
      initial: "G"
    }
  ];

  return (
    <>
      <style>{`
        :root {
          --primary-gold: #F4D03F;
          --deep-navy: #0A1128;
          --soft-lavender: #C8B8DB;
          --light-blue: #A8DADC;
          --warm-terracotta: #C86B56;
          --cream: #FFF8F0;
          --dark-text: #1A1A1A;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; color: var(--dark-text); line-height: 1.6; overflow-x: hidden; }

        /* Animations */
        @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-on-scroll { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

        /* Navbar */
        .navbar {
          position: fixed; top: 0; width: 100%; background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px); z-index: 1000; border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          animation: slideDown 0.6s ease-out;
        }
        .nav-container { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 2rem; }
        .logo { display: flex; align-items: center; gap: 0.8rem; font-weight: 700; font-size: 1.1rem; color: var(--deep-navy); }
        .logo-icon { width: 45px; height: 45px; background: linear-gradient(135deg, var(--primary-gold), var(--warm-terracotta)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; }
        .nav-links { display: flex; gap: 2.5rem; list-style: none; }
        .nav-links a { text-decoration: none; color: var(--dark-text); font-weight: 500; transition: color 0.3s; position: relative; }
        .nav-links a:hover { color: var(--warm-terracotta); }

        /* Hero */
        .hero { position: relative; height: 100vh; display: flex; align-items: center; background: linear-gradient(135deg, var(--deep-navy) 0%, #1a2847 100%); overflow: hidden; color: white; padding: 0 2rem; }
        .hero-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.15; background-image: radial-gradient(circle at 20% 50%, var(--primary-gold) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--soft-lavender) 0%, transparent 50%); animation: float 20s ease-in-out infinite; }
        .hero-content { position: relative; max-width: 1400px; margin: 0 auto; z-index: 2; }
        .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(3rem, 8vw, 5rem); line-height: 1.1; margin-bottom: 1.5rem; }
        .highlight { color: var(--primary-gold); }

        /* Common Layouts */
        .section-padding { padding: 8rem 2rem; }
        .container { max-width: 1400px; margin: 0 auto; }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem; }

        /* Cards */
        .pillar-card { padding: 3rem 2rem; border-radius: 15px; transition: all 0.4s; background: white; border: 1px solid #eee; }
        .pillar-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        
        .team-card { background: white; border-radius: 20px; padding: 2.5rem 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); position: relative; }
        .team-avatar { width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 900; background: var(--primary-gold); margin-bottom: 1rem; }

        .cta-button { display: inline-block; padding: 1rem 2.5rem; background: var(--primary-gold); color: var(--deep-navy); text-decoration: none; font-weight: 700; border-radius: 50px; transition: 0.3s; }
        .cta-button:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(244, 208, 63, 0.4); }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .section-padding { padding: 4rem 1rem; }
        }
      `}</style>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon">C</div>
            <span>Champions Leadership Global</span>
          </div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div style={{ letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--primary-gold)', marginBottom: '1.5rem', fontWeight: 600 }}>Welcome to a World of Champions</div>
          <h1 className="hero-title">Raising <span className="highlight">Transformational Leaders</span></h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '650px', marginBottom: '2.5rem', opacity: 0.85 }}>
            We empower individuals and organizations to discover their purpose, develop authentic leadership, and achieve lasting personal transformation.
          </p>
          <blockquote style={{ paddingLeft: '2rem', borderLeft: '3px solid var(--warm-terracotta)', fontStyle: 'italic', marginBottom: '3rem', opacity: 0.7 }}>
            "You can make decisions, not consequences"
            <span style={{ display: 'block', marginTop: '0.5rem', color: 'var(--primary-gold)', fontWeight: 600 }}>— J.A. Oyedele</span>
          </blockquote>
          <a href="#about" className="cta-button">Explore Our Mission</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="grid-3" style={{ gridTemplateColumns: '1.2fr 0.8fr', alignItems: 'center' }}>
            <div className="animate-on-scroll">
              <h2 style={{ fontSize: '3rem', fontFamily: 'Playfair Display', marginBottom: '2rem' }}>Who We Are</h2>
              <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#444' }}>
                Champions' Leadership Global is deeply committed to the themes of <strong>purpose, leadership, and personal development</strong>. We believe that everyone has the potential and responsibility to live out their purpose.
              </p>
              <p style={{ fontSize: '1.1rem', color: '#444' }}>
                We believe the world needs more leaders who lead from the angle of transformation. Transforming people is the best way to transform the world.
              </p>
            </div>
            <div className="animate-on-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'var(--deep-navy)', color: 'white', padding: '2rem', borderRadius: '15px' }}>
                <h4 style={{ color: 'var(--primary-gold)', marginBottom: '0.5rem' }}>Leadership Academy</h4>
                <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Equipping leaders with every knowledge and skill needed to rise to influence.</p>
              </div>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #eee' }}>
                <h4 style={{ color: 'var(--deep-navy)', marginBottom: '0.5rem' }}>Global Events</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Hosting conferences, seminars, and bootcamps for the next generation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Section */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-on-scroll">
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display' }}>The Champions' Framework</h2>
            <p style={{ color: '#666' }}>Built on three fundamental principles</p>
          </div>
          <div className="grid-3">
            <div className="pillar-card animate-on-scroll">
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
              <h3 style={{ marginBottom: '1rem' }}>Purpose</h3>
              <p style={{ color: '#666' }}>The essence of living and the driving force behind every decision, action, and goal.</p>
            </div>
            <div className="pillar-card animate-on-scroll" style={{ delay: '0.2s' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👑</div>
              <h3 style={{ marginBottom: '1rem' }}>Leadership</h3>
              <p style={{ color: '#666' }}>The ability to influence and inspire others to work towards a common global vision.</p>
            </div>
            <div className="pillar-card animate-on-scroll" style={{ delay: '0.4s' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌱</div>
              <h3 style={{ marginBottom: '1rem' }}>Growth</h3>
              <p style={{ color: '#666' }}>Developing new skills, building confidence, and cultivating a growth mindset.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="section-padding" style={{ background: '#f9f9f9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-on-scroll">
            <h2 style={{ fontSize: '2.8rem', fontFamily: 'Playfair Display' }}>Meet Our Team</h2>
            <p style={{ color: '#666' }}>A passionate group committed to raising transformational leaders.</p>
          </div>
          <div className="grid-3">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="team-card animate-on-scroll">
                <div className="team-avatar" style={{ 
                  background: `linear-gradient(135deg, ${idx % 2 === 0 ? 'var(--primary-gold)' : 'var(--soft-lavender)'}, #eee)` 
                }}>
                  {member.initial}
                </div>
                <div style={{ color: 'var(--warm-terracotta)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>{member.role}</div>
                <h3 style={{ margin: '0.5rem 0', fontFamily: 'Playfair Display' }}>{member.name}</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>{member.bio}</p>
                {member.linkedin ? (
                  <a href={member.linkedin} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'var(--deep-navy)', fontWeight: 700, fontSize: '0.85rem' }}>LINKEDIN →</a>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#ccc', fontStyle: 'italic' }}>LinkedIn coming soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="section-padding" style={{ background: 'var(--primary-gold)', textAlign: 'center' }}>
        <div className="container animate-on-scroll">
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display', color: 'var(--deep-navy)', marginBottom: '1.5rem' }}>Ready to Begin Your Transformation?</h2>
          <p style={{ marginBottom: '2.5rem', fontSize: '1.2rem', color: 'rgba(10, 17, 40, 0.8)' }}>Join thousands of leaders who have discovered their purpose.</p>
          <a href="mailto:info@cleadglobal.org" className="cta-button" style={{ background: 'var(--deep-navy)', color: 'white' }}>Get Started Today</a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--deep-navy)', color: 'white', padding: '4rem 2rem' }}>
        <div className="container grid-3">
          <div>
            <h3 style={{ fontFamily: 'Playfair Display', marginBottom: '1.5rem' }}>Champions Leadership Global</h3>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>We believe that the world is first a people, which eventually makes the place. Our mandate is transformation.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--primary-gold)', marginBottom: '1.5rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', opacity: 0.8 }}>
              <li style={{ marginBottom: '0.5rem' }}><a href="#home" style={{ color: 'white', textDecoration: 'none' }}>Home</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#about" style={{ color: 'white', textDecoration: 'none' }}>About</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#team" style={{ color: 'white', textDecoration: 'none' }}>Team</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--primary-gold)', marginBottom: '1.5rem' }}>Contact</h4>
            <p style={{ opacity: 0.8, marginBottom: '0.5rem' }}>📞 +234 906 414 4546</p>
            <p style={{ opacity: 0.8 }}>✉️ info@cleadglobal.org</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.3, fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
          &copy; 2026 Champions Leadership Global. Raising Transformational Leaders.
        </div>
      </footer>
    </>
  );
};

export default App;
