// ==========================================================================
// Vercel Serverless Function: /api/orders/track
// Allows a customer to track their COD order safely using order_number & phone
// ==========================================================================

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const order_number = req.query.order_number || (req.body && req.body.order_number);
  const phone = req.query.phone || (req.body && req.body.phone);

  if (!order_number || !phone) {
    return res.status(400).json({
      success: false,
      error: 'يرجى تقديم رقم الطلب ورقم الهاتف المسجل للاستعلام.'
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: 'تكوين الخادم الخلفي غير مكتمل.' });
  }

  try {
    const cleanPhone = String(phone).trim().replace(/\s+/g, '');
    const cleanOrderNum = String(order_number).trim().toUpperCase();

    const queryUrl = `${supabaseUrl}/rest/v1/orders?select=id,order_number,customer_name,governorate,total_amount,payment_method,payment_status,order_status,created_at,order_items(product_title,variant_name,quantity,total_price)&order_number=eq.${encodeURIComponent(cleanOrderNum)}&customer_phone=eq.${encodeURIComponent(cleanPhone)}&limit=1`;

    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    const orders = await response.json();

    if (!response.ok || !Array.isArray(orders) || orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'لم يتم العثور على أي طلب يطابق هذا الرقم مع رقم الهاتف المدخل.'
      });
    }

    const order = orders[0];
    return res.status(200).json({
      success: true,
      order: {
        order_number: order.order_number,
        customer_name: order.customer_name,
        governorate: order.governorate,
        total_amount: order.total_amount,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        order_status: order.order_status,
        created_at: order.created_at,
        items: order.order_items
      }
    });
  } catch (err) {
    console.error('Track order error:', err);
    return res.status(500).json({ success: false, error: 'حدث خطأ أثناء معالجة الاستعلام.' });
  }
};

