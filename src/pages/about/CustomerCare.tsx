import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import AboutSidebar from "../../components/about/AboutSidebar";

const CustomerCare = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Obsługa klienta"
          subtitle="Jesteśmy tu, żeby pomóc Ci we wszystkich sprawach związanych z bielizną"
        />
        
        <ContentSection title="Dane kontaktowe">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-light text-foreground">Telefon</h3>
              <p className="text-muted-foreground">+39 02 7600 1234</p>
              <p className="text-sm text-muted-foreground">Pon-Pt: 9:00-18:00 CET<br />Sob: 10:00-16:00 CET</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-light text-foreground">E-mail</h3>
              <p className="text-muted-foreground">ciao@italicalingerie.com</p>
              <p className="text-sm text-muted-foreground">Odpowiedź w ciągu 24 godzin</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-light text-foreground">Live Chat</h3>
              <Button variant="outline" className="rounded-none">
                Rozpocznij czat
              </Button>
              <p className="text-sm text-muted-foreground">Dostępny w godzinach pracy</p>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Najczęstsze pytania">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="shipping" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                Jakie są opcje i czas dostawy?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Oferujemy bezpłatną dostawę standardową (3-5 dni roboczych) dla zamówień powyżej 400 zł. Dostawa ekspresowa (1-2 dni) kosztuje 60 zł. Wszystkie zamówienia są pięknie zapakowane i wysyłane z naszego magazynu w Mediolanie.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="returns" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                Jaka jest Wasza polityka zwrotów i wymian?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Przyjmujemy zwroty w ciągu 30 dni dla nieużywanych produktów z metkami i w oryginalnym opakowaniu. Ze względów higienicznych majtki i kombinezony nie podlegają zwrotowi (chyba że są wadliwe). Zwroty na terenie Europy są bezpłatne.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sizing" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                Jak znaleźć swój idealny rozmiar?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Odwiedź naszą Tabelę rozmiarów, gdzie znajdziesz szczegółowe instrukcje pomiarów i przelicznik między rozmiarami włoskimi, EU, UK i US. Nasz zespół obsługi klienta służy także indywidualną pomocą w doborze rozmiaru.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="care" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                Jak pielęgnować bieliznę Italica?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Prać ręcznie w zimnej wodzie z delikatnym detergentem. Nie wybielać ani nie suszyć w suszarce. Suszyć płasko. Przechowywać w dołączonym jedwabnym woreczku. Szczegółowe instrukcje pielęgnacji znajdziesz na metce każdego produktu.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="gift" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                Czy oferujecie pakowanie prezentów?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Tak! Wszystkie zamówienia Italica są dostarczane w naszym markowym opakowaniu prezentowym bez dodatkowych opłat. Oferujemy również ulepszenie do pudełka premium oraz spersonalizowane kartki przy zamówieniu.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ContentSection>

        <ContentSection title="Formularz kontaktowy">
          <div>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-light text-foreground">Imię</label>
                  <Input className="rounded-none" placeholder="Wpisz swoje imię" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-light text-foreground">Nazwisko</label>
                  <Input className="rounded-none" placeholder="Wpisz swoje nazwisko" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-light text-foreground">E-mail</label>
                <Input type="email" className="rounded-none" placeholder="Wpisz swój e-mail" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-light text-foreground">Numer zamówienia (opcjonalnie)</label>
                <Input className="rounded-none" placeholder="Podaj numer zamówienia jeśli dotyczy" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-light text-foreground">W czym możemy Ci pomóc?</label>
                <Textarea
                  className="rounded-none min-h-[120px]"
                  placeholder="Opisz szczegółowo swoje zapytanie"
                />
              </div>

              <Button type="submit" className="w-full rounded-none">
                Wyślij wiadomość
              </Button>
            </form>
          </div>
        </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default CustomerCare;
