import toast from "react-hot-toast";
import { create } from "zustand";

const backendUrl = import.meta.env.VITE_BACKEND;

const useAuth = create((set, get) => ({
  loading: false,
  userLoading: true,
  user: null,

  handleLogin: async (e) => {
    e.preventDefault();
    set({ loading: true });
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        return toast.error(errorData.message || "Login failed");
      }
      const data = await res.json();
      if (!data.ok) {
        return toast.error(data.msg || "Login failed");
      }
      console.log(data);
      toast.success("Login successful!");
      e.target.reset();
      window.location.href = "/";
    } catch (err) {
      toast.error(err.message);
      console.log(err.message)
    } finally {
      set({ loading: false });
    }
  },

  handleRegister: async (e) => {
    e.preventDefault();
    set({ loading: true });

    const formData = new FormData(e.target);

    const formValues = Object.fromEntries(formData.entries());

    if (
      !get().checkPasswords(formValues.password, formValues.confirmPassword)
    ) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
        credentials: "include",
      });
      console.log("Response from server:", res);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }
      const data = await res.json();
      if (!data.ok) {
        return toast.error(data.msg || "Registration failed");
      }
      console.log(data);
      toast.success("Registration successful! Please log in.");
      e.target.reset();
      window.location.href = "/";
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    } finally {
      set({ loading: false });
    }
  },

  checkPasswords: (password, confirmPassword) => {
    if (password !== confirmPassword) return false;
    return true;
  },

  checkUser: async () => {
    set({ userLoading: true });
    try {
      const res = await fetch(`${backendUrl}/auth/get-user`, {
        credentials: "include",
      });
      if (!res.ok) {
        return null;
      }
      const data = await res.json();
      if (!data.ok) {
        return null;
      }
      set({ user: data.data });
      toast.success(`User ${data.data.name}`)
    } catch (err) {
      return null;
    } finally {
      set({ userLoading: false });
    }
  },

  logout: async () => {
    try {
      const res = await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Logout failed");
      }
      const data = await res.json();
      console.log("Logout response:", data);
      if (!data.ok) {
        return toast.error(data.msg || "Logout failed");
      }
      toast.success("Logout successful!");
      set({ user: null });
      window.location.href = "/";
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  },
}));

export default useAuth;
