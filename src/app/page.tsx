export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold mb-8">Welcome to Planet Mado RPG</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-center mb-4">Login or create an account to start your journey</p>
        <div className="flex flex-col gap-4">
          <a 
            href="/login" 
            className="bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700"
          >
            Login
          </a>
          <a 
            href="/register" 
            className="bg-green-600 text-white py-2 px-4 rounded text-center hover:bg-green-700"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}