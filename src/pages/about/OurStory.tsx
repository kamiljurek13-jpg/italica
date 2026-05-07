import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import ImageTextBlock from "../../components/about/ImageTextBlock";
import AboutSidebar from "../../components/about/AboutSidebar";

const OurStory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
          <PageHeader 
            title="Nasza historia"
            subtitle="Podróż pełna pasji, rzemiosła i włoskiej elegancji"
          />
          
          <ContentSection>
            <ImageTextBlock
              image="/founders.png"
              imageAlt="Italica founders"
              title="Narodziny w Mediolanie"
              content="Italica powstała ze wspólnej wizji tworzenia luksusowej bielizny, która celebruje kobiecość poprzez włoskie rzemiosło. Nasi założyciele, połączeni pasją do wyjątkowych tkanin i ponadczasowego wzornictwa, osiedlili markę w sercu Mediolanu z misją tworzenia rzeczy, które sprawiają, że każda kobieta czuje się niezwykła."
              imagePosition="left"
            />
          </ContentSection>

          <ContentSection title="Nasze dziedzictwo">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xl font-light text-foreground">Włoskie rzemiosło</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Każdy element naszej kolekcji jest ręcznie tworzony przez doświadczonych rzemieślników w naszym mediolańskim atelier. Szanujemy tradycyjne włoskie techniki tkackie, łącząc je z nowoczesną innowacyjnością, by każda rzecz spełniała nasze rygorystyczne standardy jakości i piękna.
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-light text-foreground">Zrównoważony luksus</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Wierzymy, że luksus i zrównoważony rozwój mogą pięknie współistnieć. Nasze zaangażowanie w etyczne pozyskiwanie tkanin, ekologiczne opakowania i odpowiedzialną produkcję sprawia, że każda rzecz, którą nosisz, przyczynia się do lepszej przyszłości.
                </p>
              </div>
            </div>
          </ContentSection>

          <ContentSection title="Nasze wartości">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Doskonałość</h3>
                <p className="text-muted-foreground">
                  Dążymy do perfekcji w każdym ściegu — od pierwszego szkicu po ostatnie przymiarki.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Zmysłowość</h3>
                <p className="text-muted-foreground">
                  Każda rzecz jest projektowana z myślą o celebrowaniu kobiecości i tworzeniu intymnej więzi między tkaniną a skórą.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Innowacja</h3>
                <p className="text-muted-foreground">
                  Nieustannie rozwijamy nasze projekty i techniki, zachowując jednocześnie ponadczasowe włoskie tradycje estetyczne.
                </p>
              </div>
            </div>
          </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default OurStory;
