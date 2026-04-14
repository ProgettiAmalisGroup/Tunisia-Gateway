export default function AuthSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f2ea] p-6">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-[#103a52]">
          🎉 Account creato con Successo
        </h1>

        <p className="mt-4 text-slate-600">
          La registrazione è andata a buon fine.
        </p>

        <button
          onClick={() => (window.location.href = "/#/welcome")}
          className="mt-6 w-full rounded-2xl bg-[#103a52] px-6 py-3 text-white font-semibold"
        >
          Vai alla tua dashboard
        </button>
      </div>
    </div>
  );
}