import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signUp, signIn, signInWithGoogle, createUserProfileDocument } from '../lib/firebase';
import { FcGoogle } from 'react-icons/fc';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// CSS Styles are defined here and injected into the component.
const GlobalStyles = () => (
  <style>{`
    /* 
    ==============================================
                    Global Styles
    ==============================================
    */

    /* Custom Scrollbar for a modern look */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #111827; /* bg-gray-900 */
    }

    ::-webkit-scrollbar-thumb {
      background-color: #4f46e5; /* A shade of purple */
      border-radius: 20px;
      border: 3px solid #111827;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background-color: #6366f1; /* Lighter purple on hover */
    }

    /*
    ==============================================
                    Input Styles
    ==============================================
    */

    .input-style {
      --input-bg: rgba(31, 41, 55, 0.5);      /* bg-gray-700 with opacity */
      --input-border: #374151;              /* border-gray-700 */
      --input-text: #e5e7eb;                /* text-gray-200 */
      --input-focus-border: #8b5cf6;       /* focus:ring-purple-500 */
      --input-placeholder: #6b7280;         /* placeholder text-gray-500 */
      
      width: 100%;
      background-color: var(--input-bg);
      border: 1px solid var(--input-border);
      color: var(--input-text);
      padding: 0.8rem 1rem;
      border-radius: 0.5rem; /* rounded-lg */
      font-size: 0.95rem;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
    }

    .input-style:focus {
      outline: none;
      border-color: var(--input-focus-border);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
    }
    
    .input-style::placeholder {
      color: var(--input-placeholder);
      opacity: 1; /* Firefox */
    }

    /* Removing number input spinners for a cleaner look */
    .input-style[type="number"]::-webkit-inner-spin-button,
    .input-style[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .input-style[type="number"] {
      -moz-appearance: textfield;
    }

    /*
    ==============================================
            React Phone Number Input Styling
    ==============================================
    This component has specific inner classes that need to be targeted.
    */
    .input-style-phone {
      display: flex;
      align-items: center;
      background-color: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: 0.5rem;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .input-style-phone:focus-within {
      outline: none;
      border-color: var(--input-focus-border);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
    }

    /* Style for the country select button */
    .PhoneInputCountry {
      margin-left: 0.75rem;
      margin-right: -0.25rem;
    }
    
    .PhoneInputCountrySelect {
      -moz-appearance: none;
      -webkit-appearance: none;
      appearance: none;
      outline: none;
      border: none;
      background: transparent;
      color: var(--input-text);
    }
    
    .PhoneInputCountryIcon {
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }

    /* The actual input field for the phone number */
    .PhoneInputInput {
      /* Inherits from .input-style but removes its own border/bg */
      background-color: transparent;
      border: none;
      outline: none;
      color: var(--input-text);
      padding: 0.8rem 1rem;
      font-size: 0.95rem;
      width: 100%;
    }

    .PhoneInputInput::placeholder {
      color: var(--input-placeholder);
    }

    /*
    ==============================================
                    Button Styles
    ==============================================
    */
    
    .button-primary {
      width: 100%;
      padding: 0.85rem 1rem;
      font-size: 1rem;
      font-weight: 600; /* semibold */
      color: white;
      border: none;
      border-radius: 0.5rem; /* rounded-lg */
      cursor: pointer;
      position: relative;
      overflow: hidden;
      z-index: 1;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
      background: linear-gradient(45deg, #8b5cf6, #6366f1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(139, 92, 246, 0.5);
    }
    
    .button-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(139, 92, 246, 0.6);
    }

    .button-primary:active {
       transform: translateY(0px) scale(0.98);
       box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .button-primary:disabled {
      background: #374151; /* gray-700 */
      color: #9ca3af; /* gray-400 */
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .button-primary:disabled:hover {
      transform: none;
      box-shadow: none;
    }
    
    /* Subtle shine effect on hover */
    .button-primary::before {
      content: '';
      position: absolute;
      top: 0;
      left: -80%;
      width: 50%;
      height: 100%;
      background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 100%);
      transform: skewX(-25deg);
      transition: left 0.6s ease;
      z-index: -1;
    }

    .button-primary:hover::before {
      left: 120%;
    }

    /*
    ==============================================
                    Checkbox Styles
    ==============================================
    */

    /* Customizing the checkbox */
    .custom-checkbox {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 0.25rem; /* rounded */
      background-color: #374151; /* bg-gray-700 */
      border: 1px solid #4b5563;   /* border-gray-600 */
      cursor: pointer;
      position: relative;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .custom-checkbox:checked {
      background-color: #8b5cf6; /* purple-500 */
      border-color: #a78bfa; /* purple-400 */
    }
    
    .custom-checkbox:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
    }

    /* Creating the checkmark using a pseudo-element */
    .custom-checkbox::after {
      content: '';
      position: absolute;
      display: none;
      left: 0.35rem;
      top: 0.15rem;
      width: 0.3rem;
      height: 0.6rem;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .custom-checkbox:checked::after {
      display: block;
    }
  `}</style>
);


const LoginPage = () => {
  const [isSigningUp, setIsSigningUp] = useState(true);
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

  // Helper: Validate email format
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignUp = async () => {
    // Client-side validation
    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!age || isNaN(Number(age)) || Number(age) < 18) {
      setError('You must be at least 18 years old to sign up.');
      return;
    }
    if (!phone || !isValidPhoneNumber(phone)) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the terms and conditions to sign up.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. Create the user in Firebase Auth
      const { user } = await signUp(email, password);
      // 2. Save profile data in Firestore
      await createUserProfileDocument(user, {
        displayName: name,
        phone,
        age: Number(age),
      });
      // Success: You may redirect or clear form here
    } catch (err) {
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
      await createUserProfileDocument(user);
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyles />
      <main className="flex items-center justify-center min-h-screen p-4 bg-gray-900 text-white font-sans">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900 to-transparent_70%" />

        <motion.div
          className="relative z-10 w-full max-w-md p-8 space-y-5 bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl shadow-black/50"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          key={isSigningUp ? 'signup' : 'signin'}
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
                      <input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required placeholder="25" className="input-style" min="18" />
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
              <label htmlFor="password" className="text-xs font-semibold text-gray-400">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="6+ characters" className="input-style" />
            </div>

            <AnimatePresence>
              {isSigningUp && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center space-x-3 pt-2">
                  <input id="agree" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="custom-checkbox" />
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

          <motion.button type="button" onClick={handleGoogleSignIn} disabled={loading} className="w-full flex justify-center items-center py-3 border border-gray-700 rounded-lg text-sm font-medium bg-gray-900/50 hover:bg-gray-800/70 transition-colors duration-200" variants={itemVariants} whileHover="hover" whileTap="tap">
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
    </>
  );
};

export default LoginPage;
