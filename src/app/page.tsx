import Link from 'next/link'
import { ArrowRight, BarChart3, PiggyBank, Wallet, TrendingUp, Shield, Zap, ChevronRight, Menu } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-0 -right-4 w-72 sm:w-96 h-72 sm:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute -bottom-8 left-20 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              My Finance
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
            >
              Daftar Gratis
            </Link>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
            >
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-full mb-6 sm:mb-8">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
            <span className="text-xs sm:text-sm text-gray-300">Kelola keuangan dengan mudah</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6">
            Atur Keuangan Anda
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Lebih Cerdas
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 px-4 sm:px-0">
            Satu aplikasi untuk melacak pengeluaran, mengatur budget, dan mencapai target tabungan Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Link
              href="/register"
              className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:opacity-90 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              Mulai Gratis
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              Sudah punya akun?
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Semua yang Anda Butuhkan
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto px-4 sm:px-0">
            Fitur lengkap untuk mengelola keuangan pribadi Anda dengan mudah dan efisien
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Feature 1 */}
          <div className="group p-5 sm:p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl sm:rounded-3xl hover:border-purple-500/50 transition-all duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Pelacakan Keuangan</h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Catat semua transaksi pemasukan dan pengeluaran dengan kategori yang terorganisir
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-5 sm:p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl sm:rounded-3xl hover:border-pink-500/50 transition-all duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Budget Planning</h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Atur budget bulanan per kategori dan pantau progress secara real-time
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-5 sm:p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl sm:rounded-3xl hover:border-green-500/50 transition-all duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
              <PiggyBank className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Target Tabungan</h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Tetapkan goals tabungan dengan deadline dan track progress menuju tujuan Anda
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group p-5 sm:p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl sm:rounded-3xl hover:border-blue-500/50 transition-all duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Laporan & Analisis</h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Lihat tren pengeluaran dan dapatkan insight dengan grafik yang mudah dipahami
            </p>
          </div>

          {/* Feature 5 */}
          <div className="group p-5 sm:p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl sm:rounded-3xl hover:border-yellow-500/50 transition-all duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Export Data</h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Download laporan keuangan dalam format CSV untuk analisis lebih lanjut
            </p>
          </div>

          {/* Feature 6 */}
          <div className="group p-5 sm:p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl sm:rounded-3xl hover:border-purple-500/50 transition-all duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Aman & Privat</h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Data keuangan Anda terenkripsi dan hanya dapat diakses oleh Anda
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="relative bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Siap Mengatur Keuangan Anda?
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
              Daftar gratis sekarang dan mulai perjalanan menuju kebebasan finansial
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors"
            >
              Mulai Sekarang
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-sm sm:text-base font-semibold text-gray-300">My Finance</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              © 2025 ymoricode. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
