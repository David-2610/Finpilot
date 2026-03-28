/* ────────────────────────────────────────────────
   App — Root component with providers
   ──────────────────────────────────────────────── */

import { AuthProvider } from '@/contexts/AuthContext';
import { FinanceProvider } from '@/contexts/FinanceContext';
import AppRoutes from '@/routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <AppRoutes />
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;