import { Search, Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-search">
        <Search size={18} color="var(--text-muted)" />
        <input type="text" placeholder="Buscar clientes, tareas..." />
      </div>

      <div className="header-auth">
        <button className="btn" style={{ background: 'none', padding: '0.5rem' }}>
          <Bell size={20} color="var(--text-muted)" />
        </button>
        <div className="avatar">
          <User size={20} />
        </div>
      </div>
    </header>
  );
};

export default Header;
