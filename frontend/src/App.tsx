import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<string>('checking...');

  useEffect(() => {
    // Check backend health
    axios
      .get('/api/health')
      .then((_res) => {
        setBackendStatus('✓ Backend connected');
      })
      .catch(() => {
        setBackendStatus('✗ Backend not available');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestão Condomínio</h1>
          <p className="text-gray-600 mt-1">Sistema de Gestão de Condomínios</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
              <p className="mt-4 text-gray-600">Carregando...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                <h2 className="text-xl font-semibold text-blue-900">Bem-vindo!</h2>
                <p className="text-blue-700 mt-2">
                  Você está iniciando o sistema de gestão de condomínios. A aplicação está em fase de desenvolvimento.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Card */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900">Status do Sistema</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Frontend:</span>
                      <span className="text-green-600 font-semibold">✓ Rodando</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Backend:</span>
                      <span
                        className={
                          backendStatus.includes('✓')
                            ? 'text-green-600 font-semibold'
                            : 'text-red-600 font-semibold'
                        }
                      >
                        {backendStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900">Próximas Etapas</h3>
                  <ul className="mt-4 space-y-2 text-gray-600">
                    <li>✓ Configurar autenticação</li>
                    <li>✓ Implementar dashboards</li>
                    <li>✓ Criar módulos de API</li>
                    <li className="text-gray-400">- Setup de testes</li>
                  </ul>
                </div>
              </div>

              {/* Documentation Links */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentação</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a
                    href="/#"
                    className="p-4 border border-gray-200 rounded hover:bg-white hover:shadow transition-all"
                  >
                    <h4 className="font-semibold text-blue-600">Arquitetura</h4>
                    <p className="text-sm text-gray-600 mt-1">Design do sistema</p>
                  </a>
                  <a
                    href="/#"
                    className="p-4 border border-gray-200 rounded hover:bg-white hover:shadow transition-all"
                  >
                    <h4 className="font-semibold text-blue-600">API Reference</h4>
                    <p className="text-sm text-gray-600 mt-1">Endpoints disponíveis</p>
                  </a>
                  <a
                    href="/#"
                    className="p-4 border border-gray-200 rounded hover:bg-white hover:shadow transition-all"
                  >
                    <h4 className="font-semibold text-blue-600">Guia do Usuário</h4>
                    <p className="text-sm text-gray-600 mt-1">Como usar o sistema</p>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            Gestão Condomínio v0.1.0 • Desenvolvido em React + Node.js • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
