import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Companies from './pages/Companies';
import Layout from './components/Layout';

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="companies" element={<Companies />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
