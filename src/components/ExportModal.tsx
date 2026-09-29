import React, { useState } from 'react';
import { Download, FileCode, CheckCircle2, ShieldAlert, Folder, ExternalLink, Copy } from 'lucide-react';

interface ExportModalProps {
  onShowToast: (msg: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ onShowToast }) => {
  const [selectedFile, setSelectedFile] = useState<'rules' | 'config' | 'api' | 'index' | 'post' | 'admin'>('rules');

  const filesContent = {
    rules: `{
  "rules": {
    "products": {
      ".read": true,
      ".indexOn": ["status", "category", "created_at"],
      "$productId": {
        ".write": "auth != null && auth.uid === 'xxiPFEdf70Ufd5vtteTFzTqyiRS2'",
        ".validate": "newData.hasChildren(['title', 'price', 'category', 'status']) && (newData.child('status').val() === 'Active' || newData.child('status').val() === 'Inactive')"
      }
    },
    "categories": {
      ".read": true,
      "$categoryId": {
        ".write": "auth != null && auth.uid === 'xxiPFEdf70Ufd5vtteTFzTqyiRS2'"
      }
    },
    "settings": {
      ".read": true,
      ".write": "auth != null && auth.uid === 'xxiPFEdf70Ufd5vtteTFzTqyiRS2'"
    },
    "users": {
      ".read": "auth != null && auth.uid === 'xxiPFEdf70Ufd5vtteTFzTqyiRS2'",
      "$userUid": {
        ".write": "auth != null && (auth.uid === 'xxiPFEdf70Ufd5vtteTFzTqyiRS2' || auth.uid === $userUid)"
      }
    }
  }
}`,
    config: `<?php
/**
 * Shopr - Platform & Firebase Configuration
 */
define('SITE_NAME', 'Shopr');
define('CURRENCY', '$');

// Security: Protected server-side Firebase Realtime Database URL
define('FIREBASE_RTDB_URL', 'https://life-job-4e856-default-rtdb.firebaseio.com');

// Authorized Administrator UID
define('ADMIN_UID', 'xxiPFEdf70Ufd5vtteTFzTqyiRS2');
define('ADMIN_EMAIL', 'bappihassan577@gmail.com');
?>`,
    api: `<?php
/**
 * Shopr - Secure Backend Proxy API
 * Proxies products and categories without exposing database URL to client HTML
 */
require_once __DIR__ . '/config.php';
$action = $_GET['action'] ?? '';
// Handles products, product by id, categories, and settings securely
?>`,
    index: `<?php
/**
 * Shopr - Public Homepage (index.php)
 * Dynamically queries Firebase Realtime Database
 */
require_once __DIR__ . '/config.php';
$products = shopr_get_products(true); // Active products only
?>
<!DOCTYPE html>
<html lang="en">
...
</html>`,
    post: `<!-- post.html?id=PRODUCT_ID -->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Product Details — Shopr</title>
  ...
</head>
<body>
  <!-- Unlimited Image Gallery with Thumbnails & Social Share System -->
</body>
</html>`,
    admin: `<?php
/**
 * Shopr - Admin Management Portal (/products_add/index.php)
 */
require_once __DIR__ . '/../config.php';
// Firebase Auth + Strict UID authorization check (xxiPFEdf70Ufd5vtteTFzTqyiRS2)
?>`
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(filesContent[selectedFile]);
      onShowToast('Code copied to clipboard');
    } catch {
      onShowToast('Code copied');
    }
  };

  return (
    <div className="py-6 space-y-8">
      {/* Top Banner with Direct ZIP Download */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Production Package Ready</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight mb-2">
            shopr.zip is Ready for Deployment
          </h2>
          <p className="text-sm text-emerald-100 leading-relaxed">
            The ZIP file contains the entire production project: <code>index.php</code>, <code>post.html</code>, <code>products_add/index.php</code>, <code>config.php</code>, <code>api.php</code>, and <code>firebase-rules.json</code>.
          </p>
        </div>

        <a
          href="/shopr.zip"
          download="shopr.zip"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-emerald-50 text-emerald-900 rounded-2xl text-base font-extrabold shadow-lg transition-all hover:scale-102 active:scale-98"
        >
          <Download className="w-5 h-5 text-emerald-700" />
          <span>Download shopr.zip</span>
        </a>
      </div>

      {/* Project Structure & File Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Project File Tree */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Folder className="w-4 h-4 text-blue-600" />
            <span>Project Structure (shopr/)</span>
          </h3>

          <div className="space-y-1.5 font-mono text-xs">
            <button
              onClick={() => setSelectedFile('rules')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                selectedFile === 'rules' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>📄 firebase-rules.json</span>
              <span className="text-[10px] text-blue-600 uppercase font-sans font-bold">Security</span>
            </button>

            <button
              onClick={() => setSelectedFile('index')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                selectedFile === 'index' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>📄 index.php</span>
              <span className="text-[10px] text-slate-400 font-sans font-bold">Storefront</span>
            </button>

            <button
              onClick={() => setSelectedFile('post')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                selectedFile === 'post' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>📄 post.html</span>
              <span className="text-[10px] text-slate-400 font-sans font-bold">Details</span>
            </button>

            <button
              onClick={() => setSelectedFile('admin')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                selectedFile === 'admin' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>📁 products_add/index.php</span>
              <span className="text-[10px] text-purple-600 font-sans font-bold">Admin</span>
            </button>

            <button
              onClick={() => setSelectedFile('config')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                selectedFile === 'config' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>📄 config.php</span>
              <span className="text-[10px] text-slate-400 font-sans font-bold">Config</span>
            </button>

            <button
              onClick={() => setSelectedFile('api')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                selectedFile === 'api' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>📄 api.php</span>
              <span className="text-[10px] text-slate-400 font-sans font-bold">Proxy</span>
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Hosting Compatibility</h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>PHP 7.4 / 8.0 / 8.1 / 8.2 / 8.3</li>
              <li>Apache / Nginx / cPanel</li>
              <li>cURL or allow_url_fopen enabled</li>
            </ul>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-950 text-slate-200 rounded-3xl p-6 shadow-xl border border-slate-800">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>{selectedFile === 'rules' ? 'firebase-rules.json' : `${selectedFile}.php`}</span>
            </div>

            <button
              onClick={copyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>

          <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-2 leading-relaxed max-h-[460px] scrollbar-thin">
            {filesContent[selectedFile]}
          </pre>
        </div>

      </div>

      {/* Deployment & Firebase Security Instructions */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <h3 className="text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <span>How to Deploy Firebase Realtime Database Security Rules</span>
        </h3>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            The project requires that only Administrator UID <code className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">xxiPFEdf70Ufd5vtteTFzTqyiRS2</code> can create, edit, or delete products and settings, while public shoppers have read-only access to products.
          </p>

          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>Open the <strong>Firebase Console</strong> and navigate to project <strong>life-job-4e856</strong>.</li>
            <li>Click <strong>Build &gt; Realtime Database</strong> in the left sidebar menu.</li>
            <li>Select the <strong>Rules</strong> tab at the top of the database screen.</li>
            <li>Paste the contents of <strong>firebase-rules.json</strong> into the editor window.</li>
            <li>Click <strong>Publish</strong> to apply the rules immediately.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
