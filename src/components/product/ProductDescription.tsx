import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewProduct from "./ReviewProduct";
import { useProduct } from "@/hooks/useProduct";

const CustomStar = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`w-3 h-3 ${filled ? 'text-foreground' : 'text-muted-foreground/30'} ${className}`}
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
      clipRule="evenodd"
    />
  </svg>
);

const ProductDescription = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: product } = useProduct(productId);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  const rating = product?.rating ?? null;
  const ratingDisplay = rating !== null ? rating.toFixed(1) : null;
  const filledStars = rating !== null ? Math.round(rating) : 0;

  const hasDetails = product?.sku || (product?.details && product.details.length > 0);
  const hasReviews = product?.reviews && product.reviews.length > 0;

  return (
    <div className="space-y-0 mt-8 border-t border-border">
      {/* Description */}
      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <span>Opis</span>
          {isDescriptionOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isDescriptionOpen && (
          <div className="pb-6">
            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              {product?.description}
            </p>
          </div>
        )}
      </div>

      {/* Product Details */}
      {hasDetails && (
        <div className="border-b border-border">
          <Button
            variant="ghost"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
          >
            <span>Szczegóły produktu</span>
            {isDetailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {isDetailsOpen && (
            <div className="pb-6 space-y-3">
              {product?.sku && (
                <div className="flex justify-between">
                  <span className="text-sm font-light text-muted-foreground">SKU</span>
                  <span className="text-sm font-light text-foreground">{product.sku}</span>
                </div>
              )}
              {product?.details?.map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-sm font-light text-muted-foreground">{label}</span>
                  <span className="text-sm font-light text-foreground">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Care Instructions */}
      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsCareOpen(!isCareOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <span>Pielęgnacja</span>
          {isCareOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isCareOpen && (
          <div className="pb-6 space-y-4">
            <ul className="space-y-2">
              <li className="text-sm font-light text-muted-foreground">• Prać ręcznie w zimnej wodzie z delikatnym detergentem</li>
              <li className="text-sm font-light text-muted-foreground">• Nie wybielać ani nie suszyć w suszarce</li>
              <li className="text-sm font-light text-muted-foreground">• Suszyć płasko na miękkim ręczniku</li>
              <li className="text-sm font-light text-muted-foreground">• Przechowywać w dołączonym jedwabnym woreczku</li>
            </ul>
            <p className="text-sm font-light text-muted-foreground">
              W przypadku prania w pralce używać woreczka do bielizny w programie delikatnym.
            </p>
          </div>
        )}
      </div>

      {/* Customer Reviews */}
      <div className="border-b border-border lg:mb-16">
        <Button
          variant="ghost"
          onClick={() => setIsReviewsOpen(!isReviewsOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <div className="flex items-center gap-3">
            <span>Opinie klientów</span>
            {ratingDisplay && (
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <CustomStar key={star} filled={star <= filledStars} />
                ))}
                <span className="text-sm font-light text-muted-foreground ml-1">{ratingDisplay}</span>
              </div>
            )}
          </div>
          {isReviewsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isReviewsOpen && hasReviews && (
          <div className="pb-6 space-y-6">
            <ReviewProduct />

            <div className="space-y-6">
              {product?.reviews?.map((review, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <CustomStar key={star} filled={star <= review.rating} />
                      ))}
                    </div>
                    <span className="text-sm font-light text-muted-foreground">{review.author}</span>
                  </div>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
