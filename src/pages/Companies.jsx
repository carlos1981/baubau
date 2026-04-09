import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Building2, Plus, Search, Mail, Phone, MoreVertical, Globe } from 'lucide-react';
import Modal from '../components/Modal';

const CompanyForm = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    nif: '',
    domicilio_fiscal: '',
    telefono: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('empresas')
        .insert([formData]);

      if (error) throw error;
      onSuccess();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      <div className="form-group">
        <label>Nombre de la Empresa *</label>
        <input type="text" name="nombre" required className="form-control" value={formData.nombre} onChange={handleChange} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>NIF</label>
          <input type="text" name="nif" className="form-control" value={formData.nif} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
        </div>
      </div>
      <div className="form-group">
        <label>Teléfono</label>
        <input type="text" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Domicilio Fiscal</label>
        <textarea name="domicilio_fiscal" className="form-control" value={formData.domicilio_fiscal} onChange={handleChange} />
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Empresa'}
        </button>
        <button type="button" className="btn" style={{ flex: 1 }} onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

const Companies = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setEmpresas(data || []);
    } catch (error) {
      console.error('Error fetching empresas:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmpresas = empresas.filter(emp => 
    emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.nif?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-title">
        Gestión de Empresas
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="header-search" style={{ width: '250px', height: '40px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o NIF..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Building2 size={18} />
            Nueva Empresa
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
                <th>Empresa</th>
                <th>NIF</th>
                <th>Contacto</th>
                <th>Domicilio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmpresas.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No se encontraron empresas.
                  </td>
                </tr>
              ) : (
                filteredEmpresas.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={16} color="var(--accent)" />
                        {emp.nombre}
                      </div>
                    </td>
                    <td>{emp.nif || 'N/A'}</td>
                    <td>
                      {emp.email && <div style={{ fontSize: '0.9rem' }}><Mail size={12} /> {emp.email}</div>}
                      {emp.telefono && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><Phone size={12} /> {emp.telefono}</div>}
                    </td>
                    <td style={{ maxWidth: '200px', fontSize: '0.85rem' }}>{emp.domicilio_fiscal || 'N/A'}</td>
                    <td>
                      <button className="btn" style={{ background: 'none' }}><MoreVertical size={18} color="var(--text-muted)" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Empresa">
        <CompanyForm onSuccess={() => { setIsModalOpen(false); fetchEmpresas(); }} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Companies;
