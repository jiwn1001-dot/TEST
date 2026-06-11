'use client';

export default function Sidebar({ colleges, selectedCollege, selectedDept, onSelectAll, onSelectCollege, onSelectDept, sidebarOpen, onCloseSidebar }) {
  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h1>Incheon National University</h1>
        <p>2026-1 Course Dashboard</p>
      </div>
      
      <button 
        className={`sidebar-menu-btn ${!selectedCollege && !selectedDept ? 'active' : ''}`}
        onClick={() => { onSelectAll(); onCloseSidebar(); }}
      >
        📊 전체 대시보드
      </button>
      
      <nav className="sidebar-nav">
        {colleges.map((college) => (
          <div key={college.name} className="college-group">
            <div 
              className={`college-name ${selectedCollege === college.name && !selectedDept ? 'active' : ''}`}
              onClick={() => { onSelectCollege(college.name); onCloseSidebar(); }}
            >
              <span>{college.name}</span>
              <span className="chevron open">▾</span>
            </div>
            <div className="dept-list">
              {college.departments.map((dept) => (
                <button
                  key={dept}
                  className={`dept-item ${selectedDept === dept && selectedCollege === college.name ? 'active' : ''}`}
                  onClick={() => { onSelectDept(college.name, dept); onCloseSidebar(); }}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
