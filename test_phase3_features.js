/**
 * test_phase3_features.js
 * Verification test suite for Homepage enhancements, WhatsApp, Payment methods,
 * Admin portal, and Database procedures.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`);
  }
}

console.log('================================================================');
console.log('  PHASE 3 ENHANCEMENTS & COMPREHENSIVE REGRESSION TEST SUITE');
console.log('================================================================\n');

// Read files
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const scriptJs = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf-8');
const styleCss = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf-8');
const adminJs = fs.readFileSync(path.join(__dirname, 'admin.js'), 'utf-8');
const apiCreateOrderJs = fs.readFileSync(path.join(__dirname, 'api', 'orders', 'create.js'), 'utf-8');
const schemaSql = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf-8');

console.log('Test Group 1: Continuous Announcement Marquee');
runTest('Continuous announcement marquee HTML exists', () => {
  assert(indexHtml.includes('announcement-marquee'), 'announcement-marquee class missing from index.html');
  assert(indexHtml.includes('announcement-group'), 'announcement-group container missing from index.html');
});
runTest('Marquee animation CSS with pause on hover exists', () => {
  assert(styleCss.includes('@keyframes marqueeScroll'), 'marqueeScroll keyframes missing in style.css');
  assert(styleCss.includes('animation-play-state: paused'), 'hover pause missing for marquee in style.css');
});

console.log('\nTest Group 2: Hero Slider Carousel (3 Campaigns, Autoplay & Controls)');
runTest('Hero slider HTML container and 3 campaign slides exist', () => {
  assert(indexHtml.includes('id="hero-slider"'), '#hero-slider missing from index.html');
  assert(indexHtml.includes('id="slider-prev-btn"'), '#slider-prev-btn missing');
  assert(indexHtml.includes('id="slider-next-btn"'), '#slider-next-btn missing');
  assert(indexHtml.includes('id="slider-dots-container"'), '#slider-dots-container missing');
  const slideMatches = indexHtml.match(/class="slider-slide/g);
  assert(slideMatches && slideMatches.length >= 3, `Expected at least 3 slides, found ${slideMatches ? slideMatches.length : 0}`);
});
runTest('Hero slider JavaScript controller exists with autoplay and reduced-motion check', () => {
  assert(scriptJs.includes('function initHeroSlider()'), 'initHeroSlider function missing');
  assert(scriptJs.includes('SLIDE_AUTOPLAY_DELAY'), 'SLIDE_AUTOPLAY_DELAY constant missing');
  assert(scriptJs.includes('prefers-reduced-motion'), 'prefers-reduced-motion check missing from script.js');
  assert(scriptJs.includes('sliderEl.addEventListener(\'mouseenter\''), 'pause on hover missing from script.js');
});

console.log('\nTest Group 3: Mobile Navigation Drawer');
runTest('Mobile hamburger button and drawer HTML exist', () => {
  assert(indexHtml.includes('id="mobile-menu-toggle"'), '#mobile-menu-toggle button missing');
  assert(indexHtml.includes('id="mobile-drawer"'), '#mobile-drawer container missing');
  assert(indexHtml.includes('id="mobile-drawer-overlay"'), '#mobile-drawer-overlay missing');
  assert(indexHtml.includes('id="close-mobile-drawer"'), '#close-mobile-drawer missing');
});
runTest('Mobile drawer JavaScript functions and ESC handler exist', () => {
  assert(scriptJs.includes('function openMobileDrawer()'), 'openMobileDrawer missing');
  assert(scriptJs.includes('function closeMobileDrawer()'), 'closeMobileDrawer missing');
  assert(scriptJs.includes('window.openMobileDrawer = openMobileDrawer'), 'openMobileDrawer not exposed to window');
  assert(scriptJs.includes('window.closeMobileDrawer = closeMobileDrawer'), 'closeMobileDrawer not exposed to window');
  assert(scriptJs.includes('e.key === \'Escape\''), 'Escape key listener missing');
});

console.log('\nTest Group 4: Dedicated Men\'s and Women\'s Collection Sections');
runTest('Men\'s collection section exists with anchor #mens-collection and CTA', () => {
  assert(indexHtml.includes('id="mens-collection"'), '#mens-collection section missing');
  assert(indexHtml.includes('filterAndScrollToCategory(\'men\')'), 'Men CTA action missing');
  assert(indexHtml.includes('assets/images/perfume_noir_amber.png'), 'Men featured image missing');
});
runTest('Women\'s collection section exists with anchor #womens-collection and CTA', () => {
  assert(indexHtml.includes('id="womens-collection"'), '#womens-collection section missing');
  assert(indexHtml.includes('filterAndScrollToCategory(\'women\')'), 'Women CTA action missing');
  assert(indexHtml.includes('assets/images/perfume_rose_silk.png'), 'Women featured image missing');
});
runTest('Category filter CTA function exists in script.js', () => {
  assert(scriptJs.includes('function filterAndScrollToCategory(catSlug)'), 'filterAndScrollToCategory missing');
  assert(scriptJs.includes('window.filterAndScrollToCategory = filterAndScrollToCategory'), 'filterAndScrollToCategory not exposed to window');
});

console.log('\nTest Group 5: Promotional Offers Grid (Real Discounts & Savings)');
runTest('Promotional offers section and grid container exist in index.html', () => {
  assert(indexHtml.includes('id="offers"'), '#offers section missing');
  assert(indexHtml.includes('id="offers-grid"'), '#offers-grid container missing');
});
runTest('renderOffers() calculates real discount percent and savings in EGP', () => {
  assert(scriptJs.includes('function renderOffers()'), 'renderOffers function missing');
  assert(scriptJs.includes('Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)'), 'discount % calculation missing');
  assert(scriptJs.includes('p.oldPrice - p.price'), 'savings calculation missing');
  assert(scriptJs.includes('renderOffers()'), 'renderOffers call on DOMContentLoaded missing');
});

console.log('\nTest Group 6: Floating WhatsApp Button & Configuration');
runTest('Floating WhatsApp button HTML exists with mobile positioning', () => {
  assert(indexHtml.includes('id="floating-whatsapp-btn"'), '#floating-whatsapp-btn missing');
  assert(styleCss.includes('.floating-whatsapp-btn'), '.floating-whatsapp-btn CSS missing');
  assert(styleCss.includes('bottom: 84px'), 'Floating WhatsApp mobile bottom clearance missing in style.css');
});
runTest('WhatsApp link configuration is customizable via window.OFOQ_WHATSAPP_NUMBER', () => {
  assert(scriptJs.includes('window.OFOQ_WHATSAPP_NUMBER'), 'OFOQ_WHATSAPP_NUMBER config fallback missing');
  assert(scriptJs.includes('function initWhatsApp()'), 'initWhatsApp function missing');
  assert(scriptJs.includes('https://wa.me/'), 'wa.me URL structure missing');
});

console.log('\nTest Group 7: Payment Options (COD, Vodafone Cash, InstaPay) & Checkout Flow');
runTest('Checkout modal contains 3 payment options and instruction box', () => {
  assert(indexHtml.includes('data-method="cod"'), 'COD option missing in index.html');
  assert(indexHtml.includes('data-method="vodafone_cash"'), 'Vodafone Cash option missing in index.html');
  assert(indexHtml.includes('data-method="instapay"'), 'InstaPay option missing in index.html');
  assert(indexHtml.includes('id="payment-details-box"'), '#payment-details-box missing in index.html');
});
runTest('selectPaymentMethod handles dynamic instructions and warnings', () => {
  assert(scriptJs.includes('function selectPaymentMethod(method)'), 'selectPaymentMethod missing');
  assert(scriptJs.includes('window.OFOQ_VODAFONE_CASH_NUMBER'), 'OFOQ_VODAFONE_CASH_NUMBER missing');
  assert(scriptJs.includes('window.OFOQ_INSTAPAY_ADDRESS'), 'OFOQ_INSTAPAY_ADDRESS missing');
  assert(scriptJs.includes('بانتظار المراجعة والتحقق'), 'Manual verification warning missing in script.js');
});
runTest('script.js passes payment_method to /api/orders/create and customizes success alert', () => {
  assert(scriptJs.includes('payment_method: selectedPaymentMethod'), 'payment_method not sent in fetch body');
  assert(scriptJs.includes('completeOrderSuccess(result.order_number, result.total_amount, name, phone, result.is_duplicate, selectedPaymentMethod)'), 'selectedPaymentMethod not passed to completeOrderSuccess');
  assert(scriptJs.includes('paymentMethod === \'vodafone_cash\''), 'Vodafone Cash custom success message missing');
  assert(scriptJs.includes('paymentMethod === \'instapay\''), 'InstaPay custom success message missing');
});

console.log('\nTest Group 8: Backend Order API & Supabase Schema Integration');
runTest('api/orders/create.js validates and handles payment_method', () => {
  assert(apiCreateOrderJs.includes('validPaymentMethods'), 'validPaymentMethods validation missing');
  assert(apiCreateOrderJs.includes('p_payment_method: sanitizedPaymentMethod'), 'p_payment_method not sent to RPC');
  assert(apiCreateOrderJs.includes('[وسيلة الدفع:'), 'payment method backward compatibility in order_notes missing');
});
runTest('supabase/schema.sql supports multiple payment methods in CHECK and RPC', () => {
  assert(schemaSql.includes('vodafone_cash'), 'vodafone_cash missing from schema CHECK');
  assert(schemaSql.includes('instapay'), 'instapay missing from schema CHECK');
  assert(schemaSql.includes('p_payment_method VARCHAR DEFAULT \'cod\''), 'p_payment_method missing from create_cod_order parameters');
});
runTest('admin.js renders payment methods clearly for merchants', () => {
  assert(adminJs.includes('فودافون كاش'), 'Vodafone Cash label missing from admin.js');
  assert(adminJs.includes('إنستاباي'), 'InstaPay label missing from admin.js');
  assert(adminJs.includes('الدفع عند الاستلام (COD)'), 'COD label missing from admin.js');
});

console.log('\n================================================================');
console.log(`  ALL TESTS COMPLETED: ${passedTests}/${totalTests} PASSED`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
