import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ProductGrid = ({ products, isLoading, currentPage, totalPages, onPageChange }: ProductGridProps) => {
  if (isLoading) {
    return (
      <section className="w-full px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="aspect-square bg-muted/20 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, index) => (
          <Link key={product.id} to={`/product/${product.id}`}>
            <Card className="border-none shadow-none bg-transparent group cursor-pointer">
              <CardContent className="p-0">
                <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black/[0.03]"></div>
                  {currentPage === 1 && (index === 0 || index === 1) && (
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
};

export default ProductGrid;
