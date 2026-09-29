<?php
/**
 * Shopr - Premium E-Commerce Platform
 * Configuration & Firebase Helper
 */

// Prevent direct script access if required
if (!defined('SHOPR_EXEC')) {
    define('SHOPR_EXEC', true);
}

// Platform settings
define('SITE_NAME', 'Shopr');
define('SITE_TAGLINE', 'Premium Handcrafted & Curated Goods');
define('SITE_URL', (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]");
define('CURRENCY', '$');

// Security: Firebase Realtime Database URL (protected server-side, not leaked in public HTML)
define('FIREBASE_RTDB_URL', 'https://life-job-4e856-default-rtdb.firebaseio.com');

// Optional: Firebase Database Secret (from Firebase Console > Project Settings > Service Accounts > Database Secrets)
// If set, server-side admin writes bypass all RTDB rules
define('FIREBASE_DB_SECRET', '');

// Authorized Admin Credentials identifier
define('ADMIN_UID', 'xxiPFEdf70Ufd5vtteTFzTqyiRS2');
define('ADMIN_EMAIL', 'bappihassan577@gmail.com');

// Local storage fallback file for environments where Firebase is in locked mode
define('LOCAL_DATA_FILE', __DIR__ . '/data_store.json');

/**
 * Execute HTTP REST request to Firebase Realtime Database
 */
function shopr_firebase_request($path, $method = 'GET', $data = null, $idToken = null) {
    $url = rtrim(FIREBASE_RTDB_URL, '/') . '/' . ltrim($path, '/') . '.json';
    
    // Attach secret or token if available
    if (!empty($idToken)) {
        $url .= '?auth=' . urlencode($idToken);
    } elseif (defined('FIREBASE_DB_SECRET') && !empty(FIREBASE_DB_SECRET)) {
        $url .= '?auth=' . urlencode(FIREBASE_DB_SECRET);
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 12);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));

    $headers = ['Content-Type: application/json', 'Accept: application/json'];

    if ($data !== null && in_array(strtoupper($method), ['POST', 'PUT', 'PATCH'])) {
        $jsonData = is_string($data) ? $data : json_encode($data);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
        $headers[] = 'Content-Length: ' . strlen($jsonData);
    }

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response === false || $httpCode >= 400) {
        // Fallback for hosting where curl might have restrictions: try file_get_contents for GET
        if ($method === 'GET' && ini_get('allow_url_fopen')) {
            $context = stream_context_create([
                'http' => [
                    'method' => 'GET',
                    'header' => "Accept: application/json\r\n",
                    'timeout' => 8
                ]
            ]);
            $fallback = @file_get_contents($url, false, $context);
            if ($fallback !== false) {
                return json_decode($fallback, true);
            }
        }
        return false;
    }

    return json_decode($response, true);
}

/**
 * Read local fallback store
 */
function shopr_get_local_store() {
    if (file_exists(LOCAL_DATA_FILE)) {
        $content = @file_get_contents(LOCAL_DATA_FILE);
        if ($content) {
            $json = json_decode($content, true);
            if (is_array($json)) return $json;
        }
    }
    return ['products' => [], 'categories' => [], 'settings' => [], 'menus' => []];
}

/**
 * Save to local fallback store
 */
