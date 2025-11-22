'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { BookOpen, Target, Dumbbell, Crown, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-black/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-black rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-3xl">BJJ</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              BJJ Evolution
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Seu diário completo de treinos de Jiu-Jitsu. Registre, organize e evolua.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-6 text-lg">
                  Começar Agora
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Diário de Treinos</h3>
            <p className="text-gray-600">
              Registre cada treino com detalhes: técnicas, observações, nível de esforço e muito mais.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Dumbbell className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Banco de Técnicas</h3>
            <p className="text-gray-600">
              Organize suas técnicas por categoria, posição e status de aprendizado.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Metas e Evolução</h3>
            <p className="text-gray-600">
              Defina metas, acompanhe seu progresso e veja sua evolução ao longo do tempo.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription CTA */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-t border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-200 text-yellow-900 px-4 py-2 rounded-full font-semibold mb-6">
              <Crown className="w-5 h-5" />
              Plano Faixa Preta
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Evolua sem limites
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Acesso completo a todas as funcionalidades por apenas R$ 29,90/mês
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Versão Gratuita</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Até 10 treinos registrados</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Até 15 técnicas no banco</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Até 3 metas ativas</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                  <Crown className="w-6 h-6 text-yellow-900" />
                  <h3 className="text-lg font-bold text-yellow-900">Plano Faixa Preta</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-900 mt-0.5 flex-shrink-0" />
                    <span className="text-yellow-900 font-medium">Treinos ilimitados</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-900 mt-0.5 flex-shrink-0" />
                    <span className="text-yellow-900 font-medium">Técnicas ilimitadas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-900 mt-0.5 flex-shrink-0" />
                    <span className="text-yellow-900 font-medium">Metas ilimitadas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-900 mt-0.5 flex-shrink-0" />
                    <span className="text-yellow-900 font-medium">Resumo mensal detalhado</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-900 mt-0.5 flex-shrink-0" />
                    <span className="text-yellow-900 font-medium">Suporte prioritário</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 BJJ Evolution. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
