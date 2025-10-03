const socialLinks = [
    { name: "Facebook", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Twitter", href: "#" },
  ]

  export default function Footer() {
    return (
      <footer className="bg-pink-600 text-white 
  py-12 px-6">
        <div className="max-w-6xl mx-auto 
  text-center">
          <button className="bg-white 
  text-pink-600 px-8 py-3 rounded-full font-bold 
  mb-6 hover:bg-pink-50 transition">
            Donate Now
          </button>
          <p className="text-pink-100 
  mb-4">Contact: info@iga.org</p>
          <div className="flex justify-center 
  gap-6">
            {socialLinks.map((link) => (
              <a key={link.name} href={link.href}
   className="hover:text-pink-200">
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    )
  }