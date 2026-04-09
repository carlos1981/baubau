import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Folders, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="metric-icon" style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.2)' }}>
          <Folders size={24} color="var(--accent)" />
        </div>
        BAU<span>BAU</span>
      </div>

      <nav className="nav-menu">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink 
          to="/clients" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Users size={20} />
          Clientes
        </NavLink>
        
        <NavLink 
          to="/companies" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Building2 size={20} />
          Empresas
        </NavLink>
        
        <div className="nav-link" style={{ opacity: 0.5, cursor: 'not-allowed', marginTop: 'auto' }}>
          <Settings size={20} />
          Ajustes
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
