const socialLinks = [
    { name: "Instagram", href: "#" },
    { name: "Twitter", href: "#" },
    { name: "LinkedIn", href: "#" },
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
      <footer className="bg-gradient-to-b 
  from-blue-900 to-blue-950 text-white py-16 
  px-6">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 
  gap-12 mb-12">
            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-bold text-lg 
  mb-4 text-blue-200">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-blue-100 
  hover:text-white transition"
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
              <h3 className="font-bold text-lg 
  mb-4 text-blue-200">Connect</h3>
              <div className="space-y-3 mb-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block 
  text-blue-100 hover:text-white transition"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <div>
                <p className="text-blue-100 
  mb-2">Newsletter</p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 
  rounded-lg bg-blue-800 text-white 
  placeholder-blue-300 focus:outline-none 
  focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t 
  border-blue-800 pt-8 text-center">
            <p className="text-blue-200">
              © 2025 International Girls
  Academy. Empowering students worldwide. 🌍✨
            </p>
          </div>
        </div>
      </footer>
    )
  }