export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Hero Section */}
      <header className="bg-pink-400 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            International Girls Academy
          </h1>
          <p className="text-lg md:text-xl text-purple-100">
            Empowering girls through education and opportunity
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We are dedicated to providing quality education and creating opportunities
            for girls around the world to reach their full potential. We want to help them achieve their dreams
            in any field!
          </p>
        </section>
      </main>
    </div>
  )
}