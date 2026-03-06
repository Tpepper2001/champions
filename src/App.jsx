import { useEffect, useState } from "react";

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
    background: #FFF8F0;
  }

  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to   { transform: translateY(0);     opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  .navbar {
    position: fixed; top: 0; width: 100%;
    background: rgba(255,255,255,0.98);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    animation: slideDown 0.6s ease-out;
  }
  .nav-container {
    max-width: 1400px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.5rem 2rem;
  }
  .logo {
    display: flex; align-items: center; gap: 1rem;
    font-weight: 700; font-size: 1.1rem; color: #0A1128;
    text-decoration: none; cursor: pointer;
  }
  .nav-links { display: flex; gap: 1.5rem; list-style: none; align-items: center; }
  .nav-links a {
    text-decoration: none; color: #1A1A1A; font-weight: 500;
    transition: color 0.3s; position: relative; cursor: pointer;
    font-size: 0.9rem;
  }
  .nav-links a.active { color: #C86B56; font-weight: 700; }
  .nav-links a:hover { color: #C86B56; }

  .hero {
    position: relative; height: 95vh;
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

  .ceo-hero {
    height: 50vh;
    background: linear-gradient(rgba(10, 17, 40, 0.85), rgba(10, 17, 40, 0.85)), 
                url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000');
    background-size: cover; background-position: center;
    display: flex; align-items: center; justify-content: center; text-align: center; color: white;
  }

  .page-padding { padding: 10rem 2rem 5rem 2rem; min-height: 80vh; }
  .home-section { padding: 6rem 2rem; }
  .section-container { max-width: 1400px; margin: 0 auto; position: relative; }
  .section-label { font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; color: #C86B56; font-weight: 600; margin-bottom: 1rem; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 900; color: #0A1128; margin-bottom: 1rem; }

  .team-grid, .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .team-card { background: white; border-radius: 20px; padding: 2.5rem 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); display: flex; flex-direction: column; }
  .team-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5rem; }
  
  .blog-card { border-radius: 20px; overflow: hidden; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
  .blog-img { width: 100%; height: 220px; object-fit: cover; }

  .contact-input { width: 100%; padding: 1.2rem; background: #fff; border: 1px solid #ddd; border-radius: 12px; margin-bottom: 1rem; font-family: inherit; font-size: 1rem; }
  label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600; color: #555; }

  @media (max-width: 992px) { .team-grid, .blog-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 768px) {
    .navbar { position: relative; }
    .nav-container { flex-direction: column; gap: 1rem; padding: 1rem; }
    .team-grid, .blog-grid { grid-template-columns: 1fr !important; }
    .section-title { font-size: 2.2rem; }
  }
`;

const teamMembers = [
  { name: "James Oluwapelumi Olatunbosun", designation: "Program Director", bio: "James is a science communicator and Engineering Physics student at OAU. He is committed to seeing young people thrive in career and character.", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0000.jpg" },
  { name: "Ogbaudu Oghenefegor Believe", designation: "Corp Member", bio: "A faith-based writer and founder of GAP INITIATIVE — an NGO empowering youth to discover their gifts and purpose.", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0001.jpg" },
  { name: "Oluwatoyin Oluwabukola Yakubu", designation: "Head, Content", bio: "Oluwatoyin is passionate about helping people find healing from trauma and depression through honest conversations.", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0005.jpg" },
  { name: "Joseph Temitope Deborah", designation: "Community Manager", bio: "A communication advocate and leadership enthusiast passionate about purpose discovery and building impactful leaders.", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0015.jpg" },
  { name: "Promise Nseobong", designation: "Human Resource", bio: "An accounting student and creative voice running a YouTube channel on motivation and spoken-word poetry.", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0006.jpg" },
  { name: "Grace Temitope Babatunde", designation: "Admin", bio: "A communication specialist combining mastery of language with a passion for people-management and HR.", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0014.jpg" },
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
            <span style={{ fontSize: '1.2rem' }}>Champions' Leadership Global</span>
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
              <div style={{ color: colors.gold, letterSpacing: '3px', fontWeight: 600, marginBottom: '1.5rem' }}>WELCOME TO A WORLD OF CHAMPIONS</div>
              <h1 style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(3rem, 8vw, 5.5rem)', color: 'white', lineHeight: 1.05, marginBottom: '1.5rem' }}>
                Raising <br />
                <span style={{ color: colors.gold }}>Transformational</span> <br />
                Leaders
              </h1>
              <p style={{ color: 'white', opacity: 0.9, fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2rem' }}>Empowering individuals to discover their purpose and lead with lasting impact.</p>
              <button style={{ background: colors.gold, color: colors.navy, padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: 700, border: 'none', cursor: 'pointer' }} onClick={() => navigate("ceo")}>Meet our Founder</button>
            </div>
          </section>

          <section className="home-section" style={{ background: 'white' }}>
            <div className="section-container">
              <div className="section-label">Contact</div>
              <h2 className="section-title">Get In Touch</h2>
              <div style={{ maxWidth: '800px', margin: '0 auto', background: colors.cream, padding: '3rem', borderRadius: '30px' }}>
                <form action={formAction} method="POST">
                  <input type="hidden" name="_subject" value="New Contact Inquiry" />
                  <label>Full Name</label>
                  <input type="text" name="FullName" className="contact-input" required />
                  <label>Email Address (For feedback)</label>
                  <input type="email" name="Email" className="contact-input" required />
                  <label>Message</label>
                  <textarea name="Message" className="contact-input" style={{ height: '150px' }} required></textarea>
                  <button type="submit" style={{ width: '100%', background: colors.navy, color: 'white', padding: '1.2rem', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Send Message</button>
                </form>
              </div>
            </div>
          </section>
        </>
      )}

      {view === "ceo" && (
        <>
          <section className="ceo-hero">
            <div className="section-container">
              <div style={{ color: colors.gold, fontWeight: 700, letterSpacing: '2px' }}>THE VISIONARY</div>
              <h1 style={{ fontFamily: 'Playfair Display', fontSize: '4rem' }}>Jerry Oyedele</h1>
            </div>
          </section>

          <section className="home-section" style={{ background: 'white' }}>
            <div className="section-container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
                <div>
                  <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260306-WA0029.jpg" alt="CEO" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                </div>
                <div style={{ fontSize: '1.1rem', color: '#333' }}>
                  <p style={{ marginBottom: '1.5rem' }}><strong>Jerry Oyedele</strong> is a sought-after public speaker with over a decade of experience, a musicologist with over 300 music compositions, and a mentor to many. He is the founder of Champions' Leadership Global, a leadership brand that focuses on purpose discovery, development, and delivery. He is currently a post-graduate student of the department of music, Obafemi Awolowo University, Ile-Ife, Osun state.</p>
                  
                  <p style={{ marginBottom: '1.5rem' }}>His journey into purpose started when he had to take a bold step by leaving engineering at 500level to study music from 100level. This story was the start of the fresh journey which opened him up to an understanding of purpose, self awareness, and leadership.</p>
                  
                  <p style={{ marginBottom: '1.5rem' }}>As a musicologist, Jerry has over two decades of experience in the field of music, and is a seasoned music composer with over 300 works in the last seven years. In a bid to further ground himself in his music profession, Jerry has gone ahead to obtain certificate courses from various institutions which includes University of Edinburgh, National University of Singapore, University of Michigan, Yale University, amongst others. He is also the founder of <strong>Jebion Music</strong>, a music brand that seeks to reveal the light of the glorious gospel through the music of the kingdom.</p>
                  
                  <p>Jerry Oyedele is also a committed worker in the vineyard of God as a choir leader in his denomination. He is also a gifted teacher of the word.</p>
                </div>
              </div>

              <div style={{ marginTop: '6rem', maxWidth: '800px', margin: '6rem auto 0 auto', background: colors.cream, padding: '4rem', borderRadius: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <div className="section-label">Engagement</div>
                  <h2 className="section-title">Book an Invitation</h2>
                </div>
                <form action={formAction} method="POST">
                  <input type="hidden" name="_subject" value="New Conference Invitation for CEO" />
                  
                  <label>Name of Conference</label>
                  <input type="text" name="ConferenceName" className="contact-input" required />
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label>Type</label>
                      <select name="Type" className="contact-input" required>
                        <option>Physical</option>
                        <option>Virtual</option>
                      </select>
                    </div>
                    <div>
                      <label>Location (If Physical)</label>
                      <input type="text" name="Location" className="contact-input" placeholder="N/A for virtual" />
                    </div>
                  </div>

                  <label>Theme</label>
                  <input type="text" name="Theme" className="contact-input" required />

                  <label>Target Audience</label>
                  <input type="text" name="TargetAudience" className="contact-input" placeholder="e.g. Students, Executives, etc." required />

                  <label>Your Contact Information (For feedback)</label>
                  <input type="text" name="ContactInfo" className="contact-input" placeholder="Email or Phone Number" required />

                  <button type="submit" style={{ width: '100%', background: colors.navy, color: 'white', padding: '1.2rem', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '1rem' }}>Submit Invitation</button>
                </form>
              </div>
            </div>
          </section>
        </>
      )}

      {view === "booking" && (
        <section className="page-padding">
          <div className="section-container">
            <div className="section-header">
              <div className="section-label">Coaching</div>
              <h2 className="section-title">Book a Session</h2>
            </div>
            <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <form action={formAction} method="POST">
                <input type="hidden" name="_subject" value="New Coaching Request" />
                <label>Focus Area</label>
                <select name="SessionType" className="contact-input" required>
                  <option>Purpose discovery</option>
                  <option>Identity crisis</option>
                  <option>Personal development and transformation</option>
                  <option>Personal Leadership coaching</option>
                  <option>Organizational Leadership coaching</option>
                  <option>Others</option>
                </select>
                <label>Full Name</label>
                <input type="text" name="FullName" className="contact-input" required />
                <label>Email Address (For feedback)</label>
                <input type="email" name="Email" className="contact-input" required />
                <label>Preferred Date</label>
                <input type="date" name="Date" className="contact-input" required />
                <button type="submit" style={{ width: '100%', background: colors.terracotta, color: 'white', padding: '1.2rem', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Schedule Session</button>
              </form>
            </div>
          </div>
        </section>
      )}

      {view === "events" && (
        <section className="page-padding">
          <div className="section-container">
            <div className="section-header">
              <div className="section-label">Programs</div>
              <h2 className="section-title">Upcoming Events</h2>
            </div>
            <div className="team-grid">
              <div style={{ padding: '2.5rem', background: 'white', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ color: colors.terracotta, fontWeight: 700, marginBottom: '0.5rem' }}>APR 15, 2026</div>
                <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', marginBottom: '1rem' }}>Leadership Bootcamp</h3>
                <p style={{ opacity: 0.7 }}>OAU Auditorium</p>
              </div>
              <div style={{ padding: '2.5rem', background: 'white', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ color: colors.terracotta, fontWeight: 700, marginBottom: '0.5rem' }}>MAY 22, 2026</div>
                <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', marginBottom: '1rem' }}>Purpose Webinar</h3>
                <p style={{ opacity: 0.7 }}>Online (Zoom)</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {view === "team" && (
        <section className="page-padding">
          <div className="section-container">
            <div className="section-header">
              <div className="section-label">Leadership</div>
              <h2 className="section-title">Meet Our Team</h2>
            </div>
            <div className="team-grid">
              {teamMembers.map((member, i) => (
                <div key={i} className="team-card">
                  <img src={member.photo} alt={member.name} className="team-avatar" />
                  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem', marginBottom: '0.5rem' }}>{member.name}</h3>
                  <div style={{ color: colors.terracotta, fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>{member.designation}</div>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {view === "blog" && (
        <section className="page-padding">
          <div className="section-container">
            <div className="section-header">
              <div className="section-label">Insights</div>
              <h2 className="section-title">Leadership Blog</h2>
            </div>
            <div className="blog-grid">
              {[
                { title: "Intentional Leadership", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800", date: "Feb 9, 2026" },
                { title: "Building Trust", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800", date: "Feb 2, 2026" },
              ].map((post, i) => (
                <div key={i} className="blog-card">
                  <img src={post.img} alt={post.title} className="blog-img" />
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ color: colors.terracotta, fontSize: '0.8rem', fontWeight: 700 }}>{post.date}</div>
                    <h3 style={{ fontFamily: 'Playfair Display', margin: '0.5rem 0' }}>{post.title}</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Coming soon...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer style={{ padding: "4rem 2rem", background: "#050a18", color: 'white', textAlign: 'center' }}>
        <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="CLG Logo" style={{ width: 80, height: 80, borderRadius: '50%', background: 'white', marginBottom: '1.5rem' }} />
        <div style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', marginBottom: '1rem' }}>Champions' Leadership Global</div>
        <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>© 2026 Champions' Leadership Global. All rights reserved.</p>
      </footer>
    </div>
  );
}