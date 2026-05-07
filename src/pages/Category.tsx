import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import CategoryHeader from "../components/category/CategoryHeader";
import FilterSortBar from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";
import productsData from "../data/products.json";

const categoryMap: { [key: string]: string } = {
  'biustonosze': 'biustonosze',
  'piżamy': 'piżamy',
  'koszulki nocne': 'koszulki nocne',
  'pończochy': 'pończochy',
  'pasy': 'pasy',
  'zestawy': 'zestawy',
};

const Category = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredCount = !category || category === 'all'
    ? productsData.length
    : productsData.filter(p => {
        const mapped = categoryMap[category.toLowerCase()];
        return p.category === mapped || p.category === category;
      }).length;

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