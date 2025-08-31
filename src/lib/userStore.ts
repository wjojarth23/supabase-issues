import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';

export const user = writable<User | null>(null);

export interface UserProfile {
	id: string;
	email: string;
	full_name: string;
	role: string;
	permissions: string[];
	created_at: string;
	updated_at: string;
	banned: boolean;
}

export const userProfile = writable<UserProfile | null>(null);
