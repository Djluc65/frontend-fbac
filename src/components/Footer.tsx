import { Link } from 'react-router-dom'
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-soft-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <div>
                <span className="font-display font-bold text-lg">Fondation</span>
                <span className="font-display font-bold text-lg text-orange-400"> Bien Aimé Cassis</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Offrir l'éducation, la dignité et l'espoir pour chaque enfant en Haïti.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link to="/a-propos" className="text-gray-400 hover:text-orange-400 transition-colors">À propos</Link></li>
              <li><Link to="/programmes" className="text-gray-400 hover:text-orange-400 transition-colors">Programmes</Link></li>
              <li><Link to="/campagnes" className="text-gray-400 hover:text-orange-400 transition-colors">Campagnes</Link></li>
              <li><Link to="/actualites" className="text-gray-400 hover:text-orange-400 transition-colors">Actualités</Link></li>
              <li><Link to="/transparence" className="text-gray-400 hover:text-orange-400 transition-colors">Transparence</Link></li>
            </ul>
          </div>

          {/* S'impliquer */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">S'impliquer</h3>
            <ul className="space-y-2">
              <li><Link to="/faire-un-don" className="text-gray-400 hover:text-orange-400 transition-colors">Faire un don</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-orange-400 transition-colors">Devenir bénévole</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-orange-400 transition-colors">Partenariat</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-orange-400 transition-colors">Événements</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">Port-au-Prince, Haïti</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <span className="text-gray-400">+509 XX XX XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <span className="text-gray-400">contact@fondationbac.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 Fondation Bien Aimé Cassis. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="#" className="text-gray-400 hover:text-orange-400 transition-colors">Mentions légales</Link>
            <Link to="#" className="text-gray-400 hover:text-orange-400 transition-colors">Politique de confidentialité</Link>
            <Link to="#" className="text-gray-400 hover:text-orange-400 transition-colors">CGU</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
