/* ==========================================================================
   أفق | OFOQ Fragrance Boutique - Core JavaScript Logic & Interactivity
   Specialized Luxury Egyptian Perfume House & Cash On Delivery (COD) Store
   ========================================================================== */

// 1. قاعدة البيانات المحلية الاحتياطية للعطور الفاخرة (بالجنيه المصري EGP)
const FALLBACK_PRODUCTS = [
  {
    id: "p1111111-1111-1111-1111-111111111111",
    title: "عطر الأوركيد والعود الملكي",
    brand: "دار أفق للعطور الفاخرة",
    fragranceType: "عطر أصلي فاخر",
    concentration: "Eau de Parfum",
    volume: "100 مل",
    scentFamily: "شرقي زهري دافئ",
    gender: "unisex",
    category: "unisex",
    categoryName: "عطور للجنسين",
    price: 1450,
    oldPrice: 2100,
    rating: 4.9,
    reviewsCount: 142,
    badge: "الأكثر طلباً",
    image: "assets/images/perfume_royal_oud.png",
    description: "توليفة عطرية ملكية تمزج بين رحيق زهرة الأوركيد البرية والعود الكمبودي النادر، مع لمسات خفيفة من الورد البلغاري والعنبر الدافئ لحضور وقور يدوم طويلاً.",
    variants: [
      { id: "v1_1", name: "100 مل (الحجم الكامل)", additionalPrice: 0 },
      { id: "v1_2", name: "50 مل (حجم السفر)", additionalPrice: -400 }
    ]
  },
  {
    id: "p2222222-2222-2222-2222-222222222222",
    title: "عطر نوار أمبر المركز للرجال",
    brand: "تشكيلة أفق بريفيه",
    fragranceType: "عطر أصلي فاخر",
    concentration: "Eau de Parfum Intense",
    volume: "100 مل",
    scentFamily: "عنبري جلدي وتوابل دافئة",
    gender: "men",
    category: "men",
    categoryName: "عطور رجالية",
    price: 1650,
    oldPrice: 2250,
    rating: 4.8,
    reviewsCount: 88,
    badge: "حضور رجالي كلاسيكي",
    image: "assets/images/perfume_noir_amber.png",
    description: "عطر رجالي غامض يفيض بالثقة والجاذبية، يفتتح بالهيل الغواتيمالي والبرغموت، ويتكئ على قلب من خشب الأرز والجلد المدبوغ الفاخر مع قاعدة عنبرية رمادية عميقة.",
    variants: [
      { id: "v2_1", name: "100 مل (الحجم الكامل)", additionalPrice: 0 },
      { id: "v2_2", name: "50 مل (حجم السفر)", additionalPrice: -450 }
    ]
  },
  {
    id: "p3333333-3333-3333-3333-333333333333",
    title: "عطر بتلات الورد والحرير للنساء",
    brand: "دار أفق للعطور الفاخرة",
    fragranceType: "عطر أصلي فاخر",
    concentration: "Eau de Parfum",
    volume: "100 مل",
    scentFamily: "زهري باودري ناعم",
    gender: "women",
    category: "women",
    categoryName: "عطور نسائية",
    price: 1550,
    oldPrice: 1950,
    rating: 4.9,
    reviewsCount: 94,
    badge: "أنوثة راقية",
    image: "assets/images/perfume_rose_silk.png",
    description: "إشراقة أنثوية ناعمة مستوحاة من رقة الحرير الطبيعي، تجمع بين ورد دي ماي الفاخر، والليتشي المنعش، مع هالة ناعمة من الفانيليا ومسك الحرير الأبيض.",
    variants: [
      { id: "v3_1", name: "100 مل (الحجم الكامل)", additionalPrice: 0 },
      { id: "v3_2", name: "50 مل (حجم السفر)", additionalPrice: -350 }
    ]
  },
  {
    id: "p4444444-4444-4444-4444-444444444444",
    title: "دهن عود سيوفي كلاسيكي قديم صافي",
    brand: "خزانة العود التراثية",
    fragranceType: "دهن عود طبيعي نقي",
    concentration: "زيت عطري خام 100% بدون كحول",
    volume: "ربع توله (3 مل)",
    scentFamily: "بخوري ترابي عميق",
    gender: "unisex",
    category: "oud-oriental",
    categoryName: "دهن عود وشرقيات",
    price: 2800,
    oldPrice: 3500,
    rating: 5.0,
    reviewsCount: 56,
    badge: "معتق 15 سنة",
    image: "assets/images/dehn_oud_bottle.png",
    description: "دهن عود سيوفي طبيعي معتق بعناية لأكثر من 15 سنة، مستخلص من أشجار العود المعمرة بنكهة بخورية فخمة وثبات استثنائي على الملابس والجلد.",
    variants: [
      { id: "v4_1", name: "ربع توله (3 مل)", additionalPrice: 0 },
      { id: "v4_2", name: "توله كاملة (12 مل)", additionalPrice: 4500 }
    ]
  },
  {
    id: "p5555555-5555-5555-5555-555555555555",
    title: "توليفة أفق سيجنتشر | مسك وخشب الصندل",
    brand: "خلطات أفق الخاصة",
    fragranceType: "خلطة خاصة محلية الصنع",
    concentration: "Extrait de Parfum",
    volume: "100 مل",
    scentFamily: "خشبي مسكي بلسمي",
    gender: "unisex",
    category: "private-blends",
    categoryName: "خلطات أفق والنيش",
    price: 1350,
    oldPrice: 1800,
    rating: 4.8,
    reviewsCount: 72,
    badge: "خلطة أفق الحصرية",
    image: "assets/images/perfume_royal_oud.png",
    description: "ابتكار عطري حصري من دار أفق يمزج بين خشب الصندل الميسوري والمسك الأبيض البلوري مع نفحات خفيفة من الهيل الأخضر واللبان الحوجري العماني.",
    variants: [
      { id: "v5_1", name: "100 مل (الحجم الكامل)", additionalPrice: 0 },
      { id: "v5_2", name: "50 مل (حجم السفر)", additionalPrice: -350 }
    ]
  },
  {
    id: "p6666666-6666-6666-6666-666666666666",
    title: "مسك الطهارة والبودر المركز",
    brand: "خلطات أفق الخاصة",
    fragranceType: "خلطة خاصة محلية الصنع",
    concentration: "زيت عطري حريري باودري",
    volume: "نصف توله (6 مل)",
    scentFamily: "مسك أبيض نقي ومنعش",
    gender: "unisex",
    category: "private-blends",
    categoryName: "خلطات أفق والنيش",
    price: 650,
    oldPrice: 900,
    rating: 4.7,
    reviewsCount: 63,
    badge: "نقاء وانتعاش",
    image: "assets/images/dehn_oud_bottle.png",
    description: "توليفة مسك الطهارة الكلاسيكية بنكهة باودر الأطفال وزهور القطن الناعمة، قوام حريري مهدئ للبشرة بعد الاستحمام برائحة النظافة المطلقة.",
    variants: [
      { id: "v6_1", name: "نصف توله (6 مل)", additionalPrice: 0 },
      { id: "v6_2", name: "توله كاملة (12 مل)", additionalPrice: 500 }
    ]
  },
  {
    id: "p7777777-7777-7777-7777-777777777777",
    title: "صندوق الإهداء الفاخر (عطر 100 مل + ربع توله دهن عود)",
    brand: "دار أفق للعطور الفاخرة",
    fragranceType: "طقم إهداء فاخر",
    concentration: "عطر + دهن عود مركز",
    volume: "صندوق متكامل",
    scentFamily: "تشكيلة فاخرة للإهداء",
    gender: "unisex",
    category: "gift-sets",
    categoryName: "أطقم هدايا وملحقات",
    price: 2950,
    oldPrice: 3800,
    rating: 4.9,
    reviewsCount: 41,
    badge: "طقم إهداء راقي",
    image: "assets/images/perfume_gift_set.png",
    description: "صندوق جلدي فاخر مبطن بالمخمل الملكي، يحتوي على زجاجة عطر الأوركيد والعود (100 مل) وتوله كريستالية من دهن العود المعتق، خيار مثالي لهدايا المناسبات الراقية.",
    variants: [
      { id: "v7_1", name: "طقم الإهداء المتكامل", additionalPrice: 0 }
    ]
  },
  {
    id: "p8888888-8888-8888-8888-888888888888",
    title: "مبخرة السيراميك الذكية لتسخين العود الفاخر",
    brand: "إكسسوارات العطر الفاخرة",
    fragranceType: "ملحقات التعطير والبخور",
    concentration: "تسخين ذاتي بالسيراميك",
    volume: "قطعة واحدة",
    scentFamily: "ملحق بخور وعود",
    gender: "unisex",
    category: "gift-sets",
    categoryName: "أطقم هدايا وملحقات",
    price: 850,
    oldPrice: 1200,
    rating: 4.8,
    reviewsCount: 38,
    badge: "تسخين ذكي بدون فحم",
    image: "assets/images/perfume.png",
    description: "مبخرة إلكترونية فاخرة بنظام تسخين السيراميك الآمن والذاتي دون الحاجة لفحم مشتعل، تحفظ الزيوت العطرية لرقائق العود وتمنع احتراقها أو انبعاث دخان كربوني مزعج.",
    variants: [
      { id: "v8_1", name: "أسود رخامي معرق", additionalPrice: 0 },
      { id: "v8_2", name: "أبيض عاجي بلمسة ذهبية", additionalPrice: 0 }
    ]
  }
];

