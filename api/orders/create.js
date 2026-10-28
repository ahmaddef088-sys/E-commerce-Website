// ==========================================================================
// Vercel Serverless Function: /api/orders/create
// Creates a Cash-on-Delivery (COD) order securely via Supabase RPC
// Enforces server-side validation, idempotency, and atomic inventory safety
// ==========================================================================

module.exports = async function handler(req, res) {
  // تفعيل CORS للسماح بالطلبات من الواجهة الأمامية
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Idempotency-Key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'طريقة الطلب غير مسموح بها. استخدم POST.' });
  }

  const {
    customer_name,
    customer_phone,
    customer_email,
    governorate,
    detailed_address,
    order_notes,
    coupon_code,
    items,
    idempotency_key,
    payment_method
  } = req.body || {};

  // 1. التحقق من الحقول الإجبارية
  if (!customer_name || !customer_phone || !governorate || !detailed_address) {
    return res.status(400).json({
      success: false,
      error: 'يرجى استكمال جميع بيانات العميل (الاسم، رقم الهاتف المصري، المحافظة، العنوان بالتفصيل).'
    });
  }

  // 2. التحقق من تنسيق رقم الهاتف المصري (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015)
  const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;
  const cleanPhone = String(customer_phone).trim().replace(/[\s\-]+/g, '');
  if (!egyptianPhoneRegex.test(cleanPhone)) {
    return res.status(400).json({
      success: false,
      error: 'رقم الهاتف غير صحيح. يجب أن يكون رقماً مصرياً مكوناً من 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015.'
    });
  }

  // 3. التحقق من وجود عناصر صالحة في السلة والكميات
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'سلة المشتريات فارغة. يرجى إضافة منتجات قبل إتمام الطلب.'
    });
  }

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!it || !it.product_id) {
      return res.status(400).json({
        success: false,
        error: `المنتج رقم ${i + 1} في السلة غير صالح أو غير محدد.`
      });
    }
    const q = Number(it.quantity);
    if (!Number.isInteger(q) || q <= 0) {
      return res.status(400).json({
        success: false,
        error: `الكمية المطلوبة للمنتج يجب أن تكون رقماً صحيحاً موجباً (1 على الأقل).`
      });
    }
  }

  // 4. فحص طريقة الدفع (COD أو فودافون كاش أو إنستاباي)
  const validPaymentMethods = ['cod', 'vodafone_cash', 'instapay'];
  const sanitizedPaymentMethod = (payment_method && validPaymentMethods.includes(String(payment_method).toLowerCase()))
    ? String(payment_method).toLowerCase()
    : 'cod';

  let finalOrderNotes = order_notes ? String(order_notes).trim() : '';
  if (sanitizedPaymentMethod === 'vodafone_cash') {
    finalOrderNotes = `[وسيلة الدفع: فودافون كاش - بانتظار التأكيد الهاتفي] ${finalOrderNotes}`.trim();
  } else if (sanitizedPaymentMethod === 'instapay') {
    finalOrderNotes = `[وسيلة الدفع: إنستاباي InstaPay - بانتظار التأكيد الهاتفي] ${finalOrderNotes}`.trim();
  }

  // 5. فحص مفتاح عدم التكرار (Idempotency Key)
  const headerIdempKey = req.headers['idempotency-key'];
  const finalIdempotencyKey = (idempotency_key || headerIdempKey) 
    ? String(idempotency_key || headerIdempKey).trim().substring(0, 100) 
    : null;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      success: false,
      error: 'تكوين الخادم الخلفي لـ Supabase غير مكتمل في المتغيرات البيئية.'
    });
  }

  try {
    // 6. استدعاء الدالة الذرية create_cod_order في Supabase (تنفيذ آمن في PostgreSQL)
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/create_cod_order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        p_customer_name: String(customer_name).trim(),
        p_customer_phone: cleanPhone,
        p_customer_email: customer_email ? String(customer_email).trim() : null,
        p_governorate: String(governorate).trim(),
        p_detailed_address: String(detailed_address).trim(),
        p_order_notes: finalOrderNotes || null,
        p_coupon_code: coupon_code ? String(coupon_code).trim() : null,
        p_items: items.map(it => ({
          product_id: String(it.product_id),
          variant_id: it.variant_id ? String(it.variant_id) : null,
          quantity: parseInt(it.quantity, 10)
        })),
        p_idempotency_key: finalIdempotencyKey,
        p_payment_method: sanitizedPaymentMethod
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = (data && (data.message || data.error || data.details)) || 'حدث خطأ أثناء معالجة الطلب في قاعدة البيانات.';
      return res.status(400).json({ success: false, error: errorMsg });
    }

    if (data && data.success) {
      return res.status(200).json(data);
    } else {
      return res.status(400).json({
        success: false,
        error: (data && data.message) || 'تعذر تأكيد الطلب.'
      });
    }
  } catch (err) {
    console.error('Server error creating order:', err);
    return res.status(502).json({
      success: false,
      error: 'فشل الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى لاحقاً.'
    });
  }
};
