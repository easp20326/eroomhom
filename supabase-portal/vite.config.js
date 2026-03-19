import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    __SUPABASE_URL__: JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://ewwfjhcrvayjmdsxtygr.supabase.co'),
    __SUPABASE_ANON_KEY__: JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3d2ZqaGNydmF5am1kc3h0eWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MDIyMjAsImV4cCI6MjA4OTQ3ODIyMH0.KHGj9UBNXxNuYteyJz5eHB-EoxR4nOPub7tnwrxMEho'),
  },
});