// تصنيف ومطابقة المعرفات الفئوية
const CATEGORY_SLUG_MAP = {
  'c1000000-0000-0000-0000-000000000001': 'men',
  'c1000000-0000-0000-0000-000000000002': 'women',
  'c1000000-0000-0000-0000-000000000003': 'unisex',
  'c1000000-0000-0000-0000-000000000004': 'oud-oriental',
  'c1000000-0000-0000-0000-000000000005': 'private-blends',
  'c1000000-0000-0000-0000-000000000006': 'gift-sets'
};

const CATEGORY_NAME_MAP = {
  'men': 'عطور رجالية',
  'women': 'عطور نسائية',
  'unisex': 'عطور للجنسين',
  'oud-oriental': 'دهن عود وشرقيات',
  'private-blends': 'خلطات أفق والنيش',
  'gift-sets': 'أطقم هدايا وملحقات'
};

// جدول أسعار الشحن بحسب المحافظة في مصر (مطابق تماماً لقاعدة البيانات)
const EGYPT_SHIPPING_RATES = {
  "القاهرة": 45,
  "الجيزة": 45,
  "القليوبية": 50,
  "الإسكندرية": 55,
  "الشرقية": 55,
  "الدقهلية": 55,
  "الغربية": 55,
  "المنوفية": 55,
  "كفر الشيخ": 60,
  "البحيرة": 60,
  "دمياط": 60,
  "بورسعيد": 60,
  "الإسماعيلية": 60,
  "السويس": 60,
  "الفيوم": 65,
  "بني سويف": 65,
  "المنيا": 70,
  "أسيوط": 75,
  "سوهاج": 75,
  "قنا": 80,
  "الأقصر": 80,
  "أسوان": 85,
  "البحر الأحمر": 90,
  "جنوب سيناء": 90,
  "مطروح": 90
};

