import { supabase } from './supabase';

// Supabase에서 전체 데이터 로드 (페이지네이션으로 1000개 제한 우회)
export async function fetchAllCourses() {
  let allData = [];
  let from = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from('test')
      .select('*')
      .range(from, from + pageSize - 1);
    
    if (error) {
      console.error('Error fetching courses:', error);
      break;
    }
    
    if (!data || data.length === 0) break;
    allData = [...allData, ...data];
    
    if (data.length < pageSize) break;
    from += pageSize;
  }
  
  return allData;
}

// 리뷰 가져오기
export async function fetchReviews(courseCode) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('course_code', courseCode)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
  return data || [];
}

// 리뷰 작성
export async function submitReview(review) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select();
  
  if (error) {
    console.error('Error submitting review:', error);
    return null;
  }
  return data;
}

// 통계 계산
export function calculateStats(courses) {
  const totalCourses = courses.length;
  const totalEnrollment = courses.reduce((sum, c) => sum + (parseInt(c['수강']) || 0), 0);
  const totalCapacity = courses.reduce((sum, c) => sum + (parseInt(c['정원']) || 0), 0);
  const avgEnrollRate = totalCapacity > 0 ? ((totalEnrollment / totalCapacity) * 100).toFixed(1) : '0.0';
  
  const foreignLectures = courses.filter(c => c['원어강의'] === 'Y').length;
  const foreignRate = totalCourses > 0 ? ((foreignLectures / totalCourses) * 100).toFixed(1) : '0.0';
  
  return {
    totalCourses,
    totalEnrollment,
    avgEnrollRate,
    foreignRate
  };
}

// 이수구분별 강좌 수
export function getCoursesByCategory(courses) {
  const categories = {};
  courses.forEach(c => {
    const cat = c['이수구분'] || '기타';
    categories[cat] = (categories[cat] || 0) + 1;
  });
  // 내림차순 정렬
  const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  return { labels: sorted.map(s => s[0]), values: sorted.map(s => s[1]) };
}

// 이수구분별 평균 수강인원
export function getAvgEnrollByCategory(courses) {
  const categories = {};
  courses.forEach(c => {
    const cat = c['이수구분'] || '기타';
    if (!categories[cat]) categories[cat] = { total: 0, count: 0 };
    categories[cat].total += parseInt(c['수강']) || 0;
    categories[cat].count += 1;
  });
  const result = Object.entries(categories).map(([k, v]) => ({
    label: k,
    value: parseFloat((v.total / v.count).toFixed(1))
  }));
  result.sort((a, b) => b.value - a.value);
  return { labels: result.map(r => r.label), values: result.map(r => r.value) };
}

// 수업방법 분류
export function getTeachingMethodDist(courses) {
  const methods = {};
  courses.forEach(c => {
    let method = c['수업방법'] || '';
    if (!method || method.trim() === '') {
      method = '대면수업';
    }
    methods[method] = (methods[method] || 0) + 1;
  });
  const sorted = Object.entries(methods).sort((a, b) => b[1] - a[1]);
  return { labels: sorted.map(s => s[0]), values: sorted.map(s => s[1]) };
}

// 학점 구성 비율
export function getCreditDist(courses) {
  const credits = {};
  courses.forEach(c => {
    const credit = c['학점'] || '기타';
    const key = credit + '학점';
    credits[key] = (credits[key] || 0) + 1;
  });
  const sorted = Object.entries(credits).sort((a, b) => b[1] - a[1]);
  return { labels: sorted.map(s => s[0]), values: sorted.map(s => s[1]) };
}

// 요일별 수업 강좌 수
export function getDayOfWeekDist(courses) {
  const days = { '월': 0, '화': 0, '수': 0, '목': 0, '금': 0, '토': 0 };
  courses.forEach(c => {
    const schedule = c['시간표(교시)'] || '';
    Object.keys(days).forEach(day => {
      if (schedule.includes(day)) {
        days[day]++;
      }
    });
  });
  return { labels: Object.keys(days), values: Object.values(days) };
}

// 수업 시간별 강좌 수
export function getTimeSlotDist(courses) {
  const slots = { '오전 9-12시': 0, '12-15시': 0, '15-18시': 0, '18시 이후': 0 };
  courses.forEach(c => {
    const timeStr = c['시간표(시간)'] || '';
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1]);
      if (hour >= 9 && hour < 12) slots['오전 9-12시']++;
      else if (hour >= 12 && hour < 15) slots['12-15시']++;
      else if (hour >= 15 && hour < 18) slots['15-18시']++;
      else if (hour >= 18) slots['18시 이후']++;
    }
  });
  return { labels: Object.keys(slots), values: Object.values(slots) };
}

// 대학별 강좌 분석 요약
export function getCollegeSummary(courses) {
  const colleges = {};
  courses.forEach(c => {
    const college = c['대학(원)'] || '기타';
    if (!colleges[college]) {
      colleges[college] = { courses: 0, enrollment: 0, capacity: 0 };
    }
    colleges[college].courses += 1;
    colleges[college].enrollment += parseInt(c['수강']) || 0;
    colleges[college].capacity += parseInt(c['정원']) || 0;
  });
  
  const result = Object.entries(colleges).map(([name, v]) => ({
    name,
    courses: v.courses,
    enrollment: v.enrollment,
    avgRate: v.capacity > 0 ? ((v.enrollment / v.capacity) * 100).toFixed(1) : '0.0'
  }));
  result.sort((a, b) => b.courses - a.courses);
  return result;
}

// 대학별 학과 목록 (사이드바용)
export function getCollegeDepartments(courses) {
  const collegeOrder = [
    '기초교육원',
    '인문대학',
    '자연과학대학',
    '사회과학대학',
    '글로벌정경대학',
    '공과대학',
    '정보기술대학',
    '경영대학',
    '예술체육대학',
    '사범대학',
    '도시과학대학',
    '생명과학기술대학',
    '융합자유전공대학',
    '동북아국제통상물류학부',
    '법학부'
  ];
  
  const collegeMap = {};
  courses.forEach(c => {
    const college = c['대학(원)'] || '';
    const dept = c['학과(부)'] || '';
    if (!college) return;
    if (!collegeMap[college]) collegeMap[college] = new Set();
    if (dept) collegeMap[college].add(dept);
  });
  
  // 순서대로 정렬
  const ordered = [];
  collegeOrder.forEach(name => {
    if (collegeMap[name]) {
      ordered.push({
        name,
        departments: Array.from(collegeMap[name]).sort()
      });
    }
  });
  
  // 나머지 추가
  Object.keys(collegeMap).forEach(name => {
    if (!collegeOrder.includes(name)) {
      ordered.push({
        name,
        departments: Array.from(collegeMap[name]).sort()
      });
    }
  });
  
  return ordered;
}
