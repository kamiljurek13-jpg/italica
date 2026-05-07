import earringsCollection from "@/assets/earrings-collection.png";
import linkBracelet from "@/assets/link-bracelet.png";
import { Link } from "react-router-dom";

const FiftyFiftySection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Link to="/category/bras" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <img 
                src={earringsCollection} 
                alt="Lace lingerie collection" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Italian Lace
            </h3>
            <p className="text-sm font-light text-foreground">
              Delicate handcrafted lace from the finest Italian ateliers
            </p>
          </div>
        </div>

        <div>
          <Link to="/category/bodysuits" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <img 
                src={linkBracelet} 
                alt="Silk bodysuit collection" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Silk Collection
            </h3>
            <p className="text-sm font-light text-foreground">
              Pure mulberry silk pieces with a second-skin feel
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiftyFiftySection;