// حالة التطبيق
let PRODUCTS = [...FALLBACK_PRODUCTS];
let cart = JSON.parse(localStorage.getItem('ofoq_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('ofoq_wishlist')) || [];
let currentCategory = 'all';
let currentSort = 'featured';
let appliedDiscount = 0;
let currentGovernorate = 'القاهرة';
let selectedVariantForQuickView = null;
let currentCheckoutIdempotencyKey = null; // مفتاح منع تكرار إرسال الطلب

// وسائل الدفع المدعومة والخيارات القابلة للتكوين
let selectedPaymentMethod = 'cod';
const VODAFONE_CASH_NUMBER = window.OFOQ_VODAFONE_CASH_NUMBER || '01000000000';
const INSTAPAY_ADDRESS = window.OFOQ_INSTAPAY_ADDRESS || 'ofoq@instapay';

// إعدادات واتساب
const STORE_WHATSAPP_NUMBER = window.OFOQ_WHATSAPP_NUMBER || '201000000000';
const STORE_WHATSAPP_DEFAULT_MSG = encodeURIComponent('مرحباً دار أفق للعطور، أود الاستفسار عن التشكيلة العطرية وإمكانية الشحن.');

// متغيرات سلايدر الهيرو الرئيسي
let currentSlideIndex = 0;
let slideIntervalTimer = null;
const SLIDE_AUTOPLAY_DELAY = 5500;

// تهيئة الاتصال بـ Supabase إن وُجد
let supabasePublicClient = null;

async function initSupabaseClient() {
  let sbUrl = localStorage.getItem('ofoq_supabase_url') || window.ENV_SUPABASE_URL;
  let sbKey = localStorage.getItem('ofoq_supabase_anon_key') || window.ENV_SUPABASE_ANON_KEY;

  if (!sbUrl || !sbKey) {
    try {
      const cfgRes = await fetch('/api/config');
      if (cfgRes.ok) {
        const cfg = await cfgRes.json();
        if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
          sbUrl = cfg.supabaseUrl;
          sbKey = cfg.supabaseAnonKey;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (window.supabase && sbUrl && sbKey) {
    try {
      supabasePublicClient = window.supabase.createClient(sbUrl, sbKey);
    } catch (e) {
      console.warn('Supabase public client not active, using fallback data.', e);
    }
  }
}

// تشغيل التطبيق عند التحميل
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  await initSupabaseClient();
  await loadLiveProducts();
  renderProducts();
  renderOffers();
  initHeroSlider();
  initWhatsApp();
  updateCartUI();
  updateWishlistUI();
  setupEventListeners();
});

// جلب المنتجات الحية من Supabase
async function loadLiveProducts() {
  if (!supabasePublicClient) return;
  try {
    const { data, error } = await supabasePublicClient
      .from('products')
      .select('*, product_variants(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      PRODUCTS = data.map(p => {
        const catSlug = CATEGORY_SLUG_MAP[p.category_id] || p.category_id || 'unisex';
        const catName = CATEGORY_NAME_MAP[catSlug] || p.badge || 'عطر فاخر';
        return {
          id: p.id,
          title: p.title,
          brand: p.brand || 'دار أفق للعطور الفاخرة',
          fragranceType: p.fragrance_type || 'عطر أصلي فاخر',
          concentration: p.concentration || 'Eau de Parfum',
          volume: p.volume || '100 مل',
          scentFamily: p.scent_family || 'عطر شرقي',
          gender: p.gender_target || 'unisex',
          category: catSlug,
          categoryName: catName,
          price: parseFloat(p.price),
          oldPrice: p.old_price ? parseFloat(p.old_price) : null,
          rating: parseFloat(p.rating || 5.0),
          reviewsCount: p.reviews_count || 10,
          badge: p.badge,
          image: p.image_url || 'assets/images/perfume_royal_oud.png',
          description: p.description,
          variants: p.product_variants && p.product_variants.length > 0 
            ? p.product_variants.map(v => ({ id: v.id, name: v.name, additionalPrice: parseFloat(v.additional_price || 0) }))
            : [{ id: 'default', name: 'القياسي', additionalPrice: 0 }]
        };
      });
    }
  } catch (err) {
    console.warn('Could not fetch from Supabase, relying on local fallback catalog.', err);
  }
}

/* ==========================================================================
   2. Theme & Timers
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('ofoq_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const themeBtnIcon = document.querySelector('#theme-toggle-btn i');
  if (themeBtnIcon) {
    themeBtnIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ofoq_theme', next);
  updateThemeIcon(next);
  showToast(next === 'dark' ? 'تم تفعيل الوضع الداكن' : 'تم تفعيل الوضع النهاري');
}

function initTimers() {
  let secondsLeft = 31339; // ~8h 42m
  setInterval(() => {
    secondsLeft--;
    if (secondsLeft < 0) secondsLeft = 86400;

    const hrs = Math.floor(secondsLeft / 3600);
    const mins = Math.floor((secondsLeft % 3600) / 60);
    const secs = secondsLeft % 60;

    const formatted = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    const announcementEl = document.getElementById('announcement-timer');
    if (announcementEl) announcementEl.textContent = formatted;

    const dealH = document.getElementById('deal-hours');
    const dealM = document.getElementById('deal-minutes');
    const dealS = document.getElementById('deal-seconds');
    if (dealH && dealM && dealS) {
      dealH.textContent = String(hrs).padStart(2, '0');
      dealM.textContent = String(mins).padStart(2, '0');
      dealS.textContent = String(secs).padStart(2, '0');
    }
  }, 1000);
}

/* ==========================================================================
   3. Products Rendering & Filtering (Currency: EGP)
   ========================================================================== */
function formatPrice(amountInEGP) {
  return `${Math.round(amountInEGP).toLocaleString('ar-EG')} ج.م`;
}

function getOptimizedImageUrl(url) {
  if (!url) return '';
  return url.replace(/\.(png|jpg|jpeg)$/i, '.webp');
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let filtered = [...PRODUCTS];

  // Category Filter
  if (currentCategory !== 'all') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  // Sort Filter
  if (currentSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p style="font-weight: 700; font-size: 1.1rem;">لا توجد منتجات متوفرة في هذا القسم حالياً.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((product, pIdx) => {
    const isWishlisted = wishlist.includes(product.id);
    const discountPercent = (product.oldPrice && product.oldPrice > product.price)
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

    return `
      <div class="product-card" onclick="quickViewProduct('${product.id}')">
        <div class="product-image-box">
          ${discountPercent ? `<span class="product-badge discount">-${discountPercent}%</span>` : (product.badge ? `<span class="product-badge">${product.badge}</span>` : '')}
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist('${product.id}')" title="إضافة للمفضلة">
            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <picture>
            <source srcset="${getOptimizedImageUrl(product.image)}" type="image/webp">
            <img src="${product.image}" alt="${product.title}" loading="${pIdx < 2 ? 'eager' : 'lazy'}" width="1024" height="1024" />
          </picture>
          <div class="quick-view-overlay">
            <button class="btn-quick-view" onclick="event.stopPropagation(); quickViewProduct('${product.id}')">
              <i class="fa-solid fa-eye"></i> نظرة سريعة وتفاصيل
            </button>
          </div>
        </div>

        <div class="product-info">
          <div class="product-brand-row">
            <span class="product-category">${product.categoryName}</span>
            ${product.volume ? `<span class="product-volume-pill">${product.volume}</span>` : ''}
          </div>
          <h3 class="product-title">${product.title}</h3>
          
          <div class="product-rating">
            ${'<i class="fa-solid fa-star"></i>'.repeat(Math.floor(product.rating))}
            <span class="rating-count">(${product.rating})</span>
          </div>

          <div class="product-bottom">
            <div class="price-container">
              <span class="current-price">${formatPrice(product.price)}</span>
              ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
            </div>

            <button class="add-to-cart-btn" onclick="event.stopPropagation(); handleCardAddToCart('${product.id}')" title="أضف للسلة">
              <i class="fa-solid fa-bag-shopping"></i>
              <span class="btn-text">أضف للسلة</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function handleCardAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  if (product.variants && product.variants.length > 1) {
    quickViewProduct(productId);
  } else {
    const v = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    addToCart(productId, 1, v);
  }
}

/* ==========================================================================
   4. Cart Logic & Free Shipping
   ========================================================================== */
function addToCart(productId, qty = 1, variant = null) {
  const itemIndex = cart.findIndex(item => item.id === productId && item.variantId === (variant ? variant.id : null));
  if (itemIndex > -1) {
    cart[itemIndex].qty += qty;
  } else {
    cart.push({
      id: productId,
      variantId: variant ? variant.id : null,
      variantName: variant ? variant.name : null,
      additionalPrice: variant ? variant.additionalPrice : 0,
      qty: qty
    });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
  
  const product = PRODUCTS.find(p => p.id === productId);
  if (product) {
    showToast(`تمت إضافة "${product.title}" إلى السلة`);
  }
}

function updateCartQty(index, delta) {
  if (cart[index]) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
  showToast('تم إزالة المنتج من السلة');
}

function saveCart() {
  localStorage.setItem('ofoq_cart', JSON.stringify(cart));
}

function handleGovernorateChange(val) {
  currentGovernorate = val;
  updateCartUI();
}

function updateCartUI() {
  const cartCountEl = document.getElementById('cart-count');
  const cartContainer = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartDiscountEl = document.getElementById('cart-discount');
  const cartShippingFeeEl = document.getElementById('cart-shipping-fee');
  const cartTotalEl = document.getElementById('cart-total');
  const shippingProgressEl = document.getElementById('shipping-progress');

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCountEl) cartCountEl.textContent = totalCount;

  let subtotal = 0;
  
  if (cart.length === 0) {
    if (cartContainer) {
      cartContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p style="font-weight: 700;">سلة التسوق فارغة حالياً</p>
          <p style="font-size: 0.85rem; margin-top: 0.3rem;">استكشف المنتجات وأضف ما يعجبك!</p>
        </div>
      `;
    }
  } else {
    if (cartContainer) {
      cartContainer.innerHTML = cart.map((item, idx) => {
        const product = PRODUCTS.find(p => p.id === item.id);
        if (!product) return '';
        const unitPrice = product.price + (item.additionalPrice || 0);
        const itemTotal = unitPrice * item.qty;
        subtotal += itemTotal;

        return `
          <div class="cart-item">
            <img src="${getOptimizedImageUrl(product.image)}" alt="${product.title}" width="65" height="65" loading="lazy" />
            <div class="cart-item-details">
              <span class="cart-item-title">${product.title}</span>
              ${item.variantName ? `<span style="font-size: 0.78rem; color: var(--primary); display: block;">الخيار: ${item.variantName}</span>` : ''}
              <span class="cart-item-price">${formatPrice(itemTotal)}</span>
              <div class="quantity-control">
                <button class="qty-btn" onclick="updateCartQty(${idx}, -1)">-</button>
                <span class="qty-val">${item.qty}</span>
                <button class="qty-btn" onclick="updateCartQty(${idx}, 1)">+</button>
              </div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${idx})">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        `;
      }).join('');
    }
  }

  // فحص الشحن المجاني فوق 1,000 ج.م
  const freeThreshold = 1000;
  let shippingFee = EGYPT_SHIPPING_RATES[currentGovernorate] || 45;

  if (shippingProgressEl) {
    if (subtotal >= freeThreshold && subtotal > 0) {
      shippingFee = 0;
      shippingProgressEl.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--accent);"></i> تهانينا! حصلت على شحن مجاني لكافة محافظات مصر 100%';
    } else {
      const remaining = Math.max(0, freeThreshold - subtotal);
      shippingProgressEl.innerHTML = `أضف منتجات بقيمة <span id="remaining-for-free-shipping" style="font-weight: 800; color: var(--primary);">${formatPrice(remaining)}</span> للحصول على شحن مجاني!`;
    }
  }

  const discountAmount = subtotal * appliedDiscount;
  const finalTotal = Math.max(0, subtotal - discountAmount) + (subtotal > 0 ? shippingFee : 0);

  if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotal);
  if (cartDiscountEl) cartDiscountEl.textContent = `-${formatPrice(discountAmount)}`;
  if (cartShippingFeeEl) cartShippingFeeEl.textContent = shippingFee === 0 ? 'مجاني 0 ج.م' : formatPrice(shippingFee);
  if (cartTotalEl) cartTotalEl.textContent = formatPrice(finalTotal);
}

