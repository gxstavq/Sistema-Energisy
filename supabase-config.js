const SUPABASE_URL = "https://rqeapbrmgnyoqslxkeea.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2Ub8DnNeaT6NMJW8bU4LGQ__PUiA66h"; 

window.isSupabaseConfigured = true;

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);