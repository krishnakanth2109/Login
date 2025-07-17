import { signInWithGoogle, signOut } from '../lib/firebase';
import useAuthStore from '../store/authStore';

const Auth = () => {
  const { user } = useAuthStore();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) { // The fix is here
      console.error("Error signing in with Google", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <div>
      {user ? (
        <button
          onClick={handleSignOut}
          className="px-4 py-2 font-semibold bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={handleSignIn}
          className="px-4 py-2 font-semibold bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Sign In with Google
        </button>
      )}
    </div>
  );
};

export default Auth;