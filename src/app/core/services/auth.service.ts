import { Injectable, signal, WritableSignal } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private supabase: SupabaseClient;

    // Expose current user as a signal
    currentUser: WritableSignal<User | null> = signal<User | null>(null);

    constructor(private router: Router) {
        // TODO: Replace with your actual Supabase URL and Key
        const supabaseUrl = 'https://obxghqptgkeoatgcdvah.supabase.co';
        const supabaseKey = 'sb_publishable_eDRkvyw7g-qaOv8wlNZQPw_xrgnT8vm';

        this.supabase = createClient(supabaseUrl, supabaseKey);

        // Initialize session
        this.supabase.auth.getSession().then(({ data }) => {
            this.currentUser.set(data.session?.user ?? null);
        });

        // Listen for auth changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            this.currentUser.set(session?.user ?? null);
            if (event === 'SIGNED_OUT') {
                this.currentUser.set(null);
            }
        });
    }

    async signUp(email: string, password: string) {
        return this.supabase.auth.signUp({
            email,
            password
        });
    }

    async signIn(email: string, password: string) {
        return this.supabase.auth.signInWithPassword({
            email,
            password
        });
    }

    async signOut() {
        return this.supabase.auth.signOut();
    }

    get user() {
        return this.currentUser();
    }
    get supabaseClient() {
        return this.supabase;
    }
}