/* ==========================================================================
   5. Wishlist Logic & Modal
   ========================================================================== */
function toggleWishlist(productId) {
  const idx = wishlist.indexOf(productId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast('تم الإزالة من المفضلة');
  } else {
    wishlist.push(productId);
    showToast('تمت الإضافة للمفضلة');
  }
  localStorage.setItem('ofoq_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
  renderProducts();
}

function updateWishlistUI() {
  const el = document.getElementById('wishlist-count');
  if (el) el.textContent = wishlist.length;
}

function openWishlistModal() {
  const container = document.getElementById('wishlist-items-container');
  if (!container) return;

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
        <i class="fa-regular fa-heart" style="font-size: 2.5rem; margin-bottom: 0.8rem; opacity: 0.5;"></i>
        <p style="font-weight: 700;">قائمتك المفضلة فارغة حالياً</p>
      </div>
    `;
  } else {
    container.innerHTML = wishlist.map(id => {
      const p = PRODUCTS.find(prod => prod.id === id);
      if (!p) return '';
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 0; border-bottom: 1px solid var(--border-color); gap: 1rem;">
          <img src="${getOptimizedImageUrl(p.image)}" alt="${p.title}" width="50" height="50" loading="lazy" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm);" />
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 0.9rem;">${p.title}</div>
            <div style="font-weight: 800; color: var(--primary); font-size: 0.85rem;">${formatPrice(p.price)}</div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="addToCart('${p.id}'); closeWishlistModal();">
              <i class="fa-solid fa-plus"></i> أضف للسلة
            </button>
            <button class="action-btn-sm" style="color: var(--danger);" onclick="toggleWishlist('${p.id}'); openWishlistModal();">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  document.getElementById('wishlist-modal').classList.add('active');
}

function closeWishlistModal() {
  document.getElementById('wishlist-modal').classList.remove('active');
}

/* ==========================================================================
   6. Modals & Quick View
   ========================================================================== */
function openCartDrawer() {
  document.getElementById('cart-overlay').classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cart-overlay').classList.remove('active');
}

function quickViewProduct(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  selectedVariantForQuickView = product.variants && product.variants.length > 0 ? product.variants[0] : null;

  const content = document.getElementById('quick-view-content');
  content.innerHTML = `
    <div style="background: var(--bg-main); border-radius: var(--radius-md); overflow: hidden; padding: 1.5rem; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color);">
      <picture>
        <source srcset="${getOptimizedImageUrl(product.image)}" type="image/webp">
        <img src="${product.image}" alt="${product.title}" style="max-width: 100%; max-height: 320px; object-fit: contain; border-radius: var(--radius-sm);" width="1024" height="1024" />
      </picture>
    </div>
    <div>
      <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.5rem;">
        <span style="color: var(--primary); font-size: 0.85rem; font-weight: 800; background: var(--primary-light); padding: 0.2rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--primary-border);">${product.brand || 'دار أفق'}</span>
        <span style="font-size: 0.82rem; color: var(--text-muted);">${product.fragranceType || 'عطر فاخر'}</span>
      </div>
      <h2 style="font-size: 1.4rem; font-weight: 800; margin: 0.2rem 0 0.6rem 0;">${product.title}</h2>
      
      <div style="display: flex; gap: 0.8rem; align-items: center; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.8rem; flex-wrap: wrap;">
        ${product.concentration ? `<span><i class="fa-solid fa-droplet" style="color: var(--primary);"></i> ${product.concentration}</span>` : ''}
        ${product.volume ? `<span><i class="fa-solid fa-bottle-droplet" style="color: var(--primary);"></i> ${product.volume}</span>` : ''}
        ${product.scentFamily ? `<span><i class="fa-solid fa-wind" style="color: var(--accent);"></i> ${product.scentFamily}</span>` : ''}
      </div>

      <div style="color: var(--warning); font-size: 0.9rem; margin-bottom: 1rem;">
        ${'<i class="fa-solid fa-star"></i>'.repeat(Math.floor(product.rating))}
        <span style="font-weight: 700; color: var(--text-main); margin-right: 0.3rem;">${product.rating}</span>
        <span style="color: var(--text-muted); font-size: 0.82rem;">(${product.reviewsCount} تقييم معتمد في مصر)</span>
      </div>

      <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.2rem;">${product.description}</p>

      ${product.variants && product.variants.length > 0 ? `
        <div style="margin-bottom: 1.5rem; background: var(--bg-card); padding: 0.9rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <label style="display: block; font-size: 0.88rem; font-weight: 800; margin-bottom: 0.6rem; color: var(--text-main);">
            <i class="fa-solid fa-sliders" style="color: var(--primary);"></i> اختر الحجم / السعة:
          </label>
          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;" id="quick-view-variants">
            ${product.variants.map((v, i) => `
              <button class="pill-btn ${i === 0 ? 'active' : ''}" onclick="selectQuickViewVariant('${product.id}', '${v.id}', this)" style="font-size: 0.85rem;">
                ${v.name} ${v.additionalPrice ? `(${v.additionalPrice > 0 ? '+' : ''}${formatPrice(v.additionalPrice)})` : ''}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
        <div>
          <span style="font-size: 1.6rem; font-weight: 900; color: var(--primary);" id="qv-price">${formatPrice(product.price + (selectedVariantForQuickView ? selectedVariantForQuickView.additionalPrice : 0))}</span>
          ${product.oldPrice ? `<span class="old-price" style="margin-right: 0.5rem;">${formatPrice(product.oldPrice)}</span>` : ''}
        </div>

        <button class="btn-primary" onclick="addSelectedVariantToCart('${product.id}')">
          <i class="fa-solid fa-cart-shopping"></i> أضف للسلة
        </button>
      </div>
    </div>
  `;

  document.getElementById('quick-view-modal').classList.add('active');
}

function selectQuickViewVariant(productId, variantId, btnEl) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const v = product.variants.find(item => item.id === variantId);
  if (!v) return;

  selectedVariantForQuickView = v;

  document.querySelectorAll('#quick-view-variants .pill-btn').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');

  const priceEl = document.getElementById('qv-price');
  if (priceEl) {
    priceEl.textContent = formatPrice(product.price + v.additionalPrice);
  }
}

function addSelectedVariantToCart(productId) {
  addToCart(productId, 1, selectedVariantForQuickView);
  closeQuickView();
}

function closeQuickView() {
  document.getElementById('quick-view-modal').classList.remove('active');
  selectedVariantForQuickView = null;
}

/* ==========================================================================
   7. Live Search Autocomplete
   ========================================================================== */
function setupSearch() {
  const input = document.getElementById('search-input');
  const dropdown = document.getElementById('search-dropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (query.length === 0) {
      dropdown.classList.remove('active');
      return;
    }

    const matches = PRODUCTS.filter(p => p.title.toLowerCase().includes(query) || p.categoryName.includes(query));
    
    if (matches.length > 0) {
      dropdown.innerHTML = matches.map(p => `
        <div class="search-item" onclick="quickViewProduct('${p.id}'); document.getElementById('search-dropdown').classList.remove('active');">
          <img src="${getOptimizedImageUrl(p.image)}" alt="${p.title}" width="50" height="50" loading="lazy" />
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">${p.title}</div>
            <div style="color: var(--primary); font-size: 0.85rem; font-weight: 800;">${formatPrice(p.price)}</div>
          </div>
        </div>
      `).join('');
      dropdown.classList.add('active');
    } else {
      dropdown.innerHTML = `<div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">لا توجد نتائج تطابق "${query}"</div>`;
      dropdown.classList.add('active');
    }
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
}

/* ==========================================================================
   8. Cash on Delivery (COD) Real Checkout & Order Processing
   ========================================================================== */
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function displayCheckoutError(msg) {
  const banner = document.getElementById('checkout-error-banner');
  const text = document.getElementById('checkout-error-text');
  if (banner && text) {
    text.textContent = msg;
    banner.style.display = 'block';
  }
}

function clearCheckoutError() {
  const banner = document.getElementById('checkout-error-banner');
  if (banner) {
    banner.style.display = 'none';
  }
}

async function handleCheckoutSubmit(e) {
  e.preventDefault();
  clearCheckoutError();

  if (cart.length === 0) {
    const emptyMsg = 'السلة فارغة، يرجى إضافة منتجات قبل إتمام الطلب!';
    showToast(emptyMsg);
    displayCheckoutError(emptyMsg);
    return;
  }

  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim().replace(/[\s\-]+/g, '');
  const governorate = document.getElementById('checkout-governorate').value;
  const address = document.getElementById('checkout-address').value.trim();
  const submitBtn = document.getElementById('checkout-submit-btn');

  // التحقق الصارم من رقم الهاتف المصري (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015)
  const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;
  if (!egyptianPhoneRegex.test(phone)) {
    const phoneErrMsg = 'يرجى إدخال رقم هاتف مصري صحيح (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015)';
    showToast(phoneErrMsg);
    displayCheckoutError(phoneErrMsg);
    return;
  }

  // تعطيل الزر لمنع تكرار الإرسال وتوليد مفتاح منع التكرار
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إرسال الطلب وحجز المخزون بالخادم...';

  if (!currentCheckoutIdempotencyKey) {
    currentCheckoutIdempotencyKey = generateUUID();
  }

  const itemsPayload = cart.map(item => ({
    product_id: item.id,
    variant_id: item.variantId || null,
    quantity: item.qty
  }));

  try {
    const response = await fetch('/api/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': currentCheckoutIdempotencyKey
      },
      body: JSON.stringify({
        customer_name: name,
        customer_phone: phone,
        governorate: governorate,
        detailed_address: address,
        coupon_code: document.getElementById('coupon-input').value.trim() || null,
        payment_method: selectedPaymentMethod,
        items: itemsPayload,
        idempotency_key: currentCheckoutIdempotencyKey
      })
    });

    let result = null;
    try {
      result = await response.json();
    } catch (parseErr) {
      result = null;
    }

    if (response.ok && result && result.success && result.order_number) {
      // نجاح معتمد وحقيقي فقط من الخادم
      currentCheckoutIdempotencyKey = null; // إعادة تعيين المفتاح بعد النجاح المؤكد
      completeOrderSuccess(result.order_number, result.total_amount, name, phone, result.is_duplicate, selectedPaymentMethod);
    } else {
      // إظهار الخطأ الحقيقي الصادر من الخادم دون تزييف ودون تفريغ السلة
      const errorMsg = (result && (result.error || result.message)) ||
        (response.status === 404
          ? 'تعذر الوصول إلى نقطة معالجة الطلبات (/api/orders/create). يرجى التأكد من تشغيل وتكوين الخادم.'
          : 'فشل الخادم في اعتماد الطلب. يرجى التحقق من المدخلات والمحاولة مرة أخرى.');
      showToast(errorMsg);
      displayCheckoutError(errorMsg);
    }
  } catch (netErr) {
    // خطأ اتصال حقيقي
    const netErrMsg = 'تعذر الاتصال بالخادم لمعالجة طلبك. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
    console.error('Checkout error:', netErr);
    showToast(netErrMsg);
    displayCheckoutError(netErrMsg);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> تأكيد الطلب وشحن المنتجات';
  }
}

