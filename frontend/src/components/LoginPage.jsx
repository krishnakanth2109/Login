import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signUp, signIn, signInWithGoogle, createUserProfileDocument } from '../lib/firebase';
import { FcGoogle } from 'react-icons/fc';

// --- Import the phone number input component and its required CSS ---
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';


const LoginPage = () => {
  // --- NEW: State to manage Sign In vs Sign Up view ---
  const [isSigningUp, setIsSigningUp] = useState(true);

  // --- State for all form fields ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };
  const itemVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

  const handleSignUp = async () => {
    // Client-side validation
    if (!agreed) {
      setError('You must agree to the terms and conditions to sign up.');
      return;
    }
    if (Number(age) < 18) {
      setError('You must be at least 18 years old to sign up.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // 1. Create the user in Firebase Auth
      const { user } = await signUp(email, password);
      // 2. Create their profile in our Firestore database with all the new data
      await createUserProfileDocument(user, {
        displayName: name,
        phone,
        age: Number(age), // Ensure age is stored as a number
      });
      // The onAuthStateChanged listener in authStore.js will handle redirecting
    } catch (err) {
      // Handle specific Firebase errors
      switch (err.code) {
        case 'auth/weak-password': setError('Password should be at least 6 characters.'); break;
        case 'auth/email-already-in-use': setError('This email is already registered. Please sign in.'); break;
        case 'auth/invalid-email': setError('Please enter a valid email address.'); break;
        default: setError('Failed to create account. Please try again.'); break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (err) {
      setError('Failed to sign in. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await signInWithGoogle();
      await createUserProfileDocument(user); // This creates a profile for new Google users
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gray-900 text-white font-sans">
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900 to-transparent_70%" />

      <motion.div
        className="relative z-10 w-full max-w-md p-8 space-y-5 bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl shadow-black/50"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        key={isSigningUp ? 'signup' : 'signin'} // This makes the animation re-run when toggling
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">{isSigningUp ? 'Create Your Account' : 'Welcome Back'}</h1>
          <p className="mt-2 text-sm text-gray-400">
            {isSigningUp ? 'Fill out the details below to get started.' : 'Sign in to access your dashboard.'}
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="px-3 py-2 text-sm font-medium text-center text-red-200 bg-red-900/50 border border-red-800 rounded-lg"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); isSigningUp ? handleSignUp() : handleSignIn(); }}>
          {/* Conditional rendering of Sign Up fields with animation */}
          <AnimatePresence>
            {isSigningUp && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-semibold text-gray-400">Full Name</label>
                  <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="input-style" />
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <div className="md:w-1/2 space-y-2">
                    <label htmlFor="age" className="text-xs font-semibold text-gray-400">Age</label>
                    <input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required placeholder="25" className="input-style" />
                  </div>
                  <div className="w-full space-y-2">
                    <label htmlFor="phone" className="text-xs font-semibold text-gray-400">Phone</label>
                    <PhoneInput id="phone" value={phone} onChange={setPhone} required defaultCountry="US" className="input-style-phone" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold text-gray-400">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="input-style" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password"className="text-xs font-semibold text-gray-400">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="6+ characters" className="input-style" />
          </div>

          <AnimatePresence>
            {isSigningUp && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center space-x-3 pt-2">
                <input id="agree" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500" />
                <label htmlFor="agree" className="text-xs text-gray-400">I agree to the <a href="#" className="font-semibold text-purple-400 hover:underline">Terms & Conditions</a></label>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4">
            <motion.button type="submit" disabled={loading} className="button-primary" variants={itemVariants} whileHover="hover" whileTap="tap">
              {loading ? 'Working...' : (isSigningUp ? 'Create Account' : 'Sign In')}
            </motion.button>
          </div>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
          <div className="relative flex justify-center text-xs"><span className="px-2 bg-gray-800 text-gray-500">OR</span></div>
        </div>

        <motion.button type="button" onClick={handleGoogleSignIn} disabled={loading} className="w-full flex justify-center items-center py-3 border border-gray-700 rounded-lg text-sm font-medium bg-gray-900/50" variants={itemVariants} whileHover="hover" whileTap="tap">
          <FcGoogle className="w-5 h-5 mr-3" />
          Continue with Google
        </motion.button>
        
        <div className="pt-4 text-center text-sm text-gray-400">
          {isSigningUp ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => { setIsSigningUp(!isSigningUp); setError(null); }} className="font-semibold text-purple-400 hover:underline ml-1">
            {isSigningUp ? 'Sign In' : 'Create one'}
          </button>
        </div>
      </motion.div>
    </main>
  );
};

export default LoginPage;
