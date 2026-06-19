import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, ShieldAlert, Cpu } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#090912] border-t border-[#2A2A4A] py-12 mt-auto" id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Logo Column */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <Link to="/" className="flex items-center gap-2 group" id="footer-logo">
              <ShieldAlert className="w-5 h-5 text-[#E07B39]" />
              <span className="font-space font-bold text-lg tracking-wider text-[#F0F0F0]">
                EKC<span className="text-[#E07B39]">.</span>
              </span>
            </Link>
            <p className="text-xs text-[#A0A0B0] max-w-xs font-sans">
              Defending host vectors, deploying SIEM collectors, and logging security writeups under an ethical framework.
            </p>
          </div>

          {/* Links Column */}
          <div className="flex justify-center space-x-6 text-sm text-[#A0A0B0] font-space" id="footer-links">
            <Link to="/about" className="hover:text-[#E07B39] transition-colors">About</Link>
            <Link to="/projects" className="hover:text-[#E07B39] transition-colors">Projects</Link>
            <Link to="/skills" className="hover:text-[#E07B39] transition-colors">Skills</Link>
            <Link to="/blog" className="hover:text-[#E07B39] transition-colors">Blog</Link>
          </div>

          {/* Socials Column */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex space-x-4" id="footer-social-logos">
              <a 
                href="https://github.com/Elvis-chanda" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 bg-[#1A1A2E] border border-[#2A2A4A] rounded-lg text-[#A0A0B0] hover:text-[#E07B39] hover:border-[#E07B39] transition-all"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com/in/elvis-chanda-0b3296245" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 bg-[#1A1A2E] border border-[#2A2A4A] rounded-lg text-[#A0A0B0] hover:text-[#E07B39] hover:border-[#E07B39] transition-all"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="mailto:elvischanda31@gmail.com" 
                className="p-2 bg-[#1A1A2E] border border-[#2A2A4A] rounded-lg text-[#A0A0B0] hover:text-[#E07B39] hover:border-[#E07B39] transition-all"
                aria-label="Email Address"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#A0A0B0]">
              <Cpu className="w-3.5 h-3.5 text-[#E07B39]" />
              <span>Lusaka, Zambia 🇿🇲</span>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-[#1D1D35]/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#A0A0B0]">
          <p>© {currentYear} Elvis Kangwa Chanda. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span className="text-[#E07B39]">SOC_LEVEL0</span>
            <span>SECURE_SHELL_ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
