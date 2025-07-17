// src/App.jsx

import { ApolloProvider } from '@apollo/client';
import client from './lib/apollo';
import useAuthStore from './store/authStore';
import Auth from './components/Auth'; // We will use this for the sign-out button
import ProtectedContent from './components/ProtectedContent';
import LoginPage from './components/LoginPage'; // <-- IMPORT THE NEW PAGE

function App() {
  const { user, loading } = useAuthStore();

  // Show a global loading indicator while Firebase is initializing
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Initializing App...</p>
      </div>
    );
  }

  return (
    <ApolloProvider client={client}>
      {user ? (
        // --- If User is Logged In ---
        <div className="container mx-auto p-4">
          <header className="flex justify-between items-center mb-6 pb-4 border-b">
            <h1 className="text-xl font-bold">
              Welcome, <span className="text-indigo-600">{user.displayName || user.email}</span>
            </h1>
            <Auth /> {/* This now primarily serves as the Sign Out button */}
          </header>
          <main>
            <ProtectedContent />
          </main>
        </div>
      ) : (
        // --- If User is NOT Logged In ---
        <LoginPage />
      )}
    </ApolloProvider>
  );
}

export default App;