function completeOrderSuccess(orderNumber, totalAmount, name, phone, isDuplicate = false, paymentMethod = 'cod') {
  clearCheckoutError();
  document.getElementById('checkout-modal').classList.remove('active');
  cart = [];
  saveCart();
  updateCartUI();
  closeCartDrawer();

  const titleMsg = isDuplicate ? 'تم استلام هذا الطلب مسبقاً وهو قيد المتابعة' : 'تم استلام طلبك واعتماده بنجاح';
  
  let paymentInstructionMsg = 'سيتواصل معك فريق خدمة العملاء هاتفياً على رقمك (' + phone + ') لتأكيد الشحن، وسيتم سداد المبلغ نقداً عند استلام الشحنة من المندوب.';
  if (paymentMethod === 'vodafone_cash') {
    paymentInstructionMsg = 'يرجى تحويل المبلغ الإجمالي (' + formatPrice(totalAmount) + ') عبر فودافون كاش إلى المحفظة (' + VODAFONE_CASH_NUMBER + '). سيتواصل معك فريق خدمة العملاء هاتفياً على رقمك (' + phone + ') لمطابقة المعاملة قبل شحن الطلب.';
  } else if (paymentMethod === 'instapay') {
    paymentInstructionMsg = 'يرجى تحويل المبلغ الإجمالي (' + formatPrice(totalAmount) + ') عبر تطبيق إنستاباي إلى المعرف (' + INSTAPAY_ADDRESS + '). سيتواصل معك فريق خدمة العملاء على رقمك (' + phone + ') للتحقق من إشعار التحويل قبل تجهيز الشحنة.';
  }

  alert(`🎉 تهانينا يا ${name}!\n\n${titleMsg} برقم: #${orderNumber}\n\n${paymentInstructionMsg}`);
  showToast(`تم تأكيد طلبك برقم: #${orderNumber}`);
}

