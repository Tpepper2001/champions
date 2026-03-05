import {  useEffect } from "react";

const colors = {
  gold: "#F4D03F",
  navy: "#0A1128",
  lavender: "#C8B8DB",
  lightBlue: "#A8DADC",
  terracotta: "#C86B56",
  cream: "#FFF8F0",
  darkText: "#1A1A1A",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'DM Sans', sans-serif;
    color: #1A1A1A;
    line-height: 1.6;
    overflow-x: hidden;
  }

  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to   { transform: translateY(0);     opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes float {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-30px) scale(1.05); }
    66%      { transform: translate(-20px,20px) scale(0.95); }
  }

  .navbar {
    position: fixed; top: 0; width: 100%;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    animation: slideDown 0.6s ease-out;
  }
  .nav-container {
    max-width: 1400px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.2rem 2rem;
  }
  .logo {
    display: flex; align-items: center; gap: 0.8rem;
    font-weight: 700; font-size: 1.1rem; color: #0A1128;
    text-decoration: none;
  }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a {
    text-decoration: none; color: #1A1A1A; font-weight: 500;
    transition: color 0.3s; position: relative; cursor: pointer;
  }
  .nav-links a:hover { color: #C86B56; }

  /* Hero */
  .hero {
    position: relative; height: 100vh;
    display: flex; align-items: center; overflow: hidden;
    background: #0A1128;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(10, 17, 40, 0.7), rgba(10, 17, 40, 0.7)), 
                      url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2000');
    background-size: cover;
    background-position: center;
    opacity: 0.4;
    animation: float 20s ease-in-out infinite;
  }
  .hero-content {
    position: relative; max-width: 1400px; margin: 0 auto;
    padding: 0 2rem; z-index: 2;
    animation: fadeInUp 1s ease-out 0.3s both;
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 5rem; font-weight: 900; color: white;
    line-height: 1.1; margin-bottom: 1.5rem; max-width: 900px;
  }

  /* Shared Sections */
  .section-container { max-width: 1400px; margin: 0 auto; position: relative; z-index: 2; }
  .section-header { text-align: center; margin-bottom: 4rem; }
  .section-label { font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; color: #C86B56; font-weight: 600; margin-bottom: 1rem; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 900; color: #0A1128; margin-bottom: 1rem; }

  /* Framework Pillars */
  .pillars-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; margin-top: 4rem; }
  .pillar-card {
    padding: 3.5rem 2.5rem; border-radius: 20px; background: white;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: all 0.4s;
    border: 1px solid rgba(0,0,0,0.03);
  }
  .pillar-card:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
  .pillar-icon { font-size: 3rem; margin-bottom: 1.5rem; }
  .pillar-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; margin-bottom: 1rem; color: #0A1128; }
  .pillar-text { font-size: 1.05rem; line-height: 1.8; color: rgba(0,0,0,0.7); margin-bottom: 1.5rem; }
  
  /* Core Values */
  .value-card {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(244,208,63,0.25);
    border-radius: 16px; padding: 2.5rem 2rem; text-align: center;
    flex: 1; min-width: 180px; max-width: 200px; transition: all 0.3s;
  }
  .value-card:hover { background: rgba(244,208,63,0.12); transform: translateY(-6px); }

  /* Team Section */
  .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 4rem; }
  .team-card {
    background: white; border-radius: 20px; padding: 2.5rem 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: all 0.4s ease;
    display: flex; flex-direction: column;
  }
  .team-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.12); }
  .team-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5rem; }
  .team-name { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: #0A1128; margin-bottom: 0.5rem; }
  .team-bio { font-size: 0.95rem; color: rgba(0,0,0,0.6); line-height: 1.7; margin-bottom: 1.5rem; flex-grow: 1; }
  .team-linkedin {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-size: 0.85rem; font-weight: 600; color: #0A1128; text-decoration: none;
    padding: 0.6rem 1.2rem; background: rgba(10,17,40,0.06);
    border-radius: 30px; transition: all 0.3s; align-self: flex-start;
  }
  .team-linkedin:hover { background: #0A1128; color: white; }

  /* Blog */
  .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; margin-top: 4rem; }
  .blog-card { border-radius: 20px; overflow: hidden; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
  .blog-img { width: 100%; height: 220px; object-fit: cover; }

  /* Video/CEO */
  .video-container {
    max-width: 1000px; margin: 0 auto; border-radius: 24px; overflow: hidden;
    aspect-ratio: 16/9; background: linear-gradient(135deg, #0A1128, #1a2847);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 30px 60px rgba(0,0,0,0.2);
  }

  .contact-input { width: 100%; padding: 1.2rem; background: #f9f9f9; border: 1px solid #eee; border-radius: 12px; margin-bottom: 1.2rem; font-family: inherit; }

  @media (max-width: 992px) { .team-grid, .blog-grid, .pillars-grid { grid-template-columns: 1fr 1fr; } }
  
  @media (max-width: 768px) {
    .nav-container { 
        flex-direction: column; 
        padding: 1rem; 
        gap: 1rem;
    }
    .nav-links { 
        display: flex; 
        gap: 1.2rem; 
        flex-wrap: wrap; 
        justify-content: center;
        font-size: 0.85rem;
    }
    .team-grid, .blog-grid, .pillars-grid { grid-template-columns: 1fr !important; }
    .hero-title { font-size: 3rem; }
  }
`;

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z"/></svg>
);

const teamMembers = [
  {
    name: "James Oluwapelumi Olatunbosun",
    designation: "Program Director",
    bio: "James is a science communicator and Engineering Physics student at OAU. He is committed to seeing young people thrive in career and character.",
    linkedin: "https://www.linkedin.com/in/james-olatunbosun",
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0000.jpg",
  },
  {
    name: "Ogbaudu Oghenefegor Believe",
    designation: "Corp Member",
    bio: "A faith-based writer and founder of GAP INITIATIVE — an NGO empowering youth to discover their gifts and purpose.",
    linkedin: null,
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0001.jpg",
  },
  {
    name: "Oluwatoyin Oluwabukola Yakubu",
    designation: "Head, Content",
    bio: "Oluwatoyin is passionate about helping people find healing from trauma and depression through honest conversations.",
    linkedin: "https://www.linkedin.com/in/oluwatoyin-yakubu-a2b1b6258",
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0005.jpg",
  },
  {
    name: "Joseph Temitope Deborah",
    designation: "Community Manager",
    bio: "A communication advocate and leadership enthusiast passionate about purpose discovery and building impactful leaders.",
    linkedin: "https://www.linkedin.com/in/temitope-deborah-joseph-b24580227",
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0015.jpg",
  },
  {
    name: "Promise Nseobong",
    designation: "Human Resource",
    bio: "An accounting student and creative voice running a YouTube channel on motivation and spoken-word poetry.",
    linkedin: "https://www.linkedin.com/in/nseobong-promise-02498a338",
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0006.jpg",
  },
  {
    name: "Grace Temitope Babatunde",
    designation: "Admin",
    bio: "A communication specialist combining mastery of language with a passion for people-management and HR.",
    linkedin: "https://www.linkedin.com/in/gracetemibabatunde",
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0014.jpg",
  },
];

const blogPosts = [
  { title: "Intentional Leadership", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800", date: "Feb 9, 2026" },
  { title: "Building Trust", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800", date: "Feb 2, 2026" },
  { title: "Vision to Action", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", date: "Jan 26, 2026" },
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <a href="#home" className="logo" onClick={e => { e.preventDefault(); scrollTo("home"); }}>
            <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="CLG Logo" style={{ width: 45, height: 45, borderRadius: "50%", background: 'white' }} />
            <span>Champions Leadership Global</span>
          </a>
          <ul className="nav-links">
            {["home","about","events","team","blog","contact"].map(id => (
              <li key={id}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{id.charAt(0).toUpperCase() + id.slice(1)}</a></li>
            ))}
          </ul>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-content">
          <div style={{ color: colors.gold, letterSpacing: '3px', fontWeight: 600, marginBottom: '1.5rem' }}>WELCOME TO A WORLD OF CHAMPIONS</div>
          <h1 className="hero-title">Raising <span style={{ color: colors.gold }}>Transformational Leaders</span></h1>
          <p style={{ color: 'white', opacity: 0.9, fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Empowering individuals to discover their purpose and lead with lasting impact through character and competence.</p>
          <blockquote style={{ color: colors.gold, borderLeft: `4px solid ${colors.gold}`, paddingLeft: '1.5rem', fontStyle: 'italic', marginBottom: '2.5rem' }}>
            "You can make decisions, not consequences" <br />
            <span style={{ fontSize: '0.9rem', color: 'white', fontStyle: 'normal' }}>— J.A. Oyedele</span>
          </blockquote>
          <button style={{ background: colors.gold, color: colors.navy, padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(244, 208, 63, 0.3)' }} onClick={() => scrollTo("about")}>Get Started Today</button>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: "8rem 2rem", background: colors.cream }}>
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="section-label">Our Story</div>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Who We Are</h2>
              <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Champions' Leadership Global is deeply committed to <strong>purpose, leadership, and personal development</strong>. We host conferences, workshops, and the Champions Leadership Academy to equip the next generation of influence.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: colors.navy, color: 'white', padding: '1.5rem', borderRadius: '15px' }}>
                  <h4 style={{ color: colors.gold, marginBottom: '0.5rem' }}>Vision</h4>
                  <p style={{ fontSize: '0.9rem' }}>To raise transformational leaders who lead with dignity and diligence globally.</p>
                </div>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', border: '1px solid #ddd' }}>
                  <h4 style={{ color: colors.navy, marginBottom: '0.5rem' }}>Mission</h4>
                  <p style={{ fontSize: '0.9rem' }}>Equipping leaders with skills to rise to positions of competence and influence.</p>
                </div>
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" alt="Leadership" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
      </section>

      {/* Three Pillars Framework */}
      <section style={{ padding: "8rem 2rem", background: "white" }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Our Foundation</div>
            <h2 className="section-title">The Champions' Framework</h2>
            <p style={{ color: 'rgba(0,0,0,0.6)', maxWidth: '700px', margin: '0 auto' }}>Three fundamental principles that guide everything we do.</p>
          </div>
          <div className="pillars-grid">
            {[
              { icon: "🎯", title: "Purpose", text: "The essence of living and a driving force behind every goal. It gives life meaning and prioritizes resources." },
              { icon: "👑", title: "Leadership", text: "The ability to influence others toward a common goal through vision, trust, and empowerment." },
              { icon: "🌱", title: "Personal Development", text: "The process of growing as an individual by building new skills and a growth mindset." }
            ].map((p, i) => (
              <div key={i} className="pillar-card">
                <div className="pillar-icon">{p.icon}</div>
                <h3 className="pillar-title">{p.title}</h3>
                <p className="pillar-text">{p.text}</p>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo("about"); }} style={{ color: colors.terracotta, fontWeight: 700, textDecoration: 'none' }}>Learn More →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ padding: "8rem 2rem", background: `linear-gradient(135deg, ${colors.navy} 0%, #1a2847 100%)` }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label" style={{ color: colors.gold }}>What Drives Us</div>
            <h2 className="section-title" style={{ color: "white" }}>Our Core Values</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
            {["Purpose", "Transformation", "Leadership", "Influence", "Global Impact"].map((v, i) => (
              <div key={i} className="value-card">
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{["🎯", "🌱", "👑", "⚡", "🌍"][i]}</div>
                <div style={{ color: 'white', fontWeight: 700, fontFamily: 'Playfair Display' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Message */}
      <section style={{ padding: "8rem 2rem", background: colors.cream }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Meet Our Founder</div>
            <h2 className="section-title">A Message from Our CEO</h2>
          </div>
          <div className="video-container">
            <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
                <h3 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: '1.5rem' }}>Champions Leadership Global</h3>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="https://youtube.com/@cleadglobal" target="_blank" rel="noreferrer" style={{ background: '#FF0000', color: 'white', textDecoration: 'none', padding: '1rem 2rem', borderRadius: '50px', fontWeight: 700 }}>YouTube Channel</a>
                    <a href="https://www.facebook.com/share/1Ks3M8DqJs/" target="_blank" rel="noreferrer" style={{ background: '#1877F2', color: 'white', textDecoration: 'none', padding: '1rem 2rem', borderRadius: '50px', fontWeight: 700 }}>Facebook Page</a>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" style={{ padding: "8rem 2rem", background: "white" }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Participation</div>
            <h2 className="section-title">Upcoming Events</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { date: "APR 15, 2026", title: "Leadership Bootcamp", loc: "OAU Auditorium" },
              { date: "MAY 22, 2026", title: "Purpose Webinar", loc: "Online (Zoom)" }
            ].map((e, i) => (
              <div key={i} style={{ padding: '2rem', background: colors.cream, borderRadius: '20px' }}>
                <div style={{ color: colors.terracotta, fontWeight: 700, marginBottom: '0.5rem' }}>{e.date}</div>
                <h3 style={{ fontFamily: 'Playfair Display', marginBottom: '1rem' }}>{e.title}</h3>
                <p style={{ opacity: 0.7 }}>{e.loc}</p>
                <a href="#contact" onClick={(evt) => { evt.preventDefault(); scrollTo("contact"); }} style={{ marginTop: '1rem', display: 'inline-block', color: colors.navy, fontWeight: 700 }}>Register Now →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" style={{ padding: "8rem 2rem", background: colors.cream }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Leadership</div>
            <h2 className="section-title">Meet Our Team</h2>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, i) => (
              <div key={i} className="team-card">
                <img src={member.photo} alt={member.name} className="team-avatar" />
                <h3 className="team-name">{member.name}</h3>
                <div style={{ fontSize: '0.8rem', color: colors.terracotta, fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>{member.designation}</div>
                <p className="team-bio">{member.bio}</p>
                {member.linkedin ? (
                  <a href={member.linkedin} target="_blank" rel="noreferrer" className="team-linkedin"><LinkedInIcon /> LinkedIn</a>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>LinkedIn Coming Soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" style={{ padding: "8rem 2rem", background: colors.navy }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label" style={{ color: colors.gold }}>Insights</div>
            <h2 className="section-title" style={{ color: "white" }}>Leadership Blog</h2>
          </div>
          <div className="blog-grid">
            {blogPosts.map((post, i) => (
              <div key={i} className="blog-card">
                <img src={post.img} alt={post.title} className="blog-img" />
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ color: colors.terracotta, fontSize: '0.8rem', fontWeight: 700 }}>{post.date}</div>
                  <h3 style={{ fontFamily: 'Playfair Display', margin: '0.5rem 0' }}>{post.title}</h3>
                  <a href="#blog" onClick={e => e.preventDefault()} style={{ color: colors.navy, fontWeight: 700, textDecoration: 'none' }}>Read More →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: "8rem 2rem", background: "white" }}>
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
            <div>
              <div className="section-label">Connect</div>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Get In Touch</h2>
              <p style={{ marginBottom: '2rem' }}>Ready to transform your leadership? Reach out to us today for inquiries or partnerships.</p>
              <div style={{ marginBottom: '1rem' }}><strong>Email:</strong> info@cleadglobal.com</div>
              <div><strong>Phone:</strong> +234 906 414 4546</div>
            </div>
            <form onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder="Full Name" className="contact-input" />
              <input type="email" placeholder="Email Address" className="contact-input" />
              <textarea placeholder="Message" className="contact-input" style={{ height: '120px', resize: 'none' }}></textarea>
              <button style={{ width: '100%', background: colors.navy, color: 'white', padding: '1rem', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "4rem 2rem", background: "#050a18", color: 'white', textAlign: 'center' }}>
        <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="CLG Logo" style={{ width: 50, borderRadius: '50%', background: 'white', marginBottom: '1.5rem' }} />
        <div style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', marginBottom: '1rem' }}>Champions Leadership Global</div>
        <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>© 2026 Champions Leadership Global. All rights reserved.</p>
      </footer>
    </div>
  );
}