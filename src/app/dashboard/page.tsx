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
import { supabase } from '@/lib/supabase'
import { Training } from '@/lib/types'
import { TRAINING_TYPES, EFFORT_LEVELS, FREE_LIMITS } from '@/lib/constants'
import { Plus, Calendar, Search, TrendingUp, Dumbbell, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loadingTrainings, setLoadingTrainings] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: '',
    techniques: '',
    observations: '',
    effort_level: 3
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchTrainings()
    }
  }, [user])

  const fetchTrainings = async () => {
    try {
      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })

      if (error) throw error
      setTrainings(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar treinos')
    } finally {
      setLoadingTrainings(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar limite da versão gratuita
    if (profile?.subscription_status === 'free' && trainings.length >= FREE_LIMITS.trainings) {
      toast.error(`Limite de ${FREE_LIMITS.trainings} treinos atingido. Assine o Plano Faixa Preta para continuar!`)
      return
    }

    try {
      const techniquesArray = formData.techniques
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const { error } = await supabase
        .from('trainings')
        .insert({
          user_id: user?.id,
          date: formData.date,
          type: formData.type,
          techniques: techniquesArray,
          observations: formData.observations,
          effort_level: formData.effort_level
        })

      if (error) throw error

      toast.success('Treino registrado com sucesso!')
      setDialogOpen(false)
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        type: '',
        techniques: '',
        observations: '',
        effort_level: 3
      })
      fetchTrainings()
    } catch (error: any) {
      toast.error('Erro ao registrar treino')
    }
  }

  const filteredTrainings = trainings.filter(training => {
    const searchLower = searchTerm.toLowerCase()
    return (
      training.type.toLowerCase().includes(searchLower) ||
      training.techniques.some(t => t.toLowerCase().includes(searchLower)) ||
      training.observations.toLowerCase().includes(searchLower)
    )
  })

  const thisMonthTrainings = trainings.filter(t => {
    const trainingDate = new Date(t.date)
    const now = new Date()
    return trainingDate.getMonth() === now.getMonth() && 
           trainingDate.getFullYear() === now.getFullYear()
  })

  if (loading || loadingTrainings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const isFreeLimitReached = profile?.subscription_status === 'free' && trainings.length >= FREE_LIMITS.trainings

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header com Stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diário de Treinos</h1>
          <p className="text-gray-600">Registre e acompanhe sua evolução no Jiu-Jitsu</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Treinos</CardDescription>
              <CardTitle className="text-3xl">{trainings.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Dumbbell className="w-4 h-4" />
                <span>Todos os registros</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Treinos este Mês</CardDescription>
              <CardTitle className="text-3xl">{thisMonthTrainings.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(), 'MMMM yyyy', { locale: ptBR })}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Esforço Médio</CardDescription>
              <CardTitle className="text-3xl">
                {trainings.length > 0 
                  ? (trainings.reduce((acc, t) => acc + t.effort_level, 0) / trainings.length).toFixed(1)
                  : '0'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>De 1 a 5</span>
              </div>
            </CardContent>
          </Card>

          <Card className={profile?.subscription_status === 'free' ? 'border-yellow-300 bg-yellow-50' : ''}>
            <CardHeader className="pb-3">
              <CardDescription>Plano Atual</CardDescription>
              <CardTitle className="text-xl">
                {profile?.subscription_status === 'free' ? 'Gratuito' : 'Faixa Preta'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.subscription_status === 'free' ? (
                <div className="text-sm text-yellow-700">
                  {trainings.length}/{FREE_LIMITS.trainings} treinos
                </div>
              ) : (
                <div className="text-sm text-green-700">
                  Treinos ilimitados
                </div>
              )}
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
                    Limite de treinos atingido
                  </h3>
                  <p className="text-sm text-yellow-800 mb-3">
                    Você atingiu o limite de {FREE_LIMITS.trainings} treinos da versão gratuita. 
                    Assine o Plano Faixa Preta para continuar registrando seus treinos sem limites!
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
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por técnica, tipo ou observação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 gap-2"
                disabled={isFreeLimitReached}
              >
                <Plus className="w-5 h-5" />
                Novo Treino
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Novo Treino</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do seu treino de hoje
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Treino *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRAINING_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="techniques">Técnicas Treinadas</Label>
                  <Input
                    id="techniques"
                    placeholder="Ex: Triângulo, Passagem de guarda, Raspagem (separe por vírgula)"
                    value={formData.techniques}
                    onChange={(e) => setFormData({ ...formData, techniques: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separe múltiplas técnicas por vírgula
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observations">Observações / Aprendizados</Label>
                  <Textarea
                    id="observations"
                    placeholder="O que você aprendeu hoje? Alguma dificuldade ou insight?"
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="effort">Nível de Esforço: {formData.effort_level}</Label>
                  <Select 
                    value={formData.effort_level.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, effort_level: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EFFORT_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value.toString()}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-red-600 to-red-700">
                    Salvar Treino
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Training List */}
        <div className="space-y-4">
          {filteredTrainings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'Nenhum treino encontrado' : 'Nenhum treino registrado ainda'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'Tente buscar por outros termos'
                    : 'Comece registrando seu primeiro treino!'
                  }
                </p>
                {!searchTerm && !isFreeLimitReached && (
                  <Button onClick={() => setDialogOpen(true)} className="bg-gradient-to-r from-red-600 to-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Primeiro Treino
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredTrainings.map((training) => (
              <Card key={training.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{training.type}</CardTitle>
                      <CardDescription>
                        {format(new Date(training.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Esforço:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-2 h-6 rounded-sm ${
                              level <= training.effort_level ? 'bg-red-600' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {training.techniques.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Técnicas:</p>
                      <div className="flex flex-wrap gap-2">
                        {training.techniques.map((technique, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                          >
                            {technique}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {training.observations && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Observações:</p>
                      <p className="text-sm text-gray-600">{training.observations}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
