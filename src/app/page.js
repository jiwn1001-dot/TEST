'use client';
import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/Breadcrumb';
import StatCards from '@/components/StatCards';
import Footer from '@/components/Footer';
import CollegeSummary from '@/components/CollegeSummary';
import CourseTable from '@/components/CourseTable';
import CourseReviewModal from '@/components/CourseReviewModal';
import AIAnalysis from '@/components/AIAnalysis';
import CourseByCategory from '@/components/charts/CourseByCategory';
import AvgEnrollByCategory from '@/components/charts/AvgEnrollByCategory';
import TeachingMethodDist from '@/components/charts/TeachingMethodDist';
import CreditDist from '@/components/charts/CreditDist';
import DayOfWeekChart from '@/components/charts/DayOfWeekChart';
import TimeSlotChart from '@/components/charts/TimeSlotChart';
import {
  fetchAllCourses,
  calculateStats,
  getCoursesByCategory,
  getAvgEnrollByCategory,
  getTeachingMethodDist,
  getCreditDist,
  getDayOfWeekDist,
  getTimeSlotDist,
  getCollegeSummary,
  getCollegeDepartments
} from '@/lib/queries';

export default function Home() {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAllCourses();
    setAllCourses(data);
    setLoading(false);
  };

  // 필터링된 데이터
  const filteredCourses = useMemo(() => {
    let filtered = allCourses;
    if (selectedCollege) {
      filtered = filtered.filter(c => c['대학(원)'] === selectedCollege);
    }
    if (selectedDept) {
      filtered = filtered.filter(c => c['학과(부)'] === selectedDept);
    }
    return filtered;
  }, [allCourses, selectedCollege, selectedDept]);

  // 통계 계산
  const stats = useMemo(() => calculateStats(filteredCourses), [filteredCourses]);
  const coursesByCategory = useMemo(() => getCoursesByCategory(filteredCourses), [filteredCourses]);
  const avgEnrollByCategory = useMemo(() => getAvgEnrollByCategory(filteredCourses), [filteredCourses]);
  const teachingMethodDist = useMemo(() => getTeachingMethodDist(filteredCourses), [filteredCourses]);
  const creditDist = useMemo(() => getCreditDist(filteredCourses), [filteredCourses]);
  const dayOfWeekDist = useMemo(() => getDayOfWeekDist(filteredCourses), [filteredCourses]);
  const timeSlotDist = useMemo(() => getTimeSlotDist(filteredCourses), [filteredCourses]);
  const collegeSummary = useMemo(() => getCollegeSummary(filteredCourses), [filteredCourses]);
  const colleges = useMemo(() => getCollegeDepartments(allCourses), [allCourses]);

  // 페이지 타이틀
  const pageTitle = selectedDept
    ? `${selectedDept} 교과목 대시보드`
    : selectedCollege
    ? `${selectedCollege} 교과목 대시보드`
    : '전체 교과목 대시보드';

  const pageSubtitle = selectedDept
    ? `${selectedCollege} > ${selectedDept} | ${filteredCourses.length.toLocaleString()}개 강좌`
    : selectedCollege
    ? `${selectedCollege} | ${filteredCourses.length.toLocaleString()}개 강좌`
    : `전체 | ${filteredCourses.length.toLocaleString()}개 강좌`;

  const handleNavigate = (college, dept) => {
    setSelectedCollege(college);
    setSelectedDept(dept);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">인천대학교 교과목 데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>
      
      <Sidebar
        colleges={colleges}
        selectedCollege={selectedCollege}
        selectedDept={selectedDept}
        onSelectAll={() => { setSelectedCollege(null); setSelectedDept(null); }}
        onSelectCollege={(c) => { setSelectedCollege(c); setSelectedDept(null); }}
        onSelectDept={(c, d) => { setSelectedCollege(c); setSelectedDept(d); }}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        <Breadcrumb
          college={selectedCollege}
          department={selectedDept}
          onNavigate={handleNavigate}
        />

        <div className="page-header">
          <div>
            <h2 className="page-title">{pageTitle}</h2>
            <p className="page-subtitle">{pageSubtitle}</p>
          </div>
          <button className="ai-analysis-btn" onClick={() => setShowAI(true)}>
            <span className="sparkle">✨</span>
            AI 강의 분석
          </button>
        </div>

        <StatCards stats={stats} />

        <div className="chart-grid">
          <CourseByCategory data={coursesByCategory} />
          <AvgEnrollByCategory data={avgEnrollByCategory} />
        </div>

        <div className="chart-grid">
          <TeachingMethodDist data={teachingMethodDist} totalCourses={stats.totalCourses} />
          <CreditDist data={creditDist} totalCourses={stats.totalCourses} />
        </div>

        <div className="chart-grid">
          <DayOfWeekChart data={dayOfWeekDist} />
          <TimeSlotChart data={timeSlotDist} />
        </div>

        {!selectedDept && (
          <CollegeSummary data={collegeSummary} />
        )}

        <CourseTable 
          courses={filteredCourses}
          onSelectCourse={setSelectedCourse}
        />

        <Footer />

        {selectedCourse && (
          <CourseReviewModal
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
          />
        )}

        {showAI && (
          <AIAnalysis
            courses={filteredCourses}
            selectedCollege={selectedCollege}
            selectedDept={selectedDept}
            onClose={() => setShowAI(false)}
          />
        )}
      </main>
    </div>
  );
}
