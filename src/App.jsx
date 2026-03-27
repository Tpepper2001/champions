import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --gold: #F4D03F;
    --navy: #0A1128;
    --terracotta: #C86B56;
    --cream: #FFF8F0;
  }

  html { scroll-behavior: smooth; }

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
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes float {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-30px) scale(1.05); }
    66%      { transform: translate(-20px,20px) scale(0.95); }
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes starPop {
    0% { transform: scale(0); opacity: 0; }
    70% { transform: scale(1.3); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes reviewSlide {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .navbar {
    position: fixed; top: 0; width: 100%;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: 1000;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    animation: slideDown 0.6s ease-out;
    transition: box-shadow 0.3s;
  }
  .navbar.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,0.08); }
  .nav-container {
    max-width: 1400px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.4rem 2rem;
  }
  .logo {
    display: flex; align-items: center; gap: 0.8rem;
    font-weight: 700; font-size: 1.05rem; color: #0A1128;
    text-decoration: none; cursor: pointer; transition: opacity 0.2s;
  }
  .logo:hover { opacity: 0.85; }
  .logo-img {
    width: 72px; height: 72px; border-radius: 50%;
    background: white; padding: 4px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    transition: transform 0.3s;
  }
  .logo:hover .logo-img { transform: rotate(-5deg) scale(1.05); }

  .nav-links { display: flex; gap: 1.4rem; list-style: none; align-items: center; }
  .nav-links a {
    text-decoration: none; color: #1A1A1A; font-weight: 500;
    transition: color 0.2s; cursor: pointer; font-size: 0.88rem;
    padding: 0.3rem 0; position: relative;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: 0; left: 0;
    width: 0; height: 2px; background: #C86B56;
    transition: width 0.3s ease;
  }
  .nav-links a:hover::after, .nav-links a.active::after { width: 100%; }
  .nav-links a.active { color: #C86B56; font-weight: 700; }
  .nav-links a:hover { color: #C86B56; }
  .nav-book-btn {
    background: linear-gradient(135deg, #C86B56, #a8553f) !important;
    color: white !important; padding: 0.6rem 1.3rem !important;
    border-radius: 50px !important; font-weight: 700 !important;
    box-shadow: 0 4px 15px rgba(200,107,86,0.35) !important;
    transition: transform 0.2s, box-shadow 0.2s !important;
  }
  .nav-book-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 6px 20px rgba(200,107,86,0.5) !important; }
  .nav-book-btn::after { display: none !important; }

  .hamburger {
    display: none; flex-direction: column; gap: 5px; cursor: pointer;
    padding: 8px; background: none; border: none; z-index: 1100;
  }
  .hamburger span {
    display: block; width: 24px; height: 2px;
    background: #0A1128; border-radius: 2px; transition: all 0.3s ease;
  }
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  .mobile-menu {
    display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(10,17,40,0.98); z-index: 999;
    flex-direction: column; align-items: center; justify-content: center;
    gap: 2.5rem; animation: fadeIn 0.25s ease;
  }
  .mobile-menu.open { display: flex; }
  .mobile-menu a {
    color: white; text-decoration: none; font-size: 1.6rem;
    font-family: 'Playfair Display', serif; font-weight: 700;
    transition: color 0.2s; cursor: pointer;
  }
  .mobile-menu a:hover, .mobile-menu a.active { color: #F4D03F; }
  .mobile-book-btn {
    background: linear-gradient(135deg, #C86B56, #a8553f) !important;
    padding: 0.8rem 2rem !important; border-radius: 50px !important;
    font-size: 1rem !important; font-family: 'DM Sans', sans-serif !important;
  }

  .hero {
    position: relative; min-height: 100vh;
    display: flex; align-items: center; overflow: hidden;
    background: #0A1128;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(135deg, rgba(10,17,40,0.88) 0%, rgba(10,17,40,0.6) 60%, rgba(200,107,86,0.3) 100%),
      url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000');
    background-size: cover; background-position: center;
    animation: float 30s ease-in-out infinite;
  }
  .hero-content {
    position: relative; z-index: 2;
    max-width: 1400px; margin: 0 auto;
    padding: 100px 2rem 0; width: 100%;
    animation: fadeInUp 1s ease 0.2s both;
  }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 0.8rem;
    color: var(--gold); letter-spacing: 3px; font-weight: 600;
    font-size: 0.8rem; margin-bottom: 1.8rem; text-transform: uppercase;
  }
  .hero-eyebrow::before { content: ''; width: 32px; height: 2px; background: var(--gold); }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 6vw, 6rem); font-weight: 900; color: white;
    line-height: 1.08; margin-bottom: 1.8rem; max-width: 820px;
  }
  .hero-title em {
    font-style: italic;
    background: linear-gradient(135deg, #F4D03F, #f0b429);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero-sub {
    color: rgba(255,255,255,0.85); font-size: 1.15rem;
    max-width: 540px; margin-bottom: 1rem; font-weight: 300; line-height: 1.7;
  }
  .hero-quote {
    color: rgba(255,255,255,0.6); font-size: 0.98rem;
    font-style: italic; font-family: 'Playfair Display', serif;
    max-width: 540px; margin-bottom: 3rem; line-height: 1.6;
  }
  .hero-cta-row { display: flex; gap: 1rem; flex-wrap: wrap; }
  .btn-primary {
    background: linear-gradient(135deg, var(--gold), #e8c020);
    color: var(--navy); padding: 1rem 2.5rem; border-radius: 50px;
    font-weight: 800; border: none; cursor: pointer; font-size: 1rem;
    box-shadow: 0 8px 25px rgba(244,208,63,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 35px rgba(244,208,63,0.5); }
  .btn-outline {
    background: transparent; color: white;
    padding: 1rem 2.5rem; border-radius: 50px;
    font-weight: 600; border: 2px solid rgba(255,255,255,0.4); cursor: pointer;
    font-size: 1rem; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .btn-outline:hover { border-color: white; background: rgba(255,255,255,0.08); }

  .hero-scroll-hint {
    position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    color: rgba(255,255,255,0.5); font-size: 0.75rem; letter-spacing: 2px;
    text-transform: uppercase; animation: fadeIn 1s 1.5s both;
  }
  .scroll-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: rgba(255,255,255,0.5);
    animation: fadeInUp 1.5s 1.5s infinite;
  }

  .marquee-strip { background: var(--navy); padding: 1rem 0; overflow: hidden; }
  .marquee-inner {
    display: flex; gap: 4rem; white-space: nowrap;
    animation: marquee 20s linear infinite; width: max-content;
  }
  .marquee-item {
    color: rgba(255,255,255,0.5); font-size: 0.8rem;
    letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
  }
  .marquee-dot { color: var(--gold); }

  .page-padding { padding: 10rem 2rem 5rem 2rem; min-height: 80vh; }
  .home-section { padding: 7rem 2rem; }
  .section-container { max-width: 1400px; margin: 0 auto; position: relative; }
  .section-header { text-align: center; margin-bottom: 4rem; }
  .section-label {
    font-size: 0.8rem; letter-spacing: 3px; text-transform: uppercase;
    color: #C86B56; font-weight: 700; margin-bottom: 1rem;
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .section-label::before, .section-label::after {
    content: ''; width: 20px; height: 1px; background: #C86B56;
  }
  .section-title {
    font-family: 'Playfair Display', serif; font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 900; color: #0A1128; margin-bottom: 1rem; line-height: 1.1;
  }

  .about-quote {
    border-left: 4px solid var(--gold); padding-left: 1.5rem;
    font-family: 'Playfair Display', serif; font-size: 1.25rem;
    font-style: italic; color: var(--navy); line-height: 1.6; margin: 2rem 0;
  }

  .value-card {
    background: white; border-radius: 16px; padding: 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    display: flex; align-items: flex-start; gap: 1rem;
    transition: transform 0.3s;
  }
  .value-card:hover { transform: translateY(-3px); }
  .value-icon {
    width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--navy), #1a2a5e);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
  }

  .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .team-card {
    background: white; border-radius: 24px; padding: 2.5rem 2rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06); display: flex; flex-direction: column;
    transition: transform 0.3s, box-shadow 0.3s; border: 1px solid rgba(0,0,0,0.04);
  }
  .team-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); }
  .team-avatar-wrap { position: relative; width: 90px; height: 90px; margin-bottom: 1.5rem; }
  .team-avatar { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(200,107,86,0.2); }
  .team-avatar-ring {
    position: absolute; inset: -6px; border-radius: 50%;
    border: 2px dashed rgba(200,107,86,0.3);
    animation: float 8s ease-in-out infinite;
  }

  .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .blog-card {
    border-radius: 24px; overflow: hidden; background: white;
    box-shadow: 0 8px 30px rgba(0,0,0,0.06); transition: transform 0.3s, box-shadow 0.3s;
    display: flex; flex-direction: column;
  }
  .blog-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.12); }
  .blog-img { width: 100%; height: 220px; object-fit: cover; transition: transform 0.4s; }
  .blog-card:hover .blog-img { transform: scale(1.04); }
  .blog-img-wrap { overflow: hidden; }

  .video-wrapper {
    max-width: 1000px; margin: 0 auto; border-radius: 24px; overflow: hidden;
    aspect-ratio: 16/9; background: #000;
    box-shadow: 0 40px 80px rgba(0,0,0,0.3); position: relative;
  }

  .contact-input {
    width: 100%; padding: 1.1rem 1.3rem; background: #fff;
    border: 1.5px solid #e8e8e8; border-radius: 12px; margin-bottom: 1rem;
    font-family: inherit; font-size: 0.95rem; transition: border-color 0.2s, box-shadow 0.2s;
    color: #1A1A1A;
  }
  .contact-input:focus { border-color: #C86B56; outline: none; box-shadow: 0 0 0 3px rgba(200,107,86,0.1); }
  .contact-input::placeholder { color: #aaa; }
  .form-feedback-text {
    font-size: 0.82rem; opacity: 0.6; text-align: center; margin-top: 1rem;
    display: block; color: #444;
  }
  .btn-submit {
    width: 100%; padding: 1.1rem; border-radius: 12px; border: none;
    font-weight: 700; cursor: pointer; font-size: 1rem; font-family: inherit;
    transition: transform 0.2s, box-shadow 0.2s; letter-spacing: 0.5px;
  }
  .btn-submit:hover { transform: translateY(-2px); }
  .btn-submit-navy {
    background: linear-gradient(135deg, #0A1128, #1a2a5e);
    color: white; box-shadow: 0 4px 20px rgba(10,17,40,0.3);
  }
  .btn-submit-navy:hover { box-shadow: 0 8px 30px rgba(10,17,40,0.4); }
  .btn-submit-terracotta {
    background: linear-gradient(135deg, #C86B56, #a8553f);
    color: white; box-shadow: 0 4px 20px rgba(200,107,86,0.35);
  }
  .btn-submit-terracotta:hover { box-shadow: 0 8px 30px rgba(200,107,86,0.5); }

  .event-card {
    background: white; border-radius: 24px; overflow: hidden;
    box-shadow: 0 5px 20px rgba(0,0,0,0.06);
    transition: transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column;
  }
  .event-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.1); }
  .event-date-badge {
    background: linear-gradient(135deg, var(--navy), #1a2a5e);
    color: white; padding: 1.5rem 2rem; display: flex; align-items: center; gap: 1rem;
  }
  .event-day { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 900; line-height: 1; }
  .event-month-year { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; }
  .event-body { padding: 2rem; flex: 1; }
  .event-register-btn {
    margin: 0 2rem 2rem; padding: 0.8rem; border-radius: 10px;
    background: var(--cream); border: 2px solid var(--navy); color: var(--navy);
    font-weight: 700; cursor: pointer; font-family: inherit; font-size: 0.9rem;
    transition: all 0.2s;
  }
  .event-register-btn:hover { background: var(--navy); color: white; }

  .ceo-grid {
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 5rem;
    align-items: start;
  }

  .article-content { font-size: 1.1rem; line-height: 1.9; color: #333; text-align: justify; }
  .article-content p { margin-bottom: 1.5rem; text-align: justify; }
  .article-content h2 { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--navy); margin: 2.5rem 0 1rem; text-align: left; }
  .article-content h3 { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--navy); margin: 2rem 0 0.8rem; text-align: left; }
  .article-content blockquote {
    border-left: 4px solid var(--gold); padding: 1rem 1.5rem;
    background: var(--cream); border-radius: 0 12px 12px 0;
    font-family: 'Playfair Display', serif; font-style: italic;
    font-size: 1.2rem; margin: 2rem 0; text-align: left;
  }

  /* ── REVIEWS ─────────────────────────────────────────────── */
  .reviews-section { padding: 7rem 2rem; background: #0A1128; position: relative; overflow: hidden; }
  .reviews-section::before {
    content: '\u201C'; position: absolute; top: -2rem; left: 2rem;
    font-family: 'Playfair Display', serif; font-size: 18rem; color: rgba(244,208,63,0.05);
    line-height: 1; pointer-events: none; user-select: none;
  }
  .reviews-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem; margin-bottom: 3rem;
  }
  .review-card {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px; padding: 2rem; position: relative; overflow: hidden;
    transition: transform 0.3s, background 0.3s;
  }
  .review-card:hover { transform: translateY(-4px); background: rgba(255,255,255,0.09); }
  .review-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #F4D03F, #C86B56);
  }
  .review-stars { display: flex; gap: 3px; margin-bottom: 1rem; }
  .review-star { color: #F4D03F; font-size: 1rem; }
  .review-text {
    font-family: 'Playfair Display', serif; font-style: italic;
    color: rgba(255,255,255,0.85); font-size: 1rem; line-height: 1.75;
    margin-bottom: 1.5rem; text-align: justify;
  }
  .review-author { display: flex; align-items: center; gap: 0.8rem; }
  .review-avatar {
    width: 42px; height: 42px; border-radius: 50%;
    background: linear-gradient(135deg, #C86B56, #F4D03F);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 1rem; color: white; flex-shrink: 0;
  }
  .review-name { color: white; font-weight: 700; font-size: 0.9rem; }
  .review-role { color: rgba(255,255,255,0.45); font-size: 0.78rem; }
  .review-new { animation: reviewSlide 0.4s ease; }

  .review-form-wrap {
    max-width: 680px; margin: 0 auto;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 28px; padding: 2.5rem;
  }
  .review-form-title {
    font-family: 'Playfair Display', serif; color: white;
    font-size: 1.6rem; margin-bottom: 0.4rem;
  }
  .review-form-sub { color: rgba(255,255,255,0.5); font-size: 0.88rem; margin-bottom: 1.8rem; }
  .review-input {
    width: 100%; padding: 0.95rem 1.2rem;
    background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.12);
    border-radius: 12px; margin-bottom: 1rem; font-family: inherit; font-size: 0.93rem;
    color: white; transition: border-color 0.2s;
  }
  .review-input:focus { border-color: #F4D03F; outline: none; }
  .review-input::placeholder { color: rgba(255,255,255,0.3); }
  .star-selector { display: flex; gap: 6px; margin-bottom: 1rem; cursor: pointer; }
  .star-btn {
    font-size: 1.6rem; background: none; border: none; cursor: pointer;
    transition: transform 0.15s; line-height: 1; padding: 0;
  }
  .star-btn:hover { transform: scale(1.2); }
  .star-active { color: #F4D03F; }
  .star-inactive { color: rgba(255,255,255,0.2); }
  .btn-review-submit {
    width: 100%; padding: 1rem; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #F4D03F, #e8c020);
    color: #0A1128; font-weight: 800; cursor: pointer; font-size: 0.95rem;
    font-family: inherit; transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(244,208,63,0.3);
  }
  .btn-review-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(244,208,63,0.45); }
  .btn-review-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .review-success {
    text-align: center; padding: 2rem; color: #F4D03F;
    font-family: 'Playfair Display', serif; font-size: 1.2rem;
  }

  /* ── BOOKING HERO ─────────────────────────────────────────── */
  .booking-hero {
    position: relative; min-height: 380px;
    display: flex; align-items: flex-end;
    overflow: hidden; background: #0A1128;
    padding: 0 2rem 0;
  }
  .booking-hero-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(to bottom, rgba(10,17,40,0.55) 0%, rgba(10,17,40,0.75) 60%, rgba(10,17,40,0.97) 100%),
      url('https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&q=80&w=2000');
    background-size: cover; background-position: center center;
  }
  .booking-hero-content {
    position: relative; z-index: 2; width: 100%; max-width: 1400px;
    margin: 0 auto; padding: 120px 0 4rem; text-align: center;
  }

  .footer { background: #050a18; color: white; padding: 5rem 2rem 3rem; position: relative; overflow: hidden; }
  .footer::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), var(--terracotta), transparent);
  }
  .footer-grid {
    max-width: 1400px; margin: 0 auto;
    display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 4rem; margin-bottom: 4rem;
  }
  .footer-bottom {
    max-width: 1400px; margin: 0 auto;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 2rem; text-align: center;
  }

  /* Block-justify all body text */
  p, .about-text p, .bio-text p { text-align: justify; }

  @media (max-width: 992px) {
    .team-grid, .blog-grid { grid-template-columns: 1fr 1fr; }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
    .hero-title { font-size: 3rem; }
    .ceo-grid { grid-template-columns: 1fr; gap: 3rem; }
  }
  @media (max-width: 768px) {
    .navbar { position: sticky; top: 0; }
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .team-grid, .blog-grid { grid-template-columns: 1fr !important; }
    .hero-title { font-size: 2.2rem; }
    .page-padding { padding: 5rem 1.2rem 3rem; }
    .home-section { padding: 4rem 1.2rem; }
    .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
    .hero-cta-row { flex-direction: column; }
    .hero-cta-row button { width: 100%; }
    .nav-container { padding: 0.5rem 1.2rem; }
    .ceo-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .reviews-section { padding: 4rem 1.2rem; }
    .review-form-wrap { padding: 1.8rem; }
    .booking-hero { min-height: 300px; }
  }
