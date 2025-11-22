export type Belt = 'Branca' | 'Azul' | 'Roxa' | 'Marrom' | 'Preta'

export type TrainingType = 'Aula' | 'Rola' | 'Campeonato' | 'Drill' | 'Estudo Teórico'

export type TechniqueCategory = 
  | 'Guarda' 
  | 'Passagem' 
  | 'Finalização' 
  | 'Raspagem' 
  | 'Defesa' 
  | 'Transição'
  | 'Quedas'
  | 'Controle'

export type Position = 
  | 'Guarda Fechada'
  | 'Meia-Guarda'
  | '50/50'
  | 'De La Riva'
  | 'Spider Guard'
  | 'X-Guard'
  | 'Montada'
  | 'Costas'
  | 'Lateral'
  | 'Joelho na Barriga'
  | 'Em Pé'

export type TechniqueStatus = 'studying' | 'mastered' | 'review'

export type GoalStatus = 'in_progress' | 'completed' | 'cancelled'

export type SubscriptionStatus = 'free' | 'active' | 'expired' | 'cancelled'

export interface Profile {
  id: string
  email: string
  name: string
  belt: Belt
  academy: string
  instructor: string
  start_date: string
  subscription_status: SubscriptionStatus
  created_at: string
}

export interface Training {
  id: string
  user_id: string
  date: string
  type: TrainingType
  techniques: string[]
  observations: string
  effort_level: number
  created_at: string
}

export interface Technique {
  id: string
  user_id: string
  name: string
  category: TechniqueCategory
  position: Position
  notes: string
  status: TechniqueStatus
  created_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description: string
  deadline: string
  status: GoalStatus
  created_at: string
}
