import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function Home() {
  async function TestFetct() {
    const me = await apiFetch("/users/me");
    return me
    
  }
  
  const data = TestFetct()
  console.log(data)

  
  return (
    <main className="min-h-screen bg-zinc-50 px-6 pt-32 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <Header title="Invoice App" />

      <section className="mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Dashboard preview
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Manage invoices in light or dark mode.
            </h2>
            <p className="mt-3 max-w-xl text-zinc-600 dark:text-zinc-300">
              Your selected theme is saved in this browser and applied across
              the app automatically.
            </p>
            <div className="mt-6 flex gap-3">
              <Button>Create invoice</Button>
              <Button variant="outline">View reports</Button>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              This month
            </p>
            <p className="mt-3 text-3xl font-bold">$12,840</p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">Paid</span>
                <span className="font-medium">$9,420</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Pending
                </span>
                <span className="font-medium">$3,420</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
