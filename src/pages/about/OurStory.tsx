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
            title="Our Story" 
            subtitle="A journey of passion, craftsmanship, and Italian elegance"
          />
          
          <ContentSection>
            <ImageTextBlock
              image="/founders.png"
              imageAlt="Italica founders"
              title="Born in Milano"
              content="Italica was born from a shared vision of creating luxury lingerie that celebrates the female form with Italian artistry. Our founders, united by their passion for exceptional fabrics and timeless design, established the brand in the heart of Milano with a commitment to creating pieces that make every woman feel extraordinary."
              imagePosition="left"
            />
          </ContentSection>

          <ContentSection title="Our Heritage">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xl font-light text-foreground">Italian Craftsmanship</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every piece in our collection is meticulously handcrafted by skilled artisans in our Milano atelier. We honor traditional Italian textile techniques while embracing modern innovation, ensuring each piece meets our exacting standards for quality and beauty.
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-light text-foreground">Sustainable Luxury</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We believe luxury and sustainability can coexist beautifully. Our commitment to ethically sourced fabrics, eco-friendly packaging, and responsible manufacturing ensures that every piece you wear contributes to a more sustainable future.
                </p>
              </div>
            </div>
          </ContentSection>

          <ContentSection title="Our Values">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Excellence</h3>
                <p className="text-muted-foreground">
                  We pursue perfection in every stitch, from the initial sketch to the final fitting.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Sensuality</h3>
                <p className="text-muted-foreground">
                  Each piece is designed to celebrate and empower, creating an intimate connection between fabric and skin.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously evolve our designs and techniques while honoring timeless Italian aesthetic traditions.
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
