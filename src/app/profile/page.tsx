'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/custom/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { BELTS } from '@/lib/constants'
import { User, Calendar, Award, Building, GraduationCap, Crown } from 'lucide-react'
import { toast } from 'sonner'
import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    belt: '',
    academy: '',
    instructor: '',
    start_date: ''
  })
  const [trainingsCount, setTrainingsCount] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        belt: profile.belt,
        academy: profile.academy,
        instructor: profile.instructor,
        start_date: profile.start_date
      })
      fetchTrainingsCount()
    }
  }, [profile])

  const fetchTrainingsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('trainings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)

      if (error) throw error
      setTrainingsCount(count || 0)
    } catch (error: any) {
      console.error('Erro ao carregar contagem de treinos')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id)

      if (error) throw error

      toast.success('Perfil atualizado com sucesso!')
      setEditing(false)
      refreshProfile()
    } catch (error: any) {
      toast.error('Erro ao atualizar perfil')
    }
  }

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const daysTraining = differenceInDays(new Date(), new Date(profile.start_date))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-black rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                  <CardDescription className="text-lg">{profile.belt}</CardDescription>
                </div>
              </div>
              {profile.subscription_status === 'active' && (
                <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                  <Crown className="w-5 h-5" />
                  <span className="font-semibold">Faixa Preta</span>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Treinos</CardDescription>
              <CardTitle className="text-3xl">{trainingsCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Registrados</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Dias Treinando</CardDescription>
              <CardTitle className="text-3xl">{daysTraining}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="w-4 h-4" />
                <span>Desde {format(new Date(profile.start_date), 'dd/MM/yyyy')}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Plano Atual</CardDescription>
              <CardTitle className="text-xl">
                {profile.subscription_status === 'free' ? 'Gratuito' : 'Faixa Preta'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.subscription_status === 'free' ? (
                <Link href="/subscription">
                  <Button size="sm" variant="outline" className="w-full">
                    Fazer Upgrade
                  </Button>
                </Link>
              ) : (
                <div className="text-sm text-green-600 font-medium">
                  Assinatura Ativa
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Atualize seus dados cadastrais</CardDescription>
              </div>
              {!editing && (
                <Button onClick={() => setEditing(true)} variant="outline">
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!editing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="belt">Faixa Atual</Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                    <Select 
                      value={formData.belt} 
                      onValueChange={(value) => setFormData({ ...formData, belt: value })}
                      disabled={!editing}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BELTS.map((belt) => (
                          <SelectItem key={belt} value={belt}>
                            {belt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Data de Início no Jiu-Jitsu</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      disabled={!editing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academy">Academia</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="academy"
                      value={formData.academy}
                      onChange={(e) => setFormData({ ...formData, academy: e.target.value })}
                      disabled={!editing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructor">Professor</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="instructor"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      disabled={!editing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-gradient-to-r from-red-600 to-red-700">
                    Salvar Alterações
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEditing(false)
                      setFormData({
                        name: profile.name,
                        belt: profile.belt,
                        academy: profile.academy,
                        instructor: profile.instructor,
                        start_date: profile.start_date
                      })
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
