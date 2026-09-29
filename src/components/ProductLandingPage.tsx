import React, { useState } from 'react';
import { 
  Copy, 
  Share2, 
  Check, 
  ShieldCheck, 
  Truck, 
  Lock, 
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Send,
  Star
} from 'lucide-react';
import { Product } from '../types';
import { AdBanner } from './AdBanner';

interface ProductLandingPageProps {
  product: Product;
  currency: string;
  onBack: () => void;
  onShowToast: (message: string) => void;
}

export const ProductLandingPage: React.FC<ProductLandingPageProps> = ({
  product,
  currency,
  onBack,
  onShowToast
}) => {
  // Collect images array (minimum 1 image)
  const allImages = React.useMemo(() => {
    let list: string[] = [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      list = product.images.filter(Boolean);
    }
    if (list.length === 0 && product.thumbnail) {
      list = [product.thumbnail];
    }
    if (list.length === 0) {
      list = ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'];
    }
    return list;
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(true);

  const currentPrice = Number(product.price) || 0;
  const oldPrice = product.old_price ? Number(product.old_price) : undefined;
  const discount = product.discount || (oldPrice && oldPrice > currentPrice
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    : undefined);

  // Exact product URL: https://domain.com/post.html?id=PRODUCT_ID
  const productShareUrl = `${window.location.origin}/post.html?id=${encodeURIComponent(product.id)}`;
  const shareText = `Check out ${product.title} on Shopr: ${productShareUrl}`;

  // Copy Link with Toast notification
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(productShareUrl);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = productShareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      onShowToast('Link copied to clipboard!');
    } catch {
      onShowToast('Link copied to clipboard!');
    }
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.short_description || `Check out ${product.title} on Shopr`,
          url: productShareUrl
        });
      } catch (err) {
        // User dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  // Rich description parser supporting B, /, -, center, and line-by-line alignment
  const renderFormattedDescription = (text: string) => {
    if (!text) return null;

    const lines = text.split('\n');

    return (
      <div className="space-y-2.5 text-slate-700 leading-relaxed text-sm">
        {lines.map((rawLine, idx) => {
          let trimmed = rawLine.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Check for Center formatting <center>...</center> or [center]...[/center]
          let isCentered = false;
          if (
            (trimmed.toLowerCase().startsWith('<center>') && trimmed.toLowerCase().endsWith('</center>')) ||
            (trimmed.toLowerCase().startsWith('[center]') && trimmed.toLowerCase().endsWith('[/center]'))
          ) {
            isCentered = true;
            trimmed = trimmed
              .replace(/^<center>/i, '')
              .replace(/<\/center>$/i, '')
              .replace(/^\[center\]/i, '')
              .replace(/\[\/center\]$/i, '')
              .trim();
          }

          // Check for Bullet item (- , • , * )
          let isBullet = false;
          if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
            isBullet = true;
            trimmed = trimmed.replace(/^[-•*]\s*/, '');
          }

          // Check for heading (### or ##)
          let isHeading = false;
          if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('#### ')) {
            isHeading = true;
            trimmed = trimmed.replace(/^#+\s*/, '');
          }

          // Parse inline bold (<b> or **) and italic (<i> or *)
          const parseInline = (str: string): React.ReactNode[] => {
            const regex = /(<b>[\s\S]*?<\/b>|\*\*[\s\S]*?\*\*|<i>[\s\S]*?<\/i>|\*[\s\S]*?\*)/gi;
            const parts: React.ReactNode[] = [];
            let lastIndex = 0;
            let match: RegExpExecArray | null;

            while ((match = regex.exec(str)) !== null) {
              if (match.index > lastIndex) {
                parts.push(str.substring(lastIndex, match.index));
              }

              const matchedStr = match[0];
              if (matchedStr.toLowerCase().startsWith('<b>') || matchedStr.startsWith('**')) {
                const inner = matchedStr.replace(/^<b>|^\*\*/g, '').replace(/<\/b>$|\*\*$/g, '');
                parts.push(<strong key={match.index} className="font-bold text-slate-900">{inner}</strong>);
              } else if (matchedStr.toLowerCase().startsWith('<i>') || matchedStr.startsWith('*')) {
                const inner = matchedStr.replace(/^<i>|^\*/g, '').replace(/<\/i>$|\*$/g, '');
                parts.push(<em key={match.index} className="italic text-slate-800">{inner}</em>);
              }
              lastIndex = regex.lastIndex;
            }

            if (lastIndex < str.length) {
              parts.push(str.substring(lastIndex));
            }

            return parts.length > 0 ? parts : [str];
          };

          if (isHeading) {
            return (
              <h4 key={idx} className={`font-['Plus_Jakarta_Sans'] font-extrabold text-base text-slate-900 pt-2 border-b border-slate-100 pb-1 ${isCentered ? 'text-center' : ''}`}>
                {parseInline(trimmed)}
              </h4>
            );
          }

          if (isBullet) {
            return (
              <div key={idx} className={`flex items-start gap-2.5 pl-1 ${isCentered ? 'justify-center' : ''}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f85606] mt-2 shrink-0" />
                <span className="flex-1">{parseInline(trimmed)}</span>
              </div>
            );
          }

          return (
            <p key={idx} className={`${isCentered ? 'text-center font-medium' : ''}`}>
              {parseInline(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-6 px-4 space-y-6">
      
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <button onClick={onBack} className="hover:text-[#f85606] transition-colors">
          Home
        </button>
        <span>/</span>
        <span className="text-slate-400">{product.category}</span>
        <span>/</span>
        <span className="text-slate-800 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm">
        
        {/* Left Column: Media Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden flex items-center justify-center">
            {discount && discount > 0 ? (
              <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md text-xs font-black bg-[#f85606] text-white shadow-md">
                -{discount}% OFF
              </span>
            ) : null}

            <img
              src={allImages[activeImageIndex]}
              alt={product.title}
              className={`max-w-full max-h-full object-contain transition-all duration-300 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';
              }}
            />
          </div>

          {/* Thumbnails Row */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setImageLoaded(false);
                  }}
                  className={`relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#f85606] shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Adsterra Banner Slot in Product Page */}
          <AdBanner className="mt-4" />
        </div>

        {/* Right Column: Title, Price, Daraz Red Order Button, Specs */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          
          <div className="mb-2">
            <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-50 text-[#f85606] border border-orange-200 uppercase tracking-wider mb-2">
              {product.category}
            </span>
            <h1 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Star rating & sales */}
          <div className="flex items-center gap-2 mb-4 text-xs">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="font-bold text-slate-700">4.9</span>
            <span className="text-slate-400">• 128 Ratings & Reviews • 100% Authentic</span>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/90 mb-5 flex items-baseline gap-3">
            <span className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-black text-[#f85606]">
              {currency}{currentPrice.toLocaleString(undefined, { minimumFractionDigits: currentPrice % 1 === 0 ? 0 : 2 })}
            </span>
            {oldPrice && oldPrice > currentPrice && (
              <>
                <span className="text-base text-slate-400 line-through">
                  {currency}{oldPrice.toLocaleString(undefined, { minimumFractionDigits: oldPrice % 1 === 0 ? 0 : 2 })}
                </span>
                <span className="text-xs font-black text-white bg-[#f85606] px-2 py-0.5 rounded">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Daraz-Style RED ORDER BUTTON (Up-and-down slide bounce animation) */}
          <div className="mb-6">
            <style>{`
              @keyframes darazSlideBounce {
                0%, 100% {
                  transform: translateY(0);
                  box-shadow: 0 8px 20px -3px rgba(248, 86, 6, 0.45);
                }
                50% {
                  transform: translateY(-4px);
                  box-shadow: 0 16px 26px -3px rgba(248, 86, 6, 0.6);
                }
              }
              .btn-daraz-order {
                animation: darazSlideBounce 2.4s ease-in-out infinite;
              }
              .btn-daraz-order:hover {
                animation-play-state: paused;
                transform: translateY(-2px);
              }
            `}</style>
            
            <a
              href={product.order_url || '#'}
              target="_self"
              className="btn-daraz-order flex items-center justify-center gap-2.5 w-full h-13 sm:h-14 rounded-2xl bg-[#f85606] hover:bg-[#e04800] active:bg-[#c93f00] text-white font-black text-sm sm:text-base tracking-wide uppercase transition-all cursor-pointer shadow-lg select-none group/order"
              onClick={(e) => {
                if (!product.order_url || product.order_url === '#') {
                  e.preventDefault();
                  onShowToast('Direct checkout link incoming for this product.');
                }
              }}
            >
              <ShoppingBag className="w-5 h-5 transition-transform duration-300 group-hover/order:scale-110" />
              <span>Order Now (Buy Now)</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover/order:translate-x-1" />
            </a>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 px-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Safe Checkout</span>
              </span>
              <a 
                href="https://t.me/shopr_official" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#f85606] font-bold hover:underline flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>Need Help? Telegram Support</span>
              </a>
            </div>
          </div>

          {/* E-Commerce Guarantee Badges */}
          <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 mb-6 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#f85606] shrink-0" />
              <span className="font-bold">Fast Courier Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">100% Genuine Guaranteed</span>
            </div>
          </div>

          {/* Short Description */}
          {product.short_description && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-['Plus_Jakarta_Sans']">
                Product Summary
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {product.short_description}
              </p>
            </div>
          )}

          {/* Full Specifications & Line-by-Line Formatted Description */}
          <div className="border-t border-slate-100 pt-6 mb-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 font-['Plus_Jakarta_Sans'] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f85606]" />
              <span>Full Details & Specifications</span>
            </h3>
            
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              {renderFormattedDescription(
                product.full_description || 
                product.short_description || 
                'Detailed specifications verified by the Shopr curation team.'
              )}
            </div>
          </div>

          {/* Social Share System */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#f85606]" />
                <span>Share with Friends</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-50 text-[#f85606] hover:bg-orange-100 border border-orange-200 transition-all active:scale-95 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </button>

              {'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              )}

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all"
              >
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(productShareUrl)}&text=${encodeURIComponent(product.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-all"
              >
                <Send className="w-3 h-3" />
                <span>Telegram</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
