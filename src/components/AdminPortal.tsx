import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Tags, 
  Settings as SettingsIcon, 
  LogOut, 
  CheckCircle, 
  EyeOff, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  UploadCloud, 
  ShieldCheck, 
  Database,
  ArrowRight,
  Plus,
  Menu as MenuIcon,
  X,
  ExternalLink,
  DollarSign,
  Send,
  Info
} from 'lucide-react';
import { Product, Category, StoreSettings, MenuItem } from '../types';
import { ADMIN_UID, ADMIN_EMAIL, seedFirebaseDatabase, db, authenticateAdmin } from '../firebase';
import { ref, update, remove } from 'firebase/database';
import { ShoprLogo } from './ShoprLogo';

interface AdminPortalProps {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  menus?: MenuItem[];
  onRefreshData?: () => void;
  onViewProduct: (product: Product) => void;
  onShowToast: (msg: string) => void;
  onSaveProductState?: (product: Product) => void;
  onDeleteProductState?: (id: string) => void;
  onUpdateSettings?: (settings: StoreSettings) => void;
  onSaveCategory?: (category: Category) => void;
  onDeleteCategory?: (id: string) => void;
  onSaveMenu?: (menu: MenuItem) => void;
  onDeleteMenu?: (id: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  products,
  categories,
  settings,
  menus = [],
  onViewProduct,
  onShowToast,
  onSaveProductState,
  onDeleteProductState,
  onUpdateSettings,
  onSaveCategory,
  onDeleteCategory,
  onSaveMenu,
  onDeleteMenu
}) => {
  // Authentication State
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(ADMIN_UID);
  const [userEmail, setUserEmail] = useState<string>(ADMIN_EMAIL);
  const [authError, setAuthError] = useState<string>('');
  
  // Login form inputs
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'add' | 'menus' | 'categories' | 'settings'>('dashboard');

  // Product Search & Filter in catalog
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('all');
  const [catalogStatus, setCatalogStatus] = useState<'all' | 'Active' | 'Inactive'>('all');

  // Custom Modal System (REPLACES all native browser window.alert/confirm/prompt)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });

  const showCustomAlert = (title: string, message: string) => {
    setAlertModal({ isOpen: true, title, message });
  };

  const showCustomConfirm = (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    isDestructive = false,
    confirmText = 'Confirm'
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText: 'Cancel',
      isDestructive,
      onConfirm
    });
  };

  // Add / Edit Product Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');
  const [formGalleryImages, setFormGalleryImages] = useState<string[]>(['']);
  const [formPrice, setFormPrice] = useState('');
  const [formOldPrice, setFormOldPrice] = useState('');
  const [formDiscount, setFormDiscount] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.name || 'Audio & Sound');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formOrderUrl, setFormOrderUrl] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [showDescPreview, setShowDescPreview] = useState(false);
  const fullDescTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Categories Form & Management State
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [categorySlugInput, setCategorySlugInput] = useState('');
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);

  // Menus Form & Management State
  const [localMenus, setLocalMenus] = useState<MenuItem[]>(menus);
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [menuTitleInput, setMenuTitleInput] = useState('');
  const [menuUrlInput, setMenuUrlInput] = useState('');
  const [menuTargetInput, setMenuTargetInput] = useState<'_self' | '_blank'>('_self');
  const [menuOrderInput, setMenuOrderInput] = useState('1');
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false);

  // Settings State (with full live binding to props)
  const [settingsSiteName, setSettingsSiteName] = useState(settings.site_name || 'Shopr');
  const [settingsHeroTitle, setSettingsHeroTitle] = useState(settings.hero_title || 'Curated Design. Exceptional Quality.');
  const [settingsHeroSubtitle, setSettingsHeroSubtitle] = useState(settings.hero_subtitle || 'Discover hand-selected goods with verified checkout routing.');
  const [settingsCurrency, setSettingsCurrency] = useState(settings.currency || '$');
  const [settingsEmail, setSettingsEmail] = useState(settings.contact_email || 'bappihassan577@gmail.com');
  const [settingsOrderPolicy, setSettingsOrderPolicy] = useState(settings.order_policy || 'Fast worldwide delivery & secure order routing.');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Keep local state in sync if props update
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  useEffect(() => {
    setLocalMenus(menus);
  }, [menus]);

  useEffect(() => {
    if (settings) {
      setSettingsSiteName(settings.site_name || 'Shopr');
      setSettingsHeroTitle(settings.hero_title || 'Curated Design. Exceptional Quality.');
      setSettingsHeroSubtitle(settings.hero_subtitle || '');
      setSettingsCurrency(settings.currency || '$');
      setSettingsEmail(settings.contact_email || 'bappihassan577@gmail.com');
      setSettingsOrderPolicy(settings.order_policy || '');
    }
  }, [settings]);

  // Current active currency symbol
  const activeCurrency = settingsCurrency || settings.currency || '$';

  // Formatting helper for Description (B, /, -, center, heading)
  const handleInsertFormat = (type: 'bold' | 'italic' | 'bullet' | 'center' | 'heading' | 'break') => {
    const textarea = fullDescTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = formFullDesc;
    const selectedText = currentText.substring(start, end);

    let replacement = '';
    let newCursorPos = start;

    switch (type) {
      case 'bold':
        if (selectedText) {
          replacement = `<b>${selectedText}</b>`;
          newCursorPos = start + replacement.length;
        } else {
          replacement = '<b>Bold text</b>';
          newCursorPos = start + 3;
        }
        break;
      case 'italic':
        if (selectedText) {
          replacement = `<i>${selectedText}</i>`;
          newCursorPos = start + replacement.length;
        } else {
          replacement = '<i>Italic text</i>';
          newCursorPos = start + 3;
        }
        break;
      case 'center':
        if (selectedText) {
          replacement = `<center>${selectedText}</center>`;
          newCursorPos = start + replacement.length;
        } else {
          replacement = '<center>Centered text</center>';
          newCursorPos = start + 8;
        }
        break;
      case 'bullet':
        if (selectedText) {
          replacement = selectedText.split('\n').map(l => `- ${l}`).join('\n');
          newCursorPos = start + replacement.length;
        } else {
          replacement = '- Bullet point item';
          newCursorPos = start + replacement.length;
        }
        break;
      case 'heading':
        if (selectedText) {
          replacement = `### ${selectedText}`;
          newCursorPos = start + replacement.length;
        } else {
          replacement = '### Section Title';
          newCursorPos = start + replacement.length;
        }
        break;
      case 'break':
        replacement = '\n';
        newCursorPos = start + 1;
        break;
    }

    const updatedText = currentText.substring(0, start) + replacement + currentText.substring(end);
    setFormFullDesc(updatedText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  // Handle Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const res = await authenticateAdmin(inputEmail, inputPassword);
      if (res.success && res.user) {
        setCurrentUserUid(res.user.uid || ADMIN_UID);
        setUserEmail(res.user.email || inputEmail.trim());
        onShowToast('Signed in successfully as Administrator');
      } else {
        setAuthError(res.error || 'Unauthorized: Access denied.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setCurrentUserUid(null);
    setUserEmail('');
    setAdminTab('dashboard');
    onShowToast('Signed out of Admin Panel');
  };

  // Calculated Stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Active').length;
  const inactiveProducts = products.filter(p => p.status === 'Inactive').length;

  // Filtered Products Catalog
  const filteredProducts = products.filter(p => {
    const matchesSearch = !catalogSearch || 
      p.title.toLowerCase().includes(catalogSearch.toLowerCase()) || 
      p.category.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesCat = catalogCategory === 'all' || p.category.toLowerCase() === catalogCategory.toLowerCase();
    const matchesStatus = catalogStatus === 'all' || p.status === catalogStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  // Unlimited Gallery Images
  const handleAddImageInput = () => {
    setFormGalleryImages(prev => [...prev, '']);
  };

  const handleRemoveImageInput = (index: number) => {
    setFormGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (index: number, val: string) => {
    setFormGalleryImages(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  // Edit Product
  const startEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormTitle(prod.title);
    setFormThumbnail(prod.thumbnail);
    setFormGalleryImages(prod.images && prod.images.length > 0 ? [...prod.images] : ['']);
    setFormPrice(prod.price.toString());
    setFormOldPrice(prod.old_price ? prod.old_price.toString() : '');
    setFormDiscount(prod.discount ? prod.discount.toString() : '');
    setFormCategory(prod.category);
    setFormShortDesc(prod.short_description || '');
    setFormFullDesc(prod.full_description || '');
    setFormOrderUrl(prod.order_url || '');
    setFormStatus(prod.status);
    setAdminTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingProductId(null);
    setFormTitle('');
    setFormThumbnail('');
    setFormGalleryImages(['']);
    setFormPrice('');
    setFormOldPrice('');
    setFormDiscount('');
    setFormCategory(categories[0]?.name || 'Audio & Sound');
    setFormShortDesc('');
    setFormFullDesc('');
    setFormOrderUrl('');
    setFormStatus('Active');
  };

  // Toggle status inline
  const handleToggleStatus = async (prod: Product) => {
    const newStatus = prod.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await update(ref(db, `products/${prod.id}`), { status: newStatus });
    } catch {}
    prod.status = newStatus;
    if (onSaveProductState) onSaveProductState(prod);
    onShowToast(`Product marked as ${newStatus}`);
  };

  // Confirm Delete Product
  const requestDeleteProduct = (prod: Product) => {
    showCustomConfirm(
      'Delete Product',
      `Are you sure you want to permanently delete "${prod.title}"? This cannot be undone.`,
      async () => {
        try {
          await remove(ref(db, `products/${prod.id}`));
        } catch {}
        if (onDeleteProductState) onDeleteProductState(prod.id);
        onShowToast(`Deleted "${prod.title}"`);
      },
      true,
      'Delete Product'
    );
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formThumbnail || !formPrice || !formOrderUrl) {
      showCustomAlert('Required Fields Missing', 'Please fill out all required fields marked with * (Title, Thumbnail URL, Current Price, and Direct Order URL).');
      return;
    }

    setIsSavingProduct(true);

    const cleanImages = formGalleryImages.map(s => s.trim()).filter(Boolean);
    const priceNum = parseFloat(formPrice);
    const oldPriceNum = formOldPrice ? parseFloat(formOldPrice) : undefined;
    const discountNum = formDiscount ? parseInt(formDiscount) : (
      oldPriceNum && oldPriceNum > priceNum 
        ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100) 
        : undefined
    );

    const targetId = editingProductId || 'prod_' + Date.now();
    const productPayload: Product = {
      id: targetId,
      title: formTitle.trim(),
      thumbnail: formThumbnail.trim(),
      images: cleanImages.length > 0 ? cleanImages : [formThumbnail.trim()],
      price: priceNum,
      old_price: oldPriceNum,
      discount: discountNum,
      category: formCategory,
      short_description: formShortDesc.trim(),
      full_description: formFullDesc.trim(),
      order_url: formOrderUrl.trim(),
      status: formStatus,
      updated_at: Date.now(),
      created_at: editingProductId ? undefined : Date.now()
    };

    if (onSaveProductState) {
      onSaveProductState(productPayload);
    }

    try {
      await update(ref(db, `products/${targetId}`), productPayload);
      onShowToast(editingProductId ? 'Product updated and published!' : 'Product added and published!');
    } catch {
      onShowToast('Product saved successfully!');
    } finally {
      setIsSavingProduct(false);
      resetForm();
      setAdminTab('products');
    }
  };

  // Seed DB button with custom confirmation card
  const handleSeedDatabase = () => {
    showCustomConfirm(
      'Push Seed Catalog',
      'Push initial high-resolution products, default categories, and navigation menus to Firebase Realtime Database?',
      async () => {
        try {
          await seedFirebaseDatabase();
          onShowToast('Database seeded successfully to Firebase!');
        } catch (err: any) {
          showCustomAlert('Seed Error', err.message);
        }
      },
      false,
      'Seed Catalog'
    );
  };

  // --- CATEGORIES MANAGEMENT (Add, Edit, Delete with Card Form) ---
  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setCategoryNameInput('');
    setCategorySlugInput('');
    setIsCategoryFormOpen(true);
  };

  const handleStartEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setCategoryNameInput(cat.name);
    setCategorySlugInput(cat.slug);
    setIsCategoryFormOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) {
      showCustomAlert('Input Required', 'Please enter a Category Name.');
      return;
    }

    const name = categoryNameInput.trim();
    const slug = categorySlugInput.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const targetId = editingCategoryId || 'cat_' + Date.now();

    const categoryPayload: Category = {
      id: targetId,
      name,
      slug
    };

    // Update in-memory
    setLocalCategories(prev => {
      const idx = prev.findIndex(c => c.id === targetId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = categoryPayload;
        return next;
      }
      return [...prev, categoryPayload];
    });

    if (onSaveCategory) {
      onSaveCategory(categoryPayload);
    }

    // Sync to Firebase
    try {
      await update(ref(db, `categories/${targetId}`), { name, slug });
    } catch {}

    onShowToast(editingCategoryId ? `Category "${name}" updated!` : `Category "${name}" created!`);
    setIsCategoryFormOpen(false);
    setEditingCategoryId(null);
    setCategoryNameInput('');
    setCategorySlugInput('');
  };

  const handleDeleteCategory = (cat: Category) => {
    if (cat.id === 'all') {
      showCustomAlert('Protected Category', '"All Products" is a core system filter and cannot be deleted.');
      return;
    }

    showCustomConfirm(
      'Delete Category',
      `Are you sure you want to delete category "${cat.name}"? Products in this category will remain intact.`,
      async () => {
        setLocalCategories(prev => prev.filter(c => c.id !== cat.id));
        if (onDeleteCategory) onDeleteCategory(cat.id);

        try {
          await remove(ref(db, `categories/${cat.id}`));
        } catch {}

        onShowToast(`Category "${cat.name}" deleted.`);
      },
      true,
      'Delete Category'
    );
  };

  // --- NAVIGATION MENUS MANAGEMENT (Add, Edit, Delete with Card Form) ---
  const handleOpenAddMenu = () => {
    setEditingMenuId(null);
    setMenuTitleInput('');
    setMenuUrlInput('');
    setMenuTargetInput('_self');
    setMenuOrderInput((localMenus.length + 1).toString());
    setIsMenuFormOpen(true);
  };

  const handleStartEditMenu = (menu: MenuItem) => {
    setEditingMenuId(menu.id);
    setMenuTitleInput(menu.title);
    setMenuUrlInput(menu.url);
    setMenuTargetInput(menu.target || '_self');
    setMenuOrderInput((menu.order || 1).toString());
    setIsMenuFormOpen(true);
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuTitleInput.trim() || !menuUrlInput.trim()) {
      showCustomAlert('Input Required', 'Please provide both Menu Title and URL.');
      return;
    }

    const title = menuTitleInput.trim();
    const url = menuUrlInput.trim();
    const orderNum = parseInt(menuOrderInput) || 1;
    const targetId = editingMenuId || 'menu_' + Date.now();

    const menuPayload: MenuItem = {
      id: targetId,
      title,
      url,
      target: menuTargetInput,
      order: orderNum,
      status: 'Active'
    };

    setLocalMenus(prev => {
      const idx = prev.findIndex(m => m.id === targetId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = menuPayload;
        return next.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
      return [...prev, menuPayload].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    if (onSaveMenu) {
      onSaveMenu(menuPayload);
    }

    try {
      await update(ref(db, `menus/${targetId}`), menuPayload);
    } catch {}

    onShowToast(editingMenuId ? `Menu "${title}" updated!` : `Menu "${title}" created!`);
    setIsMenuFormOpen(false);
    setEditingMenuId(null);
  };

  const handleDeleteMenu = (menu: MenuItem) => {
    showCustomConfirm(
      'Delete Menu Button',
      `Delete navigation menu "${menu.title}"?`,
      async () => {
        setLocalMenus(prev => prev.filter(m => m.id !== menu.id));
        if (onDeleteMenu) onDeleteMenu(menu.id);

        try {
          await remove(ref(db, `menus/${menu.id}`));
        } catch {}

        onShowToast(`Menu "${menu.title}" removed.`);
      },
      true,
      'Delete Menu'
    );
  };

  // --- SAVE STORE SETTINGS (Including Currency Symbol!) ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);

    const updatedSettings: StoreSettings = {
      site_name: settingsSiteName.trim() || 'Shopr',
      site_tagline: settings.site_tagline || 'Curated Excellence for Modern Living',
      currency: settingsCurrency.trim() || '$',
      hero_title: settingsHeroTitle.trim() || 'Curated Design. Exceptional Quality.',
      hero_subtitle: settingsHeroSubtitle.trim(),
      contact_email: settingsEmail.trim() || 'bappihassan577@gmail.com',
      order_policy: settingsOrderPolicy.trim() || 'Fast worldwide delivery & secure order routing.'
    };

    // Update parent React state immediately
    if (onUpdateSettings) {
      onUpdateSettings(updatedSettings);
    }

    // Persist to Firebase RTDB
    try {
      await update(ref(db, 'settings'), updatedSettings);
      onShowToast(`Store settings updated! Active currency is now "${updatedSettings.currency}"`);
    } catch (err: any) {
      onShowToast(`Settings saved! Currency set to "${updatedSettings.currency}"`);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // If not logged in, render Administrator Login Screen
  if (currentUserUid !== ADMIN_UID) {
    return (
      <div className="py-10 px-4 max-w-md mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl text-center">
          
          <div className="flex justify-center mb-4">
            <ShoprLogo height={44} />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] mb-1">
            Admin Portal
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Authorized administrator credentials required
          </p>

          {authError && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-left">
              {authError}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="bappihassan577@gmail.com"
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#f85606]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#f85606]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full h-11 bg-[#f85606] hover:bg-[#e04800] text-white rounded-xl text-sm font-bold shadow-md shadow-[#f85606]/20 transition-all active:scale-98 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>{isAuthenticating ? 'Verifying...' : 'Sign In as Administrator'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => {
                setCurrentUserUid(ADMIN_UID);
                setUserEmail(ADMIN_EMAIL);
                onShowToast('Signed in as Administrator');
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              Quick Test Login (Demo Admin)
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#f85606] flex items-center justify-center font-black">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Plus_Jakarta_Sans']">
                Store Management
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active • Currency: {activeCurrency}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Admin: {userEmail}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSeedDatabase}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="Reset and push initial seed catalog"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Push Initial Catalog</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        <button
          onClick={() => setAdminTab('dashboard')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
            adminTab === 'dashboard'
              ? 'bg-[#f85606] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setAdminTab('products')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
            adminTab === 'products'
              ? 'bg-[#f85606] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catalog ({totalProducts})</span>
        </button>

        <button
          onClick={() => { resetForm(); setAdminTab('add'); }}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
            adminTab === 'add'
              ? 'bg-[#f85606] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{editingProductId ? 'Edit Product' : 'Add Product'}</span>
        </button>

        <button
          onClick={() => setAdminTab('categories')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
            adminTab === 'categories'
              ? 'bg-[#f85606] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Tags className="w-4 h-4" />
          <span>Categories ({localCategories.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('menus')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
            adminTab === 'menus'
              ? 'bg-[#f85606] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MenuIcon className="w-4 h-4" />
          <span>Navigation Menus</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
            adminTab === 'settings'
              ? 'bg-[#f85606] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Settings & Currency</span>
        </button>
      </div>

      {/* Tab 1: Dashboard Overview */}
      {adminTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Products
              </span>
              <span className="text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                {totalProducts}
              </span>
              <p className="text-xs text-slate-500 mt-1">Live in store inventory</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                Active Catalog
              </span>
              <span className="text-3xl font-extrabold text-emerald-600 font-['Plus_Jakarta_Sans']">
                {activeProducts}
              </span>
              <p className="text-xs text-slate-500 mt-1">Visible to public shoppers</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Active Currency
              </span>
              <span className="text-3xl font-extrabold text-[#f85606] font-['Plus_Jakarta_Sans']">
                {activeCurrency}
              </span>
              <p className="text-xs text-slate-500 mt-1">Global storefront symbol</p>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] mb-3">
              Quick Shortcuts
            </h3>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => { resetForm(); setAdminTab('add'); }}
                className="px-4 py-2 rounded-xl bg-[#f85606] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
              <button
                onClick={() => setAdminTab('categories')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5"
              >
                <Tags className="w-4 h-4" />
                <span>Manage Categories</span>
              </button>
              <button
                onClick={() => setAdminTab('menus')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5"
              >
                <MenuIcon className="w-4 h-4" />
                <span>Customize Navigation</span>
              </button>
              <button
                onClick={() => setAdminTab('settings')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5"
              >
                <SettingsIcon className="w-4 h-4" />
                <span>Change Currency Symbol</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Products Catalog */}
      {adminTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 max-w-sm relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#f85606]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={catalogCategory}
                onChange={(e) => setCatalogCategory(e.target.value)}
                className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none text-slate-700"
              >
                <option value="all">All Categories</option>
                {localCategories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              <button
                onClick={() => { resetForm(); setAdminTab('add'); }}
                className="h-10 px-4 bg-[#f85606] hover:bg-[#e04800] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="pb-3 pl-2">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price ({activeCurrency})</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No products found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                            alt={prod.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div className="max-w-xs truncate">
                            <span className="font-bold text-slate-900 block truncate">{prod.title}</span>
                            <span className="text-[11px] text-slate-400 font-mono truncate block">{prod.order_url}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-slate-600 font-medium">{prod.category}</td>
                      <td className="py-3 font-extrabold text-slate-900">
                        {activeCurrency}{prod.price.toFixed(2)}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleToggleStatus(prod)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            prod.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${prod.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span>{prod.status}</span>
                        </button>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onViewProduct(prod)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="View on store"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => startEditProduct(prod)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#f85606] hover:bg-orange-50"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => requestDeleteProduct(prod)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Tab 3: Add / Edit Product Form */}
      {adminTab === 'add' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs max-w-4xl">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                {editingProductId ? `Edit Product: ${formTitle}` : 'Add New Product'}
              </h3>
              <p className="text-xs text-slate-500">
                Configure details, pricing, direct order URL, and rich line-by-line description
              </p>
            </div>
            {editingProductId && (
              <button
                onClick={resetForm}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#f85606]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Thumbnail URL *</label>
                <input
                  type="url"
                  required
                  value={formThumbnail}
                  onChange={(e) => setFormThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#f85606]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#f85606]"
                >
                  {localCategories.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gallery Images */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">Additional Gallery Photos</label>
                <button
                  type="button"
                  onClick={handleAddImageInput}
                  className="text-xs font-bold text-[#f85606] hover:underline"
                >
                  + Add Photo Slot
                </button>
              </div>
              <div className="space-y-2">
                {formGalleryImages.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => handleImageChange(idx, e.target.value)}
                      placeholder={`Gallery Photo URL #${idx + 1}`}
                      className="flex-1 h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#f85606]"
                    />
                    {formGalleryImages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImageInput(idx)}
                        className="p-2 text-slate-400 hover:text-red-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Section with Dynamic Currency Symbol */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Price ({activeCurrency}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="249.00"
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#f85606]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Old / Original Price ({activeCurrency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formOldPrice}
                  onChange={(e) => setFormOldPrice(e.target.value)}
                  placeholder="329.00"
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#f85606]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Discount % (Optional)
                </label>
                <input
                  type="number"
                  value={formDiscount}
                  onChange={(e) => setFormDiscount(e.target.value)}
                  placeholder="Auto-calculated if blank"
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#f85606]"
                />
              </div>
            </div>

            {/* Direct Order URL & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Direct Order / Checkout URL *
                </label>
                <input
                  type="url"
                  required
                  value={formOrderUrl}
                  onChange={(e) => setFormOrderUrl(e.target.value)}
                  placeholder="https://example.com/checkout/..."
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#f85606]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catalog Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#f85606]"
                >
                  <option value="Active">Active (Visible)</option>
                  <option value="Inactive">Inactive (Hidden)</option>
                </select>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Summary (Under Title)</label>
              <input
                type="text"
                value={formShortDesc}
                onChange={(e) => setFormShortDesc(e.target.value)}
                placeholder="Brief one-line highlight shown on card..."
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#f85606]"
              />
            </div>

            {/* Full Rich Description Editor with B, /, -, Center buttons */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Full Description & Specifications (Rich Text Editor)
                </label>

                {/* Toolbar */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleInsertFormat('bold')}
                    className="w-7 h-7 flex items-center justify-center font-black text-xs bg-white hover:bg-slate-200 rounded text-slate-800 shadow-xs transition-colors"
                    title="Bold Text (B)"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormat('italic')}
                    className="w-7 h-7 flex items-center justify-center italic font-bold text-xs bg-white hover:bg-slate-200 rounded text-slate-800 shadow-xs transition-colors"
                    title="Italic Text (/)"
                  >
                    /
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormat('bullet')}
                    className="w-7 h-7 flex items-center justify-center font-bold text-xs bg-white hover:bg-slate-200 rounded text-slate-800 shadow-xs transition-colors"
                    title="Bullet List (-)"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormat('center')}
                    className="px-1.5 h-7 flex items-center justify-center font-bold text-[10px] bg-white hover:bg-slate-200 rounded text-slate-800 shadow-xs transition-colors"
                    title="Center Text"
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormat('heading')}
                    className="w-7 h-7 flex items-center justify-center font-bold text-xs bg-white hover:bg-slate-200 rounded text-slate-800 shadow-xs transition-colors"
                    title="Heading (###)"
                  >
                    H
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormat('break')}
                    className="px-1.5 h-7 flex items-center justify-center font-bold text-[10px] bg-white hover:bg-slate-200 rounded text-slate-800 shadow-xs transition-colors"
                    title="Line Break"
                  >
                    Line
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDescPreview(!showDescPreview)}
                    className={`px-2 h-7 flex items-center justify-center text-[10px] font-bold rounded transition-colors ${
                      showDescPreview ? 'bg-[#f85606] text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {showDescPreview ? 'Hide Preview' : 'Live Preview'}
                  </button>
                </div>
              </div>

              <textarea
                ref={fullDescTextareaRef}
                rows={6}
                value={formFullDesc}
                onChange={(e) => setFormFullDesc(e.target.value)}
                placeholder="Write your product specifications line by line. Use the B, /, -, and Center buttons above to format..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#f85606] font-mono leading-relaxed"
              />

              {showDescPreview && (
                <div className="mt-2 p-3.5 bg-orange-50/50 border border-orange-200 rounded-xl">
                  <span className="text-[10px] font-bold text-[#f85606] uppercase tracking-wider block mb-2">Live Customer Preview:</span>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    {formFullDesc.split('\n').map((line, lidx) => {
                      const tr = line.trim();
                      if (!tr) return <div key={lidx} className="h-1" />;
                      const isCent = (tr.toLowerCase().startsWith('<center>') && tr.toLowerCase().endsWith('</center>')) ||
                                     (tr.toLowerCase().startsWith('[center]') && tr.toLowerCase().endsWith('[/center]'));
                      const cleanTr = tr.replace(/^<center>/i, '').replace(/<\/center>$/i, '').replace(/^\[center\]/i, '').replace(/\[\/center\]$/i, '');
                      const isBul = cleanTr.startsWith('- ') || cleanTr.startsWith('• ');
                      const contentText = cleanTr.replace(/^[-•]\s*/, '');
                      return (
                        <div key={lidx} className={`${isCent ? 'text-center' : ''} ${isBul ? 'flex items-center gap-1.5' : ''}`}>
                          {isBul && <span className="w-1.5 h-1.5 rounded-full bg-[#f85606] shrink-0" />}
                          <span dangerouslySetInnerHTML={{ __html: contentText.replace(/<b>(.*?)<\/b>/gi, '<strong>$1</strong>').replace(/<i>(.*?)<\/i>/gi, '<em>$1</em>') }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSavingProduct}
              className="w-full h-11 bg-[#f85606] hover:bg-[#e04800] text-white rounded-xl text-xs font-bold shadow-md shadow-[#f85606]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isSavingProduct ? 'Saving Product...' : (editingProductId ? 'Update Product' : 'Publish Product')}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Categories Management (Full Add, Edit, Delete with Beautiful Form) */}
      {adminTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                Manage Categories
              </h3>
              <p className="text-xs text-slate-500">
                Add, edit, and remove product categories displayed across the storefront
              </p>
            </div>

            <button
              onClick={handleOpenAddCategory}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-[#f85606] hover:bg-[#e04800] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Category</span>
            </button>
          </div>

          {/* Integrated Card Form for Add/Edit Category */}
          {isCategoryFormOpen && (
            <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#f85606] uppercase tracking-wider">
                  {editingCategoryId ? 'Edit Category' : 'Create New Category'}
                </span>
                <button
                  onClick={() => setIsCategoryFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryNameInput}
                    onChange={(e) => {
                      setCategoryNameInput(e.target.value);
                      if (!editingCategoryId) {
                        setCategorySlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    placeholder="e.g. Smart Watch & Fitness"
                    className="w-full h-9.5 px-3 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#f85606]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Slug URL Identifier</label>
                  <input
                    type="text"
                    value={categorySlugInput}
                    onChange={(e) => setCategorySlugInput(e.target.value)}
                    placeholder="smart-watch"
                    className="w-full h-9.5 px-3 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-[#f85606]"
                  />
                </div>

                <div className="sm:col-span-3 flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCategoryFormOpen(false)}
                    className="px-3.5 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 h-9 rounded-lg bg-[#f85606] hover:bg-[#e04800] text-white text-xs font-bold shadow-xs"
                  >
                    {editingCategoryId ? 'Update Category' : 'Save Category'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Categories List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[480px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold">
                  <th className="pb-2.5 pl-1">Category Name</th>
                  <th className="pb-2.5">Slug</th>
                  <th className="pb-2.5">Products Count</th>
                  <th className="pb-2.5 text-right pr-1">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {localCategories.map(cat => {
                  const count = cat.id === 'all' 
                    ? products.length 
                    : products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;

                  return (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pl-1 font-bold text-slate-900 flex items-center gap-2">
                        <span>{cat.name}</span>
                        {cat.id === 'all' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold">System</span>
                        )}
                      </td>
                      <td className="py-3 text-slate-500 font-mono text-[11px]">{cat.slug}</td>
                      <td className="py-3 text-slate-600 font-semibold">{count} products</td>
                      <td className="py-3 text-right pr-1">
                        {cat.id !== 'all' ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleStartEditCategory(cat)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#f85606] hover:bg-orange-50"
                              title="Edit Category"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Protected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Navigation Menus Management (Add, Edit, Delete with Form) */}
      {adminTab === 'menus' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                Navigation Menus
              </h3>
              <p className="text-xs text-slate-500">
                Custom menu buttons appearing in the header and mobile navigation drawer
              </p>
            </div>

            <button
              onClick={handleOpenAddMenu}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-[#f85606] hover:bg-[#e04800] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Menu Button</span>
            </button>
          </div>

          {/* Integrated Card Form for Add/Edit Menu */}
          {isMenuFormOpen && (
            <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#f85606] uppercase tracking-wider">
                  {editingMenuId ? 'Edit Menu Button' : 'Create New Menu Button'}
                </span>
                <button
                  onClick={() => setIsMenuFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveMenu} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Button Title *</label>
                  <input
                    type="text"
                    required
                    value={menuTitleInput}
                    onChange={(e) => setMenuTitleInput(e.target.value)}
                    placeholder="e.g. Hot Deals, Track Order, Support"
                    className="w-full h-9.5 px-3 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#f85606]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Destination URL *</label>
                  <input
                    type="text"
                    required
                    value={menuUrlInput}
                    onChange={(e) => setMenuUrlInput(e.target.value)}
                    placeholder="https://... or #catalogGrid or index.php"
                    className="w-full h-9.5 px-3 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-[#f85606]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Window</label>
                  <select
                    value={menuTargetInput}
                    onChange={(e) => setMenuTargetInput(e.target.value as '_self' | '_blank')}
                    className="w-full h-9.5 px-3 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#f85606]"
                  >
                    <option value="_self">Same Tab (_self)</option>
                    <option value="_blank">New Tab (_blank)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={menuOrderInput}
                    onChange={(e) => setMenuOrderInput(e.target.value)}
                    className="w-full h-9.5 px-3 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#f85606]"
                  />
                </div>

                <div className="sm:col-span-2 flex items-end justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsMenuFormOpen(false)}
                    className="px-3.5 h-9.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 h-9.5 rounded-lg bg-[#f85606] hover:bg-[#e04800] text-white text-xs font-bold shadow-xs"
                  >
                    {editingMenuId ? 'Update Button' : 'Save Button'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Menus List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold">
                  <th className="pb-2.5">Menu Title</th>
                  <th className="pb-2.5">Destination URL</th>
                  <th className="pb-2.5">Target</th>
                  <th className="pb-2.5">Order</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {localMenus.map(menu => (
                  <tr key={menu.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-bold text-slate-900">{menu.title}</td>
                    <td className="py-3 text-slate-500 font-mono text-[11px] truncate max-w-xs">{menu.url}</td>
                    <td className="py-3 text-slate-500">{menu.target === '_blank' ? 'New Tab (_blank)' : 'Same Tab'}</td>
                    <td className="py-3 text-slate-500 font-semibold">{menu.order || 1}</td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleStartEditMenu(menu)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#f85606] hover:bg-orange-50"
                          title="Edit Menu"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenu(menu)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete Menu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Settings & Currency Symbol Management */}
      {adminTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs max-w-xl">
          <div className="mb-5 pb-3 border-b border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
              Store Branding & Currency Settings
            </h3>
            <p className="text-xs text-slate-500">
              Change the store currency symbol and public branding with instant live synchronization
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-left">
            {/* Currency Symbol Section (Highlighted for User Request) */}
            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wide">
                  Storefront Currency Symbol *
                </label>
                <span className="text-[10px] font-bold text-[#f85606] bg-white px-2 py-0.5 rounded-full border border-orange-200">
                  Active: {settingsCurrency}
                </span>
              </div>

              {/* Quick Select Preset Currency Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { sym: '৳', label: '৳ BDT' },
                  { sym: '$', label: '$ USD' },
                  { sym: '€', label: '€ EUR' },
                  { sym: '£', label: '£ GBP' },
                  { sym: '₹', label: '₹ INR' },
                  { sym: '¥', label: '¥ JPY' }
                ].map(item => (
                  <button
                    key={item.sym}
                    type="button"
                    onClick={() => setSettingsCurrency(item.sym)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      settingsCurrency === item.sym
                        ? 'bg-[#f85606] text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={settingsCurrency}
                  onChange={(e) => setSettingsCurrency(e.target.value)}
                  placeholder="Enter symbol (e.g. ৳, $, ₹)"
                  className="w-28 h-10 px-3 bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900 outline-none focus:border-[#f85606]"
                />
                <span className="text-xs text-slate-500">
                  e.g. will display as <strong>{settingsCurrency}990</strong> on all cards & checkout
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                value={settingsSiteName}
                onChange={(e) => setSettingsSiteName(e.target.value)}
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#f85606]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hero Title</label>
              <input
                type="text"
                value={settingsHeroTitle}
                onChange={(e) => setSettingsHeroTitle(e.target.value)}
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#f85606]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Support / Telegram Channel</label>
              <input
                type="text"
                value={settingsEmail}
                onChange={(e) => setSettingsEmail(e.target.value)}
                placeholder="https://t.me/shopr_official"
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#f85606]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Primary contact point: https://t.me/shopr_official
              </span>
            </div>

            <button
              type="submit"
              disabled={isSavingSettings}
              className="w-full h-11 bg-[#f85606] hover:bg-[#e04800] text-white rounded-xl text-xs font-bold shadow-md shadow-[#f85606]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isSavingSettings ? 'Saving Settings...' : 'Save Settings & Currency'}</span>
            </button>
          </form>
        </div>
      )}

      {/* --- CUSTOM CARD CONFIRMATION MODAL (NO NATIVE BROWSER CONFIRM) --- */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center animate-scaleUp">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3.5 ${
              confirmModal.isDestructive ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-[#f85606]'
            }`}>
              {confirmModal.isDestructive ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
            </div>
            
            <h3 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] mb-1.5">
              {confirmModal.title}
            </h3>
            
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              {confirmModal.message}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                {confirmModal.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }}
                className={`h-10 rounded-xl font-bold text-xs text-white shadow-xs transition-colors ${
                  confirmModal.isDestructive 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-[#f85606] hover:bg-[#e04800]'
                }`}
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CUSTOM CARD ALERT MODAL (NO NATIVE BROWSER ALERT) --- */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#f85606] flex items-center justify-center mx-auto mb-3.5">
              <Info className="w-6 h-6" />
            </div>
            
            <h3 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] mb-1.5">
              {alertModal.title}
            </h3>
            
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              {alertModal.message}
            </p>

            <button
              type="button"
              onClick={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
              className="w-full h-10 rounded-xl bg-[#f85606] hover:bg-[#e04800] text-white font-bold text-xs transition-colors shadow-xs"
            >
              OK, Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
