# Shopr — Premium E-Commerce Platform

A production-ready e-commerce platform built with PHP, HTML5, CSS3, JavaScript, and Firebase Realtime Database.

## Features
- **Public Homepage (`index.php`)**: Hero banner, live search, categories filtering, dynamic product cards, external order forwarding.
- **Product Landing Page (`post.html?id=PRODUCT_ID`)**: Unlimited image gallery with thumbnail switcher, pricing, formatted specs, direct external order button, and complete social share system (Copy link with toast, Web Share API, WhatsApp, Facebook, Telegram, Messenger).
- **Admin Management Panel (`products_add/index.php`)**: Firebase Auth (Email/password + Google Sign-In), strict UID authorization (`xxiPFEdf70Ufd5vtteTFzTqyiRS2`), animated stat cards, product catalog table with live Active/Inactive toggle, unlimited image upload inputs, category manager, and settings.
- **Backend Configuration & Proxy (`config.php`, `api.php`)**: Keeps the Firebase Realtime Database URL protected server-side so it is not unnecessarily exposed in visible HTML.
- **Database Security Rules (`firebase-rules.json`)**: Production-level rules restricting all write access exclusively to Administrator UID `xxiPFEdf70Ufd5vtteTFzTqyiRS2`.

---

## Deploying to Web Hosting (cPanel / Apache / Nginx / Shared Hosting)

1. Upload `shopr.zip` to your hosting web root (e.g. `public_html/`).
2. Extract `shopr.zip`.
3. Verify that PHP 7.4 or PHP 8.x is enabled with `curl` or `allow_url_fopen` enabled.
4. Visit your website:
   - Storefront: `https://yourdomain.com/index.php`
   - Product Details: `https://yourdomain.com/post.html?id=<PRODUCT_ID>`
   - Admin Portal: `https://yourdomain.com/products_add/`

---

## How to Deploy `firebase-rules.json` to Firebase Realtime Database

### Method 1: Using Firebase Console (Easiest)
1. Open [Firebase Console](https://console.firebase.google.com/).
2. Select your project: `life-job-4e856`.
3. In the left navigation, click **Build** > **Realtime Database**.
4. Click on the **Rules** tab at the top.
5. Copy the contents of `firebase-rules.json` and paste them into the editor.
6. Click **Publish**.

### Method 2: Using Firebase CLI
If you use Firebase CLI locally:
```bash
firebase login
firebase use life-job-4e856
firebase deploy --only database
```

---

## Administrator Account
- **Admin UID**: `xxiPFEdf70Ufd5vtteTFzTqyiRS2`
- **Admin Email**: `bappihassan577@gmail.com`
- **Database URL**: `https://life-job-4e856-default-rtdb.firebaseio.com`
