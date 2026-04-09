import { UserPlus, MoreVertical, Mail, Phone } from 'lucide-react';

const Clients = () => {
  const clients = [
    { id: 1, name: 'Alex Rivera', email: 'alex@digital.com', phone: '+34 600 000 001', status: 'active', company: 'Digital Solutions' },
    { id: 2, name: 'Elena Gomez', email: 'elena@estudio.es', phone: '+34 600 000 002', status: 'pending', company: 'Estudio Creativo' },
    { id: 3, name: 'Marco Polo', email: 'marco@logistica.com', phone: '+34 600 000 003', status: 'inactive', company: 'Global Logistics' },
    { id: 4, name: 'Sofia Loren', email: 'sofia@moda.it', phone: '+39 300 000 004', status: 'active', company: 'Alta Moda' },
    { id: 5, name: 'David Chen', email: 'david@tech.cn', phone: '+86 100 000 005', status: 'active', company: 'Tech Innovation' },
  ];

  return (
    <div className="page-container">
      <div className="page-title">
        Gestión de Clientes
        <button className="btn btn-primary">
          <UserPlus size={18} />
          Nuevo Cliente
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Empresa</th>
              <th>Contacto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>
                  <div style={{ fontWeight: '600' }}>{client.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: #{client.id}</div>
                </td>
                <td>{client.company}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Mail size={14} color="var(--accent)" /> {client.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Phone size={14} /> {client.phone}
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${client.status}`}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </span>
                </td>
                <td>
                  <button className="btn" style={{ background: 'none', padding: '0.5rem' }}>
                    <MoreVertical size={18} color="var(--text-muted)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