/* ==========================================================================
   9. Order Tracking (تتبع الشحنات)
   ========================================================================== */
function openTrackModal() {
  document.getElementById('track-order-modal').classList.add('active');
}

function closeTrackModal() {
  document.getElementById('track-order-modal').classList.remove('active');
}

async function handleTrackOrderSubmit(e) {
  e.preventDefault();
  const orderNum = document.getElementById('track-order-number').value.trim();
  const phone = document.getElementById('track-order-phone').value.trim().replace(/[\s\-]+/g, '');
  const btn = document.getElementById('track-submit-btn');
  const resultContainer = document.getElementById('track-result-container');

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري البحث...';
  resultContainer.style.display = 'none';

  try {
    const res = await fetch(`/api/orders/track?order_number=${encodeURIComponent(orderNum)}&phone=${encodeURIComponent(phone)}`);
    const data = await res.json();

    if (res.ok && data && data.success && data.order) {
      const o = data.order;
      const statusLabels = {
        pending: 'قيد المراجعة والتأكيد الهاتفي',
        confirmed: 'تم التأكيد وجاري التجهيز',
        processing: 'قيد التجهيز في المستودع',
        shipped: 'تم تسليم الشحنة لمندوب التوصيل',
        delivered: 'تم تسليم الطلب بنجاح',
        cancelled: 'تم إلغاء الطلب',
        returned: 'مرتجع'
      };

      resultContainer.innerHTML = `
        <div style="background: var(--bg-card); padding: 1.2rem; border-radius: var(--radius-sm); border: 1px solid var(--border-active);">
          <div style="font-weight: 800; color: var(--primary); font-size: 1.1rem; margin-bottom: 0.5rem;">طلبك رقم: ${o.order_number}</div>
          <div style="font-size: 0.9rem; margin-bottom: 0.3rem;"><strong>العميل:</strong> ${o.customer_name} (${o.governorate})</div>
          <div style="font-size: 0.9rem; margin-bottom: 0.3rem;"><strong>الإجمالي:</strong> ${formatPrice(o.total_amount)} (الدفع عند الاستلام)</div>
          <div style="margin-top: 0.8rem; padding: 0.5rem; background: var(--primary-light); border-radius: var(--radius-sm); color: var(--text-main); font-weight: 700;">
            <i class="fa-solid fa-truck"></i> الحالة: ${statusLabels[o.order_status] || o.order_status}
          </div>
        </div>
      `;
      resultContainer.style.display = 'block';
    } else {
      const errText = (data && data.error) || 'لم يتم العثور على أي طلب يطابق هذا الرقم مع رقم الهاتف المدخل.';
      resultContainer.innerHTML = `<div style="color: var(--danger); font-size: 0.9rem; padding: 0.5rem;"><i class="fa-solid fa-circle-exclamation"></i> ${errText}</div>`;
      resultContainer.style.display = 'block';
    }
  } catch (err) {
    resultContainer.innerHTML = `<div style="color: var(--danger); font-size: 0.9rem; padding: 0.5rem;"><i class="fa-solid fa-triangle-exclamation"></i> فشل الاتصال بخدمة التتبع. يرجى المحاولة لاحقاً.</div>`;
    resultContainer.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> استعلام عن الطلب';
  }
}

