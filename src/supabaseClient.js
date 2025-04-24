// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aiwvtdlxttkutsntyljb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpd3Z0ZGx4dHRrdXRzbnR5bGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwODE5OTcsImV4cCI6MjA2MDY1Nzk5N30.GEkgUcQDw23yiCw-ETI6rouBwnfGplV4P54UG6StoKg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
