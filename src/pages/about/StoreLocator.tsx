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
      hours: "Mon-Sat: 10AM-8PM, Sun: 11AM-7PM",
      services: ["Personal Fitting", "Custom Orders", "Bridal Consultation", "Alterations"]
    },
    {
      name: "Italica Brera",
      address: "Via Fiori Chiari 8, 20121 Milano, Italia",
      phone: "+39 02 8900 5678",
      hours: "Mon-Sat: 10AM-7:30PM, Sun: 12PM-6PM",
      services: ["Personal Fitting", "Gift Wrapping", "Bridal Consultation"]
    },
    {
      name: "Italica Porta Nuova",
      address: "Corso Como 10, 20154 Milano, Italia",
      phone: "+39 02 6200 9012",
      hours: "Mon-Sat: 10AM-8PM, Sun: 11AM-7PM",
      services: ["Browse & Buy", "Personal Fitting", "Gift Wrapping"]
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
          title="Store Locator" 
          subtitle="Visit our boutiques in Milano for a personalized lingerie experience"
        />
        
        <ContentSection title="Interactive Store Map">
          <StoreMap />
        </ContentSection>

        <ContentSection title="Our Boutiques">
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
                        Get Directions
                      </Button>
                      <Button className="rounded-none">
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-light text-foreground">Available Services</h4>
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

        <ContentSection title="Private Fitting">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Experience the luxury of a private fitting at our Milano boutiques. Our expert consultants will help you discover your perfect size, explore our collections, and find pieces that make you feel extraordinary.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="space-y-3">
                <h4 className="text-lg font-light text-foreground">Personal Fitting</h4>
                <p className="text-muted-foreground text-sm">
                  One-on-one guidance to find your perfect fit and style
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-light text-foreground">Bridal Consultation</h4>
                <p className="text-muted-foreground text-sm">
                  Curated bridal lingerie selections for your special day
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-light text-foreground">Expert Alterations</h4>
                <p className="text-muted-foreground text-sm">
                  Professional tailoring to ensure the perfect fit
                </p>
              </div>
            </div>
            
            <div className="pt-8">
              <Button size="lg" className="rounded-none">
                Schedule Your Fitting
              </Button>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Virtual Consultations">
          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-xl font-light text-foreground mb-4">Can't visit in person?</h3>
            <p className="text-muted-foreground mb-6">
              Book a virtual consultation with one of our lingerie experts. We'll showcase pieces via video call, 
              help you find your perfect size, and guide you through our collections from the comfort of your home.
            </p>
            <Button variant="outline" className="rounded-none">
              Book Virtual Consultation
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