`;

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z"/>
  </svg>
);

const teamMembers = [
  { name: "James Oluwapelumi Olatunbosun", designation: "Program Director", bio: "James is a science communicator and Engineering Physics student at OAU. He is committed to seeing young people thrive in career and character.", linkedin: "https://www.linkedin.com/in/james-olatunbosun", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0000.jpg" },
  { name: "Ogbaudu Oghenefegor Believe", designation: "Content Writer", bio: "A faith-based writer and founder of GAP INITIATIVE — an NGO empowering youth to discover their gifts and purpose.", linkedin: null, photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0001.jpg" },
  { name: "Oluwatoyin Oluwabukola Yakubu", designation: "Head, Content", bio: "Oluwatoyin is passionate about helping people find healing from trauma and depression through honest conversations.", linkedin: "https://www.linkedin.com/in/oluwatoyin-yakubu-a2b1b6258", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0005.jpg" },
  { name: "Joseph Temitope Deborah", designation: "Community Manager", bio: "A communication advocate and leadership enthusiast passionate about purpose discovery and building impactful leaders.", linkedin: "https://www.linkedin.com/in/temitope-deborah-joseph-b24580227", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0015.jpg" },
  { name: "Promise Nseobong", designation: "Human Resource", bio: "An accounting student and creative voice running a YouTube channel on motivation and spoken-word poetry.", linkedin: "https://www.linkedin.com/in/nseobong-promise-02498a338", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0006.jpg" },
  { name: "Grace Temitope Babatunde", designation: "Admin", bio: "A communication specialist combining mastery of language with a passion for people-management and HR.", linkedin: "https://www.linkedin.com/in/gracetemibabatunde", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0014.jpg" },
];

const blogPosts = [
  {
    title: "Intentional Leadership",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    date: "Feb 9, 2026",
    category: "Leadership",
    excerpt: "Leadership is more than just a position; it is a conscious decision to influence and guide others towards a shared vision.",
    readTime: "5 min read",
    ctaHeading: "Ready to lead with intention and impact?",
    ctaSub: "Book a session and begin building the leader you were made to be.",
    fullContent: `Leadership is more than just a position; it is a conscious decision to influence and guide others towards a shared vision. In a world full of noise and distraction, the most impactful leaders are those who lead with intentionality.

