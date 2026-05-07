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
          title="Size Guide" 
          subtitle="Find your perfect fit with our comprehensive sizing guide"
        />
        
        <ContentSection title="Bra Sizing">
          <div className="space-y-8">
            <div className="bg-muted/10 rounded-lg p-8">
              <h3 className="text-xl font-light text-foreground mb-6">How to Measure</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Band Size</h4>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Wear an unpadded bra or no bra</li>
                    <li>Measure around your ribcage, just under your bust</li>
                    <li>Keep the tape snug but comfortable</li>
                    <li>Round to the nearest whole number</li>
                  </ol>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Cup Size</h4>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Measure around the fullest part of your bust</li>
                    <li>Subtract your band measurement from this number</li>
                    <li>The difference determines your cup size</li>
                    <li>Refer to the chart below</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted/20">
                    <th className="border border-border p-3 text-left font-light">IT Size</th>
                    <th className="border border-border p-3 text-left font-light">EU Size</th>
                    <th className="border border-border p-3 text-left font-light">UK Size</th>
                    <th className="border border-border p-3 text-left font-light">US Size</th>
                    <th className="border border-border p-3 text-left font-light">Band (cm)</th>
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

        <ContentSection title="Briefs & Bodysuits Sizing">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Briefs & Thongs</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">XS</span>
                  <span className="text-foreground">IT 38 / EU 34 / Waist 60-64cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">S</span>
                  <span className="text-foreground">IT 40 / EU 36 / Waist 64-68cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">M</span>
                  <span className="text-foreground">IT 42 / EU 38 / Waist 68-72cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">L</span>
                  <span className="text-foreground">IT 44 / EU 40 / Waist 72-76cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">XL</span>
                  <span className="text-foreground">IT 46 / EU 42 / Waist 76-80cm</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Bodysuits & Sleepwear</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">XS</span>
                  <span className="text-foreground">IT 38 / Bust 80cm / Waist 60cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">S</span>
                  <span className="text-foreground">IT 40 / Bust 84cm / Waist 64cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">M</span>
                  <span className="text-foreground">IT 42 / Bust 88cm / Waist 68cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">L</span>
                  <span className="text-foreground">IT 44 / Bust 92cm / Waist 72cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">XL</span>
                  <span className="text-foreground">IT 46 / Bust 96cm / Waist 76cm</span>
                </div>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Need Help?">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Still unsure about sizing? Our lingerie consultants are here to help you find the perfect fit. 
              Download our printable size guide or schedule a virtual fitting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="rounded-none">
                Download PDF Guide
              </Button>
              <Button className="rounded-none">
                Schedule Fitting
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
