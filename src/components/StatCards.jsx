'use client';

export default function StatCards({ stats }) {
  const cards = [
    { label: '총 강좌 수', value: stats.totalCourses.toLocaleString(), icon: '📖' },
    { label: '총 수강인원', value: stats.totalEnrollment.toLocaleString(), icon: '👥' },
    { label: '평균 수강률', value: stats.avgEnrollRate + '%', icon: '📊' },
    { label: '원어강의 비율', value: stats.foreignRate + '%', icon: '🌐' },
  ];

  return (
    <div className="stat-cards">
      {cards.map((card, i) => (
        <div key={i} className="stat-card">
          <div>
            <div className="stat-card-label">{card.label}</div>
            <div className="stat-card-value">{card.value}</div>
          </div>
          <div className="stat-card-icon">{card.icon}</div>
        </div>
      ))}
    </div>
  );
}
