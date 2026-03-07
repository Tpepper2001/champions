import { useEffect, useState } from "react";

const colors = {
  gold: "#F4D03F",
  navy: "#0A1128",
  terracotta: "#C86B56",
  cream: "#FFF8F0",
  white: "#FFFFFF",
  gray: "#4A4A4A"
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'DM Sans', sans-serif;
    color: #1A1A1A;
    line-height: 1.6;
    background: #FFF8F0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3 { font-family: 'Playfair Display', serif; font-weight: 900; color: ${colors.navy}; }

  /* Sharper text adjustment */
  p { font-size: 1.05rem; color: #2D2D2D; font-weight: 400; }

  .navbar {
    position: fixed; top: 0; width: 100%;
    background: rgba(255,255,255,0.98);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  .nav-container {
    max-width: 1400px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.5rem 2rem;
  }
  .logo { display: flex; align-items: center; gap: 1rem; cursor: pointer; }
  .nav-links { display: flex; gap: 1.5rem; list-style: none; align-items: center; }
  .nav-links a {
    text-decoration: none; color: #1A1A1A; font-weight: 700;
    font-size: 0.9rem; transition: color 0.3s;
  }
  .nav-links a.active { color: ${colors.terracotta}; }

  .hero {
    position: relative; height: 90vh;
    display: flex; align-items: center; overflow: hidden;
    background: ${colors.navy};
  }
  .hero-bg {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(10, 17, 40, 0.75), rgba(10, 17, 40, 0.75)), 
                      url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000');
    background-size: cover; background-position: center;
  }
  .hero-title { font-size: clamp(3rem, 8vw, 5.5rem); color: white; line-height: 1.05; margin-bottom: 1.5rem; }

  .section { padding: 6rem 2rem; }
  .container { max-width: 1200px; margin: 0 auto; }
  .section-label { font-size: 0.85rem; letter-spacing: 3px; text-transform: uppercase; color: ${colors.terracotta}; font-weight: 700; margin-bottom: 1rem; text-align: center; }
  .section-title { font-size: 3rem; margin-bottom: 3rem; text-align: center; }

  .pillar-card {
    background: white; padding: 2.5rem; border-radius: 20px;
    text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.02);
  }

  .video-wrapper {
    max-width: 1000px; margin: 0 auto; border-radius: 24px; overflow: hidden;
    aspect-ratio: 16/9; background: #000; box-shadow: 0 30px 60px rgba(0,0,0,0.15);
  }

  .contact-input { width: 100%; padding: 1.2rem; background: #fff; border: 1px solid #ddd; border-radius: 12px; margin-bottom: 1.2rem; font-family: inherit; font-size: 1rem; }
  .form-feedback-text { font-size: 0.85rem; opacity: 0.8; text-align: center; margin-top: 1rem; display: block; font-weight: 500; }

  @media (max-width: 768px) {
    .nav-container { flex-direction: column; padding: 1rem; }
    .nav-links { margin-top: 1rem; gap: 0.8rem; font-size: 0.8rem; }
    .hero-title { font-size: 2.8rem; }
    .section { padding: 4rem 1rem; }
  }
`;

const coreValues = ["Purpose", "Personal Transformation", "Leadership", "Influence", "Global Impact"];

export default function App() {
  const [view, setView] = useState("home");
  const formAction = "https://formspree.io/f/mqeykgyy";
  const contactInfo = "Contact info: championscorner27@gmail.com | +234 906 414 4546";

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const navigate = (v) => { setView(v); window.scrollTo(0, 0); };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => navigate("home")}>
            <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="CLG Logo" style={{ width: 75, height: 75, borderRadius: "50%" }} />
            <span style={{ fontWeight: 700 }}>Champions' Leadership Global</span>
          </div>
          <ul className="nav-links">
            <li><a href="#!" className={view === "home" ? "active" : ""} onClick={() => navigate("home")}>Home</a></li>
            <li><a href="#!" className={view === "ceo" ? "active" : ""} onClick={() => navigate("ceo")}>Meet the CEO</a></li>
            <li><a href="#!" className={view === "booking" ? "active" : ""} onClick={() => navigate("booking")} style={{ background: colors.terracotta, color: 'white', padding: '0.6rem 1.2rem', borderRadius: '50px' }}>Book a Session</a></li>
          </ul>
        </div>
      </nav>

      {view === "home" && (
        <>
          <section className="hero">
            <div className="hero-bg" />
            <div className="container" style={{ position: 'relative', z-index: 2, padding: '0 2rem' }}>
              <h1 className="hero-title">Raising <br /><span style={{ color: colors.gold }}>Transformational</span> <br />Leaders</h1>
              <p style={{ color: 'white', opacity: 0.9, maxWidth: '600px', marginBottom: '2rem' }}>Empowering individuals to discover their purpose and lead with lasting impact.</p>
              <button style={{ background: colors.gold, color: colors.navy, padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: 700, border: 'none', cursor: 'pointer' }} onClick={() => navigate("booking")}>Get Started</button>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="section-label">Core Pillars</div>
              <h2 className="section-title">What We Stand For</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {coreValues.map(v => (
                  <div key={v} className="pillar-card">
                    <h3 style={{ fontSize: '1.2rem', color: colors.navy }}>{v}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="section" style={{ background: colors.navy, color: 'white' }}>
            <div className="container">
              <div className="section-label" style={{ color: colors.gold }}>Personal Message</div>
              <h2 className="section-title" style={{ color: 'white' }}>Our CEO says Welcome</h2>
              <div className="video-wrapper">
                 <iframe width="100%" height="100%" src="https://www.youtube.com/embed/S_8q0h4-QNo" title="CEO Welcome Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="section-label">Contact</div>
              <h2 className="section-title">Get In Touch</h2>
              <div style={{ maxWidth: '700px', margin: '0 auto', background: colors.white, padding: '3rem', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                <form action={formAction} method="POST">
                  <input type="text" name="Name" placeholder="Full Name" className="contact-input" required />
                  <input type="email" name="Email" placeholder="Email Address" className="contact-input" required />
                  <textarea name="Message" placeholder="How can we help you?" className="contact-input" style={{ height: '120px' }} required></textarea>
                  <button type="submit" style={{ width: '100%', background: colors.navy, color: 'white', padding: '1.2rem', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Send Message</button>
                  <span className="form-feedback-text">{contactInfo}</span>
                </form>
              </div>
            </div>
          </section>
        </>
      )}

      {view === "ceo" && (
        <section className="page-padding" style={{ padding: '10rem 2rem 5rem 2rem' }}>
          <div className="container">
            <div className="section-label">The Visionary</div>
            <h2 className="section-title">Visioneer and Founder</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
              <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260306-WA0029.jpg" alt="CEO" style={{ width: '100%', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
              <div>
                <p style={{ marginBottom: '1.5rem' }}>Jerry Oyedele is a sought-after public speaker with over a decade of experience, a musicologist with over 300 music compositions, and a mentor to many. He is the founder of <strong>Champions' Leadership Global</strong>, a leadership brand that focuses on purpose discovery, development, and delivery. He is currently a post-graduate student of the department of music, Obafemi Awolowo University, Ile-Ife, Osun state.</p>
                <p style={{ marginBottom: '1.5rem' }}>His journey into purpose started when he had to take a bold step by leaving engineering at 500level to study music from 100level. This story was the start of the fresh journey which opened him up to an understanding of purpose, self awareness, and leadership.</p>
                <p style={{ marginBottom: '1.5rem' }}>As a musicologist, Jerry has over two decades of experience in the field of music, and is a seasoned music composer with over 300 works in the last seven years. In a bid to further ground himself in his music profession, Jerry has gone ahead to obtain certificate courses from various institutions. He is also the founder of <strong>Jebion Music</strong>.</p>
                <p style={{ marginBottom: '1.5rem' }}>Jerry Oyedele is also a committed worker in the vineyard of God as a choir leader in his denomination. He is also a gifted teacher of the word.</p>

                <div style={{ marginTop: '3rem', padding: '2.5rem', background: 'white', borderRadius: '25px', border: '1px solid #eee' }}>
                  <h3>Book an Invitation</h3>
                  <form action={formAction} method="POST" style={{ marginTop: '1.5rem' }}>
                    <input type="text" name="Event" placeholder="Name of Conference" className="contact-input" required />
                    <select name="Type" className="contact-input"><option>Physical</option><option>Virtual</option></select>
                    <input type="text" name="Theme" placeholder="Event Theme" className="contact-input" required />
                    <input type="email" name="Contact" placeholder="Your Email" className="contact-input" required />
                    <button type="submit" style={{ width: '100%', background: colors.navy, color: 'white', padding: '1.1rem', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Submit Invitation</button>
                    <span className="form-feedback-text">{contactInfo}</span>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {view === "booking" && (
        <section className="page-padding" style={{ padding: '10rem 2rem 5rem 2rem', background: `linear-gradient(rgba(255,248,240,0.9), rgba(255,248,240,0.9)), url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000')`, backgroundSize: 'cover' }}>
          <div className="container">
            <h2 className="section-title">Book a Session</h2>
            <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <form action={formAction} method="POST">
                <select name="SessionType" className="contact-input" required>
                  <option>Purpose discovery</option>
                  <option>Identity crisis</option>
                  <option>Personal development and transformation</option>
                  <option>Personal Leadership coaching</option>
                  <option>Organizational Leadership coaching</option>
                  <option>Others</option>
                </select>
                <input type="text" name="Name" placeholder="Full Name" className="contact-input" required />
                <input type="email" name="Email" placeholder="Email Address" className="contact-input" required />
                <input type="date" name="Date" className="contact-input" required />
                <button type="submit" style={{ width: '100%', background: colors.terracotta, color: 'white', padding: '1.2rem', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Schedule Session</button>
                <span className="form-feedback-text">{contactInfo}</span>
              </form>
            </div>
          </div>
        </section>
      )}

      <footer style={{ padding: "4rem 2rem", background: colors.navy, color: 'white', textAlign: 'center' }}>
        <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="CLG Logo" style={{ width: 60, height: 60, borderRadius: '50%', background: 'white', marginBottom: '1.5rem' }} />
        <p style={{ opacity: 0.7 }}>© 2026 Champions' Leadership Global. All rights reserved.</p>
      </footer>
    </div>
  );
}