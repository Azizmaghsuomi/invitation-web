import { createClient } from "@supabase/supabase-js";

const normalizeSupabaseUrl = (value?: string) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) {
        return value;
    }
    return `https://${value}.supabase.co`;
};

const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and anon key must be defined");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

export const adminSupabase = supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
          auth: {
              persistSession: false,
              autoRefreshToken: false,
          },
      })
    : null;
