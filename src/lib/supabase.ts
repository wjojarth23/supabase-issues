import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://site.supabase.co';
const supabaseAnonKey = 'anonymous-key';


export const supabase = createClient(supabaseUrl, supabaseAnonKey);