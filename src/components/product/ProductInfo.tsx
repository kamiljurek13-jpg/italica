import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useProduct } from "@/hooks/useProduct";
import { trackProductAddedToCart } from "@/lib/amplitude";

const BRA_BANDS = ["50", "55", "60", "65", "70", "75", "80", "85", "90"];
const BRA_CUPS = ["A", "B", "C", "D", "E", "F", "G"];
const STANDARD_SIZES = ["XS", "S", "M", "L", "XL"];

const selectClass =
  "h-10 px-3 text-sm font-light border border-border bg-background text-foreground focus:outline-none focus:border-foreground appearance-none cursor-pointer";

const ProductInfo = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const [selectedSize, setSelectedSize] = useState("");
  const [braBand, setBraBand] = useState("70");
  const [braCup, setBraCup] = useState("C");
  const [customSize, setCustomSize] = useState("");

  const { data: product } = useProduct(productId);

  const isBra = product?.category === "biustonosze";

  const effectiveSize = customSize.trim() || (isBra ? `${braBand}${braCup}` : selectedSize);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleGridSize = (size: string) => {
    setSelectedSize(size);
    setCustomSize("");
  };

  const handleBraChange = (band: string, cup: string) => {
    setBraBand(band);
    setBraCup(cup);
    setCustomSize("");
  };

  const handleCustomSize = (value: string) => {
    setCustomSize(value);
    setSelectedSize("");
    setBraBand("70");
    setBraCup("C");
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!effectiveSize) {
      toast.error("Wybierz rozmiar przed dodaniem do koszyka");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        size: effectiveSize,
        category: product.category,
        color: product.color ?? undefined,
      });
    }

    trackProductAddedToCart({ id: product.id, name: product.name, category: product.category, price: product.price, quantity });

    toast.success(`${product.name} dodano do koszyka!`, {
      description: `Rozmiar: ${effectiveSize}, Ilość: ${quantity}`,
    });
  };

  if (!product) {
    return <div>Produkt nie znaleziony</div>;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Strona główna</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/category/${product.category}`}>{product.category}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product title and price */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-light text-muted-foreground mb-1 capitalize">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-light text-foreground">{product.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-xl font-light text-foreground">{product.price} zł</p>
          </div>
        </div>
      </div>

      {/* Size selector */}
      <div className="space-y-4 py-4 border-b border-border">
        {product.color && (
          <div className="space-y-2">
            <h3 className="text-sm font-light text-foreground">Kolor</h3>
            <p className="text-sm font-light text-muted-foreground capitalize">{product.color}</p>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-sm font-light text-foreground">Rozmiar</h3>

          {isBra ? (
            <div className="flex gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-light text-muted-foreground">Obwód (cm)</label>
                <select
                  value={braBand}
                  onChange={e => handleBraChange(e.target.value, braCup)}
                  className={selectClass}
                >
                  {BRA_BANDS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-light text-muted-foreground">Miseczka</label>
                <select
                  value={braCup}
                  onChange={e => handleBraChange(braBand, e.target.value)}
                  className={selectClass}
                >
                  {BRA_CUPS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              {STANDARD_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => handleGridSize(size)}
                  className={`h-10 w-12 text-sm font-light border transition-colors ${
                    selectedSize === size && !customSize
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-foreground hover:border-foreground'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom size — for all categories */}
        <div className="space-y-2 pt-1">
          <p className="text-xs font-light text-muted-foreground">
            Nie znalazłaś swojego rozmiaru? Nie ma problemu — wpisz czego potrzebujesz i załatwimy to.
          </p>
          <input
            type="text"
            value={customSize}
            onChange={e => handleCustomSize(e.target.value)}
            placeholder={isBra ? "np. 85DD, 70H" : "np. XL długi, 42/44"}
            className="h-10 w-full px-3 text-sm font-light border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground"
          />
        </div>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-light text-foreground">Ilość</span>
          <div className="flex items-center border border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={decrementQuantity}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="h-10 flex items-center px-4 text-sm font-light min-w-12 justify-center border-l border-r border-border">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={incrementQuantity}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-light rounded-none"
        >
          Dodaj do koszyka
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
