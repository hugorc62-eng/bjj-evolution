'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/custom/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { Goal, GoalStatus } from '@/lib/types'
import { FREE_LIMITS } from '@/lib/constants'
import { Plus, Target, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

export default function GoalsPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loadingGoals, setLoadingGoals] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'in_progress' as GoalStatus
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchGoals()
    }
  }, [user])

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGoals(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar metas')
    } finally {
      setLoadingGoals(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const activeGoals = goals.filter(g => g.status === 'in_progress').length

    // Verificar limite da versão gratuita
    if (profile?.subscription_status === 'free' && activeGoals >= FREE_LIMITS.goals) {
      toast.error(`Limite de ${FREE_LIMITS.goals} metas ativas atingido. Assine o Plano Faixa Preta para continuar!`)
      return
    }

    try {
      const { error } = await supabase
        .from('goals')
        .insert({
          user_id: user?.id,
          ...formData
        })

      if (error) throw error

      toast.success('Meta criada com sucesso!')
      setDialogOpen(false)
      setFormData({
        title: '',
        description: '',
        deadline: '',
        status: 'in_progress'
      })
      fetchGoals()
    } catch (error: any) {
      toast.error('Erro ao criar meta')
    }
  }

  const updateGoalStatus = async (id: string, status: GoalStatus) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      toast.success('Status atualizado!')
      fetchGoals()
    } catch (error: any) {
      toast.error('Erro ao atualizar status')
    }
  }

  const inProgressGoals = goals.filter(g => g.status === 'in_progress')
  const completedGoals = goals.filter(g => g.status === 'completed')
  const cancelledGoals = goals.filter(g => g.status === 'cancelled')

  if (loading || loadingGoals) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const isFreeLimitReached = profile?.subscription_status === 'free' && inProgressGoals.length >= FREE_LIMITS.goals

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case 'in_progress':
        return <Clock className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusLabel = (status: GoalStatus) => {
    switch (status) {
      case 'in_progress':
        return 'Em Andamento'
      case 'completed':
        return 'Concluída'
      case 'cancelled':
        return 'Cancelada'
    }
  }

  const getDaysRemaining = (deadline: string) => {
    const days = differenceInDays(new Date(deadline), new Date())
    if (days < 0) return 'Prazo expirado'
    if (days === 0) return 'Hoje'
    if (days === 1) return '1 dia restante'
    return `${days} dias restantes`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Metas e Evolução</h1>
          <p className="text-gray-600">Defina objetivos e acompanhe seu progresso</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Metas</CardDescription>
              <CardTitle className="text-3xl">{goals.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Todas as metas
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardDescription>Em Andamento</CardDescription>
              <CardTitle className="text-3xl text-blue-700">{inProgressGoals.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Clock className="w-4 h-4" />
                <span>Ativas</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardDescription>Concluídas</CardDescription>
              <CardTitle className="text-3xl text-green-700">{completedGoals.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Alcançadas</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Taxa de Sucesso</CardDescription>
              <CardTitle className="text-3xl">
                {goals.length > 0 
                  ? Math.round((completedGoals.length / goals.length) * 100)
                  : 0
                }%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Metas concluídas
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerta de Limite */}
        {isFreeLimitReached && (
          <Card className="mb-6 border-yellow-400 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-1">
                    Limite de metas ativas atingido
                  </h3>
                  <p className="text-sm text-yellow-800 mb-3">
                    Você atingiu o limite de {FREE_LIMITS.goals} metas ativas da versão gratuita. 
                    Assine o Plano Faixa Preta para criar metas ilimitadas!
                  </p>
                  <Link href="/subscription">
                    <Button className="bg-yellow-600 hover:bg-yellow-700">
                      Ver Plano Faixa Preta
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions Bar */}
        <div className="flex justify-end mb-6">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 gap-2"
                disabled={isFreeLimitReached}
              >
                <Plus className="w-5 h-5" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Nova Meta</DialogTitle>
                <DialogDescription>
                  Defina um objetivo claro para sua evolução no Jiu-Jitsu
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Meta *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Melhorar defesa de arm-lock da guarda fechada"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva sua meta em detalhes, o que você quer alcançar..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Prazo *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-green-700">
                    Criar Meta
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {/* Em Andamento */}
          {inProgressGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Em Andamento</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {inProgressGoals.map((goal) => (
                  <Card key={goal.id} className="hover:shadow-md transition-shadow border-blue-200">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <Badge className={`${getStatusColor(goal.status)} gap-1`}>
                          {getStatusIcon(goal.status)}
                          {getStatusLabel(goal.status)}
                        </Badge>
                      </div>
                      <CardDescription>
                        Prazo: {format(new Date(goal.deadline), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </CardDescription>
                      <div className="text-sm font-medium text-blue-600">
                        {getDaysRemaining(goal.deadline)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {goal.description && (
                        <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateGoalStatus(goal.id, 'completed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Concluir
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGoalStatus(goal.id, 'cancelled')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Concluídas */}
          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Concluídas</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {completedGoals.map((goal) => (
                  <Card key={goal.id} className="hover:shadow-md transition-shadow border-green-200 bg-green-50/30">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <Badge className={`${getStatusColor(goal.status)} gap-1`}>
                          {getStatusIcon(goal.status)}
                          {getStatusLabel(goal.status)}
                        </Badge>
                      </div>
                      <CardDescription>
                        Prazo: {format(new Date(goal.deadline), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {goal.description && (
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Canceladas */}
          {cancelledGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Canceladas</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {cancelledGoals.map((goal) => (
                  <Card key={goal.id} className="hover:shadow-md transition-shadow opacity-60">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <Badge className={`${getStatusColor(goal.status)} gap-1`}>
                          {getStatusIcon(goal.status)}
                          {getStatusLabel(goal.status)}
                        </Badge>
                      </div>
                      <CardDescription>
                        Prazo: {format(new Date(goal.deadline), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {goal.description && (
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {goals.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma meta criada ainda
                </h3>
                <p className="text-gray-600 mb-4">
                  Defina suas primeiras metas para acompanhar sua evolução!
                </p>
                {!isFreeLimitReached && (
                  <Button onClick={() => setDialogOpen(true)} className="bg-gradient-to-r from-green-600 to-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Meta
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
