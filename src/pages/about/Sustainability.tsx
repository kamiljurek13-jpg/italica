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
          title="Sustainability" 
          subtitle="Creating beautiful lingerie while protecting our planet for future generations"
        />
        
        <ContentSection title="Our Environmental Commitment">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Ethical Sourcing</h3>
              <p className="text-muted-foreground leading-relaxed">
                We partner only with Italian and European mills who share our commitment to ethical practices. Every fabric in our collection — from Leavers lace to mulberry silk — is sourced responsibly with full transparency in our supply chain.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Eco-Friendly Materials</h3>
              <p className="text-muted-foreground leading-relaxed">
                Over 60% of our fabrics come from certified sustainable sources. We prioritize organic cotton, recycled lace, and eco-certified silk, reducing environmental impact while maintaining the highest quality standards.
              </p>
            </div>
          </div>

          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-2xl font-light text-foreground mb-6">Our Impact Goals</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-light text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Carbon neutral operations by 2026</p>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2">90%</div>
                <p className="text-sm text-muted-foreground">Recycled packaging materials</p>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2">Zero</div>
                <p className="text-sm text-muted-foreground">Waste to landfill policy</p>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Circular Economy">
          <div className="space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe in creating lingerie that lasts — pieces you'll treasure for years, not seasons.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Lifetime Care</h3>
                <p className="text-muted-foreground">
                  Every piece comes with our lifetime care promise, including professional repairs and restoration services at our Milano atelier.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Take-Back Program</h3>
                <p className="text-muted-foreground">
                  When you're ready for something new, we'll take back your Italica pieces to be recycled into future collections.
                </p>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Certifications & Partnerships">
          <div className="space-y-8">
            <p className="text-muted-foreground leading-relaxed">
              Our commitment to sustainability is verified through partnerships with leading organizations and certifications that hold us accountable to the highest standards.
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
