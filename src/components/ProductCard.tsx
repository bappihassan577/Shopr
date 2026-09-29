import React from 'react';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  currency: string;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelectProduct
}) => {
  const currentPrice = Number(product.price) || 0;
  const oldPrice = product.old_price ? Number(product.old_price) : undefined;
  
  // Calculate discount percentage
  const discount = product.discount || (oldPrice && oldPrice > currentPrice
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    : undefined);

  const thumbnailSrc = product.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

  const handleOrderClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!product.order_url || product.order_url === '#' || product.order_url === '') {
      e.preventDefault();
      onSelectProduct(product);
    }
  };

  return (
    <article className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-red-400 overflow-hidden flex flex-col shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
      
      {/* Product Image Container */}
      <div className="relative w-full aspect-square bg-slate-50 overflow-hidden">
        {discount && discount > 0 ? (
          <span className="absolute top-2 left-2 z-10 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded text-[10px] sm:text-xs font-black bg-[#f85606] text-white shadow-xs tracking-tight">
            -{discount}%
          </span>
        ) : null}

        <button
          onClick={() => onSelectProduct(product)}
          className="w-full h-full block cursor-pointer focus:outline-none"
          aria-label={`View ${product.title}`}
        >
          <img
            src={thumbnailSrc}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </button>

        {/* Quick View overlay icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct(product);
          }}
          title="View details"
          className="absolute bottom-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-red-600 flex items-center justify-center shadow-md backdrop-blur-xs transition-transform active:scale-90"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Body: Title on Left, Price on Right, Details below, Red Order Button at bottom */}
      <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Row 1: Left Title, Right Price */}
          <div className="flex items-start justify-between gap-1.5 mb-1">
            <h3 className="flex-1 font-['Plus_Jakarta_Sans'] text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#f85606] transition-colors line-clamp-2 leading-tight">
              <button
                onClick={() => onSelectProduct(product)}
                className="text-left w-full hover:underline focus:outline-none cursor-pointer"
              >
                {product.title}
              </button>
            </h3>

            {/* Price Column on Right */}
            <div className="text-right shrink-0">
              <div className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-black text-[#f85606] whitespace-nowrap">
                {currency}{currentPrice.toLocaleString(undefined, { minimumFractionDigits: currentPrice % 1 === 0 ? 0 : 2 })}
              </div>
              {oldPrice && oldPrice > currentPrice && (
                <div className="text-[10px] text-slate-400 line-through leading-none">
                  {currency}{oldPrice.toLocaleString(undefined, { minimumFractionDigits: oldPrice % 1 === 0 ? 0 : 2 })}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Short Description / Details */}
          <p className="text-[11px] text-slate-500 line-clamp-1 mb-1 font-normal leading-normal">
            {product.short_description || product.category}
          </p>

          {/* Trust rating badge */}
          <div className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold mb-2.5">
            <div className="flex items-center">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-slate-600 font-bold">4.9</span>
            <span className="text-slate-400">(verified)</span>
          </div>
        </div>

        {/* Row 3: Daraz-Style Red Order Button at Bottom with slide icon animation */}
        <a
          href={product.order_url || '#'}
          target="_self"
          onClick={handleOrderClick}
          className="relative w-full h-8 sm:h-9 px-3 rounded-lg sm:rounded-xl bg-[#f85606] hover:bg-[#e04800] active:bg-[#c93f00] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-[#f85606]/30 hover:shadow-md transition-all overflow-hidden group/btn cursor-pointer select-none"
        >
          <ShoppingBag className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:scale-110" />
          <span className="tracking-wide uppercase text-[11px] sm:text-xs">Order Now</span>
        </a>

      </div>

    </article>
  );
};