function shopr_save_local_store($data) {
    @file_put_contents(LOCAL_DATA_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

/**
 * Fetch all products
 */
function shopr_get_products($onlyActive = true) {
    $data = shopr_firebase_request('products');
    
    // Fallback to local store if Firebase is locked or empty
    if (!is_array($data) || empty($data)) {
        $local = shopr_get_local_store();
        if (!empty($local['products'])) {
            $data = $local['products'];
        }
    }

    if (!is_array($data)) {
        return [];
    }

    $products = [];
    foreach ($data as $key => $prod) {
        if (!is_array($prod)) continue;
        $prod['id'] = $key;
        if ($onlyActive) {
            if (isset($prod['status']) && strtolower($prod['status']) === 'inactive') {
                continue;
            }
        }
        $products[] = $prod;
    }

    // Sort newest first
    usort($products, function($a, $b) {
        $tA = isset($a['created_at']) ? (int)$a['created_at'] : 0;
        $tB = isset($b['created_at']) ? (int)$b['created_at'] : 0;
        return $tB - $tA;
    });

    return $products;
}

/**
 * Fetch a single product by ID
 */
function shopr_get_product($id) {
    if (empty($id)) return null;
    $sanitizedId = preg_replace('/[^a-zA-Z0-9_\-]/', '', $id);
    $data = shopr_firebase_request('products/' . $sanitizedId);
    if (is_array($data)) {
        $data['id'] = $sanitizedId;
        return $data;
    }

    // Check local store
    $local = shopr_get_local_store();
    if (isset($local['products'][$sanitizedId])) {
        $item = $local['products'][$sanitizedId];
        $item['id'] = $sanitizedId;
        return $item;
    }

    return null;
}

/**
 * Fetch all categories
 */
function shopr_get_categories() {
    $data = shopr_firebase_request('categories');
    if (!is_array($data) || empty($data)) {
        $local = shopr_get_local_store();
        if (!empty($local['categories'])) {
            $data = $local['categories'];
        }
    }

    if (!is_array($data)) {
        return [
            ['id' => 'all', 'name' => 'All Products', 'slug' => 'all'],
            ['id' => 'audio', 'name' => 'Audio & Sound', 'slug' => 'audio'],
            ['id' => 'timepieces', 'name' => 'Timepieces', 'slug' => 'timepieces'],
            ['id' => 'lifestyle', 'name' => 'Lifestyle & Everyday', 'slug' => 'lifestyle'],
            ['id' => 'tech', 'name' => 'Smart Tech', 'slug' => 'tech']
        ];
    }

    $categories = [];
    foreach ($data as $key => $cat) {
        if (!is_array($cat)) continue;
        $cat['id'] = $key;
        $categories[] = $cat;
    }
    return $categories;
}

/**
 * Fetch navigation menu items
 */
function shopr_get_menus() {
    $data = shopr_firebase_request('menus');
    if (!is_array($data) || empty($data)) {
        $local = shopr_get_local_store();
        if (!empty($local['menus'])) {
            $data = $local['menus'];
        }
    }

    if (!is_array($data)) {
        return [
            ['id' => 'menu_home', 'title' => 'Home', 'url' => 'index.php', 'target' => '_self', 'order' => 1, 'status' => 'Active'],
            ['id' => 'menu_offers', 'title' => 'Special Offers', 'url' => '#catalogGrid', 'target' => '_self', 'order' => 2, 'status' => 'Active'],
            ['id' => 'menu_contact', 'title' => 'Support', 'url' => 'mailto:bappihassan577@gmail.com', 'target' => '_blank', 'order' => 3, 'status' => 'Active']
        ];
    }

    $menus = [];
    foreach ($data as $key => $m) {
        if (!is_array($m)) continue;
        $m['id'] = $key;
        if (isset($m['status']) && $m['status'] === 'Inactive') continue;
        $menus[] = $m;
    }

    usort($menus, function($a, $b) {
        return (int)($a['order'] ?? 0) - (int)($b['order'] ?? 0);
    });

    return $menus;
}

/**
 * Fetch website settings
 */
function shopr_get_settings() {
    $data = shopr_firebase_request('settings');
    $defaults = [
        'site_name' => 'Shopr',
        'site_tagline' => 'Curated Excellence for Modern Living',
        'currency' => '$',
        'hero_title' => 'Curated Design. Exceptional Quality.',
        'hero_subtitle' => 'Discover our hand-selected collection of world-class everyday goods, electronics, and lifestyle apparel.',
        'contact_email' => 'bappihassan577@gmail.com',
        'order_policy' => 'Fast worldwide delivery & secure order routing.'
    ];

    if (is_array($data)) {
        return array_merge($defaults, $data);
    }
    return $defaults;
}
?>
