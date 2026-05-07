import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import AboutSidebar from "../../components/about/AboutSidebar";

const Sustainability = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Zrównoważony rozwój"
          subtitle="Tworzymy piękną bieliznę, dbając o naszą planetę dla przyszłych pokoleń"
        />
        
        <ContentSection title="Nasze zobowiązanie ekologiczne">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Etyczne pozyskiwanie surowców</h3>
              <p className="text-muted-foreground leading-relaxed">
                Współpracujemy wyłącznie z włoskimi i europejskimi przędzalniami, które podzielają nasze zaangażowanie w etyczne praktyki. Każda tkanina w naszej kolekcji — od koronki Leavers po jedwab z morwy — jest pozyskiwana odpowiedzialnie, z pełną przejrzystością łańcucha dostaw.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Ekologiczne materiały</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ponad 60% naszych tkanin pochodzi z certyfikowanych zrównoważonych źródeł. Stawiamy na bawełnę organiczną, koronkę z recyklingu i jedwab z certyfikatem ekologicznym, minimalizując wpływ na środowisko przy zachowaniu najwyższych standardów jakości.
              </p>
            </div>
          </div>

          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-2xl font-light text-foreground mb-6">Nasze cele</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-light text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Neutralność węglowa do 2026 roku</p>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2">90%</div>
                <p className="text-sm text-muted-foreground">Opakowania z materiałów z recyklingu</p>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2">Zero</div>
                <p className="text-sm text-muted-foreground">Polityka zerowych odpadów na wysypiska</p>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Gospodarka o obiegu zamkniętym">
          <div className="space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Wierzymy w tworzenie bielizny, która trwa — rzeczy, które będziesz cenić przez lata, nie sezony.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Dożywotnia opieka</h3>
                <p className="text-muted-foreground">
                  Każda rzecz objęta jest dożywotnią gwarancją opieki, w tym profesjonalnymi naprawami i renowacją w naszym mediolańskim atelier.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Program zwrotu</h3>
                <p className="text-muted-foreground">
                  Kiedy będziesz gotowa na coś nowego, odbierzemy Twoje produkty Italica i poddamy je recyklingowi na potrzeby przyszłych kolekcji.
                </p>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Certyfikaty i partnerstwa">
          <div className="space-y-8">
            <p className="text-muted-foreground leading-relaxed">
              Nasze zaangażowanie w zrównoważony rozwój jest weryfikowane przez partnerstwa z wiodącymi organizacjami i certyfikaty, które rozliczają nas z najwyższych standardów.
            </p>
            
            <div className="grid md:grid-cols-4 gap-8 items-center">
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">OEKO-TEX</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">B Corp</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">GOTS</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Fair Trade</span>
              </div>
            </div>
          </div>
        </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Sustainability;
