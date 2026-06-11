'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function AIAnalysis({ courses, selectedCollege, selectedDept, onClose }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  const targetLabel = selectedDept || selectedCollege || '전체 교과목 대시보드';
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  const startAnalysis = async () => {
    setLoading(true);
    setStarted(true);
    setError('');

    // 통계 요약 데이터 준비
    const totalCourses = courses.length;
    const totalEnrollment = courses.reduce((s, c) => s + (parseInt(c['수강']) || 0), 0);
    const totalCapacity = courses.reduce((s, c) => s + (parseInt(c['정원']) || 0), 0);
    const avgRate = totalCapacity > 0 ? ((totalEnrollment / totalCapacity) * 100).toFixed(1) : 0;
    const foreignCount = courses.filter(c => c['원어강의'] === 'Y').length;
    const foreignRate = totalCourses > 0 ? ((foreignCount / totalCourses) * 100).toFixed(1) : 0;

    // 이수구분별
    const categories = {};
    courses.forEach(c => {
      const cat = c['이수구분'] || '기타';
      if (!categories[cat]) categories[cat] = { count: 0, enrollment: 0 };
      categories[cat].count++;
      categories[cat].enrollment += parseInt(c['수강']) || 0;
    });

    // 학점 분포
    const credits = {};
    courses.forEach(c => {
      const cr = c['학점'] || '기타';
      credits[cr + '학점'] = (credits[cr + '학점'] || 0) + 1;
    });

    // 수업방법
    const methods = {};
    courses.forEach(c => {
      const m = c['수업방법'] || '대면수업';
      methods[m] = (methods[m] || 0) + 1;
    });

    // 요일별
    const days = { '월': 0, '화': 0, '수': 0, '목': 0, '금': 0, '토': 0 };
    courses.forEach(c => {
      const s = c['시간표(교시)'] || '';
      Object.keys(days).forEach(d => { if (s.includes(d)) days[d]++; });
    });

    // 시간대별
    const timeSlots = { '오전(9-12시)': 0, '오후초반(12-15시)': 0, '오후후반(15-18시)': 0, '야간(18시이후)': 0 };
    courses.forEach(c => {
      const t = c['시간표(시간)'] || '';
      const m = t.match(/(\d{1,2}):/);
      if (m) {
        const h = parseInt(m[1]);
        if (h >= 9 && h < 12) timeSlots['오전(9-12시)']++;
        else if (h >= 12 && h < 15) timeSlots['오후초반(12-15시)']++;
        else if (h >= 15 && h < 18) timeSlots['오후후반(15-18시)']++;
        else if (h >= 18) timeSlots['야간(18시이후)']++;
      }
    });

    const catSummary = Object.entries(categories)
      .map(([k, v]) => `${k}: ${v.count}개(평균 수강인원 ${(v.enrollment / v.count).toFixed(1)}명)`)
      .join(', ');
    
    const creditSummary = Object.entries(credits)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}: ${v}개(${((v / totalCourses) * 100).toFixed(1)}%)`)
      .join(', ');

    const methodSummary = Object.entries(methods)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}: ${v}개(${((v / totalCourses) * 100).toFixed(1)}%)`)
      .join(', ');

    const daySummary = Object.entries(days)
      .map(([k, v]) => `${k}요일: ${v}개`)
      .join(', ');

    const timeSummary = Object.entries(timeSlots)
      .map(([k, v]) => `${k}: ${v}개`)
      .join(', ');

    const prompt = `
당신은 대학 교육과정 및 강좌 운영을 분석하는 전문가입니다.
아래는 인천대학교 2026학년도 1학기 "${targetLabel}" 강좌 데이터 통계입니다. 이 데이터를 종합적으로 분석해주세요.

## 데이터 통계
- 분석 대상: ${targetLabel}
- 총 강좌 수: ${totalCourses}개
- 총 수강인원: ${totalEnrollment}명
- 평균 수강률: ${avgRate}%
- 원어(영어) 강의 비율: ${foreignRate}%

### 이수구분별 현황
${catSummary}

### 학점 구성
${creditSummary}

### 수업방법 분포
${methodSummary}

### 요일별 강좌 수
${daySummary}

### 시간대별 강좌 수
${timeSummary}

## 요청사항
다음 형식으로 분석 보고서를 작성해주세요:

# [분석 보고서] 2026학년도 1학기 인천대학교 ${targetLabel} 교육과정 및 강좌 운영 현황 분석

**작성일:** ${today}
**분석 대상:** 인천대학교 2026학년도 1학기 ${targetLabel} 강좌 및 수강 데이터

---

## 1. 데이터 요약
(주요 통계 수치를 기반으로 전체적인 현황을 요약)

---

## 2. 주요 특징 및 트렌드 분석
### 1) 이수구분 및 학점 구성 특성
### 2) 수업방법 비중 및 시사점
### 3) 요일 및 시간대별 강좌 배치 현황

---

## 3. 문제점 및 개선 아이디어 제언
(데이터에 기반한 구체적이고 건설적인 제안 3가지 이상)

---
*본 보고서는 2026학년도 1학기 학사 운영의 효율성을 제고하고, 학생 중심의 최적화된 교육 환경을 마련하기 위한 기초 자료로 활용되길 바랍니다.*
`;

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096,
            }
          })
        }
      );

      const result = await response.json();
      
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const text = result.candidates[0].content.parts[0].text;
        setAnalysis(text);
      } else {
        setError('AI 응답을 받지 못했습니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (err) {
      console.error('AI Analysis Error:', err);
      setError('API 호출 중 오류가 발생했습니다: ' + err.message);
    }
    
    setLoading(false);
  };

  const downloadMD = () => {
    const header = `=== AI 강의 데이터 분석 보고서 ===\n분석 대상: ${targetLabel}\n일자: ${today}\n작성 모델: Gemini 3.1 Flash-Lite\n\n`;
    const blob = new Blob([header + analysis], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_강의_분석_${targetLabel}_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✨ AI 강의 데이터 종합 분석</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {!started ? (
            <div className="ai-loading">
              <div style={{fontSize: '48px'}}>🤖</div>
              <div className="ai-loading-text">AI 분석을 시작하시겠습니까?</div>
              <div className="ai-loading-sub">
                &quot;{targetLabel}&quot;의 강좌 데이터 {courses.length}개를 분석합니다.
              </div>
              <button className="close-btn" onClick={startAnalysis} style={{marginTop: '12px'}}>
                ✨ 분석 시작
              </button>
            </div>
          ) : loading ? (
            <div className="ai-loading">
              <div className="ai-spinner"></div>
              <div className="ai-loading-text">Gemini 3.1 Flash-Lite 모델이 통계를 분석 중입니다...</div>
              <div className="ai-loading-sub">대시보드 데이터를 종합적으로 해석하여 보고서를 작성하고 있습니다.</div>
            </div>
          ) : error ? (
            <div className="ai-loading">
              <div style={{fontSize: '48px'}}>⚠️</div>
              <div className="ai-loading-text">{error}</div>
              <button className="close-btn" onClick={startAnalysis} style={{marginTop: '12px'}}>
                🔄 다시 시도
              </button>
            </div>
          ) : (
            <>
              <div className="ai-meta">
                <span>분석 대상: {targetLabel}</span>
                <span>일자: {today}</span>
              </div>
              <div className="ai-content">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </>
          )}
        </div>
        {analysis && !loading && (
          <div className="modal-footer">
            <button className="download-btn" onClick={downloadMD}>
              📥 보고서 다운로드 (.md)
            </button>
            <button className="close-btn" onClick={onClose}>닫기</button>
          </div>
        )}
      </div>
    </div>
  );
}
