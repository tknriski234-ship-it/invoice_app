export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Daftar ke akun kamu.
      </p>

      <form className="mt-6 space-y-4">
        <input type="text"
        placeholder="Nama" 
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"/>
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <button className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
          Register
        </button>
      </form>
    </>
  );
}