import { create } from 'zustand';

export type AuthUser = {
	uid: string;
	displayName?: string | null;
	email?: string | null;
	photoURL?: string | null;
};

type AuthState = {
	user: AuthUser | null;
	spotifyConnected: boolean;
	setUser: (u: AuthUser | null) => void;
	setSpotifyConnected: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	spotifyConnected: false,
	setUser: (user) => set({ user }),
	setSpotifyConnected: (spotifyConnected) => set({ spotifyConnected }),
}));

