'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function DayOfWeekChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [{
      label: '강좌 수',
      data: data.values,
      backgroundColor: data.labels.map((label) => 
        label === '화' ? '#F5A623' : '#A5B4FC'
      ),
      borderRadius: 4,
      barThickness: 24,
    }]
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1F2937',
        titleFont: { size: 13, family: 'Pretendard' },
        bodyFont: { size: 12, family: 'Pretendard' },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.x}개 강좌`
        }
      }
    },
    scales: {
      x: { 
        grid: { color: '#F3F4F6' }, 
        ticks: { font: { size: 11, family: 'Pretendard' } }
      },
      y: { 
        grid: { display: false }, 
        ticks: { font: { size: 13, family: 'Pretendard', weight: '600' } }
      }
    }
  };

  return (
    <div className="chart-card">
      <div className="chart-card-title">요일별 수업 강좌 수</div>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
