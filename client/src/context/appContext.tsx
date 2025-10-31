import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// ========================
// Interfaces
// ========================
export interface Movie {
  _id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  original_language?: string;
  tagline?: string;
  geners: string[];
  casts: string[];
  vote_average: number;
  runtime: number;
}

export interface Show {
  _id?: string;
  movie: string | Movie;
  showDateTime: Date;
  showPrice: number;
  occupiedSeats: Record<string, boolean>;
}

export interface AppContextType {
  axios: typeof axios;
  fetchIsAdmin: () => Promise<void>;
  user: any;
  getToken: () => Promise<string | null>;
  navigate: ReturnType<typeof useNavigate>;
  isAdmin: boolean;
  shows: any;
  favoriteMovies: Movie[];
  fetchFavoriteMovies: () => Promise<void>;
  image_base_url: any;
}

// ========================
// ========================
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL as string;

// ========================
// ========================
export const AppContext = createContext<AppContextType | undefined>(undefined);

// ========================
// ========================
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState<Show[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.warn("No token available yet — user not logged in");
        return;
      }
      const { data } = await axios.get<{ isAdmin: boolean }>(
        "/api/admin/is-admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access the admin dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get<{
        success: boolean;
        shows: Show[];
        message?: string;
      }>("/api/show/all");
      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message || "Failed to fetch shows");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get<{
        success: boolean;
        movies: Movie[];
        message?: string;
      }>("/api/user/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message || "Failed to fetch favorite movies");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (user) fetchIsAdmin();
    fetchFavoriteMovies();
  }, [user]);

  const value: AppContextType = {
    axios,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    isAdmin,
    shows,
    favoriteMovies,
    fetchFavoriteMovies,
    image_base_url,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ========================
// Hook للاستخدام في أي مكون
// ========================
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within an AppProvider");
  return context;
};
