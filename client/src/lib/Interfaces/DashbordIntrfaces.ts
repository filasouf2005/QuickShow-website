// types/movie.ts
export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

export interface Movie {
  _id: string;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  genres: Genre[];
  casts: Cast[]; // from dummyCastsData
  release_date: string; // YYYY-MM-DD
  original_language: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
}
// types/show.ts


export interface Show {
  _id: string;
  movie: Movie;
  showDateTime: string; // ISO string
  showPrice: number;
  occupiedSeats: Record<string, string>; 
  __v?: number; // appears in some docs
}


// types/dashboard.ts

export interface DashboardData {
  totalBookings: number;
  totalRevenue: number;
  totalUser: number;
  activeShows: Show[];
}

// types/booking.ts

export interface BookingUser {
  name: string;
}

export interface BookingShow {
  _id: string;
  movie: Movie;
  showDateTime: string; // ISO string
  showPrice: number;
}

export interface Booking {
  _id: string;
  user: BookingUser;
  show: BookingShow;
  amount: number;
  bookedSeats: string[];
  isPaid: boolean;
}
