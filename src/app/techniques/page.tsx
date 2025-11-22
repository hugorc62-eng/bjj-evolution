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
import { Technique, TechniqueStatus } from '@/lib/types'
import { TECHNIQUE_CATEGORIES, POSITIONS, FREE_LIMITS } from '@/lib/constants'
import { Plus, Search, Dumbbell, AlertCircle, BookOpen, CheckCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function TechniquesPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [techniques, setTechniques] = useState<Technique[]>([])
  const [loadingTechniques, setLoadingTechniques] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<TechniqueStatus | 'all'>('all')
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    position: '',
    notes: '',
    status: 'studying' as TechniqueStatus
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchTechniques()
    }
  }, [user])

  const fetchTechniques = async () => {
    try {
      const { data, error } = await supabase
        .from('techniques')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTechniques(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar técnicas')
    } finally {
      setLoadingTechniques(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar limite da versão gratuita
    if (profile?.subscription_status === 'free' && techniques.length >= FREE_LIMITS.techniques) {
      toast.error(`Limite de ${FREE_LIMITS.techniques} técnicas atingido. Assine o Plano Faixa Preta para continuar!`)
      return
    }

    try {
      const { error } = await supabase
        .from('techniques')
        .insert({
          user_id: user?.id,
          ...formData
        })

      if (error) throw error

      toast.success('Técnica adicionada com sucesso!')
      setDialogOpen(false)
      setFormData({
        name: '',
        category: '',
        position: '',
        notes: '',
        status: 'studying'
      })
      fetchTechniques()
    } catch (error: any) {
      toast.error('Erro ao adicionar técnica')
    }
  }

  const updateTechniqueStatus = async (id: string, status: TechniqueStatus) => {
    try {
      const { error } = await supabase
        .from('techniques')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      toast.success('Status atualizado!')
      fetchTechniques()
    } catch (error: any) {
      toast.error('Erro ao atualizar status')
    }
  }

  const filteredTechniques = techniques.filter(technique => {
    const matchesSearch = 
      technique.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technique.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technique.position.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || technique.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const studyingCount = techniques.filter(t => t.status === 'studying').length
  const masteredCount = techniques.filter(t => t.status === 'mastered').length
  const reviewCount = techniques.filter(t => t.status === 'review').length

  if (loading || loadingTechniques) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const isFreeLimitReached = profile?.subscription_status === 'free' && techniques.length >= FREE_LIMITS.techniques

  const getStatusIcon = (status: TechniqueStatus) => {
    switch (status) {
      case 'studying':
        return <BookOpen className="w-4 h-4" />
      case 'mastered':
        return <CheckCircle className="w-4 h-4" />
      case 'review':
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: TechniqueStatus) => {
    switch (status) {
      case 'studying':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'mastered':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  }

  const getStatusLabel = (status: TechniqueStatus) => {
    switch (status) {
      case 'studying':
        return 'Em Estudo'
      case 'mastered':
        return 'Dominada'
      case 'review':
        return 'Revisar'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Banco de Técnicas</h1>
          <p className="text-gray-600">Organize e acompanhe seu arsenal de técnicas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Técnicas</CardDescription>
              <CardTitle className="text-3xl">{techniques.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Todas as técnicas
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardDescription>Em Estudo</CardDescription>
              <CardTitle className="text-3xl text-blue-700">{studyingCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <BookOpen className="w-4 h-4" />
                <span>Aprendendo</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardDescription>Dominadas</CardDescription>
              <CardTitle className="text-3xl text-green-700">{masteredCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Prontas para usar</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardDescription>Para Revisar</CardDescription>
              <CardTitle className="text-3xl text-yellow-700">{reviewCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <Clock className="w-4 h-4" />
                <span>Precisam atenção</span>
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
                    Limite de técnicas atingido
                  </h3>
                  <p className="text-sm text-yellow-800 mb-3">
                    Você atingiu o limite de {FREE_LIMITS.techniques} técnicas da versão gratuita. 
                    Assine o Plano Faixa Preta para adicionar técnicas ilimitadas!
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
              placeholder="Buscar técnica..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="studying">Em Estudo</SelectItem>
              <SelectItem value="mastered">Dominadas</SelectItem>
              <SelectItem value="review">Para Revisar</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 gap-2"
                disabled={isFreeLimitReached}
              >
                <Plus className="w-5 h-5" />
                Nova Técnica
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Técnica</DialogTitle>
                <DialogDescription>
                  Registre uma nova técnica no seu banco
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Técnica *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Triângulo da guarda fechada"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {TECHNIQUE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Posição Inicial *</Label>
                    <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a posição" />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITIONS.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: TechniqueStatus) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studying">Em Estudo</SelectItem>
                      <SelectItem value="mastered">Dominada</SelectItem>
                      <SelectItem value="review">Revisar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas Pessoais</Label>
                  <Textarea
                    id="notes"
                    placeholder="Detalhes, dicas, pontos de atenção..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700">
                    Adicionar Técnica
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Techniques Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTechniques.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm || filterStatus !== 'all' ? 'Nenhuma técnica encontrada' : 'Nenhuma técnica cadastrada'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece adicionando suas primeiras técnicas!'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && !isFreeLimitReached && (
                  <Button onClick={() => setDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeira Técnica
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredTechniques.map((technique) => (
              <Card key={technique.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{technique.name}</CardTitle>
                    <Badge className={`${getStatusColor(technique.status)} gap-1`}>
                      {getStatusIcon(technique.status)}
                      {getStatusLabel(technique.status)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{technique.category}</Badge>
                    <Badge variant="outline">{technique.position}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {technique.notes && (
                    <p className="text-sm text-gray-600 mb-4">{technique.notes}</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateTechniqueStatus(technique.id, 'studying')}
                      className={technique.status === 'studying' ? 'border-blue-500 text-blue-700' : ''}
                    >
                      Em Estudo
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateTechniqueStatus(technique.id, 'mastered')}
                      className={technique.status === 'mastered' ? 'border-green-500 text-green-700' : ''}
                    >
                      Dominada
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateTechniqueStatus(technique.id, 'review')}
                      className={technique.status === 'review' ? 'border-yellow-500 text-yellow-700' : ''}
                    >
                      Revisar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
