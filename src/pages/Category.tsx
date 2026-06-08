import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import CategoryHeader from "../components/category/CategoryHeader";
import FilterSortBar from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";
import { useProductsByCategory } from "@/hooks/useProducts";

const Category = () => {
  const { category } = useParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: products = [] } = useProductsByCategory(category);
  const filteredCount = products.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6">
        <CategoryHeader
          category={category || 'All Products'}
        />

        <FilterSortBar
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          itemCount={filteredCount}
        />

        <ProductGrid />
      </main>

      <Footer />
    </div>
  );
};

export default Category;
