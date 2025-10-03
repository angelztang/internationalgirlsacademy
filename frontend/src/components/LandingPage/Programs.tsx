const programs = [
  {
    title: "Ujima Business Program",
    description: "12 weeks to launch your business",
  },
  {
    title: "Kumbathon",
    description: "Make coding cool through hackathons",
  },
  {
    title: "Box of Open Love",
    description: "Get essential items for school/college",
  },
]

export default function Programs() {
  return (
    <section className="bg-pink-500 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Our Programs</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div key={program.title} className="bg-white text-gray-800 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-pink-600 mb-3">{program.title}</h3>
              <p className="text-gray-600 mb-4">{program.description}</p>
              <a href="#" className="text-pink-600 font-semibold hover:underline">
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}