import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductLandingPage } from './components/ProductLandingPage';
import { AdminPortal } from './components/AdminPortal';
import { ExportModal } from './components/ExportModal';
import { Toast } from './components/Toast';
import { AdBanner } from './components/AdBanner';
import { Product, Category, StoreSettings, MenuItem } from './types';
import { subscribeProducts, subscribeCategories, subscribeMenus, subscribeSettings } from './firebase';
import { INITIAL_SETTINGS } from './data/seed';
import { ArrowUpDown, Filter, ShieldCheck, Truck, Headphones, Sparkles, Send, Zap } from 'lucide-react';
import { ShoprLogo } from './components/ShoprLogo';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'store' | 'product' | 'admin' | 'package'>('store');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'discount'>('newest');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Check URL params for secret admin access (?admin=1 or ?admin=true)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === '1' || urlParams.get('admin') === 'true') {
      setCurrentTab('admin');
    }

    // Keyboard shortcut to open admin panel discreetly (Ctrl + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setCurrentTab(prev => prev === 'admin' ? 'store' : 'admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subscribe to Firebase RTDB for live data sync (Products, Categories, Menus, Settings)
  useEffect(() => {
    const unsubProducts = subscribeProducts((prods) => {
      setProducts(prods);
      if (!selectedProduct && prods.length > 0) {
        setSelectedProduct(prods[0]);
      }
    });

    const unsubCategories = subscribeCategories((cats) => {
      setCategories(cats);
    });

    const unsubMenus = subscribeMenus((m) => {
      setMenus(m);
    });

    const unsubSettings = subscribeSettings((s) => {
      setSettings(s);
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubMenus();
      unsubSettings();
    };
  }, []);

  // Filter & Sort active products for public storefront
  const visibleProducts = React.useMemo(() => {
    let list = products.filter(p => p.status === 'Active');

    if (activeCategory !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.short_description && p.short_description.toLowerCase().includes(q))
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
      return (b.created_at || 0) - (a.created_at || 0);
    });
  }, [products, activeCategory, searchQuery, sortBy]);

  // Navigate to product landing page
  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setCurrentTab('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Immediate state update callbacks so UI NEVER lags or requires reload
  const handleSaveProductState = (savedProduct: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex(p => p.id === savedProduct.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedProduct;
        return next;
      }
      return [savedProduct, ...prev];
    });
  };

  const handleDeleteProductState = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
  };

  const handleSaveCategory = (cat: Category) => {
    setCategories(prev => {
      const idx = prev.findIndex(c => c.id === cat.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = cat;
        return next;
      }
      return [...prev, cat];
    });
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const handleSaveMenu = (menu: MenuItem) => {
    setMenus(prev => {
      const idx = prev.findIndex(m => m.id === menu.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = menu;
        return next.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
      return [...prev, menu].sort((a, b) => (a.order || 0) - (b.order || 0));
    });
  };

  const handleDeleteMenu = (id: string) => {
    setMenus(prev => prev.filter(m => m.id !== id));
  };

  const activeCurrency = settings.currency || '$';

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900 flex flex-col font-['Inter'] selection:bg-[#f85606] selection:text-white">
      
      {/* Toast Notification Container */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Main Responsive Header with E-Commerce Style */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        siteName={settings.site_name}
        menus={menus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-5">
        
        {/* Tab 1: Public Storefront */}
        {currentTab === 'store' && (
          <div className="space-y-4">
            
            {/* Adsterra Sponsored Banner (728x90 on Desktop, 320x50 on Mobile) */}
            <AdBanner />

            {/* Catalog Controls: Clean Category Pills & Sort Filter */}
            <div id="catalogGrid" className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer ${
                    activeCategory === 'all'
                      ? 'bg-[#f85606] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Items ({products.filter(p => p.status === 'Active').length})
                </button>

                {categories.filter(c => c.id !== 'all').map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer ${
                      activeCategory.toLowerCase() === cat.name.toLowerCase()
                        ? 'bg-[#f85606] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sorting Filter */}
              <div className="flex items-center gap-2 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-[#f85606] cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="discount">Top Discounts</option>
                </select>
              </div>

            </div>

            {/* Dynamic Product Grid: 2 PER ROW on Mobile, scaling up responsively */}
            {visibleProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center my-6">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#f85606] flex items-center justify-center mx-auto mb-3">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 font-['Plus_Jakarta_Sans']">No products found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  We couldn't find items in "{searchQuery || activeCategory}". Try selecting another category.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="px-4 py-2 bg-[#f85606] text-white rounded-xl text-xs font-bold hover:bg-[#e04800] transition-colors cursor-pointer"
                >
                  Show All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3.5 pb-6">
                {visibleProducts.map(prod => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    currency={activeCurrency}
                    onSelectProduct={handleSelectProduct}
                  />
                ))}
              </div>
            )}

            {/* Promotional Trust & Support Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs my-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#f85606] flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-['Plus_Jakarta_Sans'] font-black text-xs text-slate-900">
                    Fast Express Delivery
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Quick dispatch with door-to-door courier tracking
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-['Plus_Jakarta_Sans'] font-black text-xs text-slate-900">
                    100% Authentic Quality
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Direct from certified merchants & manufacturers
                  </p>
                </div>
              </div>

              {/* Customer Support points directly to Telegram */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-['Plus_Jakarta_Sans'] font-black text-xs text-slate-900">
                    Telegram Customer Care
                  </h4>
                  <a 
                    href="https://t.me/shopr_official" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#f85606] font-bold hover:underline"
                  >
                    https://t.me/shopr_official
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Product Landing Page (post.html?id=...) */}
        {currentTab === 'product' && (
          selectedProduct ? (
            <ProductLandingPage
              product={selectedProduct}
              currency={activeCurrency}
              onBack={() => setCurrentTab('store')}
              onShowToast={showToast}
            />
          ) : (
            <div className="py-20 text-center">
              <p className="text-slate-500 text-sm">Please select a product from the storefront.</p>
              <button
                onClick={() => setCurrentTab('store')}
                className="mt-4 px-4 py-2 bg-[#f85606] text-white rounded-xl text-xs font-bold"
              >
                Go to Storefront
              </button>
            </div>
          )
        )}

        {/* Tab 3: Admin Management Portal (products_add/index.php) */}
        {currentTab === 'admin' && (
          <div>
            <div className="mb-4 flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold">
              <span>Admin Management Portal</span>
              <button 
                onClick={() => setCurrentTab('store')}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs font-semibold cursor-pointer"
              >
                ← Return to Public Store
              </button>
            </div>
            <AdminPortal
              products={products}
              categories={categories}
              settings={settings}
              menus={menus}
              onViewProduct={handleSelectProduct}
              onShowToast={showToast}
              onSaveProductState={handleSaveProductState}
              onDeleteProductState={handleDeleteProductState}
              onUpdateSettings={handleUpdateSettings}
              onSaveCategory={handleSaveCategory}
              onDeleteCategory={handleDeleteCategory}
              onSaveMenu={handleSaveMenu}
              onDeleteMenu={handleDeleteMenu}
            />
          </div>
        )}

        {/* Tab 4: Package & Deployment (shopr.zip) */}
        {currentTab === 'package' && (
          <ExportModal onShowToast={showToast} />
        )}

      </main>

      {/* Clean E-Commerce Footer with Telegram Customer Care */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <div className="mb-2">
                <ShoprLogo height={34} />
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-2">
                {settings.site_tagline}. Verified e-commerce platform with direct checkout routing and customer security.
              </p>
              <p className="text-[11px] text-slate-400">
                Authorized merchant forwarder.
              </p>
            </div>

            {/* Customer Care with Telegram Channel */}
            <div>
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-2.5 font-['Plus_Jakarta_Sans']">
                Customer Care
              </h5>
              <div className="space-y-2 text-xs">
                <a 
                  href="https://t.me/shopr_official" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 text-[#f85606] hover:bg-orange-100 font-bold transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Join Official Telegram (@shopr_official)</span>
                </a>
                <p className="text-[11px] text-slate-400">
                  Instant response & order tracking assistance via Telegram
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span 
              onDoubleClick={() => setCurrentTab('admin')} 
              title="Double click for Admin panel"
              className="cursor-default select-none"
            >
              &copy; {new Date().getFullYear()} {settings.site_name}. All rights reserved.
            </span>
            <span>Currency: <strong>{activeCurrency}</strong></span>
          </div>
        </div>
      </footer>

    </div>
  );
}
