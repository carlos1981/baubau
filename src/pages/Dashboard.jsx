import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

const Dashboard = () => {
  const metrics = [
    { title: 'Clientes Totales', value: '1,284', icon: <Users size={24} />, trend: '+12%' },
    { title: 'Ingresos Mensuales', value: '€24,500', icon: <DollarSign size={24} />, trend: '+8.4%' },
    { title: 'Proyectos Activos', value: '43', icon: <TrendingUp size={24} />, trend: '+2' },
    { title: 'Tiempo de Respuesta', value: '1.2h', icon: <Clock size={24} />, trend: '-15%' },
  ];

  return (
    <div className="page-container">
      <div className="page-title">
        Resumen de Actividad
        <button className="btn btn-primary">Descargar Reporte</button>
      </div>

      <div className="dashboard-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="card">
            <div className="metric-title">{metric.title}</div>
            <div className="metric-value">
              {metric.value}
              <div className="metric-icon">{metric.icon}</div>
            </div>
            <div style={{ 
              marginTop: '1rem', 
              fontSize: '0.875rem', 
              color: metric.trend.startsWith('+') ? '#4ade80' : '#f87171',
              fontWeight: '600'
            }}>
              {metric.trend} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>vs mes pasado</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <TrendingUp size={48} color="var(--accent)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ color: 'var(--text-muted)' }}>Gráfico de Rendimiento (Próximamente)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Estamos procesando tus datos en tiempo real...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
