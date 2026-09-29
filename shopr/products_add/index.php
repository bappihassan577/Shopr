<?php
/**
 * Shopr - Admin Management Portal
 * File: /products_add/index.php
 */
require_once __DIR__ . '/../config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Shopr Admin Portal — Management Dashboard</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" type="image/svg+xml" href="../shopr-logo.svg">

  <!-- Google Fonts & Font Awesome Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <style>
    :root {
      --primary: #0f172a;
      --accent: #2563eb;
      --accent-hover: #1d4ed8;
      --accent-subtle: #eff6ff;
      --success: #16a34a;
      --warning: #f59e0b;
      --danger: #ef4444;
      --bg-body: #f8fafc;
      --bg-card: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --sidebar-w: 260px;
      --radius: 16px;
      --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.07);
      --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.08);
      --font-heading: 'Plus Jakarta Sans', sans-serif;
      --font-body: 'Inter', sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg-body);
      color: var(--text-main);
      font-family: var(--font-body);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    a { text-decoration: none; color: inherit; }
    button, input, select, textarea { font-family: inherit; }

    /* Login View */
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: radial-gradient(circle at 10% 20%, #f1f5f9 0%, #e2e8f0 90%);
    }

    .login-box {
      width: 100%;
      max-width: 420px;
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 36px 28px;
      box-shadow: var(--shadow-xl);
      text-align: center;
    }

    .form-group {
      margin-bottom: 16px;
      text-align: left;
    }

    .form-label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 6px;
      color: var(--text-main);
    }

    .form-control {
      width: 100%;
      height: 48px;
      padding: 0 16px;
      border: 1px solid var(--border);
      border-radius: 12px;
      font-size: 14px;
      background: #f8fafc;
      color: var(--text-main);
      outline: none;
      transition: all 0.2s;
    }

    .form-control:focus {
      background: #fff;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    .btn-primary {
      width: 100%;
      height: 48px;
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 14.5px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
      transition: all 0.2s;
    }

    .btn-primary:hover {
      background: var(--accent-hover);
    }

    /* Admin App Layout */
    .admin-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Sidebar for Desktop */
    .sidebar {
      width: var(--sidebar-w);
      background: #ffffff;
      border-right: 1px solid var(--border);
      position: fixed;
      top: 0; bottom: 0; left: 0;
      z-index: 50;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .sidebar-brand {
      padding: 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sidebar-nav {
      padding: 18px 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 13.5px;
      font-weight: 700;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }

    .nav-item:hover {
      background: #f1f5f9;
      color: var(--primary);
    }

    .nav-item.active {
      background: var(--accent-subtle);
      color: var(--accent);
    }

    .nav-item i {
      font-size: 16px;
      width: 22px;
      text-align: center;
    }

    /* Main Content Area */
    .main-wrapper {
      margin-left: var(--sidebar-w);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      width: calc(100% - var(--sidebar-w));
    }

    /* Top Bar */
    .top-bar {
      height: 72px;
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 30;
    }

    .top-title {
      font-family: var(--font-heading);
      font-size: 18px;
      font-weight: 800;
      color: var(--primary);
    }

    .top-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-tag {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f1f5f9;
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text-main);
    }

    .btn-logout {
      background: #fef2f2;
      color: var(--danger);
      border: 1px solid #fee2e2;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .mobile-menu-trigger {
      display: none;
      background: none;
      border: 1px solid var(--border);
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 16px;
      cursor: pointer;
      color: var(--text-main);
    }

    .admin-content {
      padding: 24px;
      flex: 1;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-sm);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .stat-icon-blue { background: #eff6ff; color: #2563eb; }
    .stat-icon-green { background: #f0fdf4; color: #16a34a; }
    .stat-icon-amber { background: #fffbeb; color: #d97706; }
    .stat-icon-purple { background: #faf5ff; color: #9333ea; }

    .stat-val {
      font-family: var(--font-heading);
      font-size: 26px;
      font-weight: 800;
      color: var(--primary);
      line-height: 1.1;
    }

    .stat-lbl {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* Card Panels */
    .card {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      box-shadow: var(--shadow-sm);
      margin-bottom: 24px;
    }

    .card-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border);
    }

    .card-title {
      font-family: var(--font-heading);
      font-size: 17px;
      font-weight: 800;
      color: var(--primary);
    }

    /* Form Grid - Mobile Responsive */
    .form-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    /* Unlimited Images Container */
    .images-box {
      background: #f8fafc;
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px;
      margin-bottom: 16px;
    }

    .image-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }

    .btn-remove-row {
      height: 46px;
      padding: 0 14px;
      background: #fef2f2;
      color: var(--danger);
      border: 1px solid #fee2e2;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      flex-shrink: 0;
    }

    .btn-add-row {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: var(--accent-subtle);
      color: var(--accent);
      border: 1px dashed var(--accent);
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    /* Tables */
    .table-wrap {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13.5px;
      min-width: 580px;
    }

    th {
      background: #f8fafc;
      padding: 12px 14px;
      font-weight: 700;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border);
      font-size: 12px;
      text-transform: uppercase;
    }

    td {
      padding: 14px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }

    .table-thumb {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      object-fit: cover;
      background: #f1f5f9;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
    }

    .status-active { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
    .status-inactive { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: #fff;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }
    .action-btn:hover { background: #f1f5f9; color: var(--primary); }
    .action-btn-del:hover { background: #fef2f2; color: var(--danger); border-color: #fee2e2; }

    /* Toast in Admin */
    .admin-toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999;
      background: #0f172a;
      color: #fff;
      padding: 14px 20px;
      border-radius: 14px;
      font-size: 13.5px;
      font-weight: 600;
      box-shadow: var(--shadow-xl);
      display: flex;
      align-items: center;
      gap: 10px;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      max-width: 90vw;
    }
    .admin-toast.show { transform: translateY(0); opacity: 1; }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
    }
    .modal-overlay.active { opacity: 1; pointer-events: auto; }

    .modal-box {
      background: #fff;
      border-radius: 20px;
      padding: 28px;
      width: 100%;
      max-width: 420px;
      box-shadow: var(--shadow-xl);
      text-align: center;
    }

    /* Mobile Drawer Overlay */
    .sidebar-overlay {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.4);
      z-index: 45;
      display: none;
    }
    .sidebar-overlay.active { display: block; }

    /* RESPONSIVE DESIGN - FIX ALL MOBILE CRASHES */
    @media (max-width: 900px) {
      .sidebar {
        transform: translateX(-100%);
      }
      .sidebar.open {
        transform: translateX(0);
      }
      .main-wrapper {
        margin-left: 0;
        width: 100%;
      }
      .mobile-menu-trigger {
        display: block;
      }
      .top-bar {
        padding: 0 16px;
      }
      .admin-content {
        padding: 16px;
      }
      .form-grid {
        grid-template-columns: 1fr !important;
        gap: 16px;
      }
      .user-tag {
        display: none;
      }
      .stats-grid {
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .stat-card {
        padding: 14px;
        gap: 10px;
      }
      .stat-icon {
        width: 40px;
        height: 40px;
        font-size: 16px;
      }
      .stat-val {
        font-size: 22px;
      }
      .card {
        padding: 18px;
      }
      .image-row {
        flex-direction: column;
        align-items: stretch;
      }
      .btn-remove-row {
        height: 38px;
      }
    }
  </style>
</head>
<body>

  <!-- VIEW 1: Administrator Login -->
  <div class="login-wrapper" id="loginView">
    <div class="login-box">
      <div style="display:flex; justify-content:center; margin-bottom: 16px;">
        <img src="../shopr-logo.svg" alt="Shopr" style="height: 46px; width:auto;">
      </div>
      <h2 style="font-size: 20px; font-weight: 800; font-family: var(--font-heading); margin-bottom: 4px;">Admin Portal</h2>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 24px;">Sign in to manage products, categories, and settings</p>

      <div id="authAlert" style="display:none; padding:12px; border-radius:10px; font-size:12.5px; font-weight:600; margin-bottom:16px; text-align:left;"></div>

      <form id="loginForm" onsubmit="handleLoginSubmit(event)">
        <div class="form-group">
          <label class="form-label">Admin Email</label>
          <input type="email" id="inputEmail" class="form-control" placeholder="bappihassan577@gmail.com" required>
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" id="inputPass" class="form-control" placeholder="••••••••••••" required>
        </div>

        <button type="submit" class="btn-primary" id="btnLogin">
          <i class="fa-solid fa-lock"></i>
          <span>Sign In to Dashboard</span>
        </button>
      </form>
    </div>
  </div>

  <!-- VIEW 2: Complete Responsive Admin Dashboard -->
  <div class="admin-layout" id="adminView" style="display: none;">
    
    <!-- Mobile Sidebar Backdrop Overlay -->
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar(false)"></div>

    <!-- Responsive Sidebar -->
    <aside class="sidebar" id="adminSidebar">
      <div class="sidebar-brand">
        <img src="../shopr-logo.svg" alt="Shopr" style="height: 36px; width: auto; max-width: 160px; object-fit: contain; flex-shrink: 0;">
        <button onclick="toggleSidebar(false)" style="background:none; border:none; font-size:18px; color:var(--text-muted); cursor:pointer;" class="md-hidden">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-item active" data-tab="dashboard" onclick="switchTab('dashboard')">
          <i class="fa-solid fa-chart-pie"></i>
          <span>Dashboard</span>
        </div>
        <div class="nav-item" data-tab="products" onclick="switchTab('products')">
          <i class="fa-solid fa-boxes-stacked"></i>
          <span>Products</span>
        </div>
        <div class="nav-item" data-tab="add-product" onclick="resetProductForm(); switchTab('add-product')">
          <i class="fa-solid fa-plus-circle"></i>
          <span>Add Product</span>
        </div>
        <div class="nav-item" data-tab="menus" onclick="switchTab('menus')">
          <i class="fa-solid fa-bars-staggered"></i>
          <span>Navigation Menus</span>
        </div>
        <div class="nav-item" data-tab="categories" onclick="switchTab('categories')">
          <i class="fa-solid fa-tags"></i>
          <span>Categories</span>
        </div>
        <div class="nav-item" data-tab="settings" onclick="switchTab('settings')">
          <i class="fa-solid fa-gear"></i>
          <span>Settings</span>
        </div>
      </nav>

      <div style="padding: 16px; border-top: 1px solid var(--border);">
        <a href="../index.php" target="_blank" class="nav-item" style="color: var(--text-main); padding: 10px 14px;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
          <span>View Public Store</span>
        </a>
      </div>
    </aside>

    <!-- Main Container -->
    <div class="main-wrapper">
      
      <!-- Top Bar -->
      <header class="top-bar">
        <div style="display: flex; align-items: center; gap: 12px;">
          <button class="mobile-menu-trigger" onclick="toggleSidebar(true)">
            <i class="fa-solid fa-bars"></i>
          </button>
          <h2 class="top-title" id="pageTitle">Dashboard</h2>
        </div>

        <div class="top-actions">
          <div class="user-tag">
            <i class="fa-solid fa-shield-halved" style="color:var(--accent);"></i>
            <span id="adminEmailLabel">bappihassan577@gmail.com</span>
          </div>
          <button class="btn-logout" onclick="handleLogout()">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="admin-content">
        
        <!-- Tab 1: Dashboard -->
        <section id="pane-dashboard" class="tab-pane">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon stat-icon-blue"><i class="fa-solid fa-boxes-stacked"></i></div>
              <div>
                <div class="stat-val" id="statTotal">0</div>
                <div class="stat-lbl">Total Products</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-green"><i class="fa-solid fa-circle-check"></i></div>
              <div>
                <div class="stat-val" id="statActive">0</div>
                <div class="stat-lbl">Active in Store</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-amber"><i class="fa-solid fa-eye-slash"></i></div>
              <div>
                <div class="stat-val" id="statInactive">0</div>
                <div class="stat-lbl">Inactive</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-purple"><i class="fa-solid fa-bars-staggered"></i></div>
              <div>
                <div class="stat-val" id="statMenus">3</div>
                <div class="stat-lbl">Custom Menus</div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Recent Inventory</h3>
              <button class="btn-primary" style="width: auto; height: 38px; padding: 0 16px; font-size: 13px;" onclick="resetProductForm(); switchTab('add-product')">
                <i class="fa-solid fa-plus"></i> Add Product
              </button>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th style="text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody id="recentTableBody">
                  <tr><td colspan="5" style="text-align:center; padding: 24px; color:var(--text-muted);">Loading products...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Tab 2: Products Catalog -->
        <section id="pane-products" class="tab-pane" style="display: none;">
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Product Catalog</h3>
                <p style="font-size: 12px; color: var(--text-muted);">All active and inactive products</p>
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <input type="text" id="filterSearch" class="form-control" placeholder="Search..." style="height: 38px; width: 160px; font-size: 13px;" oninput="renderProductsTable()">
                <button class="btn-primary" style="width: auto; height: 38px; padding: 0 16px; font-size: 13px;" onclick="resetProductForm(); switchTab('add-product')">
                  <i class="fa-solid fa-plus"></i> Add
                </button>
              </div>
            </div>

            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th style="text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody id="catalogTableBody"></tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Tab 3: Add / Edit Product (Single Column on Mobile) -->
        <section id="pane-add-product" class="tab-pane" style="display: none;">
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title" id="formHeaderTitle">Add New Product</h3>
                <p style="font-size: 12px; color: var(--text-muted);">Saved securely via server-side handler with Firebase Realtime Database sync</p>
              </div>
              <button onclick="switchTab('products')" style="background:none; border:1px solid var(--border); padding:6px 14px; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer;">
                Cancel
              </button>
            </div>

            <form id="productForm" onsubmit="handleSaveProductSubmit(event)">
              <input type="hidden" id="formEditId" value="">

              <div class="form-grid">
                <!-- Col 1: Details -->
                <div>
                  <div class="form-group">
                    <label class="form-label">Product Title *</label>
                    <input type="text" id="prodTitle" class="form-control" placeholder="e.g. Minimalist Ceramic Audio Speaker" required>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Thumbnail Photo URL *</label>
                    <input type="url" id="prodThumb" class="form-control" placeholder="https://i.ibb.co/... or https://images.unsplash.com/..." required>
                  </div>

                  <!-- Unlimited Gallery Images Section -->
                  <div class="images-box">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                      <div>
                        <strong style="font-size: 13px; display: block;">Unlimited Gallery Images</strong>
                        <span style="font-size: 11.5px; color: var(--text-muted);">Additional photos for the product landing page</span>
                      </div>
                      <button type="button" class="btn-add-row" onclick="addGalleryImageRow()">
                        <i class="fa-solid fa-plus"></i> + Add Image URL
                      </button>
                    </div>

                    <div id="galleryInputsWrap"></div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Short Description</label>
                    <textarea id="prodShortDesc" class="form-control" style="height: 70px; padding: 10px 14px;" placeholder="Brief summary displayed on cards..."></textarea>
                  </div>

                  <div class="form-group">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
                      <label class="form-label" style="margin-bottom: 0;">Full Description (Formatted line-by-line specifications)</label>
                      <div style="display: flex; align-items: center; gap: 4px; background: #f1f5f9; padding: 3px 6px; border-radius: 8px; border: 1px solid var(--border);">
                        <button type="button" onclick="insertDescFormat('bold')" style="width:26px; height:26px; display:inline-flex; align-items:center; justify-content:center; background:#fff; border:1px solid var(--border); border-radius:6px; font-size:12px; font-weight:800; cursor:pointer;" title="Bold: <b>text</b>">B</button>
                        <button type="button" onclick="insertDescFormat('italic')" style="width:26px; height:26px; display:inline-flex; align-items:center; justify-content:center; background:#fff; border:1px solid var(--border); border-radius:6px; font-size:12px; font-style:italic; font-family:serif; cursor:pointer;" title="Italic / Slant: <i>text</i> (/)">/</button>
                        <button type="button" onclick="insertDescFormat('bullet')" style="width:26px; height:26px; display:inline-flex; align-items:center; justify-content:center; background:#fff; border:1px solid var(--border); border-radius:6px; font-size:12px; font-weight:800; cursor:pointer;" title="Bullet List: - item">-</button>
                        <button type="button" onclick="insertDescFormat('center')" style="height:26px; padding:0 7px; display:inline-flex; align-items:center; justify-content:center; background:#fff; border:1px solid var(--border); border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;" title="Center align: <center>...</center>">Center</button>
                        <button type="button" onclick="insertDescFormat('heading')" style="height:26px; padding:0 7px; display:inline-flex; align-items:center; justify-content:center; background:#fff; border:1px solid var(--border); border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;" title="Heading: ###">H</button>
                      </div>
                    </div>
                    <textarea id="prodFullDesc" class="form-control" style="height: 140px; padding: 12px 14px; font-family: monospace; font-size: 12px; line-height: 1.6;" placeholder="Specifications line by line. Use the B, /, -, and Center buttons above..."></textarea>
                  </div>
                </div>

                <!-- Col 2: Pricing & External Order -->
                <div>
                  <div class="form-group">
                    <label class="form-label">Category *</label>
                    <select id="prodCategory" class="form-control" required></select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Current Price ($) *</label>
                    <input type="number" step="0.01" id="prodPrice" class="form-control" placeholder="500.00" required>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Old Price ($) (Optional)</label>
                    <input type="number" step="0.01" id="prodOldPrice" class="form-control" placeholder="800.00">
                  </div>

                  <div class="form-group">
                    <label class="form-label">Discount (%) (Optional)</label>
                    <input type="number" id="prodDiscount" class="form-control" placeholder="37">
                  </div>

                  <div class="form-group">
                    <label class="form-label">External Order URL *</label>
                    <input type="url" id="prodOrderUrl" class="form-control" placeholder="https://earntrustbd.xyz" required>
                    <span style="font-size: 11px; color: var(--text-muted); display: block; margin-top: 4px;">Clicking "Order" forwards customers to this link.</span>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Visibility Status</label>
                    <select id="prodStatus" class="form-control">
                      <option value="Active">Active (Visible in Store)</option>
                      <option value="Inactive">Inactive (Hidden from Store)</option>
                    </select>
                  </div>

                  <button type="submit" class="btn-primary" id="btnSubmitProduct" style="margin-top: 8px;">
                    <i class="fa-solid fa-floppy-disk"></i>
                    <span>Save Product</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        <!-- Tab 4: Navigation Menus Management -->
        <section id="pane-menus" class="tab-pane" style="display: none;">
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Navigation Menus</h3>
                <p style="font-size: 12px; color: var(--text-muted);">Manage custom menu buttons displayed on the storefront (desktop & mobile)</p>
              </div>
              <button class="btn-primary" style="width: auto; height: 38px; padding: 0 16px; font-size: 13px;" onclick="openMenuForm()">
                <i class="fa-solid fa-plus"></i> Add Menu Button
              </button>
            </div>

            <!-- Menu Form Card -->
            <div id="menuFormBox" style="display: none; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
              <h4 id="menuFormTitle" style="font-size: 13px; font-weight: 800; color: #ea580c; margin-bottom: 12px; text-transform: uppercase;">Add Menu Item</h4>
              <input type="hidden" id="menuFormId">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 12px;">
                <div>
                  <label class="form-label">Menu Title *</label>
                  <input type="text" id="menuFormTitleInput" class="form-control" placeholder="e.g. Hot Deals, Support">
                </div>
                <div>
                  <label class="form-label">URL Destination *</label>
                  <input type="text" id="menuFormUrlInput" class="form-control" placeholder="https://... or #catalogGrid">
                </div>
                <div>
                  <label class="form-label">Target</label>
                  <select id="menuFormTargetInput" class="form-control">
                    <option value="_self">Same Tab (_self)</option>
                    <option value="_blank">New Tab (_blank)</option>
                  </select>
                </div>
                <div>
                  <label class="form-label">Order</label>
                  <input type="number" id="menuFormOrderInput" class="form-control" value="1">
                </div>
              </div>
              <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button type="button" onclick="closeMenuForm()" style="height: 36px; padding: 0 14px; border-radius: 8px; border: 1px solid var(--border); background: #fff; font-weight: 700; cursor: pointer;">Cancel</button>
                <button type="button" onclick="submitMenuForm()" class="btn-primary" style="width: auto; height: 36px; padding: 0 18px;">Save Menu</button>
              </div>
            </div>

            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Menu Title</th>
                    <th>Link Target URL</th>
                    <th>Open In</th>
                    <th>Order</th>
                    <th style="text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody id="menusTableBody"></tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Tab 5: Categories -->
        <section id="pane-categories" class="tab-pane" style="display: none;">
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Manage Categories</h3>
                <p style="font-size: 12px; color: var(--text-muted);">Categories used to group products</p>
              </div>
              <button class="btn-primary" style="width: auto; height: 38px; padding: 0 16px; font-size: 13px;" onclick="openCategoryForm()">
                <i class="fa-solid fa-plus"></i> New Category
              </button>
            </div>

            <!-- Category Form Card -->
            <div id="categoryFormBox" style="display: none; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
              <h4 id="categoryFormTitle" style="font-size: 13px; font-weight: 800; color: #ea580c; margin-bottom: 12px; text-transform: uppercase;">Create Category</h4>
              <input type="hidden" id="categoryFormId">
              <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px; margin-bottom: 12px;">
                <div>
                  <label class="form-label">Category Name *</label>
                  <input type="text" id="categoryFormNameInput" class="form-control" placeholder="e.g. Smart Watch & Audio" oninput="autoCategorySlug()">
                </div>
                <div>
                  <label class="form-label">Slug</label>
                  <input type="text" id="categoryFormSlugInput" class="form-control" placeholder="smart-watch">
                </div>
              </div>
              <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button type="button" onclick="closeCategoryForm()" style="height: 36px; padding: 0 14px; border-radius: 8px; border: 1px solid var(--border); background: #fff; font-weight: 700; cursor: pointer;">Cancel</button>
                <button type="button" onclick="submitCategoryForm()" class="btn-primary" style="width: auto; height: 36px; padding: 0 18px;">Save Category</button>
              </div>
            </div>

            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th style="text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody id="categoriesTableBody"></tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Tab 6: Settings -->
        <section id="pane-settings" class="tab-pane" style="display: none;">
          <div class="card" style="max-width: 640px;">
            <div class="card-header">
              <h3 class="card-title">Store Branding & Settings</h3>
            </div>

            <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 14px; margin-bottom: 16px;">
              <label class="form-label" style="font-weight: 800; color: #ea580c;">Store Currency Symbol *</label>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
                <button type="button" onclick="setCurrencySymbol('৳')" style="padding: 4px 10px; border-radius: 6px; border: 1px solid #fdba74; background: #fff; font-weight: 700; cursor: pointer;">৳ BDT</button>
                <button type="button" onclick="setCurrencySymbol('$')" style="padding: 4px 10px; border-radius: 6px; border: 1px solid #fdba74; background: #fff; font-weight: 700; cursor: pointer;">$ USD</button>
                <button type="button" onclick="setCurrencySymbol('€')" style="padding: 4px 10px; border-radius: 6px; border: 1px solid #fdba74; background: #fff; font-weight: 700; cursor: pointer;">€ EUR</button>
                <button type="button" onclick="setCurrencySymbol('£')" style="padding: 4px 10px; border-radius: 6px; border: 1px solid #fdba74; background: #fff; font-weight: 700; cursor: pointer;">£ GBP</button>
                <button type="button" onclick="setCurrencySymbol('₹')" style="padding: 4px 10px; border-radius: 6px; border: 1px solid #fdba74; background: #fff; font-weight: 700; cursor: pointer;">₹ INR</button>
              </div>
              <input type="text" id="setCurrency" class="form-control" value="$" style="max-width: 120px; font-weight: 900; font-size: 16px;">
            </div>

            <div class="form-group">
              <label class="form-label">Website Name</label>
              <input type="text" id="setSiteName" class="form-control" value="Shopr">
            </div>
            <div class="form-group">
              <label class="form-label">Hero Title</label>
              <input type="text" id="setHeroTitle" class="form-control" value="Curated Design. Exceptional Quality.">
            </div>
            <div class="form-group">
              <label class="form-label">Hero Subtitle</label>
              <textarea id="setHeroSub" class="form-control" style="height: 80px; padding: 10px 14px;">Discover our hand-selected collection of everyday goods, electronics, and lifestyle apparel.</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Customer Support (Telegram / Email)</label>
              <input type="text" id="setEmail" class="form-control" value="https://t.me/shopr_official">
              <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;">Official customer care: https://t.me/shopr_official</span>
            </div>
            <button class="btn-primary" style="width: auto; padding: 0 24px; margin-top: 10px;" onclick="saveStoreSettings()">
              Save Settings & Currency
            </button>
          </div>
        </section>

      </main>
    </div>
  </div>

  <!-- Delete Modal -->
  <div class="modal-overlay" id="deleteModal">
    <div class="modal-box">
      <div style="font-size: 38px; color: var(--danger); margin-bottom: 12px;"><i class="fa-solid fa-triangle-exclamation"></i></div>
      <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">Delete this product?</h3>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">This item will be permanently removed.</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <button onclick="closeDeleteModal()" style="height: 44px; border-radius: 10px; border: 1px solid var(--border); background: #f8fafc; font-weight: 700; cursor: pointer;">Cancel</button>
        <button onclick="confirmDeleteProduct()" style="height: 44px; border-radius: 10px; border: none; background: var(--danger); color: #fff; font-weight: 700; cursor: pointer;">Delete</button>
      </div>
    </div>
  </div>

  <!-- Toast -->
  <div class="admin-toast" id="adminToast">
    <i class="fa-solid fa-circle-check" style="color: #22c55e;"></i>
    <span id="toastMsg">Action completed successfully</span>
  </div>

  <script>
    const ADMIN_EMAIL = 'bappihassan577@gmail.com';
    let allProducts = [];
    let allCategories = [];
    let allMenus = [];
    let deleteTargetId = null;

    function showToast(msg) {
      const toast = document.getElementById('adminToast');
      document.getElementById('toastMsg').textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3200);
    }

    // Toggle Mobile Sidebar
    function toggleSidebar(open) {
      const sidebar = document.getElementById('adminSidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (open) {
        sidebar.classList.add('open');
        overlay.classList.add('active');
      } else {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      }
    }

    // Tab Switching
    function switchTab(tabName) {
      document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-tab') === tabName);
      });
      document.querySelectorAll('.tab-pane').forEach(el => el.style.display = 'none');
      const target = document.getElementById(`pane-${tabName}`);
      if (target) target.style.display = 'block';

      const titles = {
        'dashboard': 'Dashboard Overview',
        'products': 'Product Catalog Management',
        'add-product': 'Add or Edit Product',
        'menus': 'Custom Navigation Menus',
        'categories': 'Category Management',
        'settings': 'Website Branding & Settings'
      };
      document.getElementById('pageTitle').textContent = titles[tabName] || 'Dashboard';
      toggleSidebar(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Handle Login
    function handleLoginSubmit(e) {
      e.preventDefault();
      const email = document.getElementById('inputEmail').value.trim();
      const pass = document.getElementById('inputPass').value;
      const alertBox = document.getElementById('authAlert');

      if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        sessionStorage.setItem('shopr_admin', '1');
        document.getElementById('loginView').style.display = 'none';
        document.getElementById('adminView').style.display = 'flex';
        loadDashboardData();
        showToast('Signed in as Administrator');
      } else {
        alertBox.style.display = 'block';
        alertBox.style.background = '#fef2f2';
        alertBox.style.color = '#b91c1c';
        alertBox.textContent = `Access denied: Only ${ADMIN_EMAIL} has administrative authorization.`;
      }
    }

    function handleLogout() {
      sessionStorage.removeItem('shopr_admin');
      document.getElementById('adminView').style.display = 'none';
      document.getElementById('loginView').style.display = 'flex';
      showToast('Logged out');
    }

    // Auto-login if session exists
    if (sessionStorage.getItem('shopr_admin') === '1') {
      document.getElementById('loginView').style.display = 'none';
      document.getElementById('adminView').style.display = 'flex';
      loadDashboardData();
    }

    // Load Data via secure server proxy api.php
    async function loadDashboardData() {
      try {
        // Load Products
        const prodRes = await fetch('../api.php?action=products&all=1');
        const prodJson = await prodRes.json();
        allProducts = prodJson.data || [];
        renderDashboardStats();
        renderRecentTable();
        renderProductsTable();

        // Load Categories
        const catRes = await fetch('../api.php?action=categories');
        const catJson = await catRes.json();
        allCategories = catJson.data || [];
        populateCategorySelect();
        renderCategoriesTable();

        // Load Menus
        const menuRes = await fetch('../api.php?action=menus');
        const menuJson = await menuRes.json();
        allMenus = menuJson.data || [];
        renderMenusTable();
      } catch (err) {
        console.warn('Dashboard data fetch notice:', err);
      }
    }

    function renderDashboardStats() {
      document.getElementById('statTotal').textContent = allProducts.length;
      document.getElementById('statActive').textContent = allProducts.filter(p => p.status === 'Active').length;
      document.getElementById('statInactive').textContent = allProducts.filter(p => p.status === 'Inactive').length;
      document.getElementById('statMenus').textContent = allMenus.length;
    }

    function renderRecentTable() {
      const tbody = document.getElementById('recentTableBody');
      const recent = allProducts.slice(0, 5);
      if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:24px; color:var(--text-muted);">No products yet. Click "Add Product" to begin!</td></tr>';
        return;
      }
      tbody.innerHTML = recent.map(p => `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:10px;">
              <img src="${p.thumbnail}" class="table-thumb" alt="" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'">
              <span style="font-weight:700;">${p.title}</span>
            </div>
          </td>
          <td>${p.category || 'General'}</td>
          <td><strong>$${parseFloat(p.price || 0).toFixed(2)}</strong></td>
          <td><span class="status-badge ${p.status === 'Active' ? 'status-active' : 'status-inactive'}">${p.status}</span></td>
          <td style="text-align:right;">
            <button class="action-btn" onclick="startEditProduct('${p.id}')" title="Edit"><i class="fa-regular fa-pen-to-square"></i></button>
          </td>
        </tr>
      `).join('');
    }

    function renderProductsTable() {
      const tbody = document.getElementById('catalogTableBody');
      const q = (document.getElementById('filterSearch').value || '').toLowerCase();
      const list = allProducts.filter(p => !q || p.title.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)));

      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">No products found.</td></tr>';
        return;
      }

      tbody.innerHTML = list.map(p => `
        <tr>
          <td><img src="${p.thumbnail}" class="table-thumb" alt="" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'"></td>
          <td>
            <strong style="display:block;">${p.title}</strong>
            <span style="font-size:11px; color:var(--text-muted);">${p.order_url || ''}</span>
          </td>
          <td>${p.category || 'General'}</td>
          <td>$${parseFloat(p.price || 0).toFixed(2)}</td>
          <td>
            <span class="status-badge ${p.status === 'Active' ? 'status-active' : 'status-inactive'}" onclick="toggleStatus('${p.id}', '${p.status}')" title="Click to toggle status">
              ${p.status}
            </span>
          </td>
          <td style="text-align:right;">
            <div style="display:inline-flex; gap:6px;">
              <a href="../post.html?id=${p.id}" target="_blank" class="action-btn" title="View"><i class="fa-regular fa-eye"></i></a>
              <button class="action-btn" onclick="startEditProduct('${p.id}')" title="Edit"><i class="fa-regular fa-pen-to-square"></i></button>
              <button class="action-btn action-btn-del" onclick="openDeleteModal('${p.id}')" title="Delete"><i class="fa-regular fa-trash-can"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // Unlimited Gallery Images
    const galleryWrap = document.getElementById('galleryInputsWrap');
    function addGalleryImageRow(val = '') {
      const div = document.createElement('div');
      div.className = 'image-row';
      div.innerHTML = `
        <input type="url" class="form-control gallery-input" placeholder="https://..." value="${val}">
        <button type="button" class="btn-remove-row" onclick="this.parentElement.remove()">
          <i class="fa-solid fa-trash-can"></i> Remove
        </button>
      `;
      galleryWrap.appendChild(div);
    }

    function populateCategorySelect() {
      const select = document.getElementById('prodCategory');
      select.innerHTML = allCategories.filter(c => c.id !== 'all').map(c => `
        <option value="${c.name}">${c.name}</option>
      `).join('');
    }

    // Format helper for Description: B, /, -, Center, Heading
    function insertDescFormat(type) {
      const textarea = document.getElementById('prodFullDesc');
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const sel = val.substring(start, end);
      let rep = '';
      let newCursor = start;

      switch(type) {
        case 'bold':
          rep = sel ? `<b>${sel}</b>` : '<b>Bold text</b>';
          newCursor = sel ? start + rep.length : start + 3;
          break;
        case 'italic':
          rep = sel ? `<i>${sel}</i>` : '<i>Italic text</i>';
          newCursor = sel ? start + rep.length : start + 3;
          break;
        case 'bullet':
          rep = sel ? sel.split('\n').map(l => `- ${l}`).join('\n') : '- Bullet item';
          newCursor = start + rep.length;
          break;
        case 'center':
          rep = sel ? `<center>${sel}</center>` : '<center>Centered text</center>';
          newCursor = sel ? start + rep.length : start + 8;
          break;
        case 'heading':
          rep = sel ? `### ${sel}` : '### Section Title';
          newCursor = start + rep.length;
          break;
      }
      textarea.value = val.substring(0, start) + rep + val.substring(end);
      textarea.focus();
      textarea.setSelectionRange(newCursor, newCursor);
    }

    // Save Product (Via PHP server-side api.php - NO PERMISSION_DENIED error!)
    async function handleSaveProductSubmit(e) {
      e.preventDefault();
      const btn = document.getElementById('btnSubmitProduct');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

      const galleryUrls = [];
      document.querySelectorAll('.gallery-input').forEach(inp => {
        if (inp.value.trim()) galleryUrls.push(inp.value.trim());
      });

      const payload = {
        id: document.getElementById('formEditId').value.trim(),
        title: document.getElementById('prodTitle').value.trim(),
        thumbnail: document.getElementById('prodThumb').value.trim(),
        images: galleryUrls,
        price: parseFloat(document.getElementById('prodPrice').value),
        old_price: parseFloat(document.getElementById('prodOldPrice').value) || null,
        discount: parseInt(document.getElementById('prodDiscount').value) || null,
        category: document.getElementById('prodCategory').value,
        short_description: document.getElementById('prodShortDesc').value.trim(),
        full_description: document.getElementById('prodFullDesc').value.trim(),
        order_url: document.getElementById('prodOrderUrl').value.trim(),
        status: document.getElementById('prodStatus').value
      };

      try {
        const res = await fetch('../api.php?action=admin_save_product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();

        if (json.success) {
          showToast(json.message || 'Product saved successfully!');
          resetProductForm();
          await loadDashboardData();
          switchTab('products');
        } else {
          alert('Error: ' + (json.error || 'Failed to save product.'));
        }
      } catch (err) {
        alert('Server communication error: ' + err.message);
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> <span>Save Product</span>';
      }
    }

    function startEditProduct(id) {
      const p = allProducts.find(item => item.id === id);
      if (!p) return;

      document.getElementById('formHeaderTitle').textContent = 'Edit Product — ' + p.title;
      document.getElementById('formEditId').value = p.id;
      document.getElementById('prodTitle').value = p.title || '';
      document.getElementById('prodThumb').value = p.thumbnail || '';
      document.getElementById('prodPrice').value = p.price || '';
      document.getElementById('prodOldPrice').value = p.old_price || '';
      document.getElementById('prodDiscount').value = p.discount || '';
      document.getElementById('prodCategory').value = p.category || '';
      document.getElementById('prodShortDesc').value = p.short_description || '';
      document.getElementById('prodFullDesc').value = p.full_description || '';
      document.getElementById('prodOrderUrl').value = p.order_url || '';
      document.getElementById('prodStatus').value = p.status || 'Active';

      galleryWrap.innerHTML = '';
      if (p.images && Array.isArray(p.images)) {
        p.images.forEach(img => addGalleryImageRow(img));
      }

      switchTab('add-product');
    }

    function resetProductForm() {
      document.getElementById('productForm').reset();
      document.getElementById('formEditId').value = '';
      document.getElementById('formHeaderTitle').textContent = 'Add New Product';
      galleryWrap.innerHTML = '';
    }

    async function toggleStatus(id, currentStatus) {
      const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      try {
        await fetch('../api.php?action=admin_toggle_status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: nextStatus })
        });
        showToast(`Status updated to ${nextStatus}`);
        loadDashboardData();
      } catch (e) {
        showToast('Error updating status');
      }
    }

    // Delete Modal
    function openDeleteModal(id) {
      deleteTargetId = id;
      document.getElementById('deleteModal').classList.add('active');
    }
    function closeDeleteModal() {
      deleteTargetId = null;
      document.getElementById('deleteModal').classList.remove('active');
    }
    async function confirmDeleteProduct() {
      if (!deleteTargetId) return;
      try {
        await fetch('../api.php?action=admin_delete_product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: deleteTargetId })
        });
        showToast('Product deleted');
        closeDeleteModal();
        loadDashboardData();
      } catch (e) {
        showToast('Error deleting product');
      }
    }

    // Custom Menus
    function renderMenusTable() {
      const tbody = document.getElementById('menusTableBody');
      if (allMenus.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-muted);">No custom navigation menus added yet.</td></tr>';
        return;
      }
      tbody.innerHTML = allMenus.map(m => `
        <tr>
          <td><strong>${m.title}</strong></td>
          <td><code style="font-size:12px;">${m.url}</code></td>
          <td><span style="font-size:11.5px; font-weight:600; color:var(--text-muted);">${m.target === '_blank' ? 'New Tab (_blank)' : 'Same Tab'}</span></td>
          <td>${m.order || 1}</td>
          <td style="text-align:right;">
            <button class="action-btn" onclick="editMenu('${m.id}')" title="Edit" style="color: #ea580c; margin-right: 4px;"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn action-btn-del" onclick="deleteMenu('${m.id}')" title="Delete"><i class="fa-regular fa-trash-can"></i></button>
          </td>
        </tr>
      `).join('');
    }

    function openMenuForm() {
      document.getElementById('menuFormId').value = '';
      document.getElementById('menuFormTitleInput').value = '';
      document.getElementById('menuFormUrlInput').value = '';
      document.getElementById('menuFormTargetInput').value = '_self';
      document.getElementById('menuFormOrderInput').value = allMenus.length + 1;
      document.getElementById('menuFormTitle').textContent = 'Add Menu Item';
      document.getElementById('menuFormBox').style.display = 'block';
    }

    function closeMenuForm() {
      document.getElementById('menuFormBox').style.display = 'none';
    }

    function editMenu(id) {
      const menu = allMenus.find(m => m.id === id);
      if (!menu) return;
      document.getElementById('menuFormId').value = menu.id;
      document.getElementById('menuFormTitleInput').value = menu.title;
      document.getElementById('menuFormUrlInput').value = menu.url;
      document.getElementById('menuFormTargetInput').value = menu.target || '_self';
      document.getElementById('menuFormOrderInput').value = menu.order || 1;
      document.getElementById('menuFormTitle').textContent = 'Edit Menu Item';
      document.getElementById('menuFormBox').style.display = 'block';
    }

    async function submitMenuForm() {
      const id = document.getElementById('menuFormId').value;
      const title = document.getElementById('menuFormTitleInput').value.trim();
      const url = document.getElementById('menuFormUrlInput').value.trim();
      const target = document.getElementById('menuFormTargetInput').value;
      const order = parseInt(document.getElementById('menuFormOrderInput').value) || 1;

      if (!title || !url) {
        showToast('Please enter both title and URL');
        return;
      }

      await fetch('../api.php?action=admin_save_menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title, url, target, order, status: 'Active' })
      });

      showToast(id ? 'Menu updated' : 'Menu created');
      closeMenuForm();
      loadDashboardData();
    }

    async function deleteMenu(id) {
      if (confirm('Delete this menu button?')) {
        await fetch('../api.php?action=admin_delete_menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        showToast('Menu removed');
        loadDashboardData();
      }
    }

    // Categories
    function renderCategoriesTable() {
      const tbody = document.getElementById('categoriesTableBody');
      tbody.innerHTML = allCategories.map(c => `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td><code>${c.slug || c.name.toLowerCase()}</code></td>
          <td><span class="status-badge status-active">Active</span></td>
          <td style="text-align:right;">
            ${c.id !== 'all' ? `
              <button class="action-btn" onclick="editCategory('${c.id}')" title="Edit" style="color: #ea580c; margin-right: 4px;"><i class="fa-solid fa-pen"></i></button>
              <button class="action-btn action-btn-del" onclick="deleteCategory('${c.id}')" title="Delete"><i class="fa-regular fa-trash-can"></i></button>
            ` : '<span style="font-size:11px; color:var(--text-muted);">Protected</span>'}
          </td>
        </tr>
      `).join('');
    }

    function openCategoryForm() {
      document.getElementById('categoryFormId').value = '';
      document.getElementById('categoryFormNameInput').value = '';
      document.getElementById('categoryFormSlugInput').value = '';
      document.getElementById('categoryFormTitle').textContent = 'Create Category';
      document.getElementById('categoryFormBox').style.display = 'block';
    }

    function closeCategoryForm() {
      document.getElementById('categoryFormBox').style.display = 'none';
    }

    function autoCategorySlug() {
      if (!document.getElementById('categoryFormId').value) {
        const val = document.getElementById('categoryFormNameInput').value;
        document.getElementById('categoryFormSlugInput').value = val.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
    }

    function editCategory(id) {
      const cat = allCategories.find(c => c.id === id);
      if (!cat) return;
      document.getElementById('categoryFormId').value = cat.id;
      document.getElementById('categoryFormNameInput').value = cat.name;
      document.getElementById('categoryFormSlugInput').value = cat.slug || '';
      document.getElementById('categoryFormTitle').textContent = 'Edit Category';
      document.getElementById('categoryFormBox').style.display = 'block';
    }

    async function submitCategoryForm() {
      const id = document.getElementById('categoryFormId').value;
      const name = document.getElementById('categoryFormNameInput').value.trim();
      const slug = document.getElementById('categoryFormSlugInput').value.trim();

      if (!name) {
        showToast('Please enter category name');
        return;
      }

      await fetch('../api.php?action=admin_save_category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, slug })
      });

      showToast(id ? 'Category updated' : 'Category created');
      closeCategoryForm();
      loadDashboardData();
    }

    async function deleteCategory(id) {
      if (confirm('Delete this category?')) {
        await fetch('../api.php?action=admin_delete_category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        showToast('Category deleted');
        loadDashboardData();
      }
    }

    function setCurrencySymbol(sym) {
      document.getElementById('setCurrency').value = sym;
    }

    async function saveStoreSettings() {
      const site_name = document.getElementById('setSiteName').value.trim();
      const hero_title = document.getElementById('setHeroTitle').value.trim();
      const hero_subtitle = document.getElementById('setHeroSub').value.trim();
      const currency = document.getElementById('setCurrency').value.trim() || '$';
      const contact_email = document.getElementById('setEmail').value.trim();

      try {
        const res = await fetch('../api.php?action=admin_save_settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            site_name,
            hero_title,
            hero_subtitle,
            currency,
            contact_email
          })
        });
        showToast(`Settings & Currency (${currency}) updated successfully!`);
      } catch (e) {
        showToast('Settings saved locally');
      }
    }
  </script>
</body>
</html>
