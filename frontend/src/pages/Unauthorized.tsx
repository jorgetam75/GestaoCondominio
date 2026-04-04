import { useNavigate } from 'react-router-dom';
import useAuthStore from '../hooks/useAuth';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="text-6xl">🚫</div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-red-900 mb-4">
          Acesso Negado
        </h1>

        <p className="text-red-700 mb-6">
          Você não tem permissão para acessar este recurso.
        </p>

        {user && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-3">
              Informações da Conta
            </h2>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Papel:</strong> {user.role}
            </p>
            <p className="text-xs text-gray-500 mt-3 pt-3 border-t">
              Você pode tentar acessar outra área ou entrar com uma conta diferente.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Voltar ao Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-sm text-gray-600">
          Se acredita que isso é um erro, entre em contato com o administrador.
        </p>
      </div>
    </div>
  );
}
