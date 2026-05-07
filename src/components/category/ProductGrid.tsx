import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import pantheonImage from "@/assets/pantheon.jpg";
import eclipseImage from "@/assets/eclipse.jpg";
import haloImage from "@/assets/halo.jpg";
import obliqueImage from "@/assets/oblique.jpg";
import lintelImage from "@/assets/lintel.jpg";
import shadowlineImage from "@/assets/shadowline.jpg";
import organicEarring from "@/assets/organic-earring.png";
import linkBracelet from "@/assets/link-bracelet.png";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  isNew?: boolean;
}

const products: Product[] = [
  { id: 1, name: "Serafina", category: "Bras", price: "€185", image: pantheonImage, isNew: true },
  { id: 2, name: "Valentina", category: "Briefs", price: "€95", image: eclipseImage },
  { id: 3, name: "Aurora", category: "Bodysuits", price: "€245", image: haloImage, isNew: true },
  { id: 4, name: "Bianca", category: "Bras", price: "€165", image: obliqueImage },
  { id: 5, name: "Chiara", category: "Sets", price: "€320", image: lintelImage },
  { id: 6, name: "Donatella", category: "Sleepwear", price: "€275", image: shadowlineImage },
  { id: 7, name: "Eleonora", category: "Bras", price: "€195", image: pantheonImage },
  { id: 8, name: "Francesca", category: "Briefs", price: "€85", image: eclipseImage },
  { id: 9, name: "Giulia", category: "Bodysuits", price: "€255", image: haloImage },
  { id: 10, name: "Isabella", category: "Bras", price: "€175", image: obliqueImage },
  { id: 11, name: "Lucia", category: "Sets", price: "€340", image: lintelImage },
  { id: 12, name: "Margherita", category: "Sleepwear", price: "€295", image: shadowlineImage },
  { id: 13, name: "Nicoletta", category: "Bras", price: "€210", image: pantheonImage },
  { id: 14, name: "Olivia", category: "Briefs", price: "€105", image: eclipseImage },
  { id: 15, name: "Patrizia", category: "Bodysuits", price: "€265", image: haloImage },
  { id: 16, name: "Raffaella", category: "Bras", price: "€155", image: obliqueImage },
  { id: 17, name: "Sofia", category: "Sets", price: "€310", image: lintelImage },
  { id: 18, name: "Teresa", category: "Sleepwear", price: "€285", image: shadowlineImage },
  { id: 19, name: "Viviana", category: "Bras", price: "€190", image: pantheonImage },
  { id: 20, name: "Alessia", category: "Briefs", price: "€110", image: eclipseImage },
  { id: 21, name: "Beatrice", category: "Bodysuits", price: "€235", image: haloImage },
  { id: 22, name: "Camilla", category: "Bras", price: "€180", image: obliqueImage },
  { id: 23, name: "Diana", category: "Sets", price: "€350", image: lintelImage },
  { id: 24, name: "Elena", category: "Sleepwear", price: "€260", image: shadowlineImage },
];

const ProductGrid = () => {
  return (
    <section className="w-full px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card 
                className="border-none shadow-none bg-transparent group cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                    />
                    <img
                      src={product.category === "Briefs" || product.category === "Sleepwear" ? linkBracelet : organicEarring}
                      alt={`${product.name} lifestyle`}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/[0.03]"></div>
                    {product.isNew && (
                      <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-black">
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-light text-foreground">
                      {product.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-sm font-light text-foreground">
                        {product.price}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      
      <Pagination />
    </section>
  );
};

export default ProductGrid;
