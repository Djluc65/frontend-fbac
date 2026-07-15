import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'
import { useSiteContent } from '../features/siteContent/useSiteContent'
import BrandLogo from './common/BrandLogo'
import ContactLinks from './common/ContactLinks'

const Footer = () => {
  const { content } = useSiteContent()
  const socialIcons = [Facebook, Instagram, Twitter, Linkedin]
  const contactInfo = {
    address: content.footer.contact.address,
    phoneDisplay: content.footer.contact.phone,
    email: content.footer.contact.email,
  }

  return (
    <footer className="bg-soft-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <BrandLogo
              to="/"
              className="mb-4 inline-flex max-w-full"
              imageClassName="max-w-[180px] sm:max-w-[220px]"
              loading="lazy"
            />
            <p className="text-gray-400 text-sm mb-4">
              {content.footer.description}
            </p>
            <div className="flex gap-4">
              {content.footer.socialLinks.map((item, index) => {
                const Icon = socialIcons[index % socialIcons.length]

                return (
                  <a
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                    aria-label={item.label}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              {content.footer.quickLinks.map((link) => (
                <li key={`${link.label}-${link.path}`}>
                  <Link to={link.path} className="text-gray-400 hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* S'impliquer */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">S'impliquer</h3>
            <ul className="space-y-2">
              {content.footer.engagementLinks.map((link) => (
                <li key={`${link.label}-${link.path}`}>
                  <Link to={link.path} className="text-gray-400 hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contact</h3>
            <ContactLinks
              contactInfo={contactInfo}
              variant="compact"
              theme="dark"
            />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            {content.footer.copyright}
          </p>
          <div className="flex gap-6 text-sm">
            {content.footer.legalLinks.map((link) => (
              <Link
                key={`${link.label}-${link.path}`}
                to={link.path}
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