True leadership begins from within. Before you can lead others, you must first learn to lead yourself. This means understanding your values, your purpose, and your non-negotiables. It means having the discipline to do what is right even when no one is watching.

Intentional leaders don't just react to circumstances — they create them. They set the tone for their teams and organisations by modelling the behaviour they wish to see. They invest in people not because it's convenient, but because they genuinely believe in the potential of every individual they encounter.

One of the greatest hallmarks of intentional leadership is the capacity to listen. Not just to respond, but to truly hear. The world is full of leaders who love to talk, but champions are those who understand that wisdom often comes from the voices around them.

As you step into your leadership journey today, ask yourself: Am I leading on purpose? Am I adding value to those around me? Am I building people, or simply using them? The answers to these questions will define the kind of leader you become — and the kind of legacy you leave behind.

Champions' Leadership Global exists to raise exactly this kind of leader: intentional, impactful, and enduring. The world doesn't need more bosses. It needs more champions.`
  },
  {
    title: "Growth is Intentional: Becoming Better on Purpose",
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800",
    date: "Mar 10, 2026",
    category: "Personal Development",
    excerpt: "Growth does not happen by chance — it happens by choice. Real growth requires intention, consistent action, and the willingness to step beyond what is comfortable.",
    readTime: "6 min read",
    ctaHeading: "Ready to grow with intention and purpose?",
    ctaSub: "Book a session and take deliberate steps toward the best version of yourself.",
    fullContent: `Everyone wants to grow. We want to become better, do more, and achieve greater things. But wanting growth and actually growing are two very different things.

Growth does not happen by chance — it happens by choice. It is easy to assume that with time, things will automatically improve. But real growth requires intention. It requires conscious effort, consistent action, and the willingness to step beyond what is comfortable.

## Understanding Intentional Growth

Intentional growth is the decision to take responsibility for your personal development. It means you do not leave your life to chance or circumstances. Instead, you actively pursue improvement in your mindset, skills, habits, and character. Growth begins when you become aware of where you are and take deliberate steps toward where you want to be.

## The Difference Between Wishing and Growing

Many people remain in the cycle of wishing: "I want to be better." "I want to succeed." "I want to grow." But growth requires more than desire — it requires discipline. It shows up in the small, consistent actions you take daily: choosing learning over distraction, choosing discipline over convenience, choosing progress over perfection. These choices, though small, compound over time and produce real transformation.

## Stepping Beyond Your Comfort Zone

Growth and comfort rarely exist in the same space. To grow, you must be willing to stretch yourself — to try, to fail, to learn, and to try again. This process may feel uncomfortable, but it is necessary. Every level of growth requires a new version of you.

## The Role of Environment

Your environment plays a significant role in your growth journey. When you surround yourself with people who are committed to growth, you are more likely to stay accountable, inspired, and focused. The right environment challenges you, supports you, and pushes you toward becoming your best self.

## A Community That Supports Your Growth

At Champions' Leadership Global, we believe growth should be intentional and supported. We provide a platform where individuals are equipped with the right mindset, guidance, and community to grow into leaders who make meaningful impact. Through mentorship, leadership development, and purposeful conversations, we help you stay committed to your growth journey.

Growth is not accidental — it is a result of the decisions you make every day. If you are ready to stop wishing for growth and start living it, the decision begins with you.`
  },
  {
    title: "The Power of Self-Leadership: Leading Yourself Before Others",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    date: "Mar 17, 2026",
    category: "Leadership",
    excerpt: "Before leading others, you must first learn to lead yourself. Self-leadership is the foundation of true, authentic, and lasting influence.",
    readTime: "7 min read",
    ctaHeading: "Ready to master the art of leading yourself?",
    ctaSub: "Book a session and build the discipline, clarity, and character of a true leader.",
    fullContent: `Have you ever set goals for yourself and struggled to stay consistent? Maybe you started with excitement, full of motivation and clarity, but somewhere along the way, discipline became difficult and consistency faded. It is a common experience — and it reveals something important: before leading others, you must first learn to lead yourself.

Self-leadership is the foundation of true leadership. It is the ability to take responsibility for your actions, manage your emotions, stay committed to your goals, and direct your life with intention. Without self-leadership, influence becomes shallow. But with it, leadership becomes authentic and impactful.

## What is Self-Leadership?

Self-leadership is the practice of intentionally guiding your thoughts, behaviours, and decisions toward growth and purpose. It means showing up for yourself even when it is difficult. It means choosing discipline over convenience. It means taking ownership of your life instead of waiting for change. When you lead yourself effectively, you build the capacity to lead others with clarity, confidence, and integrity.

## Key Traits of Self-Leaders

Self-leadership is not a talent reserved for a few — it is a skill that can be developed. Discipline means doing what needs to be done, even when you don't feel like it. Accountability means taking responsibility for your choices and outcomes. Emotional Intelligence means understanding and managing your emotions effectively. Clarity means knowing your values, goals, and direction. These traits shape not only your personal growth but also how others experience your leadership.

## Why Self-Leadership Matters

Many people desire influence, impact, and success, but overlook the inner work required to sustain it. Self-leadership builds consistency. It strengthens resilience in difficult moments. It creates alignment between who you are and what you do. When you are able to lead yourself, you become someone others can trust, follow, and learn from.

## You Don't Have to Do It Alone

While self-leadership begins with personal responsibility, growth is accelerated in the right environment. Being part of a community of growth-driven individuals provides accountability, encouragement, and guidance. Mentors and like-minded peers help you stay focused and committed, especially when the journey becomes challenging.

At Champions' Leadership Global, we are passionate about raising individuals who lead with clarity, discipline, and purpose. We provide the environment, mentorship, and resources needed to help you develop self-leadership and grow into a leader who makes meaningful impact.

Leadership does not begin when others follow you. It begins the moment you choose to lead yourself.`
  },
  {
    title: "Your Purpose: The Compass That Guides Your Life",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    date: "Mar 21, 2026",
    category: "Purpose",
    excerpt: "Purpose is the inner compass that gives direction to your life — your unique function on earth and the contribution you are meant to make in the world.",
    readTime: "5 min read",
    ctaHeading: "Ready to discover and deploy your purpose?",
    ctaSub: "Book a clarity session and find the compass that will guide the rest of your life.",
    fullContent: `Have you ever tried to walk a path you were unfamiliar with without a guide or a compass? The experience can be confusing, discouraging, and uncertain. Life can feel the same way when it is lived without purpose.

Purpose is the inner compass that gives direction to your life. It can be simply described as your unique function on earth — the reason for your existence and the contribution you are meant to make in the world. When you understand your purpose, your identity becomes clearer and your path becomes more meaningful.

Just as a compass guides a traveller, purpose guides your decisions, growth, and impact. To keep your purpose alive, it is important to stay aligned with your Vision — seeing the future you are working toward; your Mission — understanding the work you are called to do; your Goals — taking intentional steps forward; and Determination — remaining committed despite challenges.

Another key part of living purposefully is community. No meaningful journey is meant to be walked alone. Surrounding yourself with like-minded individuals and mentors provides encouragement, guidance, and accountability.

At Champions' Leadership Global, we are committed to helping individuals discover their purpose, develop leadership capacity, and grow into people who create meaningful impact in their communities and beyond. If you are seeking clarity about your purpose and direction for growth, we invite you to book a discovery call with our team. Our experienced mentors are ready to guide and support you on your journey toward purposeful leadership and all-round development.

