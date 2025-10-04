const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/theinternationalgirlsacademy/" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/the-international-girls-academy/" },
]

const footerSections = [
  {
    title: "About IGA",
    links: [
      { name: "Our Mission", href: "#" },
      { name: "Our Team", href: "#" },
      { name: "Impact Reports", href: "#" },
      { name: "Contact Us", href: "#" },
    ],
  },
  {
    title: "Programs",
    links: [
      { name: "Ujima", href: "#" },
      { name: "After School", href: "#" },
      { name: "Entrepreneurship", href: "#" },
      { name: "Alumni Network", href: "#" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { name: "Become a Student", href: "#" },
      { name: "Volunteer", href: "#" },
      { name: "Donate", href: "#" },
      { name: "Partner With Us", href: "#" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-blue-primary text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-lg mb-4 text-white-accent">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white-accent hover:text-white transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white-accent">Connect</h3>
            <div className="space-y-3 mb-6">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-100 hover:text-white transition"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div>
              <p className="text-white-accent mb-2">Newsletter</p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg bg-white-accent text-blue-primary placeholder-blue-primary focus:outline-none focus:ring-2 focus:ring-blue-primary"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white-accent/20 pt-8 text-center">
          <p className="text-white-accent">
            © 2025 International Girls Academy. Empowering students worldwide. 🌍✨
          </p>
        </div>
      </div>
    </footer>
  )
}
