import { create } from 'zustand';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const useAuthStore = create((set) => ({
  user: null,
  idToken: null,
  loading: true,
  setUser: (user) => set({ user }),
  setIdToken: (idToken) => set({ idToken }),
  setLoading: (loading) => set({ loading }),
}));

// This part listens for auth changes and updates the store
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const token = await user.getIdToken();
    // When the user logs in, update state
    useAuthStore.setState({ user, idToken: token, loading: false });
  } else {
    // When the user logs out, clear state
    useAuthStore.setState({ user: null, idToken: null, loading: false });
  }
});

export default useAuthStore;