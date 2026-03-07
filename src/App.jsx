import { useEffect, useState } from "react";

const colors = {
  gold: "#F4D03F",
  navy: "#0A1128",
  lavender: "#C8B8DB",
  lightBlue: "#A8DADC",
  terracotta: "#C86B56",
  cream: "#FFF8F0",
  darkText: "#0D0D0D", // Sharper dark text
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'DM Sans', sans-serif;
    color: #1A1A1A;
    line-height: 1.6;
    overflow-x: hidden;
    background: #FFF8F0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3 { color: #0A1128; letter-spacing: -0.01em; }
  p { color: #2D2D2D; } /* Sharper paragraph text */

  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to   { transform: translateY(0);     opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  .navbar {
    position: fixed; top: 0; width: 100%;
    background: rgba(255,255,255,0.98);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    animation: slideDown 0.6s ease-out;
  }
  .nav-container {
    max-width: 1400px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.4rem 2rem;
  }
  .logo {
    display: flex; align-items: center; gap: 1rem;
    font-weight: 700; font-size: 1.1rem; color: #0A1128;
    text-decoration: none; cursor: pointer;
  }
  .nav-links { display: flex; gap: 1.5rem; list-style: none; align-items: center; }
  .nav-links a {
    text-decoration: none; color: #111; font-weight: 600;
    transition: color 0.3s; position: relative; cursor: pointer;
    font-size: 0.9rem;
  }
  .nav-links a.active { color: #C86B56; }
  .nav-links a:hover { color: #C86B56; }

  .hero {
    position: relative; height: 90vh;
    display: flex; align-items: center; overflow: hidden;
    background: #0A1128;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(10, 17, 40, 0.75), rgba(10, 17, 40, 0.75)), 
                      url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000');
    background-size: cover; background-position: center;
    opacity: 0.6;
  }
  .hero-content {
    position: relative; max-width: 1400px; margin: 0 auto;
    padding: 0 2rem; z-index: 2;
    animation: fadeInUp 0.8s ease-out both;
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 900; color: white;
    line-height: 1.05; margin-bottom: 1.5rem;
  }

  .page-padding { padding: 7rem 2rem 4rem 2rem; min-height: 80vh; }
  .home-section { padding: 4rem 2rem; }
  .section-container { max-width: 1400px; margin: 0 auto; position: relative; }
  .section-header { text-align: center; margin-bottom: 3rem; }
  .section-label { font-size: 0.85rem; letter-spacing: 2.5px; text-transform: uppercase; color: #C86B56; font-weight: 700; margin-bottom: 0.8rem; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 2.8rem; font-weight: 900; color: #0A1128; }

  .team-grid, .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .team-card { background: white; border-radius: 20px; padding: 2.5rem 2rem; border: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; }
  .team-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5rem; border: 3px solid #FFF8F0; }
  
  .blog-card { border-radius: 20px; overflow: hidden; background: white; border: 1px solid rgba(0,0,0,0.05); }
  .blog-img { width: 100%; height: 220px; object-fit: cover; }

  .video-wrapper {
    max-width: 1000px; margin: 0 auto; border-radius: 24px; overflow: hidden;
    aspect-ratio: 16/9; background: #000;
    box-shadow: 0 25px 50px rgba(0,0,0,0.15);
  }

  .contact-input { width: 100%; padding: 1.2rem; background: #fff; border: 1.5px solid #eee; border-radius: 12px; margin-bottom: 1rem; font-family: inherit; font-size: 1rem; color: #111; }
  .contact-input:focus { border-color: #C86B56; outline: none; }
  
  .pillar-card {
    text-align: center; padding: 2rem; background: white; border-radius: 15px;
    border-bottom: 4px solid #F4D03F; transition: transform 0.3s;
  }
  .pillar-card:hover { transform: translateY(-5px); }

  @media (max-width: 992px) { 
    .team-grid, .blog-grid { grid-template-columns: 1fr 1fr; } 
  }
  @media (max-width: 768px) {
    .navbar { position: sticky; top: 0; }
    .nav-container { padding: 0.8rem 1rem; }
    .nav-links { gap: 0.8rem; }
    .team-grid, .blog-grid { grid-template-columns: 1fr !important; }
    .hero-title { font-size: 2.8rem; }
    .home-section { padding: 3rem 1rem; }
  }
`;

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z"/></svg>
);

const teamMembers = [
  { name: "James Oluwapelumi Olatunbosun", designation: "Program Director", bio: "James is a science communicator and Engineering Physics student at OAU. He is committed to seeing young people thrive in career and character.", linkedin: "https://www.linkedin.com/in/james-olatunbosun", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0000.jpg" },
  { name: "Ogbaudu Oghenefegor Believe", designation: "Corp Member", bio: "A faith-based writer and founder of GAP INITIATIVE — an NGO empowering youth to discover their gifts and purpose.", linkedin: null, photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0001.jpg" },
  { name: "Oluwatoyin Oluwabukola Yakubu", designation: "Head, Content", bio: "Oluwatoyin is passionate about helping people find healing from trauma and depression through honest conversations.", linkedin: "https://www.linkedin.com/in/oluwatoyin-yakubu-a2b1b6258", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0005.jpg" },
  { name: "Joseph Temitope Deborah", designation: "Community Manager", bio: "A communication advocate and leadership enthusiast passionate about purpose discovery and building impactful leaders.", linkedin: "https://www.linkedin.com/in/temitope-deborah-joseph-b24580227", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0015.jpg" },
  { name: "Promise Nseobong", designation: "Human Resource", bio: "An accounting student and creative voice running a YouTube channel on motivation and spoken-word poetry.", linkedin: "https://www.linkedin.com/in/nseobong-promise-02498a338", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0006.jpg" },
  { name: "Grace Temitope Babatunde", designation: "Admin", bio: "A communication specialist combining mastery of language with a passion for people-management and HR.", linkedin: "https://www.linkedin.com/in/gracetemibabatunde", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0014.jpg" },
];

const blogPosts = [
  { title: "Intentional Leadership", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800", date: "Feb 9, 2026", excerpt: "Leadership is more than just a position; it is a conscious decision to influence others towards a shared vision." },
];

export default function App() {
  const [view, setView] = useState("home");
  const formAction = "https://formspree.io/f/mqeykgyy";

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const navigate = (v) => {
    setView(v);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => navigate("home")}>
            <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="CLG Logo" style={{ width: 85, height: 85, borderRadius: "50%", background: 'white', padding: '5px' }} />
            <span>Champions' Leadership Global</span>
          </div>
          <ul className="nav-links">
            <li><a href="#!" className={view === "home" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("home"); }}>Home</a></li>
            <li><a href="#!" className={view === "ceo" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("ceo"); }}>Meet the CEO</a></li>
            <li><a href="#!" className={view === "events" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("events"); }}>Events</a></li>
            <li><a href="#!" className={view === "team" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("team"); }}>Team</a></li>
            <li><a href="#!" className={view === "blog" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("blog"); }}>Blog</a></li>
            <li><a href="#!" className={view === "booking" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("booking"); }} style={{ background: colors.terracotta, color: 'white', padding: '0.6rem 1.2rem', borderRadius: '50px' }}>Book a Session</a></li>
          </ul>
        </div>
      </nav>

      {view === "home" && (
        <>
          <section className="hero">
            <div className="hero-bg" />
            <div className="hero-content">
              <div style={{ color: colors.gold, letterSpacing: '3px', fontWeight: 700, marginBottom: '1.2rem' }}>WELCOME TO A WORLD OF CHAMPIONS</div>
              <h1 className="hero-title">
                Raising <br />
                <span style={{ color: colors.gold }}>Transformational</span> <br />
                Leaders
              </h1>
              <p style={{ color: 'white', opacity: 0.95, fontSize: '1.25rem', maxWidth: '600px', marginBottom: '2rem', fontWeight: 500 }}>Empowering individuals to discover their purpose and lead with lasting impact.</p>
              <button style={{ background: colors.gold, color: colors.navy, padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: 800, border: 'none', cursor: 'pointer' }} onClick={() => navigate("ceo")}>Explore Our Mission</button>
            </div>
          </section>

          <section id="about-us" className="home-section" style={{ background: 'white' }}>
            <div className="section-container">
              <div className="section-label">Our Story</div>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>About Us</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
                <div style={{ fontSize: '1.1rem' }}>
                  <p style={{ marginBottom: '1.2rem' }}>Champions' Leadership Global is a brand deeply committed to the themes of purpose, leadership, and personal development.</p>
                  <p style={{ fontWeight: 700, color: colors.navy, fontSize: '1.2rem' }}>Transforming people is the best way to transform the world, because the world is first a people, which eventually makes the place.</p>
                </div>
                <div style={{ background: colors.cream, padding: '2rem', borderRadius: '20px', border: '1px solid #F0EAD6' }}>
                  <p>Our mandates cuts across hosting conferences, seminars, workshops, and bootcamps for raising the leaders of this generation and the next.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className="home-section" style={{ background: 'white', borderTop: '1px solid #f0f0f0' }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-label">Foundations</div>
                <h2 className="section-title">Core Values</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {["Purpose", "Personal Transformation", "Leadership", "Influence", "Global Impact"].map((v, i) => (
                  <div key={i} className="pillar-card">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{v}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="home-section" style={{ background: colors.navy, color: 'white' }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-label" style={{ color: colors.gold }}>Personal Note</div>
                <h2 className="section-title" style={{ color: 'white' }}>Our CEO says Welcome</h2>
              </div>
              <div className="video-wrapper">
                 <iframe width="100%" height="100%" src="https://www.youtube.com/embed/S_8q0h4-QNo" frameBorder="0" allowFullScreen></iframe>
              </div>
            </div>
          </section>

          <section className="home-section" style={{ background: 'white' }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-label">Latest Insight</div>
                <h2 className="section-title">From the Blog</h2>
              </div>
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="blog-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                  <img src={blogPosts[0].img} alt="post" style={{ width: '100%', height: '100%', minHeight: '300px', objectFit: 'cover' }} />
                  <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ color: colors.terracotta, fontWeight: 800, fontSize: '0.9rem' }}>{blogPosts[0].date}</div>
                    <h3 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', margin: '0.8rem 0' }}>{blogPosts[0].title}</h3>
                    <p style={{ marginBottom: '1.5rem' }}>{blogPosts[0].excerpt}</p>
                    <button onClick={() => navigate("blog")} style={{ background: colors.navy, color: 'white', padding: '0.8rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' }}>Read Full Article</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="home-section" style={{ background: colors.cream }}>
            <div className="section-container" style={{ maxWidth: '800px' }}>
              <div className="section-header">
                <div className="section-label">Connect</div>
                <h2 className="section-title">Contact Us</h2>
              </div>
              <form action={formAction} method="POST" style={{ background: 'white', padding: '2.5rem', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input type="text" name="Name" placeholder="Full Name" className="contact-input" required />
                  <input type="email" name="Email" placeholder="Email Address" className="contact-input" required />
                </div>
                <textarea name="Message" placeholder="Message" className="contact-input" style={{ height: '120px', resize: 'none' }} required></textarea>
                <button type="submit" style={{ width: '100%', background: colors.navy, color: 'white', padding: '1.2rem', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Send Message</button>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>championscorner27@gmail.com | +234 906 414 4546</p>
              </form>
            </div>
          </section>
        </>
      )}

      {view === "ceo" && (
        <>
          <div style={{ height: '400px', background: `linear-gradient(rgba(10,17,40,0.85), rgba(10,17,40,0.85)), url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2000')`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <h1 style={{ fontFamily: 'Playfair Display', color: 'white', fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>Visioneer and Founder</h1>
          </div>
          <section className="page-padding" style={{ marginTop: '-60px' }}>
            <div className="section-container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
                <div>
                  <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260306-WA0029.jpg" alt="CEO" style={{ width: '100%', borderRadius: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                  <div style={{ marginTop: '1.5rem', padding: '2rem', background: colors.navy, color: 'white', borderRadius: '20px' }}>
                    <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', color: 'white' }}>Jerry Oyedele</h3>
                    <p style={{ color: colors.gold, fontWeight: 700 }}>CEO, Champions' Leadership Global</p>
                  </div>
                </div>
                <div style={{ fontSize: '1.1rem' }}>
                  <p style={{ marginBottom: '1.2rem' }}>Jerry Oyedele is a sought-after public speaker with over a decade of experience, a musicologist with over 300 music compositions, and a mentor to many. He is the founder of <strong>Champions' Leadership Global</strong>, a leadership brand that focuses on purpose discovery, development, and delivery. He is currently a post-graduate student of the department of music, Obafemi Awolowo University, Ile-Ife, Osun state.</p>
                  <p style={{ marginBottom: '1.2rem' }}>His journey into purpose started when he had to take a bold step by leaving engineering at 500level to study music from 100level. This story was the start of the fresh journey which opened him up to an understanding of purpose, self awareness, and leadership.</p>
                  <p style={{ marginBottom: '1.2rem' }}>As a musicologist, Jerry has over two decades of experience in the field of music, and is a seasoned music composer with over 300 works in the last seven years. He has gone ahead to obtain certificate courses from various institutions which includes University of Edinburgh, National University of Singapore, University of Michigan, Yale University, amongst others.</p>
                  <p style={{ marginBottom: '2rem' }}>Jerry Oyedele is also a committed worker in the vineyard of God as a choir leader in his denomination. He is also a gifted teacher of the word.</p>

                  <div style={{ padding: '2.5rem', background: 'white', borderRadius: '25px', border: '1px solid #eee' }}>
                    <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', marginBottom: '1.5rem' }}>Book an Invitation</h3>
                    <form action={formAction} method="POST">
                      <input type="hidden" name="_subject" value="CEO Invitation" />
                      <input type="text" name="Conference" placeholder="Name of Conference" className="contact-input" required />
                      <select name="Type" className="contact-input" required><option>Physical</option><option>Virtual</option></select>
                      <input type="text" name="Location" placeholder="Location (If Physical)" className="contact-input" />
                      <input type="text" name="Theme" placeholder="Theme" className="contact-input" required />
                      <input type="text" name="Audience" placeholder="Target Audience" className="contact-input" required />
                      <input type="email" name="Contact" placeholder="Your Email" className="contact-input" required />
                      <button type="submit" style={{ width: '100%', background: colors.navy, color: 'white', padding: '1.2rem', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Submit Invitation</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {view === "booking" && (
        <section className="page-padding" style={{ background: `linear-gradient(rgba(255,248,240,0.92), rgba(255,248,240,0.92)), url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000')`, backgroundSize: 'cover' }}>
          <div className="section-container" style={{ maxWidth: '600px' }}>
            <div className="section-header">
              <div className="section-label">Coaching</div>
              <h2 className="section-title">Book a Session</h2>
            </div>
            <form action={formAction} method="POST" style={{ background: 'white', padding: '3rem', borderRadius: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <input type="hidden" name="_subject" value="Coaching Session Request" />
              <select name="SessionType" className="contact-input" required>
                <option>Purpose discovery</option>
                <option>Identity crisis</option>
                <option>Personal development and transformation</option>
                <option>Personal Leadership coaching</option>
                <option>Organizational Leadership coaching</option>
                <option>Others</option>
              </select>
              <input type="text" name="FullName" placeholder="Your Name" className="contact-input" required />
              <input type="email" name="Email" placeholder="Email Address" className="contact-input" required />
              <input type="date" name="Date" className="contact-input" required />
              <button type="submit" style={{ width: '100%', background: colors.terracotta, color: 'white', padding: '1.2rem', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Schedule Session</button>
              <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>championscorner27@gmail.com</p>
            </form>
          </div>
        </section>
      )}

      {/* Footer (Simplified) */}
      <footer style={{ padding: "3rem 2rem", background: "#050a18", color: 'white', textAlign: 'center' }}>
        <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="Logo" style={{ width: 60, borderRadius: '50%', background: 'white', marginBottom: '1rem' }} />
        <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>Champions' Leadership Global</p>
        <p style={{ opacity: 0.6, fontSize: '0.85rem', marginTop: '0.5rem' }}>© 2026 All rights reserved.</p>
      </footer>
    </div>
  );
}