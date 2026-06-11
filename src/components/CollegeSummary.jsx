'use client';

export default function CollegeSummary({ data }) {
  const getRateClass = (rate) => {
    const r = parseFloat(rate);
    if (r >= 85) return 'rate-high';
    if (r >= 75) return 'rate-mid';
    return 'rate-low';
  };

  return (
    <div className="summary-section">
      <div className="chart-card-title">대학(원)별 강좌 분석 요약</div>
      <table className="summary-table">
        <thead>
          <tr>
            <th>순번</th>
            <th>대학(원)</th>
            <th>강좌 수</th>
            <th>수강인원 합계</th>
            <th>평균 수강률(%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.name}>
              <td>{i + 1}</td>
              <td>{row.name}</td>
              <td>{row.courses}개</td>
              <td>{row.enrollment.toLocaleString()}명</td>
              <td className={getRateClass(row.avgRate)}>{row.avgRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
