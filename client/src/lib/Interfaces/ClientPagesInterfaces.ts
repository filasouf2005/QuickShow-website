export interface MoviePages {
    _id: string;
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    genres: {
        id: number;
        name: string;
    }[];
    casts: {
        name: string;
        profile_path: string;
    }[];
    release_date: string;
    original_language: string;
    tagline: string;
    vote_average: number;
    vote_count: number;
    runtime: number;
}