Your purpose can become the compass that guides your life.`
  },
];

const coreValues = [
  { title: "Purpose", desc: "We believe every individual carries a God-given assignment. Our work begins where purpose is discovered — and we will not rest until every person we serve finds theirs." },
  { title: "Personal Transformation", desc: "We are committed to the inside-out work of change. Real transformation is not cosmetic — it reshapes thinking, behaviour, and character from the core." },
  { title: "Leadership", desc: "We raise leaders defined by character, not title. Every programme we run is ultimately a leadership development encounter." },
  { title: "Influence", desc: "We equip people to carry weight in their spheres — family, career, community, and beyond. Influence is the currency of true leadership." },
  { title: "Global Impact", desc: "Our vision does not stop at borders. We are raising a generation of champions whose impact will be felt across nations and generations." },
  { title: "Legacy", desc: "We build for the long term. Everything we do is designed to outlast us — raising leaders whose lives, decisions, and values echo into the next generation." },
];

const degrees = [
  { degree: "B.A. Music — Second Class Upper", school: "Obafemi Awolowo University, Ile-Ife, Osun State, Nigeria", status: "Completed" },
  { degree: "M.A. Music", school: "Obafemi Awolowo University, Ile-Ife, Osun State, Nigeria", status: "Ongoing" },
];

const certifications = [
  { cert: "Write Like Mozart: An Introduction to Classical Music Composition", school: "National University of Singapore" },
  { cert: "Introduction to Classical Music", school: "Yale University" },
  { cert: "Fundamentals of Music Theory", school: "The University of Edinburgh" },
  { cert: "Introduction to Psychology", school: "Yale University" },
  { cert: "Songwriting: Writing the Lyrics", school: "Berklee College of Music" },
  { cert: "Exploring Piano Literature: The Piano Sonata", school: "University of Michigan" },
];

const pastEvents = [
  {
    quarter: "NOV 2024",
    title: "Champions Conference 1.0",
    theme: "TRANSFORMATION: Change | Evolve",
    loc: "Google Meet (Virtual)",
    desc: "Our inaugural flagship conference — a groundbreaking gathering designed to inspire participants to become the best version of themselves through mind transformation, personal evolution, and lasting change.",
    tags: ["Virtual", "Free"],
    dates: "15–16 Nov, 2024",
  },
  {
    quarter: "FEB 2025",
    title: "Love & Patriotism",
    theme: "A Tool for National Development",
    loc: "Telegram",
    desc: "A Champions' Corner Exploits 365 February Special exploring how love and patriotism can be harnessed as tools for driving meaningful national development.",
    tags: ["Virtual"],
    dates: "11 Feb, 2025",
  },
  {
    quarter: "FEB 2026",
    title: "Value & Value Systems Masterclass",
    theme: "The Hidden Framework That Shapes Your Destiny",
    loc: "Facebook Live (@Jerry Oyedele)",
    desc: "A Purpose Leadership Development Masterclass diving deep into how values influence choices and outcomes, building values that sustain growth, aligning purpose with principles, and breaking cycles through value change.",
    tags: ["Virtual", "Free"],
    dates: "13–14 Feb, 2026",
  },
  {
    quarter: "MAR 2026",
    title: "3-Day Leadership Bootcamp",
    theme: "3 Days. 6 Core Pillars. One Defining Shift.",
    loc: "Google Meet (Virtual)",
    desc: "A transformative 3-day bootcamp covering self-awareness, purpose discovery, basics of leadership, personal transformation, leadership development, and influence — followed by one month of personal mentorship.",
    tags: ["Virtual", "Paid"],
    dates: "18–20 Mar, 2026",
  },
  {
    quarter: "MAR 2025",
    title: "Next Generation Conference",
    theme: "The Power of Vision",
    loc: "Telegram Page",
    desc: "A Champions' Corner conference exploring the power of vision for the next generation — featuring speakers Jerry Oyedele (Founder, Champions' Corner), Afoluwa Oyegbile (Creative Director, Aphoenix), and Tolu Ayowole (CEO, Tap Music Africa).",
    tags: ["Virtual", "Free"],
    dates: "25 Mar, 2025",
  },
  {
    quarter: "JUN 2025",
    title: "Redefining Failure Bootcamp",
    theme: "A 2-Day Virtual Bootcamp",
    loc: "Telegram (Virtual)",
    desc: "A Champions Leadership Academy 2-day virtual bootcamp tackling overcoming the feeling and fear of failure, why failure is important, failing forward, and fixed vs growth mindset.",
    tags: ["Virtual"],
    dates: "10–11 Jun, 2025",
  },
];

const events = [
  {
    quarter: "Q2 2026",
    title: "Kingdom Creative Conference 1.0",
    theme: "BEZALEEL: The Spirit of Wisdom & Understanding",
    loc: "Online (Virtual)",
    desc: "An inaugural conference exploring creativity, calling, and the Spirit of wisdom — where faith and excellence meet to unlock the creative potential God has placed in every believer.",
    tags: ["Virtual"],
  },
  {
    quarter: "Q3 2026",
    title: "Champions Conference 2.0",
    theme: "RECALIBRATE: Setting Your Mind",
    loc: "OAU, Ile-Ife",
    desc: "Our flagship annual conference returns — challenging leaders to reset their thinking, realign their purpose, and step into a new season with clarity and conviction.",
    tags: ["Physical", "Virtual"],
  },
  {
    quarter: "Q3 2026",
    title: "Certificate Course in Leadership",
    theme: "2026 Cohort",
    loc: "Physical & Virtual",
    desc: "A structured, practical leadership training programme designed to equip participants with the mindset, tools, and character needed to lead effectively in every sphere of life.",
    tags: ["Physical", "Virtual"],
  },
  {
    quarter: "DEC 2026",
    title: "Retrospect 1.0",
    theme: "HOW FAR AND HOW WELL: Looking Back at 2026",
    loc: "Online (Virtual)",
    desc: "A reflective year-end gathering to look back at 2026 with honesty and gratitude — celebrating growth, acknowledging lessons, and setting our hearts towards the year ahead.",
    tags: ["Virtual"],
  },
];

const statItems = [
  { num: "2", suffix: "+", label: "Years of Impact", desc: "Years of raising transformational leaders", icon: "📅" },
  { num: "1K", suffix: "+", label: "Lives Transformed", desc: "Individuals impacted through our programmes", icon: "🌱" },
  { num: "6", suffix: "", label: "Core Team Members", desc: "Dedicated champions driving the vision", icon: "🤝" },
  { num: "6", suffix: "", label: "Core Values", desc: "Principles guiding everything we do", icon: "🧭" },
];

// ── REAL REVIEWS ──────────────────────────────────────────────
const demoReviews = [
  {
    id: 1,
    name: "Joseph Lilian Amanda",
    role: "Lagos",
    rating: 5,
    text: "Before CLG, leadership to me was just about the position and taking the lion's share. The Champions' Leadership Global impact gave me a better way to look at leadership — I can now tell you who I am in just three words: self-awareness. I know it is not just about living a million years on earth; the question is what am I leaving behind? What impact am I making? Who am I carrying along with me? Trust me, it was impactful. I am super happy I did not miss this opportunity."
  },
  {
    id: 2,
    name: "Nseobong Promise",
    role: "Calabar",
    rating: 5,
    text: "Champions' Leadership Global has impacted me in many ways through its programmes, boot camps, and enlightening sessions. I have gained clarity on issues that have to do with vision and purpose, and I have also witnessed self-transformation in ways I did not expect."
  },
  {
    id: 3,
    name: "Daniel",
    role: "Ile-Ife",
    rating: 5,
    text: "This year in January 2026, I learnt how to manage my time properly from the first webinar of the year. That single session changed how I approach my days and my responsibilities."
  },
  {
    id: 4,
    name: "Oyeleye Deborah",
    role: "Osun State",
    rating: 5,
    text: "I attended the last leadership boot camp organised by Champions' Leadership Global and it was a real eye-opener to a lot of things I thought I knew, especially handling situations as a leader. I have learnt so much from the conferences and webinars that have been held. Special thanks to the convener and committee — keep up the good work."
  },
  {
    id: 5,
    name: "Kayode Emmanuel",
    role: "Lagos",
    rating: 5,
    text: "Champions' Leadership Global has impacted me positively in the way of my thinking and reasoning about life and decision making."
  },
];

// ── REVIEWS SECTION COMPONENT ─────────────────────────────────
function ReviewsSection() {
  const [reviews, setReviews] = useState(demoReviews);
  const [form, setForm] = useState({ name: "", role: "", text: "", rating: 5 });
  const [hoverStar, setHoverStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      const newReview = {
        id: Date.now(),
        name: form.name.trim(),
        role: form.role.trim() || "Community Member",
        rating: form.rating,
        text: form.text.trim(),
        isNew: true,
      };
      setReviews(prev => [newReview, ...prev]);
      setSubmitted(true);
      setSubmitting(false);
    }, 600);
  };

  const initials = (name) => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="reviews-section">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label" style={{ color: "#F4D03F", justifyContent: "center" }}>Community Voices</div>
          <h2 className="section-title" style={{ color: "white" }}>
            What Champions <em style={{ fontStyle: "italic", color: "#F4D03F" }}>Are Saying</em>
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.8rem", marginTop: "0.5rem" }}>
            <div style={{ display: "flex", gap: "3px" }}>
              {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#F4D03F", fontSize: "1.1rem" }}>★</span>)}
            </div>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
              {avgRating} average · {reviews.length} reviews
            </span>
          </div>
        </div>

        <div className="reviews-grid">
          {reviews.map((r) => (
            <div key={r.id} className={"review-card" + (r.isNew ? " review-new" : "")}>
              <div className="review-stars">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className="review-star">{s <= r.rating ? "★" : "☆"}</span>
                ))}
              </div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">
                <div className="review-avatar">{initials(r.name)}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-role">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* REVIEW FORM */}
        <div className="review-form-wrap">
          {submitted ? (
            <div className="review-success">
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎉</div>
              <div>Thank you for sharing your story, Champion!</div>
              <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", fontFamily: "DM Sans, sans-serif", marginTop: "0.5rem", fontStyle: "normal" }}>
                Your review has been added to the wall above.
              </div>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", role: "", text: "", rating: 5 }); }}
                style={{ marginTop: "1.5rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", padding: "0.6rem 1.5rem", borderRadius: 20, cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" }}
              >
                Write another review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="review-form-title">Share Your Experience</h3>
              <p className="review-form-sub">Has CLG impacted your journey? We'd love to hear from you.</p>
              <div style={{ marginBottom: "0.5rem" }}>
                <label style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Your Rating</label>
              </div>
              <div className="star-selector" onMouseLeave={() => setHoverStar(0)}>
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s} type="button"
                    className={"star-btn " + (s <= (hoverStar || form.rating) ? "star-active" : "star-inactive")}
                    onMouseEnter={() => setHoverStar(s)}
                    onClick={() => setForm(f => ({ ...f, rating: s }))}
                  >★</button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <input className="review-input" placeholder="Your Full Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <input className="review-input" placeholder="Role / City (optional)" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
              </div>
              <textarea
                className="review-input" placeholder="Tell us how CLG impacted your journey…"
                style={{ height: 120, resize: "none" }} required
                value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
              />
              <button type="submit" className="btn-review-submit" disabled={submitting}>
                {submitting ? "Posting…" : "Post My Review ✦"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  // ── ROUTING: read initial page from URL hash ──────────────────
  const getViewFromHash = () => {
    const hash = window.location.hash.replace("#", "").split("/")[0];
    const valid = ["home", "ceo", "events", "team", "blog", "booking"];
    return valid.includes(hash) ? hash : "home";
  };

  const getSlugFromHash = () => {
    const parts = window.location.hash.replace("#", "").split("/");
    return parts[1] || null;
  };

  const [view, setView] = useState(getViewFromHash);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedPost, setSelectedPost] = useState(() => {
    const slug = getSlugFromHash();
    if (slug) return blogPosts.find(p => p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug) || null;
    return null;
  });
  const formAction = "https://formspree.io/f/mqeykgyy";
  const contactInfoText = "championscorner27@gmail.com · +234 906 414 4546";

  // ── Sync URL hash → view when user presses back/forward ───────
  useEffect(() => {
    const onHashChange = () => {
      const v = getViewFromHash();
      const slug = getSlugFromHash();
      setView(v);
      setSelectedPost(slug ? blogPosts.find(p => p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug) || null : null);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.head.removeChild(style);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigate = (v, post = null) => {
    setView(v);
    setMenuOpen(false);
    setSelectedPost(post);
    if (post) {
      const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      window.location.hash = `${v}/${slug}`;
    } else {
      window.location.hash = v === "home" ? "" : v;
    }
    window.scrollTo(0, 0);
  };

  const navItems = [
    { label: "Home", key: "home" },
    { label: "Meet the CEO", key: "ceo" },
    { label: "Events", key: "events" },
    { label: "Team", key: "team" },
    { label: "Blog", key: "blog" },
  ];

  // Parse article content with headings support
  const renderArticleContent = (content) => {
    return content.trim().split("\n\n").map((block, i) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("## ")) {
        return <h2 key={i}>{trimmed.replace("## ", "")}</h2>;
      }
      if (trimmed.startsWith("### ")) {
        return <h3 key={i}>{trimmed.replace("### ", "")}</h3>;
      }
      return <p key={i}>{trimmed}</p>;
    });
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className={"navbar" + (scrolled ? " scrolled" : "")}>
        <div className="nav-container">
          <div className="logo" onClick={() => navigate("home")}>
            <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="CLG Logo" className="logo-img" />
            <span>Champions&apos; Leadership Global</span>
          </div>
          <ul className="nav-links">
            {navItems.map(item => (
              <li key={item.key}>
                <a href="#!" className={view === item.key ? "active" : ""} onClick={e => { e.preventDefault(); navigate(item.key); }}>{item.label}</a>
              </li>
            ))}
            <li>
              <a href="#!" className={"nav-book-btn" + (view === "booking" ? " active" : "")} onClick={e => { e.preventDefault(); navigate("booking"); }}>Book a Session</a>
            </li>
          </ul>
          <button className={"hamburger" + (menuOpen ? " open" : "")} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={"mobile-menu" + (menuOpen ? " open" : "")}>
        {navItems.map(item => (
          <a key={item.key} href="#!" className={view === item.key ? "active" : ""} onClick={e => { e.preventDefault(); navigate(item.key); }}>{item.label}</a>
        ))}
        <a href="#!" className="mobile-book-btn" onClick={e => { e.preventDefault(); navigate("booking"); }}>Book a Session</a>
      </div>

      {/* HOME */}
      {view === "home" && (
        <div>
          {/* HERO */}
          <section className="hero">
            <div className="hero-bg" />
            <div className="hero-content">
              <div className="hero-eyebrow">Welcome to a World of Champions</div>
              <h1 className="hero-title">
                Raising<br />
                <em>Transformational</em><br />
                Leaders
              </h1>
              <p className="hero-sub">Empowering individuals to discover their purpose and lead with lasting, generational impact.</p>
              <p className="hero-quote">&ldquo;You can choose your actions; not consequences&rdquo; &mdash; Jerry Oyedele</p>
              <div className="hero-cta-row">
                <button className="btn-primary" onClick={() => { const el = document.getElementById("about-us"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}>
                  Explore Our Mission
                </button>
                <button className="btn-outline" onClick={() => navigate("booking")}>
                  Book a Session &rarr;
                </button>
              </div>
            </div>
            <div className="hero-scroll-hint">
              <span>Scroll</span>
              <div className="scroll-dot" />
            </div>
          </section>

          {/* MARQUEE */}
          <div className="marquee-strip">
            <div className="marquee-inner">
              {["Purpose Discovery", "Leadership Development", "Intentional Living", "Character Formation", "Champions Conference", "Personal Transformation",
                "Purpose Discovery", "Leadership Development", "Intentional Living", "Character Formation", "Champions Conference", "Personal Transformation"].map((t, i) => (
                <span key={i} className="marquee-item">{t} <span className="marquee-dot">&bull;</span> </span>
              ))}
            </div>
          </div>

          {/* STATS */}
          <section style={{ background: "#0A1128", padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-80px", left: "-80px", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,208,63,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,107,86,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
              <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <div className="section-label" style={{ color: "#F4D03F", justifyContent: "center", marginBottom: "0.8rem" }}>Our Impact So Far</div>
                <h2 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.1 }}>
                  Every Number Tells <em style={{ fontStyle: "italic", color: "#F4D03F" }}>a Story</em>
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
                {statItems.map((s, i) => (
                  <div key={i}
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "2.5rem 2rem", textAlign: "center", position: "relative", overflow: "hidden", transition: "transform 0.3s, background 0.3s", cursor: "default" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 48, height: 3, background: i % 2 === 0 ? "linear-gradient(90deg, #F4D03F, #e8c020)" : "linear-gradient(90deg, #C86B56, #a8553f)", borderRadius: "0 0 4px 4px" }} />
                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{s.icon}</div>
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(3rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1, marginBottom: "0.4rem" }}>
                      <span style={{ color: "white" }}>{s.num}</span>
                      <span style={{ color: i % 2 === 0 ? "#F4D03F" : "#C86B56" }}>{s.suffix}</span>
                    </div>
                    <div style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.6rem", letterSpacing: "0.5px" }}>{s.label}</div>
                    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "4rem", padding: "2.5rem 3rem", background: "rgba(244,208,63,0.06)", border: "1px solid rgba(244,208,63,0.15)", borderRadius: 20, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
                <div>
                  <p style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.3rem" }}>Need clarity on purpose, identity, and leadership?</p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>Join others who have unlocked their potential.</p>
                </div>
                <button onClick={() => navigate("booking")} className="btn-primary" style={{ whiteSpace: "nowrap" }}>
                  Book a Session &rarr;
                </button>
              </div>
            </div>
          </section>

          {/* ABOUT US */}
          <section id="about-us" className="home-section" style={{ background: "white" }}>
            <div className="section-container">
              <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <div className="section-label">Our Story</div>
                <h2 className="section-title">About Champions&apos; Leadership Global</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "center", marginBottom: "2rem" }}>
                <div style={{ fontSize: "1.05rem", color: "#555", lineHeight: 1.9 }}>
                  <p style={{ marginBottom: "1.5rem", textAlign: "justify" }}>Champions&apos; Leadership Global is a brand deeply committed to the themes of purpose, leadership, and personal development. We exist to raise a generation of individuals who are not merely successful in the world&apos;s eyes but are truly fulfilled in their God-given assignment.</p>
                  <p style={{ marginBottom: "1.5rem", textAlign: "justify" }}>We believe that everyone has the potential and responsibility to live out their purpose, and we aim to inspire and enlighten individuals on this journey. Our work is rooted in the conviction that the world&apos;s greatest problems are not structural — they are leadership problems, and leadership problems are ultimately people problems.</p>
                  <p style={{ marginBottom: "1.5rem", textAlign: "justify" }}>Founded out of a personal experience of purpose discovery, Champions&apos; Leadership Global was born to serve as a catalyst — a space where people encounter the truth about themselves, are equipped for their life&apos;s work, and are connected to a community of like-minded champions.</p>
                  <blockquote className="about-quote">
                    Transforming people is the best way to transform the world, because the world is first a people, which eventually makes the place.
                  </blockquote>
                </div>
                <div>
                  <div style={{ background: "linear-gradient(135deg, #0A1128, #1a2a5e)", color: "white", padding: "3rem", borderRadius: 28, marginBottom: "1.5rem" }}>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", marginBottom: "1rem", color: "#F4D03F" }}>Our Vision</h3>
                    <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.8, fontSize: "1.05rem", textAlign: "justify" }}>A world where every individual walks in the full expression of their God-given purpose — leading families, organisations, communities, and nations with wisdom, integrity, and lasting impact.</p>
                  </div>
                  <div style={{ background: "#FFF8F0", padding: "2.5rem", borderRadius: 28, border: "1px solid rgba(0,0,0,0.06)" }}>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", marginBottom: "1rem", color: "#0A1128" }}>Our Mission</h3>
                    <p style={{ color: "#555", lineHeight: 1.8, fontSize: "1.05rem", textAlign: "justify" }}>To discover, develop, and deploy transformational leaders through intentional programmes, platforms, and partnerships that foster purpose, character, and excellence in every sphere of life.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CORE VALUES */}
          <section className="home-section" style={{ background: "#FFF8F0" }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-label">What We Stand For</div>
                <h2 className="section-title">Our Core Values</h2>
                <p style={{ maxWidth: 560, margin: "0 auto", color: "#666", lineHeight: 1.7, textAlign: "justify" }}>These values are not aspirations — they are the daily operating system of everyone who bears the Champions&apos; Leadership Global name.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                {coreValues.map((v, i) => (
                  <div key={i} className="value-card">
                    <div className="value-icon" />
                    <div>
                      <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", color: "#0A1128", marginBottom: "0.4rem" }}>{v.title}</h4>
                      <p style={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.7, textAlign: "justify" }}>{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CEO VIDEO */}
          <section className="home-section" style={{ background: "#0A1128" }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-label" style={{ color: "#F4D03F" }}>A Personal Note</div>
                <h2 className="section-title" style={{ color: "white" }}>Our CEO says Welcome</h2>
                <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto" }}>Hear directly from Jerry Oyedele, founder of Champions&apos; Leadership Global</p>
              </div>
              <div className="video-wrapper">
                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/jAco6NX4I1k" title="CEO Welcome Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                <button onClick={() => navigate("ceo")} style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.3)", color: "white", padding: "0.9rem 2rem", borderRadius: 50, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: "0.95rem" }}>
                  Read Full Bio &rarr;
                </button>
              </div>
            </div>
          </section>

          {/* REVIEWS */}
          <ReviewsSection />

          {/* BLOG PREVIEW */}
          <section className="home-section" style={{ background: "white" }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-label">Latest Insight</div>
                <h2 className="section-title">From the Blog</h2>
              </div>
              <div style={{ maxWidth: 950, margin: "0 auto" }}>
                <div className="blog-card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", borderRadius: 24 }}>
                  <div className="blog-img-wrap">
                    <img src={blogPosts[0].img} alt="Latest post" style={{ width: "100%", height: "100%", minHeight: 320, objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1rem", alignItems: "center" }}>
                      <span style={{ background: "#FFF8F0", color: "#C86B56", padding: "0.3rem 0.8rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700 }}>{blogPosts[0].category}</span>
                      <span style={{ color: "#aaa", fontSize: "0.8rem" }}>{blogPosts[0].readTime}</span>
                    </div>
                    <div style={{ color: "#C86B56", fontWeight: 700, fontSize: "0.85rem" }}>{blogPosts[0].date}</div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", margin: "0.8rem 0", color: "#0A1128" }}>{blogPosts[0].title}</h3>
                    <p style={{ opacity: 0.75, marginBottom: "1.8rem", lineHeight: 1.7, textAlign: "justify" }}>{blogPosts[0].excerpt}</p>
                    <button onClick={() => navigate("blog", blogPosts[0])}
                      style={{ background: "#0A1128", color: "white", padding: "0.9rem 1.8rem", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", alignSelf: "flex-start", fontFamily: "inherit" }}>
                      Read Full Article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" className="home-section" style={{ background: "#FFF8F0" }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-label">Connect</div>
                <h2 className="section-title">Contact Us</h2>
                <p style={{ maxWidth: 500, margin: "0 auto", color: "#666" }}>Have a question, collaboration idea, or just want to reach out? We would love to hear from you.</p>
              </div>
              <div style={{ maxWidth: 800, margin: "0 auto", background: "white", padding: "3.5rem", borderRadius: 30, boxShadow: "0 10px 50px rgba(0,0,0,0.07)" }}>
                <form action={formAction} method="POST">
                  <input type="hidden" name="_subject" value="New Website Message" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                    <input type="text" name="Name" placeholder="Full Name" className="contact-input" required />
                    <input type="email" name="Email" placeholder="Email Address" className="contact-input" required />
                  </div>
                  <textarea name="Message" placeholder="Your Message" className="contact-input" style={{ height: 150, resize: "none" }} required />
                  <button type="submit" className="btn-submit btn-submit-navy">Send Message</button>
                  <span className="form-feedback-text">{contactInfoText}</span>
                </form>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* CEO */}
      {view === "ceo" && (
        <div>
          <div style={{ background: "#0A1128", padding: "120px 2rem 4rem", textAlign: "center" }}>
            <div className="section-label" style={{ justifyContent: "center", color: "#F4D03F", marginBottom: "1rem" }}>Visioneer &amp; Founder</div>
            <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.1 }}>
              Meet <em style={{ fontStyle: "italic", color: "#F4D03F" }}>Jerry Oyedele</em>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", marginTop: "1rem", fontSize: "1.05rem", textAlign: "center" }}>Leading with Purpose and Passion</p>
          </div>

          <section className="page-padding" style={{ background: "white", marginTop: "-40px" }}>
            <div className="section-container">
              <div className="ceo-grid">
                <div>
                  <div style={{ borderRadius: 28, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.12)" }}>
                    <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260306-WA0029.jpg" alt="Jerry Oyedele" style={{ width: "100%", display: "block" }} />
                  </div>
                  <div style={{ marginTop: "1.5rem", padding: "2rem", background: "#0A1128", color: "white", borderRadius: 20 }}>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", marginBottom: "0.3rem" }}>Jerry Oyedele</h3>
                    <p style={{ color: "#F4D03F", fontWeight: 600, marginBottom: "1.2rem" }}>Founder &amp; CEO, Champions&apos; Leadership Global</p>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {["Public Speaker", "Musicologist", "Mentor", "Choir Leader", "Educator"].map(tag => (
                        <span key={tag} style={{ background: "rgba(255,255,255,0.1)", padding: "0.3rem 0.8rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: "1.5rem", padding: "2rem", background: "#FFF8F0", borderRadius: 20 }}>
                    <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", color: "#0A1128", marginBottom: "1.5rem" }}>Academic Qualifications</h4>
                    {degrees.map((d, i) => (
                      <div key={i} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: i < degrees.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                        <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0A1128", marginBottom: "0.2rem" }}>{d.degree}</div>
                        <div style={{ fontSize: "0.82rem", color: "#666", marginBottom: "0.4rem" }}>{d.school}</div>
                        <span style={{ background: d.status === "Ongoing" ? "rgba(200,107,86,0.12)" : "rgba(10,17,40,0.08)", color: d.status === "Ongoing" ? "#C86B56" : "#0A1128", fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 20 }}>{d.status}</span>
                      </div>
                    ))}
                    <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", color: "#0A1128", margin: "1.5rem 0 1rem" }}>Certifications</h4>
                    {certifications.map((c, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.9rem" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#C86B56", flexShrink: 0, marginTop: "0.35rem" }} />
                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333", lineHeight: 1.4, marginBottom: "0.15rem" }}>{c.cert}</div>
                          <div style={{ fontSize: "0.78rem", color: "#888" }}>{c.school}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="section-label" style={{ marginBottom: "0.5rem", justifyContent: "flex-start" }}>Biography</div>
                  <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.5rem", color: "#0A1128", marginBottom: "2rem", lineHeight: 1.2 }}>A Life Defined<br />by Purpose</h2>
                  <div style={{ fontSize: "1.05rem", color: "#444", lineHeight: 1.9 }}>
                    {[
                      "Jerry Oyedele is a sought-after public speaker, musicologist, and mentor whose life is a living testimony of what it means to step into one's God-given purpose against all odds. He is the founder of Champions' Leadership Global, a leadership brand dedicated to purpose discovery, personal development, and leadership excellence — and the founder of Jebion Music, a gospel music brand committed to releasing the sound of the Kingdom.",
                      "He holds a Bachelor of Arts in Music (Second Class Upper) from Obafemi Awolowo University, Ile-Ife, and is currently pursuing a Master of Arts in Music at the same institution, where he continues to deepen his academic and creative formation.",
                    ].map((text, i) => (
                      <p key={i} style={{ marginBottom: "1.5rem", textAlign: "justify" }}>{text}</p>
                    ))}
                    <blockquote className="about-quote" style={{ margin: "2rem 0" }}>
                      &ldquo;I had to make the hardest decision of my life: leave engineering at 500 level and start music all over again from 100 level. That decision became the doorway to my purpose.&rdquo;
                    </blockquote>
                    {[
                      { heading: "The Journey to Purpose", paras: [
                        "Jerry's story is not a conventional one. After years in the Engineering faculty at OAU, he felt a deep, undeniable pull toward music — a field he had loved all his life but never considered a \"serious\" path. The decision to leave and start over from 100 level was met with questions, doubts, and social pressure. But that radical act of obedience became the seed of everything he now leads.",
                        "From that moment of surrender, Jerry began to understand purpose not as a destination but as a daily commitment to becoming who you were made to be. His personal journey gave him language for what millions experience: the tension between the life others expect and the life your soul craves. Champions' Leadership Global was born out of that tension."
                      ]},
                      { heading: "The Musicologist", paras: [
                        "As a musicologist, Jerry brings over two decades of lived experience in music to his academic and creative pursuits. He is a prolific composer with over 300 original works produced in the last seven years alone — spanning choral, contemporary gospel, and orchestral forms. His compositions are not merely artistic expressions; they are spiritual declarations crafted to minister to the heart and glorify God.",
                        "Through Jebion Music, Jerry is building a legacy of sacred music that bridges the gap between excellence and anointing. To ground his practice further, he has pursued certificate courses from world-class institutions including the National University of Singapore, Yale University, the University of Edinburgh, Berklee College of Music, and the University of Michigan."
                      ]},
                      { heading: "The Speaker & Mentor", paras: [
                        "With over a decade on the public speaking circuit, Jerry has addressed students, professionals, church congregations, and various audiences across Nigeria. His messages are characterised by clarity, depth, and a rare ability to make abstract ideas about purpose feel immediately personal and actionable.",
                        "As a mentor, Jerry works one-on-one and in group settings with young people navigating identity crises, career transitions, and leadership challenges. His approach is not merely motivational — it is transformational, drawing from Scripture, personal experience, and a rich understanding of human development."
                      ]},
                      { heading: "Faith & Church Life", paras: [
                        "Jerry Oyedele is a committed worker in the vineyard of God. He serves as a choir leader in his local church denomination, using music as a vehicle for worship and intercession. He is also recognised as a gifted teacher of the Word."
                     ]},
                        "For Jerry, there is no separation between ministry and mission — every platform he occupies, whether a university auditorium, a conference hall, or a choir rehearsal, is an altar where lives can be shaped for eternity."
                      ]},
                    ].map(({ heading, paras }, hi) => (
                      <div key={hi}>
                        <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#0A1128", margin: "2.5rem 0 1rem" }}>{heading}</h3>
                        {paras.map((p, pi) => <p key={pi} style={{ marginBottom: "1.5rem", textAlign: "justify" }}>{p}</p>)}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "3.5rem", padding: "3rem", background: "#FFF8F0", borderRadius: 28, border: "1px solid rgba(0,0,0,0.06)" }}>
                    <div className="section-label" style={{ justifyContent: "flex-start", marginBottom: "0.5rem" }}>Invitations</div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem", marginBottom: "0.5rem", color: "#0A1128" }}>Invite Jerry to Speak</h3>
                    <p style={{ color: "#777", fontSize: "0.95rem", marginBottom: "2rem", lineHeight: 1.7, textAlign: "justify" }}>Jerry is available for conferences, summits, university programmes, church events, and corporate leadership sessions. Fill the form below and our team will be in touch within 48 hours.</p>
                    <form action={formAction} method="POST">
                      <input type="hidden" name="_subject" value="CEO Conference Invitation" />
                      <input type="text" name="Conference_Name" placeholder="Name of Conference / Event" className="contact-input" required />
                      <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.88rem", color: "#555" }}>Event Type</label>
                      <select name="Event_Type" className="contact-input" required>
                        <option value="Physical">Physical</option>
                        <option value="Virtual">Virtual</option>
                      </select>
                      <input type="text" name="Location" placeholder="Location (if Physical)" className="contact-input" />
                      <input type="text" name="Theme" placeholder="Theme of the Event" className="contact-input" required />
                      <input type="text" name="Target_Audience" placeholder="Target Audience" className="contact-input" required />
                      <input type="email" name="Contact_Email" placeholder="Your Email Address" className="contact-input" required />
                      <button type="submit" className="btn-submit btn-submit-navy">Submit Invitation</button>
                      <span className="form-feedback-text">{contactInfoText}</span>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* BOOKING */}
      {view === "booking" && (
        <div>
          <div className="booking-hero">
            <div className="booking-hero-bg" />
            <div className="booking-hero-content">
              <div className="section-label" style={{ color: "#F4D03F", justifyContent: "center", marginBottom: "1rem" }}>Begin Your Journey</div>
              <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.1, marginBottom: "1rem" }}>
                Book a <em style={{ fontStyle: "italic", color: "#F4D03F" }}>Session</em>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: 540, margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.7, textAlign: "justify" }}>
                Step into a collaborative environment designed to help you discover purpose, resolve identity questions, and refine your leadership edge.
              </p>
            </div>
          </div>
          <section style={{ background: "#FFF8F0", padding: "5rem 2rem" }}>
            <div style={{ maxWidth: 580, margin: "0 auto", background: "white", padding: "3.5rem", borderRadius: 28, boxShadow: "0 30px 80px rgba(0,0,0,0.1)" }}>
              <form action={formAction} method="POST">
                <input type="hidden" name="_subject" value="New Coaching Request" />
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.88rem", color: "#555" }}>Type of Session</label>
                <select name="SessionType" className="contact-input" required>
                  <option>Purpose discovery</option>
                  <option>Identity crisis</option>
                  <option>Personal development and transformation</option>
                  <option>Personal Leadership coaching</option>
                  <option>Organizational Leadership coaching</option>
                  <option>Others</option>
                </select>
                <input type="text" name="FullName" placeholder="Full Name" className="contact-input" required />
                <input type="email" name="Email" placeholder="Email Address" className="contact-input" required />
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.88rem", color: "#555" }}>Preferred Date</label>
                <input type="date" name="RequestedDate" className="contact-input" required />
                <button type="submit" className="btn-submit btn-submit-terracotta">Schedule My Session</button>
                <span className="form-feedback-text">{contactInfoText}</span>
              </form>
            </div>
          </section>
        </div>
      )}

      {/* EVENTS */}
      {view === "events" && (
        <section className="page-padding" style={{ background: "#FFF8F0" }}>
          <div className="section-container">
            <div className="section-header">
              <div className="section-label">Programs &amp; Conferences</div>
              <h2 className="section-title">Upcoming Events</h2>
              <p style={{ maxWidth: 500, margin: "0 auto", color: "#666" }}>Join us at our upcoming programmes and be part of a movement raising the next generation of champions.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", maxWidth: 900, margin: "0 auto" }}>
              {events.map((e, i) => (
                <div key={i} className="event-card">
                  <div className="event-date-badge">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "2px", opacity: 0.6, marginBottom: "0.3rem" }}>Upcoming</div>
                      <div className="event-day" style={{ fontSize: "1.6rem", letterSpacing: "1px" }}>{e.quarter}</div>
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {e.tags.map(tag => (
                        <span key={tag} style={{ background: tag === "Virtual" ? "rgba(168,218,220,0.3)" : "rgba(244,208,63,0.25)", color: tag === "Virtual" ? "#A8DADC" : "#F4D03F", padding: "0.25rem 0.7rem", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="event-body">
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", marginBottom: "0.3rem", color: "#0A1128", lineHeight: 1.2 }}>{e.title}</h3>
                    <p style={{ color: "#C86B56", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.5rem", fontStyle: "italic" }}>&ldquo;{e.theme}&rdquo;</p>
                    <p style={{ color: "#888", fontSize: "0.82rem", fontWeight: 600, marginBottom: "1rem" }}>📍 {e.loc}</p>
                    <p style={{ fontSize: "0.92rem", color: "#666", lineHeight: 1.7, textAlign: "justify" }}>{e.desc}</p>
                  </div>
                  <button className="event-register-btn" onClick={() => navigate("booking")}>Register Interest</button>
                </div>
              ))}
            </div>

            {/* PAST EVENTS */}
            <div style={{ marginTop: "6rem" }}>
              <div className="section-header" style={{ marginBottom: "2.5rem" }}>
                <div className="section-label">Our History</div>
                <h2 className="section-title" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>Past Events</h2>
                <p style={{ maxWidth: 500, margin: "0 auto", color: "#666" }}>A record of the programmes, masterclasses, and conferences that have shaped our journey so far.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
                {pastEvents.map((e, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 18px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", opacity: 0.9 }}>
                    <div style={{ background: "linear-gradient(135deg, #3a3a4a, #555568)", color: "white", padding: "1.2rem 1.6rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "2px", opacity: 0.55, marginBottom: "0.2rem" }}>Completed</div>
                        <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.5px" }}>{e.dates}</div>
                      </div>
                      <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                        {e.tags.map(tag => (
                          <span key={tag} style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", padding: "0.2rem 0.6rem", borderRadius: 20, fontSize: "0.65rem", fontWeight: 700 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: "1.5rem 1.6rem", flex: 1 }}>
                      <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.15rem", marginBottom: "0.3rem", color: "#0A1128", lineHeight: 1.2 }}>{e.title}</h3>
                      <p style={{ color: "#C86B56", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.5rem", fontStyle: "italic" }}>&ldquo;{e.theme}&rdquo;</p>
                      <p style={{ color: "#aaa", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.8rem" }}>📍 {e.loc}</p>
                      <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.7, textAlign: "justify" }}>{e.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TEAM */}
      {view === "team" && (
        <section className="page-padding" style={{ background: "white" }}>
          <div className="section-container">
            <div className="section-header">
              <div className="section-label">The Champions</div>
              <h2 className="section-title">Meet Our Team</h2>
              <p style={{ maxWidth: 500, margin: "0 auto", color: "#666" }}>A passionate, purpose-driven team committed to raising transformational leaders.</p>
            </div>
            <div className="team-grid">
              {teamMembers.map((member, i) => (
                <div key={i} className="team-card">
                  <div className="team-avatar-wrap">
                    <img src={member.photo} alt={member.name} className="team-avatar" />
                    <div className="team-avatar-ring" />
                  </div>
                  <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", marginBottom: "0.4rem", color: "#0A1128" }}>{member.name}</h3>
                  <div style={{ color: "#C86B56", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>{member.designation}</div>
                  <p style={{ fontSize: "0.93rem", color: "#666", flexGrow: 1, lineHeight: 1.7, textAlign: "justify" }}>{member.bio}</p>
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noreferrer" style={{ marginTop: "1.2rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#0A1128", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", padding: "0.5rem 1rem", background: "#FFF8F0", borderRadius: 20 }}>
                      <LinkedInIcon /> Connect on LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* VOLUNTEER BANNER */}
            <div style={{ marginTop: "5rem", background: "linear-gradient(135deg, #0A1128, #1a2a5e)", borderRadius: 28, padding: "4rem 3rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
              {/* decorative circles */}
              <div style={{ position: "absolute", top: "-60px", right: "-60px", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,208,63,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,107,86,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div className="section-label" style={{ color: "#F4D03F", justifyContent: "center", marginBottom: "1.2rem" }}>Join the Team</div>
                <h2 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem" }}>
                  Volunteer With Us &mdash;<br />
                  <em style={{ fontStyle: "italic", color: "#F4D03F" }}>Deploy Your Skill for Impact</em>
                </h2>
                <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: 560, margin: "0 auto 2.5rem", fontSize: "1rem", lineHeight: 1.8, textAlign: "justify" }}>
                  Do you have a gift — in design, writing, media, logistics, speaking, technology, or anything in between? We are always looking for passionate individuals who want to put their skills to work for a cause greater than themselves. Come build with us.
                </p>
                <a
                  href="https://wa.me/2348107772854"
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem", background: "linear-gradient(135deg, #F4D03F, #e8c020)", color: "#0A1128", padding: "1rem 2.5rem", borderRadius: 50, fontWeight: 800, fontSize: "1rem", textDecoration: "none", boxShadow: "0 8px 25px rgba(244,208,63,0.35)", transition: "transform 0.2s, box-shadow 0.2s", fontFamily: "DM Sans, sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 35px rgba(244,208,63,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(244,208,63,0.35)"; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.852L.057 23.571a.75.75 0 00.921.921l5.719-1.475A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.726 9.726 0 01-4.95-1.352l-.354-.212-3.664.944.964-3.546-.232-.368A9.715 9.715 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                  </svg>
                  Chat Us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BLOG LIST */}
      {view === "blog" && !selectedPost && (
        <section className="page-padding" style={{ background: "#FFF8F0" }}>
          <div className="section-container">
            <div className="section-header">
              <div className="section-label">Insights &amp; Wisdom</div>
              <h2 className="section-title">Leadership Blog</h2>
              <p style={{ maxWidth: 500, margin: "0 auto", color: "#666" }}>Practical wisdom, purpose-driven insights, and leadership truths for the champion in you.</p>
            </div>
            <div className="blog-grid">
              {blogPosts.map((post, i) => (
                <div key={i} className="blog-card" style={{ cursor: "pointer" }} onClick={() => navigate("blog", post)}>
                  <div className="blog-img-wrap">
                    <img src={post.img} alt={post.title} className="blog-img" />
                  </div>
                  <div style={{ padding: "1.8rem" }}>
                    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "0.8rem" }}>
                      <span style={{ background: "#FFF8F0", color: "#C86B56", padding: "0.2rem 0.7rem", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700 }}>{post.category}</span>
                      <span style={{ color: "#aaa", fontSize: "0.78rem" }}>{post.readTime}</span>
                    </div>
                    <div style={{ color: "#C86B56", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.5rem" }}>{post.date}</div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.35rem", marginBottom: "0.8rem", color: "#0A1128" }}>{post.title}</h3>
                    <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1.2rem", lineHeight: 1.7, textAlign: "justify" }}>{post.excerpt}</p>
                    <span style={{ color: "#0A1128", fontWeight: 800, fontSize: "0.88rem" }}>Read Article &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BLOG ARTICLE */}
      {view === "blog" && selectedPost && (
        <section className="page-padding" style={{ background: "white" }}>
          <div className="section-container">
            <div style={{ maxWidth: 780, margin: "0 auto" }}>
              <button onClick={() => navigate("blog")} style={{ background: "none", border: "none", cursor: "pointer", color: "#C86B56", fontWeight: 700, marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "inherit", fontSize: "0.9rem", padding: 0 }}>
                &larr; Back to Blog
              </button>
              <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1.5rem", alignItems: "center" }}>
                <span style={{ background: "#FFF8F0", color: "#C86B56", padding: "0.3rem 0.8rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700 }}>{selectedPost.category}</span>
                <span style={{ color: "#aaa", fontSize: "0.8rem" }}>{selectedPost.readTime}</span>
                <span style={{ color: "#aaa", fontSize: "0.8rem" }}>&middot; {selectedPost.date}</span>
              </div>
              <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#0A1128", lineHeight: 1.1, marginBottom: "2rem" }}>{selectedPost.title}</h1>
              <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: "3rem", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
                <img src={selectedPost.img} alt={selectedPost.title} style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }} />
              </div>
              <div className="article-content">
                {renderArticleContent(selectedPost.fullContent)}
              </div>
              <div style={{ marginTop: "4rem", padding: "2.5rem", background: "#FFF8F0", borderRadius: 20, textAlign: "center" }}>
                <p style={{ fontWeight: 700, color: "#0A1128", marginBottom: "0.5rem", textAlign: "center" }}>
                  {selectedPost.ctaHeading || "Ready to start your leadership journey?"}
                </p>
                <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1.2rem", textAlign: "center" }}>
                  {selectedPost.ctaSub || "Book a clarity session and take the next step."}
                </p>
                <button onClick={() => navigate("booking")} className="btn-primary">Book a Session</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="CLG Logo" style={{ width: 60, height: 60, borderRadius: "50%", background: "white", padding: 4 }} />
              <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem" }}>Champions&apos; Leadership Global</span>
            </div>
            <p style={{ opacity: 0.55, fontSize: "0.9rem", lineHeight: 1.8, maxWidth: 340 }}>Empowering individuals to discover their purpose and lead with lasting, generational impact.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "0.85rem", letterSpacing: "2px", textTransform: "uppercase", color: "#F4D03F" }}>Navigation</h4>
            {[["Home","home"],["Meet the CEO","ceo"],["Events","events"],["Team","team"],["Blog","blog"],["Book a Session","booking"]].map(item => (
              <div key={item[1]} style={{ marginBottom: "0.8rem" }}>
                <a href="#!" onClick={e => { e.preventDefault(); navigate(item[1]); }} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.9rem", cursor: "pointer" }}>{item[0]}</a>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "0.85rem", letterSpacing: "2px", textTransform: "uppercase", color: "#F4D03F" }}>Contact</h4>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "0.8rem" }}>✉ championscorner27@gmail.com</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "2rem" }}>📞 +234 906 414 4546</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p style={{ opacity: 0.35, fontSize: "0.85rem" }}>&copy; 2026 Champions&apos; Leadership Global. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
