import { useNavigate } from 'react-router-dom';
import useAuthStore from '../hooks/useAuth';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Bem-vindo, {user?.email}! ({user?.role})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-900">
              ✓ Autenticação Funcionando!
            </h2>
            <p className="text-blue-700 mt-2">
              Você está logado como <strong>{user?.email}</strong> com o papel de{' '}
              <strong>{user?.role}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Info */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informações do Usuário
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>ID:</strong> {user?.id}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Papel:</strong> {user?.role}
                </p>
                {user?.resident_id && (
                  <p>
                    <strong>Residente ID:</strong> {user.resident_id}
                  </p>
                )}
                {user?.manager_id && (
                  <p>
                    <strong>Gestor ID:</strong> {user.manager_id}
                  </p>
                )}
                {user?.admin_id && (
                  <p>
                    <strong>Admin ID:</strong> {user.admin_id}
                  </p>
                )}
              </div>
            </div>

            {/* What's Next */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Próximas Etapas
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Autenticação & Token JWT</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">→</span>
                  <span>Implementar APIs (Edifícios, Unidades, etc)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">→</span>
                  <span>Criar Dashboards por Papel</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">-</span>
                  <span>Testes e Deploy</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Phase Status */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Status da Implementação
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Fase 1: Setup & Infra</span>
                <span className="text-green-600 font-semibold">✓ Completo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Fase 2: Autenticação</span>
                <span className="text-green-600 font-semibold">✓ Completo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Fase 3: APIs Core</span>
                <span className="text-yellow-600 font-semibold">→ Em Progresso</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Fase 4: Dashboards</span>
                <span className="text-gray-400 font-semibold">- Pendente</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
