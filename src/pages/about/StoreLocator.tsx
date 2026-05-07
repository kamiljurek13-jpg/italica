import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import StoreMap from "../../components/about/StoreMap";
import { Button } from "../../components/ui/button";
import AboutSidebar from "../../components/about/AboutSidebar";

const StoreLocator = () => {
  const stores = [
    {
      name: "Italica Montenapoleone",
      address: "Via Montenapoleone 14, 20121 Milano, Italia",
      phone: "+39 02 7600 1234",
      hours: "Pon-Sob: 10:00-20:00, Niedz: 11:00-19:00",
      services: ["Przymiarki osobiste", "Zamówienia indywidualne", "Konsultacje ślubne", "Przeróbki"]
    },
    {
      name: "Italica Brera",
      address: "Via Fiori Chiari 8, 20121 Milano, Italia",
      phone: "+39 02 8900 5678",
      hours: "Pon-Sob: 10:00-19:30, Niedz: 12:00-18:00",
      services: ["Przymiarki osobiste", "Pakowanie prezentów", "Konsultacje ślubne"]
    },
    {
      name: "Italica Porta Nuova",
      address: "Corso Como 10, 20154 Milano, Italia",
      phone: "+39 02 6200 9012",
      hours: "Pon-Sob: 10:00-20:00, Niedz: 11:00-19:00",
      services: ["Zakupy stacjonarne", "Przymiarki osobiste", "Pakowanie prezentów"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Znajdź salon"
          subtitle="Odwiedź nasze butiki w Mediolanie i poczuj luksus na własnej skórze"
        />
        
        <ContentSection title="Mapa salonów">
          <StoreMap />
        </ContentSection>

        <ContentSection title="Nasze butiki">
          <div className="grid gap-8">
            {stores.map((store, index) => (
              <div key={index} className="bg-background rounded-lg p-8 border border-border">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-light text-foreground">{store.name}</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p>{store.address}</p>
                      <p>{store.phone}</p>
                      <p>{store.hours}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button variant="outline" className="rounded-none">
                        Nawiguj
                      </Button>
                      <Button className="rounded-none">
                        Zarezerwuj wizytę
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-light text-foreground">Dostępne usługi</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {store.services.map((service, serviceIndex) => (
                        <li key={serviceIndex} className="text-sm text-muted-foreground flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ContentSection>

        <ContentSection title="Przymiarki prywatne">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Doświadcz luksusu prywatnych przymiarek w naszych mediolańskich butikach. Nasi eksperci pomogą Ci odkryć idealny rozmiar, poznać nasze kolekcje i znaleźć rzeczy, które sprawią, że poczujesz się wyjątkowo.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="space-y-3">
                <h4 className="text-lg font-light text-foreground">Przymiarki osobiste</h4>
                <p className="text-muted-foreground text-sm">
                  Indywidualne doradztwo, by znaleźć idealne dopasowanie i styl
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-light text-foreground">Konsultacje ślubne</h4>
                <p className="text-muted-foreground text-sm">
                  Dobrana bielizna ślubna na Twój wyjątkowy dzień
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-light text-foreground">Przeróbki krawieckie</h4>
                <p className="text-muted-foreground text-sm">
                  Profesjonalne krawieckie dopasowanie dla perfekcyjnego efektu
                </p>
              </div>
            </div>

            <div className="pt-8">
              <Button size="lg" className="rounded-none">
                Umów przymiarki
              </Button>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Konsultacje wirtualne">
          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-xl font-light text-foreground mb-4">Nie możesz odwiedzić nas osobiście?</h3>
            <p className="text-muted-foreground mb-6">
              Umów się na wirtualną konsultację z jedną z naszych ekspertek od bielizny. Zaprezentujemy kolekcje przez wideo, pomożemy dobrać rozmiar i przeprowadzimy przez całą ofertę — z wygody Twojego domu.
            </p>
            <Button variant="outline" className="rounded-none">
              Umów konsultację online
            </Button>
          </div>
        </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default StoreLocator;
