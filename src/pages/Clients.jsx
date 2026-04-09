import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserPlus, MoreVertical, Mail, Phone, Building2, Search } from 'lucide-react';
import Modal from '../components/Modal';
import ClientForm from '../components/ClientForm';

const Clients = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select(`
          *,
          empresas (
            nombre
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error('Error fetching clientes:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    fetchClientes();
  };

  const filteredClientes = clientes.filter(cliente => 
    `${cliente.nombre} ${cliente.apellido_1}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-title">
        Gestión de Clientes
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="header-search" style={{ width: '250px', height: '40px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={18} />
            Añadir Cliente
          </button>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando datos...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Empresa</th>
                <th>Contacto</th>
                <th>Tipo / NIF</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No se encontraron clientes.
                  </td>
                </tr>
              ) : (
                filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>
                        {cliente.nombre} {cliente.apellido_1} {cliente.apellido_2 || ''}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: #{cliente.id}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={14} color="var(--text-muted)" />
                        {cliente.empresas?.nombre || 'Particular'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <Mail size={14} color="var(--accent)" /> 
                        <span style={{ fontSize: '0.9rem' }}>{cliente.email || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <Phone size={14} /> {cliente.telefono || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem' }}>{cliente.tipo_cliente || 'N/A'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cliente.nif || ''}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${cliente.estado || 'active'}`}>
                        {cliente.estado === 'active' ? 'Activo' : cliente.estado}
                      </span>
                    </td>
                    <td>
                      <button className="btn" style={{ background: 'none', padding: '0.5rem' }}>
                        <MoreVertical size={18} color="var(--text-muted)" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Añadir Nuevo Cliente"
      >
        <ClientForm 
          onSuccess={handleCreateSuccess} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default Clients;