/* ==========================================================================
   10. Toast Notifications
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--primary);"></i> <span>${message}</span>`;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ==========================================================================
   11. Event Listeners Registration
   ========================================================================== */
function setupEventListeners() {
  // Theme Toggle
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Cart Drawer Toggles
  const cartBtn = document.getElementById('cart-toggle-btn');
  const mobileCartBtn = document.getElementById('mobile-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
  if (mobileCartBtn) mobileCartBtn.addEventListener('click', (e) => { e.preventDefault(); openCartDrawer(); });
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);

  // Wishlist Modal Toggles
  const wishlistBtn = document.getElementById('wishlist-btn');
  const closeWishlistBtn = document.getElementById('close-wishlist-modal');
  if (wishlistBtn) wishlistBtn.addEventListener('click', openWishlistModal);
  if (closeWishlistBtn) closeWishlistBtn.addEventListener('click', closeWishlistModal);

  // Track Order Modal Toggles
  const trackBtn = document.getElementById('track-order-btn');
  const mobileTrackBtn = document.getElementById('mobile-track-btn');
  const closeTrackBtn = document.getElementById('close-track-order-modal');
  if (trackBtn) trackBtn.addEventListener('click', openTrackModal);
  if (mobileTrackBtn) mobileTrackBtn.addEventListener('click', (e) => { e.preventDefault(); openTrackModal(); });
  if (closeTrackBtn) closeTrackBtn.addEventListener('click', closeTrackModal);

  // Categories Click
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const cat = card.dataset.category;
      currentCategory = cat;
      
      // Sync Filter Pills
      document.querySelectorAll('.pill-btn').forEach(btn => {
        if (btn.dataset.filter === cat) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      renderProducts();
    });
  });

  // Filter Pills
  document.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentCategory = btn.dataset.filter;

      // Sync Category Cards
      document.querySelectorAll('.category-card').forEach(c => {
        if (c.dataset.category === currentCategory) c.classList.add('active');
        else c.classList.remove('active');
      });

      renderProducts();
    });
  });

  // Sort Select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  // Coupon Code
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', () => {
      const code = document.getElementById('coupon-input').value.trim().toUpperCase();
      if (code === 'OFOQ10') {
        appliedDiscount = 0.10;
        showToast('تم تطبيق خصم 10% بنجاح!');
      } else if (code === 'EGYPT20') {
        appliedDiscount = 0.20;
        showToast('تم تطبيق خصم 20% بنجاح!');
      } else {
        appliedDiscount = 0;
        showToast('كود الخصم غير صحيح (جرب OFOQ10 أو EGYPT20)');
      }
      updateCartUI();
    });
  }

  // Quick View Modal Close
  const closeQVBtn = document.getElementById('close-quick-view');
  if (closeQVBtn) closeQVBtn.addEventListener('click', closeQuickView);

  // Checkout Modal Open/Close
  const openCheckoutBtn = document.getElementById('open-checkout-btn');
  const closeCheckoutBtn = document.getElementById('close-checkout-modal');
  if (openCheckoutBtn) {
    openCheckoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('السلة فارغة، يرجى إضافة منتجات قبل الشراء.');
        return;
      }
      clearCheckoutError();
      document.getElementById('checkout-modal').classList.add('active');
    });
  }
  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', () => {
      document.getElementById('checkout-modal').classList.remove('active');
    });
  }

  // Mobile Drawer Toggles
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const closeMobileDrawerBtn = document.getElementById('close-mobile-drawer');
  const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileDrawer);
  if (closeMobileDrawerBtn) closeMobileDrawerBtn.addEventListener('click', closeMobileDrawer);
  if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeMobileDrawer);

  // Close Drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileDrawer();
    }
  });

  setupSearch();
}

/* ==========================================================================
   12. Hero Slider Carousel Controller
   ========================================================================== */
