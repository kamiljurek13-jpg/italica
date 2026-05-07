import { useEffect } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const TermsOfService = () => {
  useEffect(() => {
    document.title = "Terms of Service - Italica";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-6">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-light text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 15, 2024</p>
          </header>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using the Italica S.r.l. website and services, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service govern your use of our website, products, and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">Returns and Exchanges</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We want you to be completely satisfied with your purchase. Returns and exchanges are accepted within 30 days of delivery, subject to the following conditions:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Items must be unworn, with tags attached, in original packaging</li>
                <li>Briefs and bodysuits are final sale for hygiene reasons (unless defective)</li>
                <li>Return shipping is free within Europe</li>
                <li>Refunds will be processed to the original payment method</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms and conditions are governed by and construed in accordance with Italian law, and you irrevocably submit to the exclusive jurisdiction of the courts in Milano, Italy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>Email: legal@italicalingerie.com</p>
                <p>Phone: +39 02 7600 1234</p>
                <p>Address: Via Montenapoleone 14, 20121 Milano, Italia</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
