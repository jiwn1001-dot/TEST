'use client';
import { useState, useEffect } from 'react';
import { fetchReviews, submitReview } from '@/lib/queries';

export default function CourseReviewModal({ course, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const courseCode = course['학수번호'] || '';
  const courseName = course['교과목명'] || '';
  const professor = course['담당교수'] || '';

  useEffect(() => {
    loadReviews();
  }, [courseCode]);

  const loadReviews = async () => {
    setLoading(true);
    const data = await fetchReviews(courseCode);
    setReviews(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !content.trim()) return;
    
    setSubmitting(true);
    const review = {
      course_name: courseName,
      course_code: courseCode,
      professor: professor,
      rating,
      difficulty: difficulty || null,
      content: content.trim(),
      nickname: nickname.trim() || '익명'
    };
    
    const result = await submitReview(review);
    if (result) {
      setSubmitSuccess(true);
      setRating(0);
      setDifficulty(0);
      setNickname('');
      setContent('');
      await loadReviews();
      setTimeout(() => setSubmitSuccess(false), 2000);
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '-';
  
  const avgDifficulty = reviews.filter(r => r.difficulty).length > 0
    ? (reviews.filter(r => r.difficulty).reduce((sum, r) => sum + r.difficulty, 0) / reviews.filter(r => r.difficulty).length).toFixed(1)
    : '-';

  const renderStars = (value, setter) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          className={`star ${n <= value ? 'filled' : ''}`}
          onClick={() => setter(n)}
        >
          ★
        </span>
      ))}
    </div>
  );

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal review-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📝 과목 리뷰</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="review-course-info">
            <h3>{courseName}</h3>
            <p>{professor} · {course['이수구분']} · {course['학점']}학점 · {courseCode}</p>
          </div>

          <div className="review-stats">
            <div className="review-stat">
              <div className="review-stat-label">평균 별점</div>
              <div className="review-stat-value">{avgRating}</div>
              <div className="review-stat-sub">/ 5.0</div>
            </div>
            <div className="review-stat">
              <div className="review-stat-label">평균 난이도</div>
              <div className="review-stat-value">{avgDifficulty}</div>
              <div className="review-stat-sub">/ 5.0</div>
            </div>
            <div className="review-stat">
              <div className="review-stat-label">리뷰 수</div>
              <div className="review-stat-value">{reviews.length}</div>
              <div className="review-stat-sub">개</div>
            </div>
          </div>

          <form className="review-form" onSubmit={handleSubmit}>
            <h4>✍️ 리뷰 작성</h4>
            <div className="form-row">
              <div className="form-group">
                <label>별점 (필수)</label>
                {renderStars(rating, setRating)}
              </div>
              <div className="form-group">
                <label>난이도</label>
                {renderStars(difficulty, setDifficulty)}
              </div>
            </div>
            <div className="form-group" style={{marginBottom: '12px'}}>
              <label>닉네임 (선택, 미입력 시 &apos;익명&apos;)</label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                maxLength={20}
              />
            </div>
            <div className="form-group" style={{marginBottom: '8px'}}>
              <label>리뷰 내용 (필수)</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="이 강의에 대한 솔직한 리뷰를 남겨주세요..."
                maxLength={500}
              />
            </div>
            <button 
              type="submit" 
              className="submit-review-btn"
              disabled={!rating || !content.trim() || submitting}
            >
              {submitting ? '등록 중...' : submitSuccess ? '✅ 등록 완료!' : '리뷰 등록'}
            </button>
          </form>

          <div className="reviews-list">
            <h4>💬 리뷰 목록 ({reviews.length}개)</h4>
            {loading ? (
              <div className="no-reviews">리뷰를 불러오는 중...</div>
            ) : reviews.length === 0 ? (
              <div className="no-reviews">아직 작성된 리뷰가 없습니다. 첫 번째 리뷰를 남겨보세요!</div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="review-item">
                  <div className="review-item-header">
                    <span className="review-item-author">{r.nickname || '익명'}</span>
                    <span className="review-item-date">{formatDate(r.created_at)}</span>
                  </div>
                  <div className="review-item-ratings">
                    <span>⭐ {r.rating}/5</span>
                    {r.difficulty && <span>📚 난이도 {r.difficulty}/5</span>}
                  </div>
                  <div className="review-item-content">{r.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