function initHeroSlider() {
  const sliderEl = document.getElementById('hero-slider');
  if (!sliderEl) return;

  const slides = sliderEl.querySelectorAll('.slider-slide');
  if (!slides || slides.length === 0) return;

  const prevBtn = document.getElementById('slider-prev-btn');
  const nextBtn = document.getElementById('slider-next-btn');
  const dotsContainer = document.getElementById('slider-dots-container');

  // Build dots dynamically matching number of slides
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${idx === currentSlideIndex ? 'active' : ''}`;
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `الانتقال للحملة رقم ${idx + 1}`);
      dot.addEventListener('click', () => {
        showSlide(idx);
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function showSlide(index) {
    if (index < 0) {
      currentSlideIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentSlideIndex = 0;
    } else {
      currentSlideIndex = index;
    }

    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === currentSlideIndex);
    });

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((d, idx) => {
        d.classList.toggle('active', idx === currentSlideIndex);
      });
    }
  }

  function nextSlide() {
    showSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    showSlide(currentSlideIndex - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartAutoplay();
    });
  }

  // Autoplay with pause on hover/touch & prefers-reduced-motion check
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function startAutoplay() {
    if (prefersReducedMotion) return;
    if (slideIntervalTimer) clearInterval(slideIntervalTimer);
    slideIntervalTimer = setInterval(nextSlide, SLIDE_AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (slideIntervalTimer) {
      clearInterval(slideIntervalTimer);
      slideIntervalTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  sliderEl.addEventListener('mouseenter', stopAutoplay);
  sliderEl.addEventListener('mouseleave', startAutoplay);
  sliderEl.addEventListener('touchstart', stopAutoplay, { passive: true });
  sliderEl.addEventListener('touchend', startAutoplay, { passive: true });

  startAutoplay();
  window.showHeroSlide = showSlide;
}

/* ==========================================================================
   13. Mobile Navigation Drawer
   ========================================================================== */
function openMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}
window.openMobileDrawer = openMobileDrawer;
window.closeMobileDrawer = closeMobileDrawer;

/* ==========================================================================
   14. Category Quick Navigation & Filtering CTA
   ========================================================================== */
function filterAndScrollToCategory(catSlug) {
  currentCategory = catSlug;

  // Sync Category Cards in the grid
  document.querySelectorAll('.category-card').forEach(c => {
    c.classList.toggle('active', c.dataset.category === catSlug);
  });

  // Sync Filter Pills in the catalog section
  document.querySelectorAll('.pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === catSlug);
  });

  renderProducts();

  const productsSection = document.getElementById('products');
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' });
  }
}
window.filterAndScrollToCategory = filterAndScrollToCategory;

/* ==========================================================================
   15. Promotional Offers Grid (Real Discounts & Savings)
   ========================================================================== */
function renderOffers() {
  const container = document.getElementById('offers-grid');
  if (!container) return;

  const offerProducts = PRODUCTS.filter(p => p.oldPrice && p.oldPrice > p.price);
  if (offerProducts.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--text-muted);">
        <i class="fa-solid fa-tags" style="font-size: 2.5rem; margin-bottom: 0.8rem; opacity: 0.4;"></i>
        <p style="font-weight: 700;">ترقبوا عروضنا ومفاجآتنا الحصرية قريباً!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = offerProducts.map(p => {
    const discountPercent = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
    const savings = p.oldPrice - p.price;
    const isWishlisted = wishlist.includes(p.id);

    return `
      <div class="offer-card" onclick="quickViewProduct('${p.id}')">
        <div class="product-image-box">
          <span class="offer-badge"><i class="fa-solid fa-bolt"></i> خصم ${discountPercent}%</span>
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist('${p.id}')" title="إضافة للمفضلة">
            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <picture>
            <source srcset="${getOptimizedImageUrl(p.image)}" type="image/webp">
            <img src="${p.image}" alt="${p.title}" loading="lazy" width="1024" height="1024" />
          </picture>
          <div class="quick-view-overlay">
            <button class="btn-quick-view" onclick="event.stopPropagation(); quickViewProduct('${p.id}')">
              <i class="fa-solid fa-eye"></i> تفاصيل العرض
            </button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-brand-row">
            <span class="product-category">${p.categoryName}</span>
            <span class="offer-savings-tag">وفر ${formatPrice(savings)}</span>
          </div>
          <h3 class="product-title" style="margin-bottom: 0.6rem;">${p.title}</h3>
          <div class="product-bottom">
            <div class="price-container">
              <span class="current-price" style="color: var(--primary); font-size: 1.3rem;">${formatPrice(p.price)}</span>
              <span class="old-price">${formatPrice(p.oldPrice)}</span>
            </div>
            <button class="add-to-cart-btn" onclick="event.stopPropagation(); handleCardAddToCart('${p.id}')" title="اطلب العرض الآن">
              <i class="fa-solid fa-bag-shopping"></i>
              <span class="btn-text">اطلب العرض</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   16. Payment Method Selector (COD, Vodafone Cash, InstaPay)
   ========================================================================== */
function selectPaymentMethod(method) {
  const allowed = ['cod', 'vodafone_cash', 'instapay'];
  if (!allowed.includes(method)) return;

  selectedPaymentMethod = method;

  // Update card active states & radio button
  document.querySelectorAll('.payment-option-card').forEach(card => {
    const isSelected = card.dataset.method === method;
    card.classList.toggle('active', isSelected);
    const radio = card.querySelector('input[type="radio"]');
    if (radio) radio.checked = isSelected;
  });

  // Dynamic Instructions Box
  const box = document.getElementById('payment-details-box');
  if (!box) return;

  if (method === 'cod') {
    box.innerHTML = `
      <div style="font-weight: 700; color: var(--primary); margin-bottom: 0.3rem;"><i class="fa-solid fa-hand-holding-dollar"></i> تعليمات الدفع عند الاستلام (COD):</div>
      <div>تدفع القيمة نقداً بالجنيه المصري لمندوب شركة الشحن فور وصوله إلى عنوانك وبعد معاينة واستلام الشحنة.</div>
    `;
  } else if (method === 'vodafone_cash') {
    box.innerHTML = `
      <div style="font-weight: 700; color: #e60000; margin-bottom: 0.3rem;"><i class="fa-solid fa-mobile-screen-button"></i> تعليمات التحويل عبر فودافون كاش:</div>
      <div style="margin-bottom: 0.45rem;">يرجى تحويل المبلغ الإجمالي إلى رقم المحفظة المعتمد: <strong style="direction: ltr; display: inline-block; font-size: 1.05rem; color: #e60000; letter-spacing: 1px;">${VODAFONE_CASH_NUMBER}</strong></div>
      <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; padding: 0.5rem; background: rgba(230,0,0,0.06); border-radius: 4px; border-right: 3px solid #e60000;">
        <i class="fa-solid fa-circle-info"></i> <strong>تنبيه هام للعميل:</strong> يتم تسجيل الطلب بحالة <em>"بانتظار المراجعة والتحقق"</em>، وسيقوم فريق خدمة العملاء بالاتصال بك هاتفياً لمطابقة رقم المعاملة واسم المحول قبل شحن العطور.
      </div>
    `;
  } else if (method === 'instapay') {
    box.innerHTML = `
      <div style="font-weight: 700; color: #6366f1; margin-bottom: 0.3rem;"><i class="fa-solid fa-bolt-lightning"></i> تعليمات التحويل عبر تطبيق إنستاباي (InstaPay):</div>
      <div style="margin-bottom: 0.45rem;">يرجى التحويل إلى عنوان الدفع اللحظي (IPA): <strong style="direction: ltr; display: inline-block; font-size: 1.05rem; color: #6366f1; font-family: monospace;">${INSTAPAY_ADDRESS}</strong></div>
      <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; padding: 0.5rem; background: rgba(99,102,241,0.06); border-radius: 4px; border-right: 3px solid #6366f1;">
        <i class="fa-solid fa-circle-info"></i> <strong>تنبيه هام للعميل:</strong> يتم تسجيل الطلب بحالة <em>"بانتظار المراجعة والتحقق"</em>، وسيتواصل معك فريق خدمة العملاء هاتفياً للتحقق من إشعار التحويل البنكي وتأكيد تجهيز الشحنة.
      </div>
    `;
  }
}
window.selectPaymentMethod = selectPaymentMethod;

/* ==========================================================================
   17. WhatsApp Floating & Drawer Link Initializer
   ========================================================================== */
function initWhatsApp() {
  const waUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${STORE_WHATSAPP_DEFAULT_MSG}`;
  const floatBtn = document.getElementById('floating-whatsapp-btn');
  const drawerBtn = document.getElementById('drawer-whatsapp-btn');

  if (floatBtn) {
    floatBtn.href = waUrl;
  }
  if (drawerBtn) {
    drawerBtn.href = waUrl;
  }
}

// تصدير الدوال الأساسية للنافذة العامة لاستخدامها عبر سمات HTML
window.addToCart = addToCart;
window.handleCardAddToCart = handleCardAddToCart;
window.quickViewProduct = quickViewProduct;
window.openQuickView = quickViewProduct;
window.handleCheckoutSubmit = handleCheckoutSubmit;
window.handleTrackOrderSubmit = handleTrackOrderSubmit;
window.openWishlistModal = openWishlistModal;
window.closeWishlistModal = closeWishlistModal;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
