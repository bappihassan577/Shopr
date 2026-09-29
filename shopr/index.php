<?php
/**
 * Shopr - Premium E-Commerce Platform
 * Public Homepage (index.php)
 */
require_once __DIR__ . '/config.php';

$settings = shopr_get_settings();
$categories = shopr_get_categories();
$products = shopr_get_products(true); // Active products only
$menus = shopr_get_menus(); // Custom navigation menus configured in admin

$siteName = htmlspecialchars($settings['site_name'] ?? 'Shopr');
$currency = htmlspecialchars($settings['currency'] ?? '$');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $siteName ?> — Online Store</title>
  <meta name="description" content="<?= htmlspecialchars($settings['hero_subtitle'] ?? 'Discover verified products with direct order routing.') ?>">
  <meta property="og:title" content="<?= $siteName ?> — Online Store">
  <meta property="og:description" content="<?= htmlspecialchars($settings['hero_subtitle'] ?? 'Discover verified products with direct order routing.') ?>">
  <meta property="og:type" content="website">
  <link rel="icon" type="image/svg+xml" href="shopr-logo.svg">
  
  <!-- Google Fonts & Font Awesome Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <style>
    :root {
      --primary: #0f172a;
      --accent: #f85606;
      --accent-hover: #e04800;
      --accent-light: #fff5f0;
      --bg-page: #f5f5f5;
      --bg-card: #ffffff;
      --text-main: #1e293b;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.07);
      --shadow-xl: 0 15px 25px -5px rgb(0 0 0 / 0.08);
      --radius: 14px;
      --font-heading: 'Plus Jakarta Sans', sans-serif;
      --font-body: 'Inter', sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg-page);
      color: var(--text-main);
      font-family: var(--font-body);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    a { text-decoration: none; color: inherit; }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 12px;
    }

    /* Top E-Commerce Flash Strip */
    .top-strip {
      background: var(--accent);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .top-strip a {
      color: #fff;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(0,0,0,0.15);
      padding: 2px 10px;
      border-radius: 9999px;
      transition: background 0.2s;
    }
    .top-strip a:hover {
      background: rgba(0,0,0,0.25);
    }

    /* Header */
    .header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 66px;
      gap: 16px;
    }

    .logo-link {
      display: inline-flex;
      align-items: center;
      height: 40px;
      flex-shrink: 0;
    }

    .logo-img {
      height: 38px;
      width: auto;
      max-width: 175px;
      object-fit: contain;
      flex-shrink: 0;
    }

    /* Search Box */
    .search-box {
      flex: 1;
      max-width: 480px;
      position: relative;
      display: flex;
    }

    .search-input {
      width: 100%;
      height: 40px;
      padding: 0 14px 0 38px;
      border-radius: 8px 0 0 8px;
      border: 1px solid var(--border);
      border-right: none;
      background: #f8fafc;
      font-size: 13px;
      color: var(--text-main);
      outline: none;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      background: #fff;
      border-color: var(--accent);
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      font-size: 13px;
    }

    .search-btn {
      height: 40px;
      padding: 0 16px;
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: 0 8px 8px 0;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .search-btn:hover {
      background: var(--accent-hover);
    }

    /* Navigation Menus */
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .nav-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12.5px;
      font-weight: 700;
      color: var(--text-main);
      transition: all 0.2s;
    }

    .nav-link:hover {
      color: var(--accent);
      background: var(--accent-light);
    }

    .nav-link.active {
      color: var(--accent);
      background: var(--accent-light);
    }

    .mobile-menu-btn {
      display: none;
      background: #f8fafc;
      border: 1px solid var(--border);
      width: 38px;
      height: 38px;
      border-radius: 8px;
      font-size: 16px;
      color: var(--text-main);
      cursor: pointer;
    }

    /* Adsterra Banner Slots */
    .adsterra-wrapper {
      margin: 12px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
    .adsterra-desktop {
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: 730px;
      min-height: 90px;
    }
    .adsterra-mobile {
      display: none;
      justify-content: center;
      width: 100%;
      max-width: 322px;
      min-height: 50px;
    }

    @media (max-width: 768px) {
      .adsterra-desktop { display: none !important; }
      .adsterra-mobile { display: flex !important; }
    }

    /* Controls Bar */
    .controls-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 16px;
      padding: 10px 14px;
      background: #fff;
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }

    .category-pills {
      display: flex;
      align-items: center;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 2px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .category-pills::-webkit-scrollbar { display: none; }

    .pill-btn {
      background: #f1f5f9;
      border: 1px solid transparent;
      padding: 5px 12px;
      border-radius: 9999px;
      font-size: 11.5px;
      font-weight: 700;
      color: var(--text-main);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }

    .pill-btn:hover { background: #e2e8f0; }
    .pill-btn.active {
      background: var(--accent);
      color: #fff;
    }

    .sort-box select {
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: #fff;
      font-size: 11.5px;
      font-weight: 700;
      color: var(--text-main);
      cursor: pointer;
      outline: none;
    }

    /* Product Grid: 2 CARDS PER LINE ON MOBILE as requested */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 40px;
    }
    @media (min-width: 640px) {
      .product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    }
    @media (min-width: 860px) {
      .product-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
    }
    @media (min-width: 1120px) {
      .product-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 16px; }
    }

    /* Product Card */
    .product-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s;
      position: relative;
    }

    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: #fdba74;
    }

    .card-media {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      background: #f8fafc;
      overflow: hidden;
    }

    .card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .card-img {
      transform: scale(1.05);
    }

    .discount-badge {
      position: absolute;
      top: 6px;
      left: 6px;
      background: var(--accent);
      color: #fff;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      z-index: 2;
    }

    .card-body {
      padding: 10px;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
    }

    /* Row 1: Left Title, Right Price */
    .card-top-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 6px;
      margin-bottom: 4px;
    }

    .card-title {
      font-family: var(--font-heading);
      font-size: 12.5px;
      font-weight: 700;
      line-height: 1.3;
      color: var(--text-main);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }
    .card-title a:hover {
      color: var(--accent);
    }

    .price-col {
      text-align: right;
      flex-shrink: 0;
    }

    .current-price {
      font-size: 13.5px;
      font-weight: 900;
      color: var(--accent);
      font-family: var(--font-heading);
      white-space: nowrap;
    }

    .old-price {
      font-size: 10px;
      color: var(--text-muted);
      text-decoration: line-through;
      display: block;
      line-height: 1;
    }

    .card-desc {
      font-size: 10.5px;
      color: var(--text-muted);
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 8px;
    }

    /* RED DARAZ STYLE ORDER BUTTON AT VERY BOTTOM */
    @keyframes darazOrderBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }

    .btn-daraz-order {
      width: 100%;
      height: 34px;
      background: var(--accent);
      color: #fff;
      font-size: 11.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: background 0.2s, transform 0.2s;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(248, 86, 6, 0.25);
    }

    .btn-daraz-order:hover {
      background: var(--accent-hover);
      animation: darazOrderBounce 1.2s infinite ease-in-out;
    }

    /* Trust banner */
    .trust-banner {
      background: #fff;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      padding: 16px;
      margin: 20px 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }
    .trust-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .trust-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--accent-light);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    /* Footer */
    .footer {
      background: #fff;
      border-top: 1px solid var(--border);
      padding: 30px 0 20px;
      margin-top: auto;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }
    .footer-brand p {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 8px;
      max-width: 340px;
    }
    .footer-col h5 {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    .footer-col ul {
      list-style: none;
    }
    .footer-col li {
      margin-bottom: 8px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .footer-col a:hover {
      color: var(--accent);
    }
    .telegram-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--accent-light);
      color: var(--accent);
      padding: 8px 12px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 12px;
    }
    .footer-bottom {
      border-top: 1px solid #f1f5f9;
      padding-top: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: var(--text-muted);
    }

    @media (max-width: 768px) {
      .header-inner { height: 56px; }
      .search-box { display: none; }
      .nav-menu { display: none; }
      .mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
      .footer-grid { grid-template-columns: 1fr; gap: 20px; }
    }

    /* Mobile Drawer */
    .drawer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 99;
      display: none;
    }
    .drawer-overlay.open { display: block; }
    .mobile-drawer {
      position: fixed;
      top: 0;
      right: -280px;
      width: 280px;
      height: 100%;
      background: #fff;
      z-index: 100;
      transition: right 0.25s ease;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .mobile-drawer.open { right: 0; }
  </style>
</head>
<body>

  <!-- Top Flash Strip -->
  <div class="top-strip">
    <div class="container" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
      <span><i class="fa-solid fa-bolt" style="color: #fde047; margin-right: 4px;"></i> Flash Deals Today • Fast Courier Delivery</span>
      <a href="https://t.me/shopr_official" target="_blank" rel="noopener noreferrer">
        <i class="fa-brands fa-telegram"></i> Telegram: @shopr_official
      </a>
    </div>
  </div>

  <!-- Header -->
  <header class="header">
    <div class="container">
      <div class="header-inner">
        <a href="index.php" class="logo-link">
          <img src="shopr-logo.svg" alt="<?= $siteName ?>" class="logo-img">
        </a>

        <!-- Search Box -->
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input type="text" id="searchInput" class="search-input" placeholder="Search in store...">
          <button class="search-btn">Search</button>
        </div>

        <!-- Navigation Menus -->
        <nav class="nav-menu">
          <a href="index.php" class="nav-link active">Home</a>
          <?php foreach ($menus as $m): ?>
            <a href="<?= htmlspecialchars($m['url']) ?>" class="nav-link" target="<?= htmlspecialchars($m['target'] ?? '_self') ?>">
              <?= htmlspecialchars($m['title']) ?>
              <?php if (($m['target'] ?? '') === '_blank'): ?>
                <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 10px; margin-left: 2px;"></i>
              <?php endif; ?>
            </a>
          <?php endforeach; ?>
          <a href="https://t.me/shopr_official" target="_blank" rel="noopener noreferrer" class="nav-link" style="color: var(--accent);">
            <i class="fa-brands fa-telegram"></i> Telegram Support
          </a>
        </nav>

        <button class="mobile-menu-btn" id="mobileMenuToggle">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Drawer -->
  <div class="drawer-overlay" id="drawerOverlay"></div>
  <div class="mobile-drawer" id="mobileDrawer">
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:12px;">
      <span style="font-weight:800; font-size:14px;">Menu</span>
      <button id="drawerClose" style="background:none; border:none; font-size:18px; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <a href="index.php" style="padding:10px; font-weight:700; color:var(--accent);">Home</a>
      <?php foreach ($menus as $m): ?>
        <a href="<?= htmlspecialchars($m['url']) ?>" style="padding:10px; font-weight:600; color:var(--text-main);" target="<?= htmlspecialchars($m['target'] ?? '_self') ?>">
          <?= htmlspecialchars($m['title']) ?>
        </a>
      <?php endforeach; ?>
      <a href="https://t.me/shopr_official" target="_blank" rel="noopener noreferrer" style="padding:10px; font-weight:700; color:var(--accent); display:flex; align-items:center; gap:8px;">
        <i class="fa-brands fa-telegram"></i> Telegram Support
      </a>
    </div>
  </div>

  <main class="container" style="padding-top: 14px;">

    <!-- ADSTERRA AD PLACEMENT: Responsive Top Banner -->
    <div class="adsterra-wrapper">
      <!-- Desktop 728x90 Adsterra Banner -->
      <div class="adsterra-desktop">
        <script>
          atOptions = {
            'key' : 'f3b903347568ac4ef4be6c7e57bcd36f',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script src="https://celerycribbanish.com/f3b903347568ac4ef4be6c7e57bcd36f/invoke.js"></script>
      </div>

      <!-- Mobile 320x50 Adsterra Banner -->
      <div class="adsterra-mobile">
        <script>
          atOptions = {
            'key' : '9c559d0bec5b12842c8742d00e2aea00',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script src="https://celerycribbanish.com/9c559d0bec5b12842c8742d00e2aea00/invoke.js"></script>
      </div>
    </div>

    <!-- Controls Bar: Category Pills & Sort -->
    <section class="controls-bar" id="catalogControls">
      <div class="category-pills">
        <button class="pill-btn active" data-cat="all">All Items (<?= count($products) ?>)</button>
        <?php foreach ($categories as $cat): ?>
          <?php if (($cat['id'] ?? '') !== 'all'): ?>
            <button class="pill-btn" data-cat="<?= htmlspecialchars($cat['name']) ?>"><?= htmlspecialchars($cat['name']) ?></button>
          <?php endif; ?>
        <?php endforeach; ?>
      </div>

      <div class="sort-box">
        <select id="sortSelect">
          <option value="newest">Sort: Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="discount">Top Discount</option>
        </select>
      </div>
    </section>

    <!-- Product Grid: 2 CARDS PER LINE ON MOBILE as explicitly requested -->
    <section class="product-grid" id="productGrid">
      <?php if (empty($products)): ?>
        <div style="text-align: center; padding: 50px 20px; grid-column: 1 / -1; background: #fff; border-radius: 14px; border: 1px dashed var(--border);">
          <i class="fa-solid fa-box-open" style="font-size: 34px; color: var(--text-muted); margin-bottom: 10px;"></i>
          <h3 style="font-size: 16px; font-weight: 700;">No products available</h3>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Items will appear as added in admin panel.</p>
        </div>
      <?php else: ?>
        <?php foreach ($products as $prod): 
          $id = htmlspecialchars($prod['id'] ?? '');
          $title = htmlspecialchars($prod['title'] ?? 'Untitled Product');
          $thumb = !empty($prod['thumbnail']) ? htmlspecialchars($prod['thumbnail']) : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
          $price = (float)($prod['price'] ?? 0);
          $oldPrice = !empty($prod['old_price']) ? (float)$prod['old_price'] : 0;
          $discount = !empty($prod['discount']) ? (int)$prod['discount'] : ($oldPrice > $price ? round((($oldPrice - $price) / $oldPrice) * 100) : 0);
          $category = htmlspecialchars($prod['category'] ?? 'General');
          $orderUrl = !empty($prod['order_url']) ? htmlspecialchars($prod['order_url']) : '#';
          $shortDesc = htmlspecialchars($prod['short_description'] ?? '');
        ?>
          <article 
            class="product-card" 
            data-id="<?= $id ?>"
            data-category="<?= strtolower($category) ?>"
            data-price="<?= $price ?>"
            data-discount="<?= $discount ?>"
            data-title="<?= strtolower($title) ?>"
          >
            <!-- Media Thumbnail -->
            <div class="card-media">
              <?php if ($discount > 0): ?>
                <span class="discount-badge">-<?= $discount ?>%</span>
              <?php endif; ?>
              <a href="post.html?id=<?= $id ?>">
                <img src="<?= $thumb ?>" alt="<?= $title ?>" class="card-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'">
              </a>
            </div>

            <!-- Card Body: Left Title, Right Price, Details below, Red Order Button at bottom -->
            <div class="card-body">
              <div>
                <div class="card-top-row">
                  <h3 class="card-title">
                    <a href="post.html?id=<?= $id ?>"><?= $title ?></a>
                  </h3>
                  <div class="price-col">
                    <span class="current-price"><?= $currency ?><?= number_format($price, $price == floor($price) ? 0 : 2) ?></span>
                    <?php if ($oldPrice > $price): ?>
                      <span class="old-price"><?= $currency ?><?= number_format($oldPrice, 0) ?></span>
                    <?php endif; ?>
                  </div>
                </div>

                <p class="card-desc"><?= $shortDesc ?: $category ?></p>
              </div>

              <!-- Red Daraz-Style Order Button at very bottom -->
              <a href="<?= $orderUrl ?>" class="btn-daraz-order" target="_self">
                <i class="fa-solid fa-bag-shopping"></i>
                <span>Order Now</span>
              </a>
            </div>
          </article>
        <?php endforeach; ?>
      <?php endif; ?>
    </section>

    <!-- Trust Highlights -->
    <div class="trust-banner">
      <div class="trust-item">
        <div class="trust-icon"><i class="fa-solid fa-truck-fast"></i></div>
        <div>
          <div style="font-size: 13px; font-weight: 800;">Fast Courier Delivery</div>
          <div style="font-size: 11px; color: var(--text-muted);">Quick dispatch to your doorstep</div>
        </div>
      </div>
      <div class="trust-item">
        <div class="trust-icon"><i class="fa-solid fa-shield-halved"></i></div>
        <div>
          <div style="font-size: 13px; font-weight: 800;">100% Authentic Goods</div>
          <div style="font-size: 11px; color: var(--text-muted);">Verified genuine merchant suppliers</div>
        </div>
      </div>
      <div class="trust-item">
        <div class="trust-icon"><i class="fa-brands fa-telegram"></i></div>
        <div>
          <div style="font-size: 13px; font-weight: 800;">Telegram Customer Care</div>
          <div style="font-size: 11px; color: var(--text-muted);"><a href="https://t.me/shopr_official" target="_blank" style="color:var(--accent); font-weight:700;">@shopr_official</a></div>
        </div>
      </div>
    </div>

  </main>

  <!-- Clean Public Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="shopr-logo.svg" alt="<?= $siteName ?>" style="height: 36px; max-width: 140px; object-fit: contain;">
          <p><?= htmlspecialchars($settings['site_tagline'] ?? 'Curated Excellence for Modern Living.') ?> Verified e-commerce platform with direct checkout forwarding.</p>
        </div>

        <div class="footer-col">
          <h5>Categories</h5>
          <ul>
            <?php foreach (array_slice($categories, 0, 5) as $cat): ?>
              <li><a href="#" onclick="filterByCategory('<?= htmlspecialchars($cat['name']) ?>'); return false;"><?= htmlspecialchars($cat['name']) ?></a></li>
            <?php endforeach; ?>
          </ul>
        </div>

        <div class="footer-col">
          <h5>Customer Care</h5>
          <ul>
            <li>
              <a href="https://t.me/shopr_official" target="_blank" rel="noopener noreferrer" class="telegram-btn">
                <i class="fa-brands fa-telegram" style="font-size: 15px;"></i>
                <span>Join Telegram Channel</span>
              </a>
            </li>
            <li style="margin-top: 6px;"><span style="font-size: 11.5px; color: var(--text-muted);"><i class="fa-solid fa-check" style="color: #22c55e;"></i> Direct support: https://t.me/shopr_official</span></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>&copy; <?= date('Y') ?> <?= $siteName ?>. All rights reserved.</span>
        <span>Currency: <strong><?= $currency ?></strong></span>
      </div>
    </div>
  </footer>

  <script>
    (function() {
      const searchInput = document.getElementById('searchInput');
      const sortSelect = document.getElementById('sortSelect');
      const categoryPills = document.querySelectorAll('.pill-btn');
      const productGrid = document.getElementById('productGrid');
      const cards = Array.from(document.querySelectorAll('.product-card'));

      let activeCategory = 'all';
      let searchQuery = '';

      function filterAndSortProducts() {
        cards.forEach(card => {
          const title = card.getAttribute('data-title') || '';
          const category = card.getAttribute('data-category') || '';
          const matchesCat = (activeCategory === 'all') || (category === activeCategory.toLowerCase());
          const matchesSearch = !searchQuery || title.includes(searchQuery.toLowerCase()) || category.includes(searchQuery.toLowerCase());
          card.style.display = (matchesCat && matchesSearch) ? 'flex' : 'none';
        });

        const sortValue = sortSelect.value;
        const visibleCards = cards.filter(card => card.style.display !== 'none');
        visibleCards.sort((a, b) => {
          const priceA = parseFloat(a.getAttribute('data-price') || 0);
          const priceB = parseFloat(b.getAttribute('data-price') || 0);
          const discA = parseInt(a.getAttribute('data-discount') || 0);
          const discB = parseInt(b.getAttribute('data-discount') || 0);
          if (sortValue === 'price-asc') return priceA - priceB;
          if (sortValue === 'price-desc') return priceB - priceA;
          if (sortValue === 'discount') return discB - discA;
          return 0;
        });
        visibleCards.forEach(c => productGrid.appendChild(c));
      }

      categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
          categoryPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          activeCategory = pill.getAttribute('data-cat') || 'all';
          filterAndSortProducts();
        });
      });

      if (searchInput) searchInput.addEventListener('input', e => { searchQuery = e.target.value.trim(); filterAndSortProducts(); });
      if (sortSelect) sortSelect.addEventListener('change', filterAndSortProducts);

      const mobileMenuToggle = document.getElementById('mobileMenuToggle');
      const mobileDrawer = document.getElementById('mobileDrawer');
      const drawerOverlay = document.getElementById('drawerOverlay');
      const drawerClose = document.getElementById('drawerClose');

      function openDrawer() { mobileDrawer.classList.add('open'); drawerOverlay.classList.add('open'); }
      function closeDrawer() { mobileDrawer.classList.remove('open'); drawerOverlay.classList.remove('open'); }

      if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openDrawer);
      if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
      if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

      window.filterByCategory = function(name) {
        categoryPills.forEach(pill => { if (pill.getAttribute('data-cat') === name) pill.click(); });
        window.scrollTo({ top: 300, behavior: 'smooth' });
      };
    })();
  </script>
</body>
</html>
