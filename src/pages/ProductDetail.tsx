import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ProductInfo from "../components/product/ProductInfo";
import ProductDescription from "../components/product/ProductDescription";
import ProductCarousel from "../components/content/ProductCarousel";
import { useProduct } from "@/hooks/useProduct";
import { trackProductViewed, trackTimeToFirstProduct } from "@/lib/amplitude";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const ProductDetail = () => {
  const { productId } = useParams();
  const { data: product, isLoading } = useProduct(productId);

  useEffect(() => {
    if (product) trackProductViewed({ id: product.id, name: product.name, category: product.category, price: product.price });
  }, [product?.id]);

  useEffect(() => {
    const start = sessionStorage.getItem('ttfp_start');
    const source = sessionStorage.getItem('ttfp_source') as 'search_icon' | 'gift_helper_icon' | null;
    if (start && source) {
      trackTimeToFirstProduct({ ttfp_ms: Date.now() - Number(start), source });
      sessionStorage.removeItem('ttfp_start');
      sessionStorage.removeItem('ttfp_source');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-6">
          <div className="w-full px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="w-full aspect-square bg-muted/20 animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6">
        <section className="w-full px-6">
          {/* Breadcrumb - Show above image on smaller screens */}
          <div className="lg:hidden mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/category/${product?.category}`}>{product?.category}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product?.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="w-full aspect-square overflow-hidden">
              <img
                src={product?.image_url}
                alt={product?.name ?? 'Product image'}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:pl-12 mt-8 lg:mt-0 lg:sticky lg:top-6 lg:h-fit">
              <ProductInfo />
              <ProductDescription />
            </div>
          </div>
        </section>

        <section className="w-full mt-16 lg:mt-24">
          <div className="mb-4 px-6">
            <h2 className="text-sm font-light text-foreground">You might also like</h2>
          </div>
          <ProductCarousel />
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
