<?php
/**
 * Shopr - Secure Backend Proxy API
 * Proxies products, categories, menus, and handles safe admin writes
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');

require_once __DIR__ . '/config.php';

$action = isset($_GET['action']) ? trim($_GET['action']) : '';

switch ($action) {
    case 'products':
        $onlyActive = !isset($_GET['all']) || $_GET['all'] !== '1';
        $products = shopr_get_products($onlyActive);
        
        if (!empty($_GET['category']) && $_GET['category'] !== 'all') {
            $catFilter = strtolower(trim($_GET['category']));
            $products = array_values(array_filter($products, function($p) use ($catFilter) {
                return isset($p['category']) && strtolower($p['category']) === $catFilter;
            }));
        }

        if (!empty($_GET['search'])) {
            $query = strtolower(trim($_GET['search']));
            $products = array_values(array_filter($products, function($p) use ($query) {
                $titleMatch = isset($p['title']) && strpos(strtolower($p['title']), $query) !== false;
                $descMatch = isset($p['short_description']) && strpos(strtolower($p['short_description']), $query) !== false;
                $catMatch = isset($p['category']) && strpos(strtolower($p['category']), $query) !== false;
                return $titleMatch || $descMatch || $catMatch;
            }));
        }

        echo json_encode(['success' => true, 'count' => count($products), 'data' => $products]);
        break;

    case 'product':
        $id = isset($_GET['id']) ? trim($_GET['id']) : '';
        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Product ID is required']);
            exit;
        }

        $product = shopr_get_product($id);
        if (!$product) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Product not found or inactive']);
            exit;
        }

        echo json_encode(['success' => true, 'data' => $product]);
        break;

    case 'categories':
        echo json_encode(['success' => true, 'data' => shopr_get_categories()]);
        break;

    case 'menus':
        echo json_encode(['success' => true, 'data' => shopr_get_menus()]);
        break;

    case 'settings':
        echo json_encode(['success' => true, 'data' => shopr_get_settings()]);
        break;

    // --- ADMIN ACTIONS (Server-Side Execution to prevent browser PERMISSION_DENIED) ---
    case 'admin_save_product':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        $title = trim($input['title'] ?? '');
        $thumbnail = trim($input['thumbnail'] ?? '');
        $price = floatval($input['price'] ?? 0);
        $orderUrl = trim($input['order_url'] ?? '');

        if (empty($title) || empty($thumbnail) || $price <= 0 || empty($orderUrl)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Please fill all required fields (title, thumbnail, price, order_url)']);
            exit;
        }

        $editId = trim($input['id'] ?? '');
        $productId = !empty($editId) ? preg_replace('/[^a-zA-Z0-9_\-]/', '', $editId) : 'prod_' . time() . '_' . rand(100, 999);

        $productPayload = [
            'id' => $productId,
            'title' => $title,
            'thumbnail' => $thumbnail,
            'images' => !empty($input['images']) && is_array($input['images']) ? array_values(array_filter($input['images'])) : [$thumbnail],
            'price' => $price,
            'old_price' => !empty($input['old_price']) ? floatval($input['old_price']) : null,
            'discount' => !empty($input['discount']) ? intval($input['discount']) : null,
            'category' => trim($input['category'] ?? 'General'),
            'short_description' => trim($input['short_description'] ?? ''),
            'full_description' => trim($input['full_description'] ?? ''),
            'order_url' => $orderUrl,
            'status' => in_array($input['status'] ?? 'Active', ['Active', 'Inactive']) ? $input['status'] : 'Active',
            'updated_at' => time() * 1000
        ];

        if (empty($editId)) {
            $productPayload['created_at'] = time() * 1000;
        }

        // 1. Save to local fallback store first (guarantees product is NEVER lost)
        $store = shopr_get_local_store();
        $store['products'][$productId] = $productPayload;
        shopr_save_local_store($store);

        // 2. Write to Firebase RTDB
        $fbMethod = !empty($editId) ? 'PATCH' : 'PUT';
        $fbRes = shopr_firebase_request('products/' . $productId, $fbMethod, $productPayload);

        $firebaseSynced = ($fbRes !== false && !isset($fbRes['error']));

        echo json_encode([
            'success' => true,
            'message' => 'Product saved successfully!',
            'firebase_synced' => $firebaseSynced,
            'id' => $productId,
            'data' => $productPayload
        ]);
        break;

    case 'admin_delete_product':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        $id = trim($input['id'] ?? '');
        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Product ID required']);
            exit;
        }

        $sanitizedId = preg_replace('/[^a-zA-Z0-9_\-]/', '', $id);

        // Delete from local
        $store = shopr_get_local_store();
        if (isset($store['products'][$sanitizedId])) {
            unset($store['products'][$sanitizedId]);
            shopr_save_local_store($store);
        }

        // Delete from Firebase
        shopr_firebase_request('products/' . $sanitizedId, 'DELETE');

        echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
        break;

    case 'admin_toggle_status':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        $id = trim($input['id'] ?? '');
        $status = trim($input['status'] ?? 'Active');

        $store = shopr_get_local_store();
        if (isset($store['products'][$id])) {
            $store['products'][$id]['status'] = $status;
            shopr_save_local_store($store);
        }

        shopr_firebase_request('products/' . $id, 'PATCH', ['status' => $status]);

        echo json_encode(['success' => true, 'status' => $status]);
        break;

    case 'admin_save_menu':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        $title = trim($input['title'] ?? '');
        $url = trim($input['url'] ?? '');
        if (empty($title) || empty($url)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Title and URL required']);
            exit;
        }

        $menuId = !empty($input['id']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '', $input['id']) : 'menu_' . time();
        $payload = [
            'id' => $menuId,
            'title' => $title,
            'url' => $url,
            'target' => $input['target'] === '_blank' ? '_blank' : '_self',
            'order' => intval($input['order'] ?? 1),
            'status' => $input['status'] === 'Inactive' ? 'Inactive' : 'Active'
        ];

        $store = shopr_get_local_store();
        $store['menus'][$menuId] = $payload;
        shopr_save_local_store($store);

        shopr_firebase_request('menus/' . $menuId, 'PUT', $payload);

        echo json_encode(['success' => true, 'data' => $payload]);
        break;

    case 'admin_delete_menu':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $id = trim($input['id'] ?? '');

        $store = shopr_get_local_store();
        if (isset($store['menus'][$id])) {
            unset($store['menus'][$id]);
            shopr_save_local_store($store);
        }

        shopr_firebase_request('menus/' . $id, 'DELETE');
        echo json_encode(['success' => true]);
        break;

    case 'admin_save_category':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        $name = trim($input['name'] ?? '');
        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Category name is required']);
            exit;
        }

        $editId = trim($input['id'] ?? '');
        $catId = !empty($editId) ? preg_replace('/[^a-zA-Z0-9_\-]/', '', $editId) : 'cat_' . time();
        $slug = !empty($input['slug']) ? trim($input['slug']) : strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name));

        $payload = [
            'id' => $catId,
            'name' => $name,
            'slug' => $slug
        ];

        $store = shopr_get_local_store();
        $store['categories'][$catId] = $payload;
        shopr_save_local_store($store);

        shopr_firebase_request('categories/' . $catId, 'PUT', ['name' => $name, 'slug' => $slug]);

        echo json_encode(['success' => true, 'data' => $payload]);
        break;

    case 'admin_delete_category':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $id = trim($input['id'] ?? '');

        if ($id === 'all') {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Cannot delete default category']);
            exit;
        }

        $store = shopr_get_local_store();
        if (isset($store['categories'][$id])) {
            unset($store['categories'][$id]);
            shopr_save_local_store($store);
        }

        shopr_firebase_request('categories/' . $id, 'DELETE');
        echo json_encode(['success' => true]);
        break;

    case 'admin_save_settings':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        $currency = trim($input['currency'] ?? '$');
        if (empty($currency)) $currency = '$';

        $payload = [
            'site_name' => trim($input['site_name'] ?? 'Shopr'),
            'site_tagline' => trim($input['site_tagline'] ?? 'Curated Excellence for Modern Living'),
            'currency' => $currency,
            'hero_title' => trim($input['hero_title'] ?? 'Curated Design. Exceptional Quality.'),
            'hero_subtitle' => trim($input['hero_subtitle'] ?? ''),
            'contact_email' => trim($input['contact_email'] ?? 'https://t.me/shopr_official'),
            'order_policy' => trim($input['order_policy'] ?? 'Fast worldwide delivery & secure order routing.')
        ];

        $store = shopr_get_local_store();
        $store['settings'] = $payload;
        shopr_save_local_store($store);

        shopr_firebase_request('settings', 'PATCH', $payload);

        echo json_encode(['success' => true, 'data' => $payload, 'message' => 'Settings and currency saved successfully!']);
        break;

    default:

        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
        break;
}
?>
