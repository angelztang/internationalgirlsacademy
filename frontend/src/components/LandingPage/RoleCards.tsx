const roles = [
  { title: "I'm a Student", description: "Start your learning journey" },
  { title: "I'm a Parent", description: "Support your child's growth" },
  { title: "I'm a Volunteer/Mentor", description: "Make a difference" },
  { title: "I'm an Alumni", description: "Stay connected" },
]

export default function RoleCards() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles.map((role) => (
          <div
            key={role.title}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-pink-200"
          >
            <h3 className="text-xl font-bold text-pink-600 mb-2">{role.title}</h3>
            <p className="text-gray-600">{role.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}