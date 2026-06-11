import "./globals.css";

export const metadata = {
  title: "인천대학교 2026-1학기 교과목 대시보드",
  description: "인천대학교 2026학년도 1학기 전체 교과목 데이터를 시각화한 인터랙티브 대시보드. 강좌 현황, 수강 통계, AI 분석 등을 제공합니다.",
  keywords: "인천대학교, INU, 교과목, 대시보드, 2026, 1학기, 강좌, 수강",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
