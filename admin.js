/* ==========================================================================
   أفق | OFOQ Luxury Store - Admin Dashboard Logic
   Secure Management for Orders, Stock & Products using Supabase
   ========================================================================== */

// 1. تكوين اتصال Supabase (يتم تعيين القيم من مشروع Supabase الخاص بك)
// يمكن تخزينها في localStorage للتجربة السريعة أو تعيينها كثوابت
const SUPABASE_CONFIG = {
  url: localStorage.getItem('ofoq_supabase_url') || window.ENV_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: localStorage.getItem('ofoq_supabase_anon_key') || window.ENV_SUPABASE_ANON_KEY || 'your-anon-key'
};

let supabaseClient = null;
if (window.supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && SUPABASE_CONFIG.url !== 'https://your-project.supabase.co') {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  } catch (e) {
    console.error('Supabase initialization error:', e);
  }
}

// حالة التطبيق الإدارية
let allOrders = [];
let allProducts = [];
let currentFilterStatus = 'all';
let selectedOrderId = null;

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  checkSupabaseConnection();
  setupAdminEvents();
});

// 2. التحقق من الاتصال والمصادقة
async function checkSupabaseConnection() {
  if (!supabaseClient) {
    try {
      const cfgRes = await fetch('/api/config');
      if (cfgRes.ok) {
        const cfg = await cfgRes.json();
        if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
          supabaseClient = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (!supabaseClient) {
    promptForSupabaseConfig();
    return;
  }

  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session && session.user) {
    verifyAdminRole(session.user);
  } else {
    showLoginView();
  }

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (session && session.user) {
      verifyAdminRole(session.user);
    } else {
      showLoginView();
    }
  });
}

function promptForSupabaseConfig() {
  const currentUrl = localStorage.getItem('ofoq_supabase_url') || '';
  const currentKey = localStorage.getItem('ofoq_supabase_anon_key') || '';
  
  if (!currentUrl || !currentKey) {
    const url = prompt('يرجى إدخال Supabase Project URL الخاص بك:', currentUrl);
    const key = prompt('يرجى إدخال Supabase Anon Key الخاص بك:', currentKey);
    if (url && key) {
      localStorage.setItem('ofoq_supabase_url', url.trim());
      localStorage.setItem('ofoq_supabase_anon_key', key.trim());
      location.reload();
    }
  }
}

async function verifyAdminRole(user) {
  try {
    // التحقق من صلاحية المدير في جدول admin_profiles
    const { data, error } = await supabaseClient
      .from('admin_profiles')
      .select('role, full_name')
      .eq('user_id', user.id)
      .single();

    if (error || !data || !['super_admin', 'admin'].includes(data.role)) {
      showToast('حسابك غير مصرح له بالدخول للوحة الإدارة.');
      await supabaseClient.auth.signOut();
      showLoginView();
      return;
    }

    showDashboardView();
    loadDashboardData();
  } catch (err) {
    console.error('Verify admin error:', err);
    showLoginView();
  }
}

function showLoginView() {
  document.getElementById('login-section').style.display = 'flex';
  document.getElementById('dashboard-content').style.display = 'none';
  document.getElementById('admin-logout-btn').style.display = 'none';
}

function showDashboardView() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('dashboard-content').style.display = 'block';
  document.getElementById('admin-logout-btn').style.display = 'inline-flex';
}

// 3. معالجة تسجيل الدخول
async function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;
  const submitBtn = document.getElementById('login-submit-btn');

  if (!supabaseClient) {
    alert('يرجى ضبط بيانات ربط Supabase أولاً.');
    promptForSupabaseConfig();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التحقق...';

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      showToast(error.message || 'فشل تسجيل الدخول، تأكد من صحة البريد وكلمة المرور.');
    } else if (data && data.user) {
      await verifyAdminRole(data.user);
    }
  } catch (err) {
    showToast('حدث خطأ غير متوقع أثناء تسجيل الدخول.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> تسجيل الدخول';
  }
}

// 4. تحميل وعرض بيانات لوحة التحكم
async function loadDashboardData() {
  await Promise.all([loadOrders(), loadProducts()]);
}

async function loadOrders() {
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    allOrders = data || [];
    renderStats();
    renderOrders();
  } catch (err) {
    console.error('Error fetching orders:', err);
    document.getElementById('orders-table-body').innerHTML = `
      <tr><td colspan="9" style="text-align: center; color: var(--danger); padding: 1.5rem;">فشل تحميل الطلبات: ${err.message}</td></tr>
    `;
  }
}

