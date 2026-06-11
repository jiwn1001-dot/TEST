'use client';
import { useState } from 'react';

export default function CourseTable({ courses, onSelectCourse }) {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(courses.length / perPage);
  const start = (page - 1) * perPage;
  const paginated = courses.slice(start, start + perPage);

  const getEnrollRate = (c) => {
    const cap = parseInt(c['정원']) || 0;
    const enroll = parseInt(c['수강']) || 0;
    if (cap === 0) return '-';
    return ((enroll / cap) * 100).toFixed(1) + '%';
  };

  const getScheduleShort = (c) => {
    const s = c['시간표(교시)'] || '';
    return s.replace(/\s*\[/g, '[').trim();
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    pages.push(
      <button key="prev" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
        이전
      </button>
    );

    if (startPage > 1) {
      pages.push(<button key={1} onClick={() => setPage(1)}>1</button>);
      if (startPage > 2) pages.push(<span key="e1" className="ellipsis">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} className={page === i ? 'active' : ''} onClick={() => setPage(i)}>
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push(<span key="e2" className="ellipsis">...</span>);
      pages.push(<button key={totalPages} onClick={() => setPage(totalPages)}>{totalPages}</button>);
    }

    pages.push(
      <button key="next" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
        다음
      </button>
    );

    return pages;
  };

  return (
    <div className="course-section">
      <div className="course-section-header">
        <div className="chart-card-title">상세 강좌 정보</div>
        <span className="table-page-info">총 {courses.length.toLocaleString()}개 중 {start + 1}-{Math.min(start + perPage, courses.length)}번째 표시</span>
      </div>
      <table className="course-table">
        <thead>
          <tr>
            <th>교과목명</th>
            <th>이수구분</th>
            <th>학점</th>
            <th>담당교수</th>
            <th>시간표(교시)</th>
            <th>수강 / 정원</th>
            <th>수강률</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((c, i) => (
            <tr key={start + i} onClick={() => onSelectCourse(c)}>
              <td style={{fontWeight: 600}}>{c['교과목명']}</td>
              <td>{c['이수구분']}</td>
              <td>{c['학점']}학점</td>
              <td>{c['담당교수']}</td>
              <td style={{fontSize: '11px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{getScheduleShort(c)}</td>
              <td>{c['수강']} / {c['정원']}</td>
              <td style={{fontWeight: 700}}>{getEnrollRate(c)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="pagination">
          {renderPagination()}
        </div>
      )}
    </div>
  );
}
