import { useEffect } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy - Italica";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-6">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-light text-foreground mb-4">Polityka prywatności</h1>
            <p className="text-muted-foreground">Ostatnia aktualizacja: 15 stycznia 2024</p>
          </header>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">Wprowadzenie</h2>
              <p className="text-muted-foreground leading-relaxed">
                W Italica S.r.l. szanujemy Twoją prywatność i jesteśmy zobowiązani do ochrony Twoich danych osobowych. Niniejsza Polityka prywatności wyjaśnia, w jaki sposób zbieramy, wykorzystujemy, ujawniamy i chronimy Twoje informacje, gdy odwiedzasz naszą stronę, dokonujesz zakupu lub korzystasz z naszych usług.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">Zbierane informacje</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-light text-foreground mb-2">Dane osobowe</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Możemy zbierać dane osobowe, które nam przekazujesz, w tym:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Imię i nazwisko, adres e-mail oraz dane kontaktowe</li>
                    <li>Adresy do faktury i dostawy</li>
                    <li>Dane płatności (przetwarzane bezpiecznie przez zewnętrznych dostawców)</li>
                    <li>Preferencje konta i ustawienia komunikacji</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">Kontakt</h2>
              <p className="text-muted-foreground leading-relaxed">
                W razie pytań dotyczących niniejszej Polityki prywatności prosimy o kontakt:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>E-mail: privacy@italicalingerie.com</p>
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

export default PrivacyPolicy;
