import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Save, AlertCircle, CheckCircle2, Plus, Building2 } from 'lucide-react';

const ClientForm = ({ onSuccess, onCancel }) => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEmpresas, setFetchingEmpresas] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para alternar entre seleccionar empresa o crear una nueva
  const [isNewCompany, setIsNewCompany] = useState(false);

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

  // Datos para la nueva empresa
  const [newCompanyData, setNewCompanyData] = useState({
    nombre: '',
    nif: ''
  });

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      setFetchingEmpresas(true);
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

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setNewCompanyData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let currentEmpresaId = formData.empresa_id;

      // 1. Si es una empresa nueva, primero la creamos
      if (isNewCompany && newCompanyData.nombre) {
        const { data: compData, error: compError } = await supabase
          .from('empresas')
          .insert([{ 
            nombre: newCompanyData.nombre, 
            nif: newCompanyData.nif 
          }])
          .select()
          .single();

        if (compError) throw compError;
        currentEmpresaId = compData.id;
      }

      // 2. Creamos el cliente
      const submitData = { 
        ...formData, 
        empresa_id: currentEmpresaId || null 
      };
      
      // Eliminar campos vacíos que podrían causar problemas
      if (!submitData.empresa_id) delete submitData.empresa_id;

      const { error: clientError } = await supabase
        .from('clientes')
        .insert([submitData]);

      if (clientError) throw clientError;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
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
      </div>

      <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <label style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
            <Building2 size={16} /> 
            Información de Empresa
          </label>
          <button 
            type="button" 
            className="btn" 
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
            onClick={() => setIsNewCompany(!isNewCompany)}
          >
            {isNewCompany ? 'Seleccionar existente' : 'Añadir nueva'}
          </button>
        </div>

        {isNewCompany ? (
          <div className="form-row animate-fade-in">
            <div className="form-group">
              <label>Nombre de la Empresa *</label>
              <input 
                type="text" 
                name="nombre" 
                required={isNewCompany}
                className="form-control" 
                value={newCompanyData.nombre}
                onChange={handleCompanyChange}
                placeholder="Ej: Agencia BauBau"
              />
            </div>
            <div className="form-group">
              <label>NIF Empresa</label>
              <input 
                type="text" 
                name="nif" 
                className="form-control" 
                value={newCompanyData.nif}
                onChange={handleCompanyChange}
                placeholder="B12345678"
              />
            </div>
          </div>
        ) : (
          <div className="form-group animate-fade-in">
            <select 
              name="empresa_id" 
              className="form-control" 
              value={formData.empresa_id}
              onChange={handleChange}
              disabled={fetchingEmpresas}
            >
              <option value="">Particular / Sin Empresa</option>
              {empresas.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.nombre}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="form-row">
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
        <label>Domicilio Fiscal Personal (Opcional)</label>
        <textarea 
          name="domicilio_fiscal" 
          className="form-control" 
          style={{ resize: 'vertical', minHeight: '60px' }}
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
