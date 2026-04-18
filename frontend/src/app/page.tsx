import HomeHeader from "@/components/layout/header";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-100">
      
      <HomeHeader />

      <main>
        <section className="w-full">
          <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">
            
            {/* 🔥 TITLE: ganti kalau mau branding beda */}
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
              Kelola Invoice Lebih Mudah & Cepat
            </h1>

            {/* 📝 SUBTITLE: jelasin value app (max 2 baris) */}
            <p className="text-sm md:text-base text-slate-500 max-w-md">
              Buat, kirim, dan pantau invoice dalam satu tempat. 
              Simpel, cepat, dan tanpa ribet.
            </p>

            {/* 🚀 CTA BUTTON */}
            <div className="flex items-center gap-3 mt-2">
              
              {/* 👉 arahkan ke register (ubah kalau flow beda) */}
              <Link href="/account/register">
                <Button variant="primary" className="px-5 py-2">
                  Mulai Sekarang
                </Button>
              </Link>

              {/* 👉 scroll ke preview / atau bisa ganti ke /login */}
              <Link href="#preview">
                <Button variant="ghost" className="px-5 py-2">
                  Pelajari
                </Button>
              </Link>

            </div>

            {/* 📦 PREVIEW DASHBOARD */}
            <div
              id="preview"
              className="w-full max-w-3xl mt-10 bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-left"
            >
              
              {/* 🔥 Judul preview (boleh diubah nanti) */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-slate-700">
                  Dashboard Preview
                </h2>
                <span className="text-xs text-slate-400">Demo</span>
              </div>

              {/* 📊 DATA DUMMY: nanti bisa diganti real UI / ganti jadi image */ }
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Invoice #001</span>
                  <span className="text-slate-500">Rp 2.500.000</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Invoice #002</span>
                  <span className="text-slate-500">Rp 1.200.000</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Invoice #003</span>
                  <span className="text-slate-500">Rp 800.000</span>
                </div>
              </div>

              {/* 🖼️ OPTIONAL: nanti bisa ganti jadi gambar dashboard */}
              {/* contoh:
                  <img src="/dashboard.png" />
              */}

            </div>

          </div>
        </section>
      </main>
    </div>
  );
}