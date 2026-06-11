'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function AvgEnrollByCategory({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [{
      label: '평균 수강인원',
      data: data.values,
      backgroundColor: data.labels.map((_, i) => 
        i === 0 ? '#F5A623' : '#A5B4FC'
      ),
      borderRadius: 4,
      barThickness: 20,
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
          label: (ctx) => ` 평균 ${ctx.parsed.x}명`
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
        ticks: { font: { size: 12, family: 'Pretendard' } }
      }
    }
  };

  return (
    <div className="chart-card">
      <div className="chart-card-title">이수구분별 평균 수강인원</div>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
