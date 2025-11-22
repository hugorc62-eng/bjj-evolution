import { Belt, TrainingType, TechniqueCategory, Position } from './types'

export const BELTS: Belt[] = ['Branca', 'Azul', 'Roxa', 'Marrom', 'Preta']

export const TRAINING_TYPES: TrainingType[] = [
  'Aula',
  'Rola',
  'Campeonato',
  'Drill',
  'Estudo Teórico'
]

export const TECHNIQUE_CATEGORIES: TechniqueCategory[] = [
  'Guarda',
  'Passagem',
  'Finalização',
  'Raspagem',
  'Defesa',
  'Transição',
  'Quedas',
  'Controle'
]

export const POSITIONS: Position[] = [
  'Guarda Fechada',
  'Meia-Guarda',
  '50/50',
  'De La Riva',
  'Spider Guard',
  'X-Guard',
  'Montada',
  'Costas',
  'Lateral',
  'Joelho na Barriga',
  'Em Pé'
]

export const EFFORT_LEVELS = [
  { value: 1, label: '1 - Muito Leve' },
  { value: 2, label: '2 - Leve' },
  { value: 3, label: '3 - Moderado' },
  { value: 4, label: '4 - Intenso' },
  { value: 5, label: '5 - Muito Intenso' }
]

// Limites da versão gratuita
export const FREE_LIMITS = {
  trainings: 10,
  techniques: 15,
  goals: 3
}

// Configuração do Plano Faixa Preta
export const SUBSCRIPTION_CONFIG = {
  planName: 'Plano Faixa Preta',
  monthlyPrice: 'R$ 29,90',
  benefits: [
    'Acesso ilimitado ao diário de treinos',
    'Banco de técnicas sem limite',
    'Criação e acompanhamento de metas ilimitadas',
    'Resumo mensal de evolução detalhado',
    'Suporte prioritário',
    'Backup automático dos seus dados'
  ]
}
