import Link from 'next/link'
import { ArrowRight, BarChart3, FileText, Target, Wallet } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            NoteFlow
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Kelola catatan, keuangan, kebiasaan, dan budget Anda - semua dalam satu dashboard
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/login"
              className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Daftar Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Catatan Harian</h3>
              <p className="text-gray-600 text-sm">
                Catat pemikiran dan ide Anda dengan sistem note-taking yang indah
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pelacakan Keuangan</h3>
              <p className="text-gray-600 text-sm">
                Lacak pengeluaran dan pemasukan dengan visualisasi yang powerful
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Wallet className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Budget Planning</h3>
              <p className="text-gray-600 text-sm">
                Atur budget per kategori dan monitor progress dengan mudah
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Target className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pelacak Kebiasaan</h3>
              <p className="text-gray-600 text-sm">
                Bangun kebiasaan baik dengan tracking harian dan visualisasi progress
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500">
              © 2025 ymoricode. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
