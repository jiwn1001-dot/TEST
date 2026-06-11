'use client';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          📖 Incheon National University Course Dashboard
        </div>
        <div className="footer-links">
          <a href="https://www.inu.ac.kr" target="_blank" rel="noopener noreferrer">인천대학교 홈페이지</a>
          <a href="https://portal.inu.ac.kr" target="_blank" rel="noopener noreferrer">INU 포털</a>
          <a href="https://cyber.inu.ac.kr" target="_blank" rel="noopener noreferrer">이러닝</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-credit">Designed &amp; Developed by Jiwan Choi (최지완)</div>
        <div className="footer-copy">© 2026 Incheon National University.</div>
      </div>
    </footer>
  );
}
