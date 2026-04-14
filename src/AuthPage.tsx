import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "./lib/supabase";

type AuthMode = "login" | "register";

export default function AuthPage({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);

  async function handleAuth(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (mode === "register") {
  const fullName =
    (formData.get("full_name") as string) ||
    (formData.get("fullName") as string) ||
    "";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: "client",
      });
    }

    window.location.href = "/#/auth-success";
  }
}

  if (mode === "login") {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
  alert(error.message);
} else {
  window.location.href = "/#/dashboard";
}
  }
}

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f2ea_0%,#fcfaf6_100%)] px-4 py-12">
      <div className="mx-auto max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center rounded-2xl border border-[#d8cfc1] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#f4ede3]"
        >
          Torna indietro
        </button>

        <div className="overflow-hidden rounded-[32px] border border-[#e0d5c8] bg-white shadow-xl shadow-[#d8cfc1]/40">
          <div className="bg-[#103a52] px-8 py-8 text-white text-center">
  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d8c7a8]">
    Tunisia Gateway
  </p>

  <h1 className="mt-3 text-3xl font-bold">
    {mode === "login" ? "Accedi alla tua area" : "Crea il tuo account"}
  </h1>

  <p className="mt-3 text-sm leading-7 text-slate-200 max-w-sm mx-auto">
    {mode === "login"
      ? "Accedi alla tua area personale per continuare il tuo percorso con Tunisia Gateway."
      : "Registrati per accedere alla tua area personale e iniziare il tuo percorso."}
  </p>
</div>

          <div className="p-8">
            <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Accedi
              </button>

              <button
                type="button"
                onClick={() => setMode("register")}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  mode === "register"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Registrati
              </button>
            </div>

           <form className="space-y-5" onSubmit={handleAuth}>
              {mode === "register" && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Nome e cognome
                  </span>
                  <input
  type="text"
  name="full_name"
  placeholder="Mario Rossi"
  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
/>
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="nome@email.com"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </span>
                <div className="relative">
  <input
      type={showPassword ? "text" : "password"}
  name="password"
  placeholder="••••••••"
    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-slate-900"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
  >
    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
  </button>
</div>
              </label>

              {mode === "register" && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Conferma password
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  />
                </label>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#103a52] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#0d3145]"
              >
                {mode === "login" ? "Accedi" : "Crea account"}
              </button>

              <p className="text-center text-xs leading-6 text-slate-500">
                {mode === "login"
                  ? "Accedi per visualizzare sessione, stato del percorso e prossimi passaggi."
                  : "Creando un account potrai accedere alla tua area personale in qualsiasi momento."}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}