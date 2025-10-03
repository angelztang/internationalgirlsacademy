const stats = [
  { value: "2,000+", label: "Students Empowered" },
  { value: "Global Reach", label: "US to Liberia" },
]

export default function TrustIndicators() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 text-center">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-pink-50 p-8 rounded-xl">
            <h3 className="text-4xl font-bold text-pink-600 mb-2">{stat.value}</h3>
            <p className="text-gray-700">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}