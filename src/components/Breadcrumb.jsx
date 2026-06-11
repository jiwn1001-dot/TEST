'use client';

export default function Breadcrumb({ college, department, onNavigate }) {
  return (
    <div className="breadcrumb">
      <span className="clickable" onClick={() => onNavigate(null, null)}>🏠 홈</span>
      {college && (
        <>
          <span className="sep">&gt;</span>
          {department ? (
            <span className="clickable" onClick={() => onNavigate(college, null)}>{college}</span>
          ) : (
            <span className="current">{college}</span>
          )}
        </>
      )}
      {department && (
        <>
          <span className="sep">&gt;</span>
          <span className="current">{department}</span>
        </>
      )}
    </div>
  );
}
