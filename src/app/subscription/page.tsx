'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/custom/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown, CheckCircle, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function SubscriptionPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  // Se já é assinante
  if (profile.subscription_status === 'active') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-yellow-900" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Você já é Faixa Preta!
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Sua assinatura está ativa e você tem acesso completo a todas as funcionalidades.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700">
                  Voltar ao Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-200 text-yellow-900 px-4 py-2 rounded-full font-semibold mb-6">
            <Crown className="w-5 h-5" />
            Plano Faixa Preta
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Plano Faixa Preta – BJJ Evolution
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desbloqueie todo o potencial do BJJ Evolution e leve seu Jiu-Jitsu para o próximo nível
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-2 border-yellow-400 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-8 h-8 text-yellow-900" />
                <h2 className="text-3xl font-bold text-yellow-900">
                  Plano Faixa Preta
                </h2>
              </div>
              <div className="text-5xl font-bold text-yellow-900 mb-2">
                R$ 29,90
              </div>
              <p className="text-yellow-900 font-medium">por mês</p>
            </div>

            <CardContent className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 font-semibold">Diário de treinos ilimitado</p>
                    <p className="text-gray-600 text-sm">Registre todos os seus treinos sem limites</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 font-semibold">Banco de técnicas sem limite</p>
                    <p className="text-gray-600 text-sm">Crie e organize quantas técnicas quiser</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 font-semibold">Metas e acompanhamento de evolução</p>
                    <p className="text-gray-600 text-sm">Defina objetivos e acompanhe seu progresso</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 font-semibold">Análises e relatórios detalhados</p>
                    <p className="text-gray-600 text-sm">Insights sobre sua evolução no Jiu-Jitsu</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 font-semibold">Backup automático em nuvem</p>
                    <p className="text-gray-600 text-sm">Seus dados sempre seguros e acessíveis</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 font-semibold">Suporte prioritário</p>
                    <p className="text-gray-600 text-sm">Atendimento rápido para suas dúvidas</p>
                  </div>
                </div>
              </div>

              {/* CTA Button - Link Cackto */}
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-yellow-900 font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => {
                    window.open('https://pay.cakto.com.br/38gad82_661994', '_blank')
                  }}
                >
                  <Crown className="w-6 h-6 mr-2" />
                  Assinar Plano Faixa Preta
                </Button>
                
                <p className="text-center text-sm text-gray-600">
                  Pagamento seguro processado pela Cackto
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Por que assinar o Plano Faixa Preta?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Sem Limites</CardTitle>
                <CardDescription>
                  Registre treinos, técnicas e metas ilimitadas. Sem restrições para sua evolução.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Análises Detalhadas</CardTitle>
                <CardDescription>
                  Resumos mensais completos com insights sobre sua evolução e progresso.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Backup Automático</CardTitle>
                <CardDescription>
                  Seus dados sempre seguros com backup automático em nuvem.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Suporte Prioritário</CardTitle>
                <CardDescription>
                  Atendimento rápido e prioritário para resolver qualquer dúvida.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <Crown className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle>Recursos Exclusivos</CardTitle>
                <CardDescription>
                  Acesso antecipado a novos recursos e funcionalidades premium.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Cancele Quando Quiser</CardTitle>
                <CardDescription>
                  Sem compromisso de longo prazo. Cancele sua assinatura a qualquer momento.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como funciona o pagamento?</CardTitle>
                <CardDescription>
                  O pagamento é processado de forma segura pela Cackto. Você será redirecionado para a página de checkout onde poderá escolher sua forma de pagamento preferida.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
                <CardDescription>
                  Sim! Você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">O que acontece com meus dados se eu cancelar?</CardTitle>
                <CardDescription>
                  Seus dados ficam salvos e você pode reativar sua assinatura a qualquer momento. Na versão gratuita, você terá acesso limitado aos seus registros.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como ativo minha assinatura após o pagamento?</CardTitle>
                <CardDescription>
                  Após a confirmação do pagamento pela Cackto, sua conta será automaticamente atualizada para o Plano Faixa Preta em alguns minutos.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
