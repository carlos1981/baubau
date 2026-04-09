import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';

const ClientForm = ({ onSuccess, onCancel }) => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEmpresas, setFetchingEmpresas] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido_1: '',
    apellido_2: '',
    email: '',
    telefono: '',
    empresa_id: '',
    tipo_cliente: 'Particular',
    nif: '',
    domicilio_fiscal: '',
    estado: 'active'
  });

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, nombre')
        .order('nombre');
      
      if (error) throw error;
      setEmpresas(data || []);
    } catch (err) {
      console.error('Error fetching empresas:', err.message);
    } finally {
      setFetchingEmpresas(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Limpiar el campo empresa_id si es una cadena vacía (evita error de clave foránea)
      const submitData = { ...formData };
      if (!submitData.empresa_id) delete submitData.empresa_id;

      const { data, error } = await supabase
        .from('clientes')
        .insert([submitData])
        .select();

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <CheckCircle2 size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
        <h3 style={{ color: 'white' }}>¡Cliente Guardado!</h3>
        <p style={{ color: 'var(--text-muted)' }}>La lista se actualizará en unos segundos...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="client-form">
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1,5rem' }}>
          <AlertCircle size={18} />
          <span>Error: {error}</span>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label>Nombre *</label>
          <input 
            type="text" 
            name="nombre" 
            required 
            className="form-control" 
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
          />
        </div>
        <div className="form-group">
          <label>Primer Apellido *</label>
          <input 
            type="text" 
            name="apellido_1" 
            required 
            className="form-control" 
            value={formData.apellido_1}
            onChange={handleChange}
            placeholder="Apellido"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Segundo Apellido</label>
          <input 
            type="text" 
            name="apellido_2" 
            className="form-control" 
            value={formData.apellido_2}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            className="form-control" 
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Teléfono</label>
          <input 
            type="text" 
            name="telefono" 
            className="form-control" 
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Tipo de Cliente</label>
          <select 
            name="tipo_cliente" 
            className="form-control" 
            value={formData.tipo_cliente}
            onChange={handleChange}
          >
            <option value="Particular">Particular</option>
            <option value="Autónomo">Autónomo</option>
            <option value="Empresa">Empresa</option>
            <option value="VIP">VIP</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Asociar Empresa</label>
        <select 
          name="empresa_id" 
          className="form-control" 
          value={formData.empresa_id}
          onChange={handleChange}
          disabled={fetchingEmpresas}
        >
          <option value="">Ninguna (Particular)</option>
          {empresas.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.nombre}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>NIF / DNI</label>
          <input 
            type="text" 
            name="nif" 
            className="form-control" 
            value={formData.nif}
            onChange={handleChange}
            placeholder="00000000X"
          />
        </div>
        <div className="form-group">
          <label>Estado</label>
          <select 
            name="estado" 
            className="form-control" 
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="active">Activo</option>
            <option value="pending">Pendiente</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Domicilio Fiscal</label>
        <textarea 
          name="domicilio_fiscal" 
          className="form-control" 
          style={{ resize: 'vertical', minHeight: '80px' }}
          value={formData.domicilio_fiscal}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
          <Save size={18} />
          {loading ? 'Guardando...' : 'Guardar Cliente'}
        </button>
        <button type="button" className="btn" style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)' }} onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
