import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import { Button } from "../../components/ui/button";
import AboutSidebar from "../../components/about/AboutSidebar";

const SizeGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Tabela rozmiarów"
          subtitle="Znajdź swój idealny rozmiar z naszym przewodnikiem"
        />
        
        <ContentSection title="Rozmiary biustonoszy">
          <div className="space-y-8">
            <div className="bg-muted/10 rounded-lg p-8">
              <h3 className="text-xl font-light text-foreground mb-6">Jak zmierzyć?</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Obwód pod biustem</h4>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Załóż biustonosz bez wypełnienia lub zostań bez niego</li>
                    <li>Zmierz obwód klatki piersiowej tuż pod biustem</li>
                    <li>Trzymaj taśmę przylegającą, ale wygodnie</li>
                    <li>Zaokrąglij do najbliższej pełnej liczby</li>
                  </ol>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Rozmiar miseczki</h4>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Zmierz obwód w najszerszym miejscu biustu</li>
                    <li>Odejmij od tego wymiaru obwód pod biustem</li>
                    <li>Różnica określa rozmiar miseczki</li>
                    <li>Odnieś się do tabeli poniżej</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted/20">
                    <th className="border border-border p-3 text-left font-light">IT</th>
                    <th className="border border-border p-3 text-left font-light">EU</th>
                    <th className="border border-border p-3 text-left font-light">UK</th>
                    <th className="border border-border p-3 text-left font-light">US</th>
                    <th className="border border-border p-3 text-left font-light">Obwód (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { it: "1", eu: "70", uk: "32", us: "32", band: "63-67" },
                    { it: "2", eu: "75", uk: "34", us: "34", band: "68-72" },
                    { it: "3", eu: "80", uk: "36", us: "36", band: "73-77" },
                    { it: "4", eu: "85", uk: "38", us: "38", band: "78-82" },
                    { it: "5", eu: "90", uk: "40", us: "40", band: "83-87" },
                    { it: "6", eu: "95", uk: "42", us: "42", band: "88-92" },
                  ].map((size, index) => (
                    <tr key={index} className="hover:bg-muted/10">
                      <td className="border border-border p-3">{size.it}</td>
                      <td className="border border-border p-3">{size.eu}</td>
                      <td className="border border-border p-3">{size.uk}</td>
                      <td className="border border-border p-3">{size.us}</td>
                      <td className="border border-border p-3">{size.band}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Rozmiary bielizny i kombinezonów">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Majtki i stringi</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">XS</span>
                  <span className="text-foreground">IT 38 / EU 34 / Talia 60-64 cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">S</span>
                  <span className="text-foreground">IT 40 / EU 36 / Talia 64-68 cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">M</span>
                  <span className="text-foreground">IT 42 / EU 38 / Talia 68-72 cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">L</span>
                  <span className="text-foreground">IT 44 / EU 40 / Talia 72-76 cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">XL</span>
                  <span className="text-foreground">IT 46 / EU 42 / Talia 76-80 cm</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Kombinezony i piżamy</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">XS</span>
                  <span className="text-foreground">IT 38 / Biust 80 cm / Talia 60 cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">S</span>
                  <span className="text-foreground">IT 40 / Biust 84 cm / Talia 64 cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">M</span>
                  <span className="text-foreground">IT 42 / Biust 88 cm / Talia 68 cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">L</span>
                  <span className="text-foreground">IT 44 / Biust 92 cm / Talia 72 cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">XL</span>
                  <span className="text-foreground">IT 46 / Biust 96 cm / Talia 76 cm</span>
                </div>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Potrzebujesz pomocy?">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Nadal nie jesteś pewna rozmiaru? Nasze konsultantki są do dyspozycji, żeby pomóc Ci znaleźć idealne dopasowanie. Pobierz nasz przewodnik w wersji PDF lub umów się na wirtualne przymiarki.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="rounded-none">
                Pobierz PDF
              </Button>
              <Button className="rounded-none">
                Umów przymiarki
              </Button>
            </div>
          </div>
        </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default SizeGuide;
