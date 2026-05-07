import { useEffect } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const TermsOfService = () => {
  useEffect(() => {
    document.title = "Terms of Service - Italica";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-6">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-light text-foreground mb-4">Regulamin</h1>
            <p className="text-muted-foreground">Ostatnia aktualizacja: 15 stycznia 2024</p>
          </header>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">Akceptacja warunków</h2>
              <p className="text-muted-foreground leading-relaxed">
                Korzystając z serwisu i usług Italica S.r.l., akceptujesz i zgadzasz się przestrzegać niniejszych warunków. Regulamin reguluje korzystanie z naszej strony, produktów i usług.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">Zwroty i wymiana</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Zależy nam na Twojej pełnej satysfakcji. Zwroty i wymiana są przyjmowane w ciągu 30 dni od dostawy, pod warunkiem spełnienia poniższych warunków:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Produkt musi być nieużywany, z metkami i w oryginalnym opakowaniu</li>
                <li>Majtki i kombinezony nie podlegają zwrotowi ze względów higienicznych (chyba że są wadliwe)</li>
                <li>Zwrot towaru na terenie Europy jest bezpłatny</li>
                <li>Zwrot należności zostanie dokonany na pierwotną metodę płatności</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">Prawo właściwe</h2>
              <p className="text-muted-foreground leading-relaxed">
                Niniejsze warunki podlegają prawu włoskiemu i są zgodnie z nim interpretowane. Nieodwołalnie poddajesz się wyłącznej jurysdykcji sądów w Mediolanie.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">Dane kontaktowe</h2>
              <p className="text-muted-foreground leading-relaxed">
                W razie pytań dotyczących niniejszego Regulaminu prosimy o kontakt:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>E-mail: legal@italicalingerie.com</p>
                <p>Telefon: +39 02 7600 1234</p>
                <p>Adres: Via Montenapoleone 14, 20121 Milano, Italia</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