async function loadProducts() {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    allProducts = data || [];
    renderProducts();
  } catch (err) {
    console.error('Error fetching products:', err);
  }
}

// 5. تحديث الإحصائيات
function renderStats() {
  const total = allOrders.length;
  const pending = allOrders.filter(o => o.order_status === 'pending').length;
  const delivered = allOrders.filter(o => o.order_status === 'delivered').length;
  const revenue = allOrders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  document.getElementById('stat-total-orders').textContent = total;
  document.getElementById('stat-pending-orders').textContent = pending;
  document.getElementById('stat-delivered-orders').textContent = delivered;
  document.getElementById('stat-total-revenue').textContent = `${revenue.toLocaleString('ar-EG')} ج.م`;
}

// 6. عرض جدول الطلبات
function renderOrders() {
  const tbody = document.getElementById('orders-table-body');
  if (!tbody) return;

  let filtered = [...allOrders];
  if (currentFilterStatus !== 'all') {
    filtered = filtered.filter(o => o.order_status === currentFilterStatus);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">لا توجد طلبات تطابق هذا التصنيف حالياً.</td></tr>
    `;
    return;
  }

  const statusMap = {
    pending: { label: 'قيد الانتظار', class: 'status-pending' },
    confirmed: { label: 'تم التأكيد', class: 'status-confirmed' },
    processing: { label: 'جاري التجهيز', class: 'status-confirmed' },
    shipped: { label: 'تم الشحن', class: 'status-shipped' },
    delivered: { label: 'تم التسليم', class: 'status-delivered' },
    cancelled: { label: 'ملغي', class: 'status-cancelled' },
    returned: { label: 'مرتجع', class: 'status-cancelled' }
  };

  tbody.innerHTML = filtered.map(order => {
    const st = statusMap[order.order_status] || { label: order.order_status, class: 'status-pending' };
    const dateFormatted = new Date(order.created_at).toLocaleDateString('ar-EG', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

    const isPaid = order.payment_status === 'paid';
    const payMethodLabels = {
      cod: 'الدفع عند الاستلام (COD)',
      vodafone_cash: 'فودافون كاش (Vodafone)',
      instapay: 'إنستاباي (InstaPay)',
      COD: 'الدفع عند الاستلام (COD)'
    };
    const pMethod = payMethodLabels[order.payment_method] || order.payment_method || 'COD';

    return `
      <tr>
        <td style="font-weight: 800; color: var(--primary);">${order.order_number}</td>
        <td style="font-weight: 700;">${order.customer_name}</td>
        <td dir="ltr" style="text-align: right;"><a href="tel:${order.customer_phone}" style="color: var(--primary);">${order.customer_phone}</a></td>
        <td>${order.governorate}</td>
        <td style="font-weight: 800;">${parseFloat(order.total_amount).toLocaleString('ar-EG')} ج.م</td>
        <td>
          <span class="${isPaid ? 'pay-paid' : 'pay-unpaid'}">
            ${isPaid ? '✓ تم التحصيل' : '⏳ لم يُحصل بعد'}
          </span>
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">${pMethod}</span>
        </td>
        <td><span class="status-badge ${st.class}">${st.label}</span></td>
        <td style="font-size: 0.8rem; color: var(--text-muted);">${dateFormatted}</td>
        <td>
          <button class="action-btn-sm" onclick="openOrderModal('${order.id}')">
            <i class="fa-solid fa-pen-to-square"></i> تعديل
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 7. عرض جدول المنتجات
function renderProducts() {
  const tbody = document.getElementById('products-table-body');
  if (!tbody) return;

  if (allProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem;">لا توجد منتجات مسجلة.</td></tr>`;
    return;
  }

  tbody.innerHTML = allProducts.map(prod => `
    <tr>
      <td><img src="${prod.image_url}" alt="${prod.title}" style="width: 44px; height: 44px; object-fit: cover; border-radius: var(--radius-sm);" /></td>
      <td style="font-weight: 700;">${prod.title}</td>
      <td style="font-weight: 800; color: var(--primary);">${parseFloat(prod.price).toLocaleString('ar-EG')} ج.م</td>
      <td style="color: var(--text-muted);">${prod.old_price ? `${parseFloat(prod.old_price).toLocaleString('ar-EG')} ج.م` : '-'}</td>
      <td>
        <span style="font-weight: 800; color: ${prod.stock_quantity < 5 ? 'var(--danger)' : 'var(--accent)'};">
          ${prod.stock_quantity} قطعة
        </span>
      </td>
      <td>
        <span class="status-badge ${prod.is_active ? 'status-delivered' : 'status-cancelled'}">
          ${prod.is_active ? 'نشط' : 'معطل'}
        </span>
      </td>
      <td>
        <button class="action-btn-sm" onclick="quickEditStock('${prod.id}', ${prod.stock_quantity})">
          <i class="fa-solid fa-boxes-stacked"></i> تعديل المخزون
        </button>
      </td>
    </tr>
  `).join('');
}

// 8. تعديل حالة الطلب
function openOrderModal(orderId) {
  selectedOrderId = orderId;
  const order = allOrders.find(o => o.id === orderId);
  if (!order) return;

  const payMethodLabels = {
    cod: 'الدفع عند الاستلام (COD)',
    vodafone_cash: 'فودافون كاش (Vodafone Cash)',
    instapay: 'إنستاباي (InstaPay)',
    COD: 'الدفع عند الاستلام (COD)'
  };
  const pMethod = payMethodLabels[order.payment_method] || order.payment_method || 'COD';
  document.getElementById('modal-order-number').textContent = `الطلب: #${order.order_number} - العميل: ${order.customer_name} [${pMethod}]`;
  document.getElementById('modal-order-status').value = order.order_status;
  document.getElementById('modal-payment-status').value = order.payment_status;

  document.getElementById('update-order-modal').classList.add('active');
}

function closeOrderModal() {
  document.getElementById('update-order-modal').classList.remove('active');
  selectedOrderId = null;
}

async function saveOrderStatus() {
  if (!selectedOrderId || !supabaseClient) return;

  const newOrderStatus = document.getElementById('modal-order-status').value;
  const newPaymentStatus = document.getElementById('modal-payment-status').value;
  const saveBtn = document.getElementById('save-status-btn');

  saveBtn.disabled = true;
  saveBtn.textContent = 'جاري الحفظ...';

  try {
    if (newOrderStatus === 'cancelled') {
      // استخدام إجراء الإلغاء الذري واستعادة المخزون
      const { data: cancelResult, error: cancelErr } = await supabaseClient
        .rpc('cancel_order_and_restore_stock', { p_order_id: selectedOrderId });

      if (cancelErr) throw cancelErr;

      // تحديث حالة الدفع إذا لزم الأمر
      await supabaseClient
        .from('orders')
        .update({ payment_status: newPaymentStatus, updated_at: new Date().toISOString() })
        .eq('id', selectedOrderId);

      showToast('تم إلغاء الطلب واسترجاع كميات المخزون المحجوزة تلقائياً بنجاح.');
    } else {
      const { error } = await supabaseClient
        .from('orders')
        .update({
          order_status: newOrderStatus,
          payment_status: newPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedOrderId);

      if (error) throw error;
      showToast('تم تحديث حالة الطلب بنجاح.');
    }

    closeOrderModal();
    await loadOrders();
    await loadProducts();
  } catch (err) {
    showToast(`فشل التحديث: ${err.message}`);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'حفظ التغييرات';
  }
}

// 9. تعديل مخزون منتج سريعاً
async function quickEditStock(productId, currentStock) {
  const newStock = prompt('أدخل كمية المخزون الجديدة:', currentStock);
  if (newStock === null || isNaN(newStock) || parseInt(newStock) < 0) return;

  try {
    const { error } = await supabaseClient
      .from('products')
      .update({ stock_quantity: parseInt(newStock), updated_at: new Date().toISOString() })
      .eq('id', productId);

    if (error) throw error;

    showToast('تم تحديث المخزون بنجاح.');
    await loadProducts();
  } catch (err) {
    showToast(`فشل تعديل المخزون: ${err.message}`);
  }
}

// 10. إعداد المستمعين للأحداث
function setupAdminEvents() {
  // أزرار تصفية الطلبات
  document.querySelectorAll('#order-filter-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#order-filter-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilterStatus = btn.dataset.status;
      renderOrders();
    });
  });

  // تسجيل الخروج
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (supabaseClient) {
        await supabaseClient.auth.signOut();
      }
      showToast('تم تسجيل الخروج بنجاح.');
      showLoginView();
    });
  }

  // حفظ حالة الطلب من المودال
  const saveBtn = document.getElementById('save-status-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveOrderStatus);
  }
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<i class="fa-solid fa-circle-info" style="color: var(--primary);"></i> <span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

