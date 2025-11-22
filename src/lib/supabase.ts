import { createClient } from '@supabase/supabase-js'

// Valores padrão seguros para evitar erro de inicialização
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'

// Criar cliente Supabase com configuração segura
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Verificar se as credenciais estão configuradas
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          belt: string
          academy: string
          instructor: string
          start_date: string
          subscription_status: 'free' | 'active' | 'expired' | 'cancelled'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      trainings: {
        Row: {
          id: string
          user_id: string
          date: string
          type: string
          techniques: string[]
          observations: string
          effort_level: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['trainings']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['trainings']['Insert']>
      }
      techniques: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          position: string
          notes: string
          status: 'studying' | 'mastered' | 'review'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['techniques']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['techniques']['Insert']>
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          deadline: string
          status: 'in_progress' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['goals']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['goals']['Insert']>
      }
    }
  }
}
