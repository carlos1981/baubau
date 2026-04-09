import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { TrendingUp, Users, DollarSign, Clock, Building2, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalEmpresas: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtenemos el conteo de clientes
        const { count: clientsCount, error: clientsError } = await supabase
          .from('clientes')
          .select('*', { count: 'exact', head: true });

        // Obtenemos el conteo de empresas
        const { count: companiesCount, error: companiesError } = await supabase
          .from('empresas')
          .select('*', { count: 'exact', head: true });

        if (clientsError || companiesError) throw clientsError || companiesError;

        setStats({
          totalClientes: clientsCount || 0,
          totalEmpresas: companiesCount || 0,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error.message);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Clientes Totales',
      value: stats.loading ? '...' : stats.totalClientes,
      icon: <Users size={24} />,
      trend: '+12%',
      color: 'var(--accent)'
    },
    {
      title: 'Empresas Registradas',
      value: stats.loading ? '...' : stats.totalEmpresas,
      icon: <Building2 size={24} />,
      trend: '+5%',
      color: '#ec4899'
    },
    {
      title: 'Ingresos Mensuales',
      value: '€12,450',
      icon: <DollarSign size={24} />,
      trend: '+18%',
      color: '#10b981'
    },
    {
      title: 'Tiempo de Respuesta',
      value: '1.2h',
      icon: <Clock size={24} />,
      trend: '-14%',
      color: '#f59e0b'
    }
  ];

  return (
    <div className="page-container">
      <div className="page-title">
        Panel de Control
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal', marginLeft: '1rem' }}>
          Bienvenido de nuevo, Carlos
        </span>
      </div>

      <div className="dashboard-grid">
        {cards.map((card, index) => (
          <div key={index} className="stat-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="stat-card-header">
              <div className="stat-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                {card.icon}
              </div>
              <span className={`stat-trend ${card.trend.startsWith('+') ? 'trend-up' : 'trend-down'}`}>
                {card.trend} <ArrowUpRight size={14} />
              </span>
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-title">{card.title}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="table-container" style={{ margin: 0 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Actividad Reciente</h3>
            <button className="btn" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>Ver todo</button>
          </div>
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
             {stats.loading ? 'Cargando actividad...' : 'No hay actividad reciente para mostrar.'}
          </div>
        </div>

        <div className="table-container" style={{ margin: 0 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Distribución de Clientes</h3>
          </div>
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '8px solid var(--border)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>100%</span>
            </div>
            <p style={{ fontSize: '0.9rem' }}>Todos los datos están sincronizados con Supabase.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
