'use client';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TeachingMethodDist({ data, totalCourses }) {
  const colors = ['#6366F1', '#10B981', '#F5A623', '#EF4444', '#06B6D4', '#8B5CF6', '#EC4899'];
  
  const chartData = {
    labels: data.labels,
    datasets: [{
      data: data.values,
      backgroundColor: colors.slice(0, data.labels.length),
      borderWidth: 2,
      borderColor: '#FFFFFF',
      hoverOffset: 6,
    }]
  };

  const total = data.values.reduce((a, b) => a + b, 0);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 11, family: 'Pretendard' },
          generateLabels: (chart) => {
            const ds = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => ({
              text: `${label}    ${((ds.data[i] / total) * 100).toFixed(1)}%`,
              fillStyle: ds.backgroundColor[i],
              strokeStyle: ds.backgroundColor[i],
              index: i,
              hidden: false,
              pointStyle: 'circle',
            }));
          }
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleFont: { size: 13, family: 'Pretendard' },
        bodyFont: { size: 12, family: 'Pretendard' },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed}개 (${((ctx.parsed / total) * 100).toFixed(1)}%)`
        }
      }
    }
  };

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart) => {
      const { ctx, width, height } = chart;
      const chartArea = chart.chartArea;
      if (!chartArea) return;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.font = '600 11px Pretendard';
      ctx.fillStyle = '#9CA3AF';
      ctx.fillText('TOTAL', centerX, centerY - 12);
      
      ctx.font = '800 20px Pretendard';
      ctx.fillStyle = '#1A1D23';
      ctx.fillText(totalCourses.toLocaleString(), centerX, centerY + 10);
      
      ctx.restore();
    }
  };

  return (
    <div className="chart-card">
      <div className="chart-card-title">수업방법 유형 분포</div>
      <div className="chart-container donut">
        <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
      </div>
    </div>
  );
}
