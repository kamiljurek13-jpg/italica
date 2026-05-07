import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import GiftHelper from "../components/GiftHelper";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6">
        <GiftHelper />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
