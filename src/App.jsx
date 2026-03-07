import { useState, useEffect } from "react";

const colors = {
  gold: "#F4D03F",
  navy: "#0A1128",
  terracotta: "#C86B56",
  cream: "#FFF8F0",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; color: #1A1A1A; line-height: 1.6; overflow-x: hidden; }

  @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

  .navbar { position: fixed; top: 0; width: 100%; background: rgba(255,255,255,0.98); backdrop-filter: blur(10px); z-index: 1000; border-bottom: 1px solid rgba(0,0,0,0.05); }
  .nav-container { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; }
  
  .logo { display: flex; align-items: center; gap: 1rem; text-decoration: none; color: #0A1128; font-weight: 700; }
  .logo img { width: 80px; height: 80px; border-radius: 50%; object-fit: contain; background: white; border: 2px solid #F4D03F; }

  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a { text-decoration: none; color: #1A1A1A; font-weight: 600; font-size: 0.95rem; transition: color 0.3s; cursor: pointer; }
  .nav-links a:hover { color: #C86B56; }

  .hero { position: relative; height: 100vh; display: flex; align-items: center; background: #0A1128; }
  .hero-bg { 
    position: absolute; inset: 0; 
    background-image: linear-gradient(to right, rgba(10, 17, 40, 0.9), rgba(10, 17, 40, 0.4)), 
                      url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000');
    background-size: cover; background-position: center; z-index: 1;
  }
  .hero-content { position: relative; max-width: 1400px; margin: 0 auto; padding: 0 2rem; z-index: 2; animation: fadeInUp 1s ease-out; }
  
  .hero-title { font-family: 'Playfair Display', serif; font-size: 5.5rem; font-weight: 900; color: white; line-height: 1.05; margin-bottom: 2rem; }
  .hero-title span { display: block; }
  .hero-title .highlight { color: #F4D03F; }

  .section-container { max-width: 1200px; margin: 0 auto; padding: 8rem 2rem; }
  .section-header { text-align: center; margin-bottom: 4rem; }
  .section-label { font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; color: #C86B56; font-weight: 700; margin-bottom: 1rem; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 900; color: #0A1128; }

  .form-card { background: white; padding: 3rem; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 1px solid #eee; }
  .input-group { margin-bottom: 1.5rem; }
  .input-label { display: block; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem; color: #0A1128; }
  .form-input, .form-select, .form-textarea { 
    width: 100%; padding: 1rem; border: 1px solid #ddd; border-radius: 12px; font-family: inherit; font-size: 1rem; 
  }
  .form-input:focus { outline: none; border-color: #F4D03F; }
  .submit-btn { 
    width: 100%; padding: 1.2rem; background: #0A1128; color: white; border: none; 
    border-radius: 12px; font-weight: 700; cursor: pointer; transition: transform 0.3s;
  }
  .submit-btn:hover { transform: translateY(-3px); background: #1a2847; }

  .ceo-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 4rem; align-items: flex-start; }
  .ceo-image { width: 100%; border-radius: 30px; box-shadow: 0 30px 60px rgba(0,0,0,0.15); }
  .ceo-bio { font-size: 1.1rem; line-height: 1.8; color: #444; }
  .ceo-bio p { margin-bottom: 1.5rem; }

  .footer { padding: 4rem 2rem; background: #050a18; color: white; text-align: center; }

  @media (max-width: 992px) { 
    .hero-title { font-size: 4rem; }
    .ceo-grid { grid-template-columns: 1fr; }
  }
`;

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App() {
  const [view, setView] = useState("home"); // home, ceo, session

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const renderHome = () => (
    <>
      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-content">
          <div style={{ color: colors.gold, letterSpacing: '4px', fontWeight: 700, marginBottom: '1.5rem' }}>LEADERSHIP • PURPOSE • IMPACT</div>
          <h1 className="hero-title">
            <span>Raising</span>
            <span className="highlight">Transformational</span>
            <span>Leaders</span>
          </h1>
          <p style={{ color: 'white', opacity: 0.9, fontSize: '1.4rem', maxWidth: '600px', marginBottom: '3rem' }}>
            Champions' Leadership Global: Empowering individuals to discover, develop, and deliver their unique purpose.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="submit-btn" style={{ background: colors.gold, color: colors.navy, width: 'auto', padding: '1rem 2.5rem' }} onClick={() => setView("ceo")}>Meet our CEO</button>
            <button className="submit-btn" style={{ background: 'white', color: colors.navy, width: 'auto', padding: '1rem 2.5rem' }} onClick={() => setView("session")}>Book a Session</button>
          </div>
        </div>
      </section>

      {/* Featured Blog Section */}
      <section style={{ padding: '8rem 2rem', background: colors.cream }}>
        <div className="section-container" style={{ padding: 0 }}>
          <div className="section-header">
            <div className="section-label">Latest Insight</div>
            <h2 className="section-title">From the Leadership Blog</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" alt="Blog" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '2rem' }}>
                <div style={{ color: colors.terracotta, fontWeight: 700, fontSize: '0.8rem', marginBottom: '1rem' }}>FEATURED POST</div>
                <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', marginBottom: '1rem' }}>The Power of Intentional Leadership</h3>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>Discover how leading with intention transforms not just outcomes, but the very fabric of organizational culture and personal growth...</p>
                <a href="#blog" onClick={e => e.preventDefault()} style={{ color: '#0A1128', fontWeight: 800, textDecoration: 'none' }}>Read Full Article →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Form */}
      <section id="contact" style={{ background: 'white' }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Get In Touch</div>
            <h2 className="section-title">Contact Information</h2>
            <p style={{ marginTop: '1rem' }}>Have questions? We'd love to hear from you.</p>
          </div>
          <div className="form-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <form action="https://formspree.io/f/mqeykgyy" method="POST">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input type="text" name="name" className="form-input" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input type="email" name="email" className="form-input" required />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Message</label>
                <textarea name="message" className="form-textarea" rows="5" required></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );

  const renderCEO = () => (
    <section style={{ background: 'white', paddingTop: '100px' }}>
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">The Visionary</div>
          <h2 className="section-title">Meet Our CEO</h2>
        </div>
        <div className="ceo-grid">
          <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260306-WA0029.jpg" alt="Jerry Oyedele" className="ceo-image" />
          <div className="ceo-bio">
            <h3 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', marginBottom: '1.5rem', color: colors.navy }}>Jerry Oyedele</h3>
            <p>Jerry Oyedele is a sought-after public speaker with over a decade of experience, a musicologist with over 300 music compositions, and a mentor to many. He is the founder of Champions' Leadership Global, a leadership brand that focuses on purpose discovery, development, and delivery. He is currently a post-graduate student of the department of music, Obafemi Awolowo University, Ile-Ife, Osun state.</p>
            <p>His journey into purpose started when he had to take a bold step by leaving engineering at 500level to study music from 100level. This story was the start of the fresh journey which opened him up to an understanding of purpose, self awareness, and leadership.</p>
            <p>As a musicologist, Jerry has over two decades of experience in the field of music, and is a seasoned music composer with over 300 works in the last seven years. In a bid to further ground himself in his music profession, Jerry has gone ahead to obtain certificate courses from various institutions which includes University of Edinburgh, National University of Singapore, University of Michigan, Yale University, amongst others. He is also the founder of Jebion Music, a music brand that seeks to reveal the light of the glorious gospel through the music of the kingdom.</p>
            <p>Jerry Oyedele is also a committed worker in the vineyard of God as a choir leader in his denomination. He is also a gifted teacher of the word.</p>
          </div>
        </div>

        {/* Invitation Form */}
        <div style={{ marginTop: '8rem' }}>
          <div className="section-header">
            <div className="section-label">Collaboration</div>
            <h2 className="section-title">Book an Invitation</h2>
            <p style={{ marginTop: '1rem' }}>Book CEO for a conference or speaking engagement.</p>
          </div>
          <div className="form-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <form action="https://formspree.io/f/mqeykgyy" method="POST">
              <input type="hidden" name="_subject" value="New CEO Conference Invitation" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="input-label">Your Name / Organization</label>
                  <input type="text" name="name" className="form-input" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input type="email" name="email" className="form-input" required />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Name of Conference</label>
                <input type="text" name="conference_name" className="form-input" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="input-label">Event Type</label>
                  <select name="event_type" className="form-select">
                    <option>Physical</option>
                    <option>Virtual</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Location (If Physical)</label>
                  <input type="text" name="location" className="form-input" placeholder="City, Country" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Theme of Event</label>
                <input type="text" name="theme" className="form-input" required />
              </div>
              <div className="input-group">
                <label className="input-label">Target Audience</label>
                <input type="text" name="audience" className="form-input" placeholder="e.g. Undergraduates, Executives" required />
              </div>
              <button type="submit" className="submit-btn">Send Invitation</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );

  const renderSession = () => (
    <section style={{ background: colors.cream, paddingTop: '100px', minHeight: '100vh' }}>
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">Growth</div>
          <h2 className="section-title">Book a Session</h2>
          <p style={{ marginTop: '1rem' }}>Take the next step in your personal or organizational leadership journey.</p>
        </div>
        <div className="form-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form action="https://formspree.io/f/mqeykgyy" method="POST">
            <input type="hidden" name="_subject" value="New Coaching Session Request" />
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" name="name" className="form-input" required />
            </div>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input type="email" name="email" className="form-input" required />
            </div>
            <div className="input-group">
              <label className="input-label">Session Category</label>
              <select name="session_category" className="form-select" required>
                <option value="">Select a category...</option>
                <option>Purpose discovery</option>
                <option>Identity crisis</option>
                <option>Personal development and transformation</option>
                <option>Personal Leadership coaching</option>
                <option>Organizational Leadership coaching</option>
                <option>Others</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Additional Information for Feedback</label>
              <textarea name="notes" className="form-textarea" rows="4" placeholder="How can we help you specifically?"></textarea>
            </div>
            <button type="submit" className="submit-btn">Book My Session</button>
          </form>
        </div>
      </div>
    </section>
  );

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <a href="#home" className="logo" onClick={(e) => { e.preventDefault(); setView("home"); window.scrollTo(0,0); }}>
            <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="Champions' Leadership Global" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.2rem' }}>Champions'</span>
              <span style={{ fontSize: '0.9rem', color: colors.terracotta }}>Leadership Global</span>
            </div>
          </a>
          <ul className="nav-links">
            <li><a onClick={() => setView("home")}>Home</a></li>
            <li><a onClick={() => setView("ceo")}>Meet Our CEO</a></li>
            <li><a onClick={() => setView("session")}>Book a Session</a></li>
            <li><a onClick={() => { setView("home"); setTimeout(() => scrollTo("contact"), 100); }}>Contact</a></li>
          </ul>
        </div>
      </nav>

      {view === "home" && renderHome()}
      {view === "ceo" && renderCEO()}
      {view === "session" && renderSession()}

      <footer className="footer">
        <div className="section-container" style={{ padding: '0 2rem' }}>
          <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="Logo" style={{ width: '60px', borderRadius: '50%', background: 'white', marginBottom: '1.5rem' }} />
          <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', marginBottom: '1rem' }}>Champions' Leadership Global</h3>
          <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>© 2026 Champions' Leadership Global. Raising Transformational Leaders.</p>
        </div>
      </footer>
    </div>
  );
}