const fs = require('fs');
const path = require('path');
const createHandler = require('c:/Users/dell/Desktop/متجر الاكتروني/api/orders/create.js');
const trackHandler = require('c:/Users/dell/Desktop/متجر الاكتروني/api/orders/track.js');

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader: function(k, v) { this.headers[k] = v; },
    status: function(code) { this.statusCode = code; return this; },
    json: function(data) { this.body = data; return this; },
    end: function() { return this; }
  };
  return res;
}

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    console.error(`  [FAIL] ${testName} - ${details}`);
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('  PHASE 1 LOCAL INTEGRITY & SECURITY UNIT TEST SUITE');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // 1. API: HTTP Method Enforcement
  // ---------------------------------------------------------------------------
  console.log('Test Group 1: HTTP Method Enforcement');
  for (const method of ['GET', 'PUT', 'DELETE', 'PATCH']) {
    const res = mockRes();
    await createHandler({ method, headers: {} }, res);
    assert(res.statusCode === 405, `Reject ${method} with 405 Method Not Allowed`, `got ${res.statusCode}`);
  }

  // ---------------------------------------------------------------------------
  // 2. API: Required Customer & Address Fields
  // ---------------------------------------------------------------------------
  console.log('\nTest Group 2: Customer & Address Field Validation');
  const requiredFields = ['customer_name', 'customer_phone', 'governorate', 'detailed_address'];
  for (const field of requiredFields) {
    const payload = {
      customer_name: 'أحمد محمود',
      customer_phone: '01012345678',
      governorate: 'القاهرة',
      detailed_address: 'شارع النصر',
      items: [{ product_id: 'p1', quantity: 1 }]
    };
    delete payload[field];
    const res = mockRes();
    await createHandler({ method: 'POST', body: payload, headers: {} }, res);
    assert(res.statusCode === 400 && res.body.success === false, `Reject missing '${field}' with 400`, `got ${res.statusCode}`);
  }

  // ---------------------------------------------------------------------------
  // 3. API: Egyptian Phone Number Validation
  // ---------------------------------------------------------------------------
  console.log('\nTest Group 3: Egyptian Phone Number Format (11 digits, prefixes: 010, 011, 012, 015)');
  const invalidPhones = ['01912345678', '01312345678', '05012345678', '010123456', '010123456789', 'abcdefghijk', ''];
  for (const phone of invalidPhones) {
    const res = mockRes();
    await createHandler({
      method: 'POST',
      body: {
        customer_name: 'علي مصطفى',
        customer_phone: phone,
        governorate: 'الجيزة',
        detailed_address: 'الدقي',
        items: [{ product_id: 'p1', quantity: 1 }]
      },
      headers: {}
    }, res);
    assert(res.statusCode === 400 && res.body.error.includes('رقم الهاتف'), `Reject invalid phone '${phone}' with 400`, `got ${res.statusCode}`);
  }

  // ---------------------------------------------------------------------------
  // 4. API: Cart Items, Quantities & Injections
  // ---------------------------------------------------------------------------
  console.log('\nTest Group 4: Cart Items & Quantity Integrity');
  const invalidItemCases = [
    { label: 'Non-array items', items: 'invalid-string' },
    { label: 'Empty items array', items: [] },
    { label: 'Missing product_id', items: [{ quantity: 1 }] },
    { label: 'Zero quantity', items: [{ product_id: 'p1', quantity: 0 }] },
    { label: 'Negative quantity', items: [{ product_id: 'p1', quantity: -2 }] },
    { label: 'Fractional quantity', items: [{ product_id: 'p1', quantity: 1.5 }] },
    { label: 'String quantity', items: [{ product_id: 'p1', quantity: 'two' }] }
  ];

  for (const tc of invalidItemCases) {
    const res = mockRes();
    await createHandler({
      method: 'POST',
      body: {
        customer_name: 'علي مصطفى',
        customer_phone: '01012345678',
        governorate: 'الجيزة',
        detailed_address: 'الدقي',
        items: tc.items
      },
      headers: {}
    }, res);
    assert(res.statusCode === 400 && res.body.success === false, `Reject: ${tc.label} with 400`, `got ${res.statusCode}`);
  }

  // ---------------------------------------------------------------------------
  // 5. API: Server Environment Guard
  // ---------------------------------------------------------------------------
  console.log('\nTest Group 5: Environment Variables Security');
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;
  const envRes = mockRes();
  await createHandler({
    method: 'POST',
    body: {
      customer_name: 'علي مصطفى',
      customer_phone: '01012345678',
      governorate: 'الجيزة',
      detailed_address: 'الدقي',
      items: [{ product_id: 'p1', quantity: 1 }]
    },
    headers: {}
  }, envRes);
  assert(envRes.statusCode === 500 && envRes.body.error.includes('المتغيرات البيئية'), 'Safely return 500 when Supabase env vars are missing', `got ${envRes.statusCode}`);

  // ---------------------------------------------------------------------------
  // 6. API: Idempotency Key & Mock Supabase Responses
  // ---------------------------------------------------------------------------
  console.log('\nTest Group 6: Idempotency Key Propagation & Mock Backend Integration');
  process.env.SUPABASE_URL = 'https://mock-project.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-key';

  const originalFetch = global.fetch;
  let interceptedRpcBody = null;

  // Mock global.fetch to intercept RPC call
  global.fetch = async (url, opts) => {
    interceptedRpcBody = JSON.parse(opts.body);
    
    // Simulate Supabase response based on payload
    if (interceptedRpcBody.p_idempotency_key === 'duplicate-key-123') {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          order_number: 'OFQ-2610-01001',
          customer_name: 'محمود',
          total_amount: 1495.00,
          shipping_fee: 45.00,
          status: 'pending',
          is_duplicate: true
        })
      };
    }

    if (interceptedRpcBody.p_items[0].product_id === 'out-of-stock-id') {
      return {
        ok: false,
        status: 400,
        json: async () => ({
          message: 'الكمية المتاحة من المنتج هي 0 فقط'
        })
      };
    }

    return {
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        order_number: 'OFQ-2610-01002',
        customer_name: interceptedRpcBody.p_customer_name,
        total_amount: 1495.00,
        shipping_fee: 45.00,
        status: 'pending',
        message: 'تم استلام طلبك بنجاح'
      })
    };
  };

  // Test 6.1: Normal Order
  const normalRes = mockRes();
  await createHandler({
    method: 'POST',
    body: {
      customer_name: 'محمود حسن',
      customer_phone: '01123456789',
      governorate: 'القاهرة',
      detailed_address: 'المعادي',
      idempotency_key: 'custom-uuid-key-001',
      items: [{ product_id: 'prod-001', quantity: 2 }]
    },
    headers: {}
  }, normalRes);
  assert(normalRes.statusCode === 200 && normalRes.body.success === true, 'Successful order creation returns 200 and order_number');
  assert(interceptedRpcBody && interceptedRpcBody.p_idempotency_key === 'custom-uuid-key-001', 'Idempotency key successfully forwarded to PostgreSQL RPC');
  assert(interceptedRpcBody.p_items[0].quantity === 2, 'Quantity sanitized and sent to RPC');

  // Test 6.2: Duplicate submission with repeated idempotency key
  const dupRes = mockRes();
  await createHandler({
    method: 'POST',
    body: {
      customer_name: 'محمود حسن',
      customer_phone: '01123456789',
      governorate: 'القاهرة',
      detailed_address: 'المعادي',
      idempotency_key: 'duplicate-key-123',
      items: [{ product_id: 'prod-001', quantity: 2 }]
    },
    headers: {}
  }, dupRes);
  assert(dupRes.statusCode === 200 && dupRes.body.is_duplicate === true, 'Duplicate idempotency key safely returns existing order without creating new order');

  // Test 6.3: Insufficient stock error from PostgreSQL
  const stockRes = mockRes();
  await createHandler({
    method: 'POST',
    body: {
      customer_name: 'محمود حسن',
      customer_phone: '01123456789',
      governorate: 'القاهرة',
      detailed_address: 'المعادي',
      items: [{ product_id: 'out-of-stock-id', quantity: 5 }]
    },
    headers: {}
  }, stockRes);
  assert(stockRes.statusCode === 400 && stockRes.body.error.includes('الكمية المتاحة'), 'PostgreSQL out-of-stock exception propagated cleanly as 400 to client');

  // Restore fetch
  global.fetch = originalFetch;

  // ---------------------------------------------------------------------------
  // 7. Client Code Integrity Check (No Fake Success, No Local Storage Fallback)
  // ---------------------------------------------------------------------------
  console.log('\nTest Group 7: Frontend Code Verification (No Fake Fallback)');
  const scriptContent = fs.readFileSync('c:/Users/dell/Desktop/متجر الاكتروني/script.js', 'utf8');
  const indexContent = fs.readFileSync('c:/Users/dell/Desktop/متجر الاكتروني/index.html', 'utf8');

  assert(!scriptContent.includes('saveLocalOrderRecord'), 'saveLocalOrderRecord completely removed from script.js');
  assert(!scriptContent.includes('ofoq_local_orders'), 'ofoq_local_orders completely removed from script.js');
  assert(scriptContent.includes('currentCheckoutIdempotencyKey'), 'Idempotency key tracking present in script.js');
  assert(scriptContent.includes('submitBtn.disabled = true'), 'Submit button disabled on submission in script.js');
  assert(indexContent.includes('id="checkout-error-banner"'), 'Error banner container present in index.html checkout modal');

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`  ALL TESTS COMPLETED: ${passedTests}/${totalTests} PASSED`);
  console.log('================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
