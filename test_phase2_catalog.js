const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('  PHASE 2 FRAGRANCE BOUTIQUE & CATALOG VALIDATION TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`);
    process.exitCode = 1;
  }
}

const rootDir = __dirname;

// 1. Verify Image Assets on Disk
console.log('Test Group 1: Fragrance Image Assets on Disk');
const requiredImages = [
  'hero_perfume_banner.png',
  'perfume_royal_oud.png',
  'perfume_noir_amber.png',
  'perfume_rose_silk.png',
  'dehn_oud_bottle.png',
  'perfume_gift_set.png'
];

requiredImages.forEach(imgName => {
  test(`Asset exists: assets/images/${imgName}`, () => {
    const fullPath = path.join(rootDir, 'assets/images', imgName);
    assert(fs.existsSync(fullPath), `Image file missing: ${fullPath}`);
    const stat = fs.statSync(fullPath);
    assert(stat.size > 50000, `Image file suspiciously small (${stat.size} bytes): ${fullPath}`);
  });
});

// 2. Verify script.js Fragrance Catalog
console.log('\nTest Group 2: script.js Catalog Integrity');
const scriptContent = fs.readFileSync(path.join(rootDir, 'script.js'), 'utf8');

test('No non-fragrance categories in FALLBACK_PRODUCTS (no tech, fashion, lifestyle)', () => {
  assert(!scriptContent.includes('category: "tech"'), 'Found tech category in script.js');
  assert(!scriptContent.includes('category: "fashion"'), 'Found fashion category in script.js');
  assert(!scriptContent.includes('category: "lifestyle"'), 'Found lifestyle category in script.js');
});

test('FALLBACK_PRODUCTS has 8 fragrance items with brands and scent notes', () => {
  assert(scriptContent.includes('عطر الأوركيد والعود الملكي'), 'Missing Royal Oud');
  assert(scriptContent.includes('عطر نوار أمبر المركز للرجال'), 'Missing Noir Amber');
  assert(scriptContent.includes('عطر بتلات الورد والحرير للنساء'), 'Missing Rose Silk');
  assert(scriptContent.includes('دهن عود سيوفي كلاسيكي قديم صافي'), 'Missing Sayoufi Dehn Oud');
  assert(scriptContent.includes('توليفة أفق سيجنتشر | مسك وخشب الصندل'), 'Missing Signature Sandalwood Musk');
  assert(scriptContent.includes('مسك الطهارة والبودر المركز'), 'Missing Tahara Musk');
  assert(scriptContent.includes('صندوق الإهداء الفاخر (عطر 100 مل + ربع توله دهن عود)'), 'Missing Royal Gift Set');
  assert(scriptContent.includes('مبخرة السيراميك الذكية لتسخين العود الفاخر'), 'Missing Ceramic Burner');
});

test('Quick View modal renders fragrance attributes (brand, concentration, volume, scentFamily)', () => {
  assert(scriptContent.includes('product.brand'), 'Missing product.brand in quickViewProduct');
  assert(scriptContent.includes('product.concentration'), 'Missing product.concentration in quickViewProduct');
  assert(scriptContent.includes('product.volume'), 'Missing product.volume in quickViewProduct');
  assert(scriptContent.includes('product.scentFamily'), 'Missing product.scentFamily in quickViewProduct');
});

test('Dynamic API config loading present in script.js', () => {
  assert(scriptContent.includes("fetch('/api/config')"), 'Missing /api/config fetch in script.js');
});

// 3. Verify index.html Fragrance UI
console.log('\nTest Group 3: index.html Fragrance Boutique UI');
const indexContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

test('Storefront title reflects Luxury Fragrance Boutique', () => {
  assert(indexContent.includes('OFOQ Fragrance Boutique') || indexContent.includes('دار العطور الفاخرة'), 'Store title missing fragrance branding');
});

test('Hero section references hero_perfume_banner.png', () => {
  assert(indexContent.includes('assets/images/hero_perfume_banner.png'), 'Hero section does not reference hero_perfume_banner.png');
});

test('Announcement bar does not contain fake urgency timer loop', () => {
  assert(!indexContent.includes('id="announcement-timer"'), 'Found fake announcement countdown timer in index.html');
});

test('Fragrance categories present in filter pills (men, women, unisex, oud-oriental, private-blends, gift-sets)', () => {
  assert(indexContent.includes('data-filter="men"'), 'Missing men filter');
  assert(indexContent.includes('data-filter="women"'), 'Missing women filter');
  assert(indexContent.includes('data-filter="unisex"'), 'Missing unisex filter');
  assert(indexContent.includes('data-filter="oud-oriental"'), 'Missing oud-oriental filter');
  assert(indexContent.includes('data-filter="private-blends"'), 'Missing private-blends filter');
  assert(indexContent.includes('data-filter="gift-sets"'), 'Missing gift-sets filter');
});

test('Featured Fragrance section features Royal Orchid & Oud with perfume_royal_oud.png', () => {
  assert(indexContent.includes('assets/images/perfume_royal_oud.png'), 'Featured section does not use perfume_royal_oud.png');
  assert(indexContent.includes('عطر الأسبوع المختار'), 'Missing Choice of Week banner');
});

// 4. Verify admin.js & schema.sql
console.log('\nTest Group 4: Admin Portal & Database Procedures');
const adminContent = fs.readFileSync(path.join(rootDir, 'admin.js'), 'utf8');
const schemaContent = fs.readFileSync(path.join(rootDir, 'supabase/schema.sql'), 'utf8');
const seedContent = fs.readFileSync(path.join(rootDir, 'supabase/seed.sql'), 'utf8');

test('admin.js connects to /api/config for seamless initialization', () => {
  assert(adminContent.includes("fetch('/api/config')"), 'admin.js missing /api/config fetch');
});

test('admin.js invokes cancel_order_and_restore_stock RPC on order cancellation', () => {
  assert(adminContent.includes('cancel_order_and_restore_stock'), 'admin.js does not call cancel_order_and_restore_stock RPC');
});

test('supabase/schema.sql has atomic cancel_order_and_restore_stock procedure', () => {
  assert(schemaContent.includes('CREATE OR REPLACE FUNCTION public.cancel_order_and_restore_stock'), 'schema.sql missing cancel_order_and_restore_stock');
});

test('supabase/seed.sql has 6 fragrance categories matching slugs', () => {
  assert(seedContent.includes("'men'"), 'seed missing men category');
  assert(seedContent.includes("'women'"), 'seed missing women category');
  assert(seedContent.includes("'unisex'"), 'seed missing unisex category');
  assert(seedContent.includes("'oud-oriental'"), 'seed missing oud-oriental category');
  assert(seedContent.includes("'private-blends'"), 'seed missing private-blends category');
  assert(seedContent.includes("'gift-sets'"), 'seed missing gift-sets category');
});

test('supabase/seed.sql has Egyptian governorate shipping rates (Cairo 45, Giza 45, Alex 55)', () => {
  assert(seedContent.includes("'القاهرة', 45.00"), 'Missing Cairo rate');
  assert(seedContent.includes("'الجيزة', 45.00"), 'Missing Giza rate');
  assert(seedContent.includes("'الإسكندرية', 55.00"), 'Missing Alexandria rate');
});

console.log(`\n================================================================`);
console.log(`  ALL PHASE 2 TESTS COMPLETED: ${passCount} PASSED`);
console.log(`================================================================\n`);
