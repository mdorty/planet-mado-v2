export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to Planet Mado
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Begin your journey in a world of martial arts and energy manipulation
        </p>
      </div>

      <div className="card p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <p className="text-center text-lg mb-8 text-gray-600 dark:text-gray-400">
          Join thousands of warriors training to become the strongest in the universe
        </p>

        <div className="space-y-4">
          <a 
            href="/login" 
            className="btn btn-primary w-full flex items-center justify-center"
          >
            <span>Login</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a 
            href="/register" 
            className="btn btn-secondary w-full flex items-center justify-center"
          >
            <span>Create Account</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}