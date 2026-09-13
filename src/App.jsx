import React, { useEffect, useState } from "react";
import { defaultSiteData } from "./defaultSiteData";
import WebsiteManager from "./components/WebsiteManager";
import AdminLogin from "./components/AdminLogin";

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
    width: 60px; height: 60px; border-radius: 50%;
    background: white; padding: 3px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    object-fit: contain;
    transition: transform 0.3s;
  }
  .logo:hover .logo-img { transform: rotate(-5deg) scale(1.05); }

  .nav-links { display: flex; gap: 1.2rem; list-style: none; align-items: center; }
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

  .nav-manager-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: #0A1128 !important; color: #F4D03F !important;
    padding: 0.55rem 1.1rem !important; border-radius: 50px !important;
    font-weight: 700 !important; font-size: 0.82rem !important;
    border: 1px solid rgba(244,208,63,0.4) !important;
    cursor: pointer; text-decoration: none;
    box-shadow: 0 3px 12px rgba(10,17,40,0.2) !important;
    transition: all 0.2s ease !important;
  }
  .nav-manager-btn:hover {
    background: #1a2a5e !important;
    border-color: #F4D03F !important;
    transform: translateY(-2px);
  }
  .nav-manager-btn::after { display: none !important; }

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
    gap: 2rem; animation: fadeIn 0.25s ease;
  }
  .mobile-menu.open { display: flex; }
  .mobile-menu a {
    color: white; text-decoration: none; font-size: 1.5rem;
    font-family: 'Playfair Display', serif; font-weight: 700;
    transition: color 0.2s; cursor: pointer;
  }
  .mobile-menu a:hover, .mobile-menu a.active { color: #F4D03F; }
  .mobile-book-btn {
    background: linear-gradient(135deg, #C86B56, #a8553f) !important;
    padding: 0.8rem 2rem !important; border-radius: 50px !important;
    font-size: 1rem !important; font-family: 'DM Sans', sans-serif !important;
  }
  .mobile-manager-btn {
    background: #F4D03F !important; color: #0A1128 !important;
    padding: 0.8rem 2rem !important; border-radius: 50px !important;
    font-size: 1rem !important; font-family: 'DM Sans', sans-serif !important;
    font-weight: 800 !important;
  }

  .hero {
    position: relative; min-height: 100vh;
    display: flex; align-items: center; overflow: hidden;
    background: #0A1128;
  }
  .hero-bg {
    position: absolute; inset: 0;
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
    font-size: clamp(2.2rem, 6vw, 5.5rem); font-weight: 900; color: white;
    line-height: 1.08; margin-bottom: 1.8rem; max-width: 850px;
  }
  .hero-title em {
    font-style: italic;
    background: linear-gradient(135deg, #F4D03F, #f0b429);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero-sub {
    color: rgba(255,255,255,0.85); font-size: 1.15rem;
    max-width: 560px; margin-bottom: 1rem; font-weight: 300; line-height: 1.7;
  }
  .hero-quote {
    color: rgba(255,255,255,0.6); font-size: 0.98rem;
    font-style: italic; font-family: 'Playfair Display', serif;
    max-width: 560px; margin-bottom: 3rem; line-height: 1.6;
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
    animation: marquee 25s linear infinite; width: max-content;
  }
  .marquee-item {
    color: rgba(255,255,255,0.6); font-size: 0.8rem;
    letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
  }
  .marquee-dot { color: var(--gold); }

  .page-padding { padding: 9rem 2rem 5rem 2rem; min-height: 80vh; }
  .home-section { padding: 6.5rem 2rem; }
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
    width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--navy), #1a2a5e);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
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
    content: '\\201C'; position: absolute; top: -2rem; left: 2rem;
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

// ── REVIEWS SECTION COMPONENT ─────────────────────────────────
function ReviewsSection({ reviewsData, onAddReview }) {
  const reviews = reviewsData?.items || [];
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
        id: `rev-${Date.now()}`,
        name: form.name.trim(),
        role: form.role.trim() || "Community Member",
        rating: form.rating,
        text: form.text.trim(),
        isNew: true,
      };
      if (onAddReview) {
        onAddReview(newReview);
      }
      setSubmitted(true);
      setSubmitting(false);
    }, 400);
  };

  const initials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <section className="reviews-section">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label" style={{ color: "#F4D03F", justifyContent: "center" }}>
            {reviewsData.label || "Community Voices"}
          </div>
          <h2 className="section-title" style={{ color: "white" }}>
            {reviewsData.title || "What Champions"}{" "}
            <em style={{ fontStyle: "italic", color: "#F4D03F" }}>
              {reviewsData.titleHighlight || "Are Saying"}
            </em>
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.8rem", marginTop: "0.5rem" }}>
            <div style={{ display: "flex", gap: "3px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} style={{ color: "#F4D03F", fontSize: "1.1rem" }}>★</span>
              ))}
            </div>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
              {avgRating} average · {reviews.length} reviews
            </span>
          </div>
        </div>

        <div className="reviews-grid">
          {reviews.map((r, i) => (
            <div key={r.id || i} className={"review-card" + (r.isNew ? " review-new" : "")}>
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="review-star">{s <= r.rating ? "★" : "☆"}</span>
                ))}
              </div>
              <p className="review-text">&ldquo;{r.text}&rdquo;</p>
              <div className="review-author">
                <div className="review-avatar">{initials(r.name || "Champion")}</div>
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
                Your review has been added to the community wall above.
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", role: "", text: "", rating: 5 });
                }}
                style={{ marginTop: "1.5rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", padding: "0.6rem 1.5rem", borderRadius: 20, cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" }}
              >
                Write another review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="review-form-title">Share Your Experience</h3>
              <p className="review-form-sub">Has CLG impacted your journey? We&apos;d love to hear from you.</p>
              <div style={{ marginBottom: "0.5rem" }}>
                <label style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Your Rating</label>
              </div>
              <div className="star-selector" onMouseLeave={() => setHoverStar(0)}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={"star-btn " + (s <= (hoverStar || form.rating) ? "star-active" : "star-inactive")}
                    onMouseEnter={() => setHoverStar(s)}
                    onClick={() => setForm((f) => ({ ...f, rating: s }))}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <input
                  className="review-input"
                  placeholder="Your Full Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <input
                  className="review-input"
                  placeholder="Role / City (optional)"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                />
              </div>
              <textarea
                className="review-input"
                placeholder="Tell us how CLG impacted your journey…"
                style={{ height: 120, resize: "none" }}
                required
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
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

const isManagerRoute = (val) => {
  if (!val) return false;
  const decoded = decodeURIComponent(val).toLowerCase().trim();
  return (
    decoded === "/web manager" ||
    decoded === "web manager" ||
    decoded === "/web-manager" ||
    decoded === "web-manager" ||
    decoded === "/webmanager" ||
    decoded === "webmanager" ||
    decoded === "/manager" ||
    decoded === "manager" ||
    decoded === "/admin" ||
    decoded === "admin"
  );
};

const getViewFromLocation = () => {
  if (typeof window === "undefined") return "home";

  // 1. Check pathname (e.g., /web manager or /web-manager)
  const pathname = window.location.pathname;
  if (isManagerRoute(pathname)) {
    return "manager";
  }

  // 2. Check hash
  const rawHash = window.location.hash.replace("#", "").split("/")[0];
  if (isManagerRoute(rawHash)) {
    return "manager";
  }

  const valid = ["home", "ceo", "events", "team", "blog", "booking"];
  return valid.includes(rawHash) ? rawHash : "home";
};

const getSlugFromHash = () => {
  if (typeof window === "undefined") return null;
  const parts = window.location.hash.replace("#", "").split("/");
  return parts[1] || null;
};

export default function App() {
  // Load site data from localStorage with fallback to defaultSiteData
  const loadInitialData = () => {
    try {
      const saved = localStorage.getItem("clg_site_content_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSiteData,
          ...parsed,
          branding: { ...defaultSiteData.branding, ...(parsed.branding || {}) },
          hero: { ...defaultSiteData.hero, ...(parsed.hero || {}) },
          statsSection: { ...defaultSiteData.statsSection, ...(parsed.statsSection || {}) },
          aboutSection: { ...defaultSiteData.aboutSection, ...(parsed.aboutSection || {}) },
          coreValues: { ...defaultSiteData.coreValues, ...(parsed.coreValues || {}) },
          ceoSection: { ...defaultSiteData.ceoSection, ...(parsed.ceoSection || {}) },
          eventsSection: { ...defaultSiteData.eventsSection, ...(parsed.eventsSection || {}) },
          teamSection: { ...defaultSiteData.teamSection, ...(parsed.teamSection || {}) },
          blogSection: { ...defaultSiteData.blogSection, ...(parsed.blogSection || {}) },
          reviewsSection: { ...defaultSiteData.reviewsSection, ...(parsed.reviewsSection || {}) },
          bookingSection: { ...defaultSiteData.bookingSection, ...(parsed.bookingSection || {}) },
        };
      }
    } catch (e) {
      console.warn("Could not load from localStorage, using defaults", e);
    }
    return defaultSiteData;
  };

  const [siteData, setSiteData] = useState(loadInitialData);

  // Synchronize site data updates and persist to localStorage
  const handleSiteDataChange = (newData) => {
    setSiteData(newData);
    try {
      localStorage.setItem("clg_site_content_v1", JSON.stringify(newData));
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  const handleSaveSiteData = () => {
    try {
      localStorage.setItem("clg_site_content_v1", JSON.stringify(siteData));
    } catch (e) {
      console.error("Manual save failed:", e);
    }
  };

  const handleResetSiteData = () => {
    setSiteData(defaultSiteData);
    try {
      localStorage.removeItem("clg_site_content_v1");
    } catch (e) {}
  };

  // ── AUTHENTICATION ───────────────
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem("clg_admin_authenticated") === "true";
    } catch (e) {
      return false;
    }
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem("clg_admin_authenticated", "true");
    } catch (e) {}
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem("clg_admin_authenticated");
    } catch (e) {}
    navigate("home");
  };

  const [view, setView] = useState(getViewFromLocation);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedPost, setSelectedPost] = useState(() => {
    const slug = getSlugFromHash();
    if (slug) {
      return (
        siteData.blogSection.posts.find(
          (p) => p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
        ) || null
      );
    }
    return null;
  });

  useEffect(() => {
    const onLocationChange = () => {
      const v = getViewFromLocation();
      const slug = getSlugFromHash();
      setView(v);
      setSelectedPost(
        slug
          ? siteData.blogSection.posts.find(
              (p) => p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
            ) || null
          : null
      );
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onLocationChange);
    window.addEventListener("popstate", onLocationChange);
    return () => {
      window.removeEventListener("hashchange", onLocationChange);
      window.removeEventListener("popstate", onLocationChange);
    };
  }, [siteData]);

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
    if (v === "manager") {
      try {
        window.history.pushState(null, "", "/web-manager");
      } catch (e) {
        window.location.hash = "web-manager";
      }
    } else if (post) {
      const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      try {
        window.history.pushState(null, "", "/");
      } catch (e) {}
      window.location.hash = `${v}/${slug}`;
    } else {
      try {
        window.history.pushState(null, "", "/");
      } catch (e) {}
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

  // Parse article content with markdown headings
  const renderArticleContent = (content) => {
    if (!content) return null;
    return content
      .trim()
      .split("\n\n")
      .map((block, i) => {
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

  // If in Website Manager mode, check authentication
  if (view === "manager") {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => navigate("home")}
          logoUrl={siteData.branding.logoUrl}
        />
      );
    }

    return (
      <WebsiteManager
        data={siteData}
        onChange={handleSiteDataChange}
        onSave={handleSaveSiteData}
        onReset={handleResetSiteData}
        onClose={() => navigate("home")}
        onLogout={handleLogout}
      />
    );
  }

  const {
    branding,
    hero,
    statsSection,
    aboutSection,
    coreValues,
    ceoSection,
    eventsSection,
    teamSection,
    blogSection,
    reviewsSection,
    bookingSection,
  } = siteData;

  return (
    <div>
      {/* FLOATING MANAGER DASHBOARD BUTTON */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
        }}
      >
        <button
          type="button"
          onClick={() => navigate("manager")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#0A1128",
            color: "#F4D03F",
            border: "2px solid #F4D03F",
            padding: "10px 18px",
            borderRadius: "50px",
            fontWeight: "800",
            fontSize: "0.85rem",
            boxShadow: "0 8px 30px rgba(10,17,40,0.5)",
            cursor: "pointer",
            fontFamily: "DM Sans, sans-serif",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.background = "#14214d";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "#0A1128";
          }}
          title="Open Website Manager Dashboard to edit text and pictures"
        >
          <span style={{ fontSize: "1.1rem" }}>⚙️</span>
          <span>Website Manager</span>
        </button>
      </div>

      {/* NAVBAR */}
      <nav className={"navbar" + (scrolled ? " scrolled" : "")}>
        <div className="nav-container">
          <div className="logo" onClick={() => navigate("home")}>
            <img src={branding.logoUrl} alt="CLG Logo" className="logo-img" />
            <span>{branding.name}</span>
          </div>
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.key}>
                <a
                  href="#!"
                  className={view === item.key ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.key);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#!"
                className={"nav-book-btn" + (view === "booking" ? " active" : "")}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("booking");
                }}
              >
                Book a Session
              </a>
            </li>
            <li>
              <button
                type="button"
                className="nav-manager-btn"
                onClick={() => navigate("manager")}
                title="Edit all website text and pictures"
              >
                <span>⚙️</span> Edit Site
              </button>
            </li>
          </ul>
          <button
            className={"hamburger" + (menuOpen ? " open" : "")}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={"mobile-menu" + (menuOpen ? " open" : "")}>
        {navItems.map((item) => (
          <a
            key={item.key}
            href="#!"
            className={view === item.key ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.key);
            }}
          >
            {item.label}
          </a>
        ))}
        <a
          href="#!"
          className="mobile-book-btn"
          onClick={(e) => {
            e.preventDefault();
            navigate("booking");
          }}
        >
          Book a Session
        </a>
        <a
          href="#!"
          className="mobile-manager-btn"
          onClick={(e) => {
            e.preventDefault();
            navigate("manager");
          }}
        >
          ⚙️ Website Manager
        </a>
      </div>

      {/* HOME VIEW */}
      {view === "home" && (
        <div>
          {/* HERO */}
          <section className="hero">
            <div
              className="hero-bg"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(10,17,40,0.88) 0%, rgba(10,17,40,0.6) 60%, rgba(200,107,86,0.3) 100%), url('${hero.bgImage}')`,
              }}
            />
            <div className="hero-content">
              <div className="hero-eyebrow">{hero.eyebrow}</div>
              <h1 className="hero-title">
                {hero.titleLine1}
                <br />
                <em>{hero.titleHighlight}</em>
                <br />
                {hero.titleLine3}
              </h1>
              <p className="hero-sub">{hero.sub}</p>
              {hero.quote && (
                <p className="hero-quote">
                  &ldquo;{hero.quote}&rdquo; &mdash; {hero.quoteAuthor}
                </p>
              )}
              <div className="hero-cta-row">
                <button
                  className="btn-primary"
                  onClick={() => {
                    const el = document.getElementById("about-us");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {hero.primaryBtnText}
                </button>
                <button className="btn-outline" onClick={() => navigate("booking")}>
                  {hero.secondaryBtnText}
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
              {[...hero.marqueeItems, ...hero.marqueeItems, ...hero.marqueeItems].map((t, i) => (
                <span key={i} className="marquee-item">
                  {t} <span className="marquee-dot">&bull;</span>{" "}
                </span>
              ))}
            </div>
          </div>

          {/* STATS */}
          <section
            style={{
              background: "#0A1128",
              padding: "6rem 2rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-80px",
                left: "-80px",
                width: 320,
                height: 320,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(244,208,63,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-60px",
                right: "-60px",
                width: 280,
                height: 280,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(200,107,86,0.1) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
              <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <div
                  className="section-label"
                  style={{ color: "#F4D03F", justifyContent: "center", marginBottom: "0.8rem" }}
                >
                  {statsSection.label}
                </div>
                <h2
                  style={{
                    fontFamily: "Playfair Display, serif",
                    color: "white",
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    fontWeight: 900,
                    lineHeight: 1.1,
                  }}
                >
                  {statsSection.title}{" "}
                  <em style={{ fontStyle: "italic", color: "#F4D03F" }}>
                    {statsSection.titleHighlight}
                  </em>
                </h2>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {statsSection.items.map((s, i) => (
                  <div
                    key={s.id || i}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 24,
                      padding: "2.5rem 2rem",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                      transition: "transform 0.3s, background 0.3s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 48,
                        height: 3,
                        background:
                          i % 2 === 0
                            ? "linear-gradient(90deg, #F4D03F, #e8c020)"
                            : "linear-gradient(90deg, #C86B56, #a8553f)",
                        borderRadius: "0 0 4px 4px",
                      }}
                    />
                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{s.icon}</div>
                    <div
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: "clamp(3rem, 6vw, 4rem)",
                        fontWeight: 900,
                        lineHeight: 1,
                        marginBottom: "0.4rem",
                      }}
                    >
                      <span style={{ color: "white" }}>{s.num}</span>
                      <span style={{ color: i % 2 === 0 ? "#F4D03F" : "#C86B56" }}>
                        {s.suffix}
                      </span>
                    </div>
                    <div
                      style={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        marginBottom: "0.6rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.45)",
                        fontSize: "0.82rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {s.desc}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: "4rem",
                  padding: "2.5rem 3rem",
                  background: "rgba(244,208,63,0.06)",
                  border: "1px solid rgba(244,208,63,0.15)",
                  borderRadius: 20,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <p style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.3rem" }}>
                    {statsSection.bannerTitle}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
                    {statsSection.bannerSub}
                  </p>
                </div>
                <button
                  onClick={() => navigate("booking")}
                  className="btn-primary"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {statsSection.bannerBtnText}
                </button>
              </div>
            </div>
          </section>

          {/* ABOUT US */}
          <section id="about-us" className="home-section" style={{ background: "white" }}>
            <div className="section-container">
              <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <div className="section-label">{aboutSection.label}</div>
                <h2 className="section-title">{aboutSection.title}</h2>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "4rem",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ fontSize: "1.05rem", color: "#555", lineHeight: 1.9 }}>
                  <p style={{ marginBottom: "1.5rem", textAlign: "justify" }}>{aboutSection.p1}</p>
                  <p style={{ marginBottom: "1.5rem", textAlign: "justify" }}>{aboutSection.p2}</p>
                  <p style={{ marginBottom: "1.5rem", textAlign: "justify" }}>{aboutSection.p3}</p>
                  {aboutSection.quote && (
                    <blockquote className="about-quote">{aboutSection.quote}</blockquote>
                  )}
                </div>
                <div>
                  <div
                    style={{
                      background: "linear-gradient(135deg, #0A1128, #1a2a5e)",
                      color: "white",
                      padding: "3rem",
                      borderRadius: 28,
                      marginBottom: "1.5rem",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: "1.5rem",
                        marginBottom: "1rem",
                        color: "#F4D03F",
                      }}
                    >
                      {aboutSection.visionTitle}
                    </h3>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        lineHeight: 1.8,
                        fontSize: "1.05rem",
                        textAlign: "justify",
                      }}
                    >
                      {aboutSection.visionDesc}
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#FFF8F0",
                      padding: "2.5rem",
                      borderRadius: 28,
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: "1.5rem",
                        marginBottom: "1rem",
                        color: "#0A1128",
                      }}
                    >
                      {aboutSection.missionTitle}
                    </h3>
                    <p
                      style={{
                        color: "#555",
                        lineHeight: 1.8,
                        fontSize: "1.05rem",
                        textAlign: "justify",
                      }}
                    >
                      {aboutSection.missionDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CORE VALUES */}
          <section className="home-section" style={{ background: "#FFF8F0" }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-label">{coreValues.label}</div>
                <h2 className="section-title">{coreValues.title}</h2>
                <p
                  style={{
                    maxWidth: 560,
                    margin: "0 auto",
                    color: "#666",
                    lineHeight: 1.7,
                    textAlign: "justify",
                  }}
                >
                  {coreValues.subtitle}
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {coreValues.items.map((v, i) => (
                  <div key={v.id || i} className="value-card">
                    <div className="value-icon">✨</div>
                    <div>
                      <h4
                        style={{
                          fontFamily: "Playfair Display, serif",
                          fontSize: "1.1rem",
                          color: "#0A1128",
                          marginBottom: "0.4rem",
                        }}
                      >
                        {v.title}
                      </h4>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "#666",
                          lineHeight: 1.7,
                          textAlign: "justify",
                        }}
                      >
                        {v.desc}
                      </p>
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
                <div className="section-label" style={{ color: "#F4D03F" }}>
                  {ceoSection.homeLabel}
                </div>
                <h2 className="section-title" style={{ color: "white" }}>
                  {ceoSection.homeTitle}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto" }}>
                  {ceoSection.homeSubtitle}
                </p>
              </div>
              <div className="video-wrapper">
                <iframe
                  width="100%"
                  height="100%"
                  src={ceoSection.videoUrl}
                  title="CEO Welcome Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                <button
                  onClick={() => navigate("ceo")}
                  style={{
                    background: "transparent",
                    border: "2px solid rgba(255,255,255,0.3)",
                    color: "white",
                    padding: "0.9rem 2rem",
                    borderRadius: 50,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.95rem",
                  }}
                >
                  Read Full Bio &rarr;
                </button>
              </div>
            </div>
          </section>

          {/* REVIEWS */}
          <ReviewsSection
            reviewsData={reviewsSection}
            onAddReview={(newReview) => {
              const updatedItems = [newReview, ...reviewsSection.items];
              handleSiteDataChange({
                ...siteData,
                reviewsSection: {
                  ...reviewsSection,
                  items: updatedItems,
                },
              });
            }}
          />

          {/* BLOG PREVIEW */}
          {blogSection.posts.length > 0 && (
            <section className="home-section" style={{ background: "white" }}>
              <div className="section-container">
                <div className="section-header">
                  <div className="section-label">Latest Insight</div>
                  <h2 className="section-title">From the Blog</h2>
                </div>
                <div style={{ maxWidth: 950, margin: "0 auto" }}>
                  <div
                    className="blog-card"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                      borderRadius: 24,
                    }}
                  >
                    <div className="blog-img-wrap">
                      <img
                        src={blogSection.posts[0].img}
                        alt="Latest post"
                        style={{ width: "100%", height: "100%", minHeight: 320, objectFit: "cover" }}
                      />
                    </div>
                    <div
                      style={{
                        padding: "3rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "0.8rem",
                          marginBottom: "1rem",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            background: "#FFF8F0",
                            color: "#C86B56",
                            padding: "0.3rem 0.8rem",
                            borderRadius: 20,
                            fontSize: "0.75rem",
                            fontWeight: 700,
                          }}
                        >
                          {blogSection.posts[0].category}
                        </span>
                        <span style={{ color: "#aaa", fontSize: "0.8rem" }}>
                          {blogSection.posts[0].readTime}
                        </span>
                      </div>
                      <div style={{ color: "#C86B56", fontWeight: 700, fontSize: "0.85rem" }}>
                        {blogSection.posts[0].date}
                      </div>
                      <h3
                        style={{
                          fontFamily: "Playfair Display, serif",
                          fontSize: "2rem",
                          margin: "0.8rem 0",
                          color: "#0A1128",
                        }}
                      >
                        {blogSection.posts[0].title}
                      </h3>
                      <p
                        style={{
                          opacity: 0.75,
                          marginBottom: "1.8rem",
                          lineHeight: 1.7,
                          textAlign: "justify",
                        }}
                      >
                        {blogSection.posts[0].excerpt}
                      </p>
                      <button
                        onClick={() => navigate("blog", blogSection.posts[0])}
                        style={{
                          background: "#0A1128",
                          color: "white",
                          padding: "0.9rem 1.8rem",
                          borderRadius: 10,
                          border: "none",
                          fontWeight: 700,
                          cursor: "pointer",
                          alignSelf: "flex-start",
                          fontFamily: "inherit",
                        }}
                      >
                        Read Full Article
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* CONTACT */}
          <section id="contact" className="home-section" style={{ background: "#FFF8F0" }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-label">Connect</div>
                <h2 className="section-title">Contact Us</h2>
                <p style={{ maxWidth: 500, margin: "0 auto", color: "#666" }}>
                  Have a question, collaboration idea, or just want to reach out? We would love to hear from you.
                </p>
              </div>
              <div
                style={{
                  maxWidth: 800,
                  margin: "0 auto",
                  background: "white",
                  padding: "3.5rem",
                  borderRadius: 30,
                  boxShadow: "0 10px 50px rgba(0,0,0,0.07)",
                }}
              >
                <form action={branding.formAction} method="POST">
                  <input type="hidden" name="_subject" value="New Website Message" />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1rem",
                    }}
                  >
                    <input
                      type="text"
                      name="Name"
                      placeholder="Full Name"
                      className="contact-input"
                      required
                    />
                    <input
                      type="email"
                      name="Email"
                      placeholder="Email Address"
                      className="contact-input"
                      required
                    />
                  </div>
                  <textarea
                    name="Message"
                    placeholder="Your Message"
                    className="contact-input"
                    style={{ height: 150, resize: "none" }}
                    required
                  />
                  <button type="submit" className="btn-submit btn-submit-navy">
                    Send Message
                  </button>
                  <span className="form-feedback-text">
                    {branding.email} · {branding.phone}
                  </span>
                </form>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* CEO PAGE */}
      {view === "ceo" && (
        <div>
          <div style={{ background: "#0A1128", padding: "120px 2rem 4rem", textAlign: "center" }}>
            <div
              className="section-label"
              style={{ justifyContent: "center", color: "#F4D03F", marginBottom: "1rem" }}
            >
              {ceoSection.pageBannerLabel}
            </div>
            <h1
              style={{
                fontFamily: "Playfair Display, serif",
                color: "white",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                lineHeight: 1.1,
              }}
            >
              {ceoSection.pageBannerTitle}{" "}
              <em style={{ fontStyle: "italic", color: "#F4D03F" }}>
                {ceoSection.pageBannerHighlight}
              </em>
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                marginTop: "1rem",
                fontSize: "1.05rem",
                textAlign: "center",
              }}
            >
              {ceoSection.pageBannerSubtitle}
            </p>
          </div>

          <section className="page-padding" style={{ background: "white", marginTop: "-40px" }}>
            <div className="section-container">
              <div className="ceo-grid">
                <div>
                  <div
                    style={{
                      borderRadius: 28,
                      overflow: "hidden",
                      boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
                    }}
                  >
                    <img
                      src={ceoSection.photo}
                      alt={ceoSection.name}
                      style={{ width: "100%", display: "block" }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: "1.5rem",
                      padding: "2rem",
                      background: "#0A1128",
                      color: "white",
                      borderRadius: 20,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: "2rem",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {ceoSection.name}
                    </h3>
                    <p style={{ color: "#F4D03F", fontWeight: 600, marginBottom: "1.2rem" }}>
                      {ceoSection.title}
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {ceoSection.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            padding: "0.3rem 0.8rem",
                            borderRadius: 20,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "1.5rem",
                      padding: "2rem",
                      background: "#FFF8F0",
                      borderRadius: 20,
                    }}
                  >
                    <h4
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: "1rem",
                        color: "#0A1128",
                        marginBottom: "1.5rem",
                      }}
                    >
                      Academic Qualifications
                    </h4>
                    {ceoSection.degrees.map((d, i) => (
                      <div
                        key={d.id || i}
                        style={{
                          marginBottom: "1rem",
                          paddingBottom: "1rem",
                          borderBottom:
                            i < ceoSection.degrees.length - 1
                              ? "1px solid rgba(0,0,0,0.06)"
                              : "none",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "0.88rem",
                            color: "#0A1128",
                            marginBottom: "0.2rem",
                          }}
                        >
                          {d.degree}
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "#666", marginBottom: "0.4rem" }}>
                          {d.school}
                        </div>
                        <span
                          style={{
                            background:
                              d.status === "Ongoing"
                                ? "rgba(200,107,86,0.12)"
                                : "rgba(10,17,40,0.08)",
                            color: d.status === "Ongoing" ? "#C86B56" : "#0A1128",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "0.2rem 0.6rem",
                            borderRadius: 20,
                          }}
                        >
                          {d.status}
                        </span>
                      </div>
                    ))}
                    <h4
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: "1rem",
                        color: "#0A1128",
                        margin: "1.5rem 0 1rem",
                      }}
                    >
                      Certifications
                    </h4>
                    {ceoSection.certifications.map((c, i) => (
                      <div
                        key={c.id || i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.6rem",
                          marginBottom: "0.9rem",
                        }}
                      >
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "#C86B56",
                            flexShrink: 0,
                            marginTop: "0.35rem",
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              color: "#333",
                              lineHeight: 1.4,
                              marginBottom: "0.15rem",
                            }}
                          >
                            {c.cert}
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "#888" }}>{c.school}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div
                    className="section-label"
                    style={{ marginBottom: "0.5rem", justifyContent: "flex-start" }}
                  >
                    Biography
                  </div>
                  <h2
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontSize: "2.5rem",
                      color: "#0A1128",
                      marginBottom: "2rem",
                      lineHeight: 1.2,
                    }}
                  >
                    A Life Defined
                    <br />
                    by Purpose
                  </h2>
                  <div style={{ fontSize: "1.05rem", color: "#444", lineHeight: 1.9 }}>
                    <p style={{ marginBottom: "1.5rem", textAlign: "justify" }}>
                      {ceoSection.bioIntro1}
                    </p>
                    <p style={{ marginBottom: "1.5rem", textAlign: "justify" }}>
                      {ceoSection.bioIntro2}
                    </p>
                    {ceoSection.quote && (
                      <blockquote className="about-quote" style={{ margin: "2rem 0" }}>
                        &ldquo;{ceoSection.quote}&rdquo;
                      </blockquote>
                    )}
                    {ceoSection.bioSections.map(({ heading, paras }, hi) => (
                      <div key={hi}>
                        <h3
                          style={{
                            fontFamily: "Playfair Display, serif",
                            fontSize: "1.6rem",
                            color: "#0A1128",
                            margin: "2.5rem 0 1rem",
                          }}
                        >
                          {heading}
                        </h3>
                        {paras.map((p, pi) => (
                          <p key={pi} style={{ marginBottom: "1.5rem", textAlign: "justify" }}>
                            {p}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: "3.5rem",
                      padding: "3rem",
                      background: "#FFF8F0",
                      borderRadius: 28,
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      className="section-label"
                      style={{ justifyContent: "flex-start", marginBottom: "0.5rem" }}
                    >
                      Invitations
                    </div>
                    <h3
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: "1.8rem",
                        marginBottom: "0.5rem",
                        color: "#0A1128",
                      }}
                    >
                      {ceoSection.invitationTitle}
                    </h3>
                    <p
                      style={{
                        color: "#777",
                        fontSize: "0.95rem",
                        marginBottom: "2rem",
                        lineHeight: 1.7,
                        textAlign: "justify",
                      }}
                    >
                      {ceoSection.invitationDesc}
                    </p>
                    <form action={branding.formAction} method="POST">
                      <input type="hidden" name="_subject" value="CEO Conference Invitation" />
                      <input
                        type="text"
                        name="Conference_Name"
                        placeholder="Name of Conference / Event"
                        className="contact-input"
                        required
                      />
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.4rem",
                          fontWeight: 700,
                          fontSize: "0.88rem",
                          color: "#555",
                        }}
                      >
                        Event Type
                      </label>
                      <select name="Event_Type" className="contact-input" required>
                        <option value="Physical">Physical</option>
                        <option value="Virtual">Virtual</option>
                      </select>
                      <input
                        type="text"
                        name="Location"
                        placeholder="Location (if Physical)"
                        className="contact-input"
                      />
                      <input
                        type="text"
                        name="Theme"
                        placeholder="Theme of the Event"
                        className="contact-input"
                        required
                      />
                      <input
                        type="text"
                        name="Target_Audience"
                        placeholder="Target Audience"
                        className="contact-input"
                        required
                      />
                      <input
                        type="email"
                        name="Contact_Email"
                        placeholder="Your Email Address"
                        className="contact-input"
                        required
                      />
                      <button type="submit" className="btn-submit btn-submit-navy">
                        Submit Invitation
                      </button>
                      <span className="form-feedback-text">
                        {branding.email} · {branding.phone}
                      </span>
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
            <div
              className="booking-hero-bg"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(10,17,40,0.55) 0%, rgba(10,17,40,0.75) 60%, rgba(10,17,40,0.97) 100%), url('${bookingSection.bgImage}')`,
              }}
            />
            <div className="booking-hero-content">
              <div
                className="section-label"
                style={{ color: "#F4D03F", justifyContent: "center", marginBottom: "1rem" }}
              >
                {bookingSection.label}
              </div>
              <h1
                style={{
                  fontFamily: "Playfair Display, serif",
                  color: "white",
                  fontSize: "clamp(2.2rem, 5vw, 4rem)",
                  lineHeight: 1.1,
                  marginBottom: "1rem",
                }}
              >
                {bookingSection.title}{" "}
                <em style={{ fontStyle: "italic", color: "#F4D03F" }}>
                  {bookingSection.titleHighlight}
                </em>
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.75)",
                  maxWidth: 540,
                  margin: "0 auto",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  textAlign: "justify",
                }}
              >
                {bookingSection.subtitle}
              </p>
            </div>
          </div>
          <section style={{ background: "#FFF8F0", padding: "5rem 2rem" }}>
            <div
              style={{
                maxWidth: 580,
                margin: "0 auto",
                background: "white",
                padding: "3.5rem",
                borderRadius: 28,
                boxShadow: "0 30px 80px rgba(0,0,0,0.1)",
              }}
            >
              <form action={branding.formAction} method="POST">
                <input type="hidden" name="_subject" value="New Coaching Request" />
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.4rem",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    color: "#555",
                  }}
                >
                  Type of Session
                </label>
                <select name="SessionType" className="contact-input" required>
                  {bookingSection.sessionTypes.map((st, i) => (
                    <option key={i}>{st}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="FullName"
                  placeholder="Full Name"
                  className="contact-input"
                  required
                />
                <input
                  type="email"
                  name="Email"
                  placeholder="Email Address"
                  className="contact-input"
                  required
                />
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.4rem",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    color: "#555",
                  }}
                >
                  Preferred Date
                </label>
                <input type="date" name="RequestedDate" className="contact-input" required />
                <button type="submit" className="btn-submit btn-submit-terracotta">
                  Schedule My Session
                </button>
                <span className="form-feedback-text">
                  {branding.email} · {branding.phone}
                </span>
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
              <div className="section-label">{eventsSection.label}</div>
              <h2 className="section-title">{eventsSection.title}</h2>
              <p style={{ maxWidth: 500, margin: "0 auto", color: "#666" }}>
                {eventsSection.subtitle}
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
                maxWidth: 900,
                margin: "0 auto",
              }}
            >
              {eventsSection.upcoming.map((e, i) => (
                <div key={e.id || i} className="event-card">
                  <div className="event-date-badge">
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          letterSpacing: "2px",
                          opacity: 0.6,
                          marginBottom: "0.3rem",
                        }}
                      >
                        Upcoming
                      </div>
                      <div className="event-day" style={{ fontSize: "1.6rem", letterSpacing: "1px" }}>
                        {e.quarter}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.4rem",
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                      }}
                    >
                      {e.tags &&
                        e.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              background:
                                tag === "Virtual"
                                  ? "rgba(168,218,220,0.3)"
                                  : "rgba(244,208,63,0.25)",
                              color: tag === "Virtual" ? "#A8DADC" : "#F4D03F",
                              padding: "0.25rem 0.7rem",
                              borderRadius: 20,
                              fontSize: "0.7rem",
                              fontWeight: 700,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="event-body">
                    <h3
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: "1.3rem",
                        marginBottom: "0.3rem",
                        color: "#0A1128",
                        lineHeight: 1.2,
                      }}
                    >
                      {e.title}
                    </h3>
                    <p
                      style={{
                        color: "#C86B56",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        marginBottom: "0.5rem",
                        fontStyle: "italic",
                      }}
                    >
                      &ldquo;{e.theme}&rdquo;
                    </p>
                    <p
                      style={{
                        color: "#888",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        marginBottom: "1rem",
                      }}
                    >
                      📍 {e.loc}
                    </p>
                    <p style={{ fontSize: "0.92rem", color: "#666", lineHeight: 1.7, textAlign: "justify" }}>
                      {e.desc}
                    </p>
                  </div>
                  <button className="event-register-btn" onClick={() => navigate("booking")}>
                    Register Interest
                  </button>
                </div>
              ))}
            </div>

            {/* PAST EVENTS */}
            <div style={{ marginTop: "6rem" }}>
              <div className="section-header" style={{ marginBottom: "2.5rem" }}>
                <div className="section-label">{eventsSection.pastLabel || "Our History"}</div>
                <h2 className="section-title" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
                  {eventsSection.pastTitle || "Past Events"}
                </h2>
                <p style={{ maxWidth: 500, margin: "0 auto", color: "#666" }}>
                  {eventsSection.pastSubtitle ||
                    "A record of the programmes, masterclasses, and conferences that have shaped our journey so far."}
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                  maxWidth: 1100,
                  margin: "0 auto",
                }}
              >
                {eventsSection.past.map((e, i) => (
                  <div
                    key={e.id || i}
                    style={{
                      background: "white",
                      borderRadius: 20,
                      overflow: "hidden",
                      boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
                      border: "1px solid rgba(0,0,0,0.05)",
                      display: "flex",
                      flexDirection: "column",
                      opacity: 0.9,
                    }}
                  >
                    <div
                      style={{
                        background: "linear-gradient(135deg, #3a3a4a, #555568)",
                        color: "white",
                        padding: "1.2rem 1.6rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "0.65rem",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            opacity: 0.55,
                            marginBottom: "0.2rem",
                          }}
                        >
                          Completed
                        </div>
                        <div
                          style={{
                            fontFamily: "Playfair Display, serif",
                            fontSize: "1rem",
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                          }}
                        >
                          {e.dates || e.quarter}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.3rem",
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                        }}
                      >
                        {e.tags &&
                          e.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                background: "rgba(255,255,255,0.12)",
                                color: "rgba(255,255,255,0.7)",
                                padding: "0.2rem 0.6rem",
                                borderRadius: 20,
                                fontSize: "0.65rem",
                                fontWeight: 700,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div style={{ padding: "1.5rem 1.6rem", flex: 1 }}>
                      <h3
                        style={{
                          fontFamily: "Playfair Display, serif",
                          fontSize: "1.15rem",
                          marginBottom: "0.3rem",
                          color: "#0A1128",
                          lineHeight: 1.2,
                        }}
                      >
                        {e.title}
                      </h3>
                      <p
                        style={{
                          color: "#C86B56",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          marginBottom: "0.5rem",
                          fontStyle: "italic",
                        }}
                      >
                        &ldquo;{e.theme}&rdquo;
                      </p>
                      <p
                        style={{
                          color: "#aaa",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          marginBottom: "0.8rem",
                        }}
                      >
                        📍 {e.loc}
                      </p>
                      <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.7, textAlign: "justify" }}>
                        {e.desc}
                      </p>
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
              <div className="section-label">{teamSection.label}</div>
              <h2 className="section-title">{teamSection.title}</h2>
              <p style={{ maxWidth: 500, margin: "0 auto", color: "#666" }}>
                {teamSection.subtitle}
              </p>
            </div>
            <div className="team-grid">
              {teamSection.members.map((member, i) => (
                <div key={member.id || i} className="team-card">
                  <div className="team-avatar-wrap">
                    <img src={member.photo} alt={member.name} className="team-avatar" />
                    <div className="team-avatar-ring" />
                  </div>
                  <h3
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontSize: "1.25rem",
                      marginBottom: "0.4rem",
                      color: "#0A1128",
                    }}
                  >
                    {member.name}
                  </h3>
                  <div
                    style={{
                      color: "#C86B56",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "1rem",
                    }}
                  >
                    {member.designation}
                  </div>
                  <p style={{ fontSize: "0.93rem", color: "#666", flexGrow: 1, lineHeight: 1.7, textAlign: "justify" }}>
                    {member.bio}
                  </p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        marginTop: "1.2rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "#0A1128",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        textDecoration: "none",
                        padding: "0.5rem 1rem",
                        background: "#FFF8F0",
                        borderRadius: 20,
                      }}
                    >
                      <LinkedInIcon /> Connect on LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* VOLUNTEER BANNER */}
            <div
              style={{
                marginTop: "5rem",
                background: "linear-gradient(135deg, #0A1128, #1a2a5e)",
                borderRadius: 28,
                padding: "4rem 3rem",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-60px",
                  right: "-60px",
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(244,208,63,0.12) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-40px",
                  left: "-40px",
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(200,107,86,0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  className="section-label"
                  style={{ color: "#F4D03F", justifyContent: "center", marginBottom: "1.2rem" }}
                >
                  {teamSection.volunteerLabel}
                </div>
                <h2
                  style={{
                    fontFamily: "Playfair Display, serif",
                    color: "white",
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    fontWeight: 900,
                    lineHeight: 1.15,
                    marginBottom: "1rem",
                  }}
                >
                  {teamSection.volunteerTitle}
                  <br />
                  <em style={{ fontStyle: "italic", color: "#F4D03F" }}>
                    {teamSection.volunteerHighlight}
                  </em>
                </h2>
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    maxWidth: 560,
                    margin: "0 auto 2.5rem",
                    fontSize: "1rem",
                    lineHeight: 1.8,
                    textAlign: "justify",
                  }}
                >
                  {teamSection.volunteerDesc}
                </p>
                <a
                  href={teamSection.volunteerWhatsApp || branding.whatsApp}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.7rem",
                    background: "linear-gradient(135deg, #F4D03F, #e8c020)",
                    color: "#0A1128",
                    padding: "1rem 2.5rem",
                    borderRadius: 50,
                    fontWeight: 800,
                    fontSize: "1rem",
                    textDecoration: "none",
                    boxShadow: "0 8px 25px rgba(244,208,63,0.35)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 12px 35px rgba(244,208,63,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(244,208,63,0.35)";
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.852L.057 23.571a.75.75 0 00.921.921l5.719-1.475A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.726 9.726 0 01-4.95-1.352l-.354-.212-3.664.944.964-3.546-.232-.368A9.715 9.715 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                  </svg>
                  {teamSection.volunteerBtnText || "Chat Us on WhatsApp"}
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
              <div className="section-label">{blogSection.label}</div>
              <h2 className="section-title">{blogSection.title}</h2>
              <p style={{ maxWidth: 500, margin: "0 auto", color: "#666" }}>
                {blogSection.subtitle}
              </p>
            </div>
            <div className="blog-grid">
              {blogSection.posts.map((post, i) => (
                <div
                  key={post.id || i}
                  className="blog-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("blog", post)}
                >
                  <div className="blog-img-wrap">
                    <img src={post.img} alt={post.title} className="blog-img" />
                  </div>
                  <div style={{ padding: "1.8rem" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.6rem",
                        alignItems: "center",
                        marginBottom: "0.8rem",
                      }}
                    >
                      <span
                        style={{
                          background: "#FFF8F0",
                          color: "#C86B56",
                          padding: "0.2rem 0.7rem",
                          borderRadius: 20,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}
                      >
                        {post.category}
                      </span>
                      <span style={{ color: "#aaa", fontSize: "0.78rem" }}>{post.readTime}</span>
                    </div>
                    <div
                      style={{
                        color: "#C86B56",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {post.date}
                    </div>
                    <h3
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: "1.35rem",
                        marginBottom: "0.8rem",
                        color: "#0A1128",
                      }}
                    >
                      {post.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#666",
                        marginBottom: "1.2rem",
                        lineHeight: 1.7,
                        textAlign: "justify",
                      }}
                    >
                      {post.excerpt}
                    </p>
                    <span style={{ color: "#0A1128", fontWeight: 800, fontSize: "0.88rem" }}>
                      Read Article &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BLOG ARTICLE VIEW */}
      {view === "blog" && selectedPost && (
        <section className="page-padding" style={{ background: "white" }}>
          <div className="section-container">
            <div style={{ maxWidth: 780, margin: "0 auto" }}>
              <button
                onClick={() => navigate("blog")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#C86B56",
                  fontWeight: 700,
                  marginBottom: "2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  padding: 0,
                }}
              >
                &larr; Back to Blog
              </button>
              <div
                style={{
                  display: "flex",
                  gap: "0.8rem",
                  marginBottom: "1.5rem",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    background: "#FFF8F0",
                    color: "#C86B56",
                    padding: "0.3rem 0.8rem",
                    borderRadius: 20,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {selectedPost.category}
                </span>
                <span style={{ color: "#aaa", fontSize: "0.8rem" }}>{selectedPost.readTime}</span>
                <span style={{ color: "#aaa", fontSize: "0.8rem" }}>
                  &middot; {selectedPost.date}
                </span>
              </div>
              <h1
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  color: "#0A1128",
                  lineHeight: 1.1,
                  marginBottom: "2rem",
                }}
              >
                {selectedPost.title}
              </h1>
              <div
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  marginBottom: "3rem",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={selectedPost.img}
                  alt={selectedPost.title}
                  style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }}
                />
              </div>
              <div className="article-content">{renderArticleContent(selectedPost.fullContent)}</div>
              <div
                style={{
                  marginTop: "4rem",
                  padding: "2.5rem",
                  background: "#FFF8F0",
                  borderRadius: 20,
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    color: "#0A1128",
                    marginBottom: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  {selectedPost.ctaHeading || "Ready to start your leadership journey?"}
                </p>
                <p
                  style={{
                    color: "#666",
                    fontSize: "0.9rem",
                    marginBottom: "1.2rem",
                    textAlign: "center",
                  }}
                >
                  {selectedPost.ctaSub || "Book a clarity session and take the next step."}
                </p>
                <button onClick={() => navigate("booking")} className="btn-primary">
                  Book a Session
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <img
                src={branding.logoUrl}
                alt="CLG Logo"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "white",
                  padding: 4,
                  objectFit: "contain",
                }}
              />
              <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem" }}>
                {branding.name}
              </span>
            </div>
            <p style={{ opacity: 0.55, fontSize: "0.9rem", lineHeight: 1.8, maxWidth: 340 }}>
              {branding.footerDesc}
            </p>
          </div>
          <div>
            <h4
              style={{
                fontWeight: 700,
                marginBottom: "1.5rem",
                fontSize: "0.85rem",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#F4D03F",
              }}
            >
              Navigation
            </h4>
            {[
              ["Home", "home"],
              ["Meet the CEO", "ceo"],
              ["Events", "events"],
              ["Team", "team"],
              ["Blog", "blog"],
              ["Book a Session", "booking"],
              ["Website Manager", "manager"],
            ].map((item) => (
              <div key={item[1]} style={{ marginBottom: "0.8rem" }}>
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item[1]);
                  }}
                  style={{
                    color: item[1] === "manager" ? "#F4D03F" : "rgba(255,255,255,0.6)",
                    fontWeight: item[1] === "manager" ? "700" : "normal",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                >
                  {item[1] === "manager" ? "⚙️ " : ""}
                  {item[0]}
                </a>
              </div>
            ))}
          </div>
          <div>
            <h4
              style={{
                fontWeight: 700,
                marginBottom: "1.5rem",
                fontSize: "0.85rem",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#F4D03F",
              }}
            >
              Contact
            </h4>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.9rem",
                marginBottom: "0.8rem",
              }}
            >
              ✉ {branding.email}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              📞 {branding.phone}
            </p>
            <a
              href={branding.whatsApp}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                color: "#F4D03F",
                fontSize: "0.85rem",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              💬 Chat on WhatsApp &rarr;
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p style={{ opacity: 0.35, fontSize: "0.85rem" }}>{branding.copyrightText}</p>
        </div>
      </footer>
    </div>
  );
}
