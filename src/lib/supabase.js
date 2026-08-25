import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** True only when both env vars are set. */
export const isDbConfigured = Boolean(url && key);

/** Shared client, or null when the app runs in static-only mode. */
export const supabase = isDbConfigured ? createClient(url, key) : null;
