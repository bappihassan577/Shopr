import { Product, Category, StoreSettings, MenuItem } from '../types';

export const INITIAL_MENUS: MenuItem[] = [
  { id: 'menu_home', title: 'Home', url: '#', target: '_self', order: 1, status: 'Active' },
  { id: 'menu_deals', title: 'Special Offers', url: '#catalogGrid', target: '_self', order: 2, status: 'Active' },
  { id: 'menu_support', title: 'Telegram Support', url: 'https://t.me/shopr_official', target: '_blank', order: 3, status: 'Active' }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'all', name: 'All Products', slug: 'all' },
  { id: 'audio', name: 'Audio & Sound', slug: 'audio' },
  { id: 'timepieces', name: 'Timepieces', slug: 'timepieces' },
  { id: 'lifestyle', name: 'Lifestyle & Everyday', slug: 'lifestyle' },
  { id: 'optics', name: 'Optics & Eyewear', slug: 'optics' },
  { id: 'tech', name: 'Smart Tech', slug: 'tech' }
];

export const INITIAL_SETTINGS: StoreSettings = {
  site_name: 'Shopr',
  site_tagline: 'Curated Excellence for Modern Living',
  currency: '$',
  hero_title: 'Curated Design. Exceptional Quality.',
  hero_subtitle: 'Discover our hand-selected collection of world-class everyday goods, electronics, and lifestyle apparel.',
  contact_email: 'https://t.me/shopr_official',
  order_policy: 'Fast worldwide delivery with instant verified checkout routing.'
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_zenith_headphones',
    title: 'Acoustic One Wireless Noise-Cancelling Headphones',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
    ],
    price: 249.00,
    old_price: 329.00,
    discount: 24,
    category: 'Audio & Sound',
    short_description: 'Precision engineered 40mm beryllium drivers with 38-hour battery longevity and active studio attenuation.',
    full_description: `Designed for sound purists and frequent travelers alike.

Key Specifications:
• Custom 40mm Beryllium acoustic transducers
• Hybrid Active Noise Cancellation with ambient transparency
• 38 hours continuous playback on a single 45-minute charge
• Anodized lightweight aluminum frame with lambskin memory ear cushions
• Bluetooth 5.3 with multipoint pairing & lossless aptX HD codec

Package includes hard travel shell, USB-C ultra-fast braided cable, and 3.5mm gold-plated audio connector.`,
    order_url: 'https://example.com/checkout/acoustic-one',
    status: 'Active',
    created_at: 1727500000000
  },
  {
    id: 'prod_minimalist_chronograph',
    title: 'Heritage Automatic Sapphire Chronograph Watch',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80'
    ],
    price: 395.00,
    old_price: 495.00,
    discount: 20,
    category: 'Timepieces',
    short_description: 'Self-winding Japanese mechanical movement with double-domed anti-reflective sapphire crystal glass.',
    full_description: `Timeless horological craftsmanship meeting modern Scandinavian minimalism.

Specifications:
• Movement: Precision Calibre Automatic with 42-hour reserve
• Case: 316L Surgical-grade brushed stainless steel (40mm diameter)
• Crystal: Scratch-resistant double-domed sapphire with anti-glare coating
• Strap: Genuine vegetable-tanned full-grain Italian leather
• Water Resistance: 5 ATM (50 meters)

Every timepiece comes individually numbered in a handcrafted walnut presentation box.`,
    order_url: 'https://example.com/checkout/heritage-watch',
    status: 'Active',
    created_at: 1727505000000
  },
  {
    id: 'prod_titanium_optics',
    title: 'Polarized Aviator Sunglasses in Matte Charcoal',
    thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'
    ],
    price: 135.00,
    old_price: 180.00,
    discount: 25,
    category: 'Optics & Eyewear',
    short_description: 'Japanese beta-titanium ultralight frame with Category 3 glare-reducing polarized lenses.',
    full_description: `Featherweight comfort that delivers absolute visual clarity under direct sunlight.

Features:
• Beta-titanium frame weighing merely 18 grams
• 100% UV400 full-spectrum protection against UVA and UVB rays
• Hydrophobic and oleophobic lens coatings repel water, grease, and fingerprints
• Ergonomic silicone nose pads with micro-contour grip

Includes genuine leather travel pouch and microfiber lens cloth.`,
    order_url: 'https://example.com/checkout/titanium-sunglasses',
    status: 'Active',
    created_at: 1727510000000
  },
  {
    id: 'prod_leather_duffel',
    title: 'Artisan Full-Grain Weekender Duffle Bag',
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
    ],
    price: 290.00,
    old_price: 360.00,
    discount: 19,
    category: 'Lifestyle & Everyday',
    short_description: 'Handcrafted oiled full-grain leather with antique brass YKK hardware and reinforced shoe compartment.',
    full_description: `Engineered for spontaneous escapes and seamless business travel.

Specifications:
• Capacity: 45 Liters (TSA carry-on compliant)
• Shell: 2.2mm vegetable-tanned cowhide with natural protective patina
• Interior: Water-resistant cotton twill lining with padded 16-inch laptop compartment
• Hardware: Solid forged antique brass zippers with lifetime warranty
• Detachable padded leather shoulder strap

Built to endure decades of global travel while developing richer character each year.`,
    order_url: 'https://example.com/checkout/artisan-duffel',
    status: 'Active',
    created_at: 1727515000000
  },
  {
    id: 'prod_mechanical_keyboard',
    title: 'Custom Low-Profile Wireless Mechanical Keyboard',
    thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
    ],
    price: 175.00,
    old_price: 210.00,
    discount: 16,
    category: 'Smart Tech',
    short_description: 'CNC aluminum body, hot-swappable Gateron mechanical switches, and multi-device Bluetooth 5.1.',
    full_description: `The ultimate tactile desk companion for creators, coders, and writers.

Features:
• 75% compact layout with machined aluminum top plate
• Hot-swappable low-profile mechanical switches (Linear Red or Tactile Brown)
• Double-shot PBT keycaps with crisp shine-through legends
• Connect up to 3 devices simultaneously via Bluetooth or 2.4GHz USB dongle
• Up to 200 hours battery life with backlighting disabled

Compatible with macOS, Windows, Linux, and iOS with dedicated hotkeys.`,
    order_url: 'https://example.com/checkout/wireless-keyboard',
    status: 'Active',
    created_at: 1727520000000
  },
  {
    id: 'prod_ceramic_pour_over',
    title: 'Matte Ceramic Pour-Over Coffee Dripper & Carafe',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80'
    ],
    price: 68.00,
    old_price: 85.00,
    discount: 20,
    category: 'Lifestyle & Everyday',
    short_description: 'Kiln-fired artisan stoneware with heat-retaining internal extraction ribs and borosilicate glass server.',
    full_description: `Elevate your morning coffee ceremony with precision extraction geometry.

Features:
• High-density stoneware holds thermal equilibrium for consistent brew temperature
• 60-degree spiral interior ribs optimize water flow and bloom expansion
• 650ml heat-resistant borosilicate glass carafe with volume markings
• Walnut wooden dripper collar with silicone insulation ring

Dishwasher safe and tested against lead and cadmium standards.`,
    order_url: 'https://example.com/checkout/ceramic-pour-over',
    status: 'Active',
    created_at: 1727525000000
  }
];
