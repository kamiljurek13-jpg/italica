const Footer = () => {
  return (
    <footer className="w-full bg-white text-black pt-8 pb-2 px-6 border-t border-[#e5e5e5] mt-48">
      <div className="">
        <div className="mb-8">
          <span className="text-xl tracking-[0.3em] font-light text-black mb-4 block">ITALICA</span>
          <p className="text-sm font-light text-black/70 leading-relaxed max-w-md mb-6">
            Luxury Italian lingerie crafted in Milano for the modern woman
          </p>

          <div className="space-y-2 text-sm font-light text-black/70">
            <div>
              <p className="font-normal text-black mb-1">Visit Us</p>
              <p>Via Montenapoleone 14</p>
              <p>20121 Milano, Italia</p>
            </div>
            <div>
              <p className="font-normal text-black mb-1 mt-3">Contact</p>
              <p>+39 02 7600 1234</p>
              <p>ciao@italicalingerie.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-[#e5e5e5] -mx-6 px-6 pt-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm font-light text-black mb-1 md:mb-0">
            © 2024 Italica. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="/privacy-policy" className="text-sm font-light text-black hover:text-black/70 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-sm font-light text-black hover:text-black/70 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
