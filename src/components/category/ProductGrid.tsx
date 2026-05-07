import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import Pagination from "./Pagination";
import productsData from "@/data/products.json";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  color: string;
  mood: string[];
}

const allProducts: Product[] = productsData;

const ProductGrid = () => {
  const { category } = useParams<{ category: string }>();
  
  // Map Polish category names to product.json categories
  const categoryMap: { [key: string]: string } = {
    'all': 'all',
    'biustonosze': 'biustonosze',
    'piżamy': 'piżamy',
    'koszulki nocne': 'koszulki nocne',
    'pończochy': 'pończochy',
    'pasy': 'pasy',
    'zestawy': 'zestawy'
  };
  
  // Filter products based on category
  const products = category === 'all' || !category
    ? allProducts
    : allProducts.filter(p => {
        const mappedCategory = categoryMap[category.toLowerCase()];
        return p.category === mappedCategory || p.category === category;
      });
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
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-black/[0.03]"></div>
                    {(product.id === "1" || product.id === "3") && (
                      <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-black">
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-light text-foreground capitalize">
                      {product.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-sm font-light text-foreground">
                        {product.price} zł
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
