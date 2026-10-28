-- ==========================================================================
-- متجر أفق الإلكتروني | OFOQ Luxury Store - Supabase Database Schema
-- Egyptian Market E-Commerce with Cash On Delivery (COD) & Admin Security
-- ==========================================================================

-- تفعيل إضافات UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------------
-- 1. جدول التصنيفات (Categories)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    icon_class VARCHAR(50) DEFAULT 'fa-solid fa-grid-2',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------------------------
-- 2. جدول المنتجات (Products)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    brand VARCHAR(100) DEFAULT 'أفق للروائح الفاخرة',
    fragrance_type VARCHAR(50) DEFAULT 'عطر أصلي', -- 'عطر أصلي', 'خلطة خاصة', 'دهن نقي', 'طقم هدايا'
    concentration VARCHAR(50) DEFAULT 'Eau de Parfum', -- 'Eau de Parfum', 'Extrait de Parfum', 'زيت عطري مركز'
    volume VARCHAR(50) DEFAULT '100 مل', -- '100 مل', '50 مل', 'ربع توله (3 مل)', إلخ
    scent_family VARCHAR(100) DEFAULT 'شرقي خشبي', -- العائلة العطرية (زهري، خشبي، عنبري، مسك)
    gender_target VARCHAR(20) DEFAULT 'unisex' CHECK (gender_target IN ('men', 'women', 'unisex')),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    old_price DECIMAL(10, 2) CHECK (old_price >= price),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    badge VARCHAR(50),
    stock_quantity INT NOT NULL DEFAULT 50 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------------------------
-- 3. جدول متغيرات المنتجات (Product Variants)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- مثال: "100 مل" أو "أسود فاخر"
    additional_price DECIMAL(10, 2) DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 25 CHECK (stock_quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------------------------
-- 4. جدول تعريفات الشحن والمحافظات المصرية (Shipping Rates)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shipping_rates (
    id SERIAL PRIMARY KEY,
    governorate_name_ar VARCHAR(100) UNIQUE NOT NULL,
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 50.00,
    estimated_days VARCHAR(50) DEFAULT '2-3 أيام عمل',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- --------------------------------------------------------------------------
-- 5. جدول كوبونات الخصم (Coupons)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage INT NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
    max_discount_amount DECIMAL(10, 2) DEFAULT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------------------------
-- 6. تسلسل وجدول الطلبات (Orders & Sequence)
-- --------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 1001 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(30) UNIQUE NOT NULL, -- مثال: OFQ-2610-01001
    idempotency_key VARCHAR(100) UNIQUE, -- مفتاح منع تكرار الطلبات المتطابقة
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    customer_email VARCHAR(150),
    governorate VARCHAR(100) NOT NULL,
    detailed_address TEXT NOT NULL,
    order_notes TEXT,
    
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    coupon_code VARCHAR(50),
    shipping_fee DECIMAL(10, 2) NOT NULL CHECK (shipping_fee >= 0),
    vat_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    
    payment_method VARCHAR(30) DEFAULT 'cod' CHECK (payment_method IN ('cod', 'vodafone_cash', 'instapay', 'COD')),
    payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    order_status VARCHAR(30) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------------------------
-- 7. جدول عناصر الطلب (Order Items)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_title VARCHAR(255) NOT NULL,
    variant_name VARCHAR(100),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0)
);

-- --------------------------------------------------------------------------
-- 8. جدول ملفات المديرين والصلاحيات (Admin Profiles)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================================
-- سياسات أمان الصفوف (Row Level Security - RLS)
-- ==========================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- 1. التصنيفات: قراءة للجميع، تعديل للمدير فقط
CREATE POLICY "Categories read to all" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories manage to admin" ON public.categories FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- 2. المنتجات: قراءة المنتجات المفعلة للجميع، إدارة كاملة للمدير
CREATE POLICY "Active products read to all" ON public.products FOR SELECT 
USING (is_active = TRUE OR EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Products manage to admin" ON public.products FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- 3. المتغيرات: قراءة للجميع، إدارة للمدير
CREATE POLICY "Variants read to all" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Variants manage to admin" ON public.product_variants FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- 4. أسعار الشحن: قراءة للجميع
CREATE POLICY "Shipping rates read to all" ON public.shipping_rates FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Shipping manage to admin" ON public.shipping_rates FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- 5. الكوبونات: قراءة للمدير والتحقق من الكوبون فقط
CREATE POLICY "Coupons admin access" ON public.coupons FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- 6. الطلبات وعناصرها: حظر كلي على الجمهور (لحماية بيانات العملاء)، إتاحة كاملة للمديرين المعتمدين فقط
CREATE POLICY "Orders admin access" ON public.orders FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')));

CREATE POLICY "Order items admin access" ON public.order_items FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')));

-- 7. ملفات المديرين: قراءة للمدير نفسه
CREATE POLICY "Admin profile self view" ON public.admin_profiles FOR SELECT TO authenticated 
USING (user_id = auth.uid());

-- ==========================================================================
-- دوال وإجراءات تخزين ومعاملات آمنة (Atomic RPC Functions)
-- ==========================================================================

-- دالة ذرية لإنشاء طلب الدفع عند الاستلام مع فحص وتخفيض المخزون بصورة محمية ومنع تكرار الطلبات
CREATE OR REPLACE FUNCTION public.create_cod_order(
    p_customer_name VARCHAR,
    p_customer_phone VARCHAR,
    p_customer_email VARCHAR,
    p_governorate VARCHAR,
    p_detailed_address TEXT,
    p_order_notes TEXT,
    p_coupon_code VARCHAR,
    p_items JSONB, -- مصفوفة عناصر الطلب: [{ "product_id": "...", "variant_id": "...", "quantity": 1 }]
    p_idempotency_key VARCHAR DEFAULT NULL, -- مفتاح منع التكرار
    p_payment_method VARCHAR DEFAULT 'cod' -- وسيلة الدفع: cod, vodafone_cash, instapay
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id UUID;
    v_order_number VARCHAR(30);
    v_seq_val BIGINT;
    v_item JSONB;
    v_product_id UUID;
    v_variant_id UUID;
    v_qty INT;
    v_prod_title VARCHAR;
    v_prod_price DECIMAL(10, 2);
    v_variant_name VARCHAR;
    v_additional_price DECIMAL(10, 2);
    v_unit_price DECIMAL(10, 2);
    v_item_total DECIMAL(10, 2);
    v_current_stock INT;
    v_variant_stock INT;
    v_subtotal DECIMAL(10, 2) := 0;
    v_shipping_fee DECIMAL(10, 2) := 50.00;
    v_discount_amount DECIMAL(10, 2) := 0;
    v_coupon_pct INT := 0;
    v_vat_amount DECIMAL(10, 2) := 0.00; -- سياسة الضريبة الأساسية (0.00 بانتظار اعتماد التاجر لضريبة 14%)
    v_total_amount DECIMAL(10, 2) := 0;
    v_free_shipping_threshold DECIMAL(10, 2) := 1000.00;
    
    -- متغيرات لفحص الطلب المكرر إن وجد
    v_existing_order_number VARCHAR(30);
    v_existing_cust_name VARCHAR(150);
    v_existing_total DECIMAL(10, 2);
    v_existing_shipping DECIMAL(10, 2);
    v_existing_status VARCHAR(30);
BEGIN
    -- 1. فحص مفتاح منع التكرار (Idempotency Check)
    IF p_idempotency_key IS NOT NULL AND TRIM(p_idempotency_key) <> '' THEN
        -- قفل استشاري لتسلسل الطلبات المتزامنة لنفس المفتاح وحمايتها من التنافس
        PERFORM pg_advisory_xact_lock(hashtext('idemp_' || TRIM(p_idempotency_key)));

        SELECT order_number, customer_name, total_amount, shipping_fee, order_status
        INTO v_existing_order_number, v_existing_cust_name, v_existing_total, v_existing_shipping, v_existing_status
        FROM public.orders
        WHERE idempotency_key = TRIM(p_idempotency_key);

        IF FOUND THEN
            -- إرجاع نتيجة الطلب السابق فورياً دون إعادة خصم المخزون ودون إنشاء طلب مكرر
            RETURN jsonb_build_object(
                'success', true,
                'order_number', v_existing_order_number,
                'customer_name', v_existing_cust_name,
                'total_amount', v_existing_total,
                'shipping_fee', v_existing_shipping,
                'status', v_existing_status,
                'message', 'تم استلام هذا الطلب مسبقاً وهو قيد المتابعة والتجهيز.',
                'is_duplicate', true
            );
        END IF;
    END IF;

    -- 2. فحص رقم الهاتف المصري (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015)
    IF p_customer_phone !~ '^01[0125][0-9]{8}$' THEN
        RAISE EXCEPTION 'رقم الهاتف غير صالح، يجب أن يكون رقماً مصرياً مكوناً من 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015';
    END IF;

    -- 3. تحديد مصاريف الشحن حسب المحافظة في مصر
    SELECT shipping_fee INTO v_shipping_fee 
    FROM public.shipping_rates 
    WHERE governorate_name_ar = p_governorate AND is_active = TRUE;
    
    IF v_shipping_fee IS NULL THEN
        v_shipping_fee := 50.00; -- القيمة الافتراضية إذا لم تُعثر على المحافظة
    END IF;

    -- 4. إنشاء رقم طلب فريد وغير متصادم باستخدام التسلسل المتزايد (Sequence-backed)
    v_seq_val := NEXTVAL('public.order_number_seq');
    v_order_number := 'OFQ-' || TO_CHAR(NOW(), 'YYMM') || '-' || LPAD(v_seq_val::TEXT, 5, '0');

    -- 5. حجز معرف الطلب المبدئي
    v_order_id := uuid_generate_v4();

    -- 6. المرور على العناصر مع ترتيبها بحسب product_id لمنع أقفال التنافس (Deadlock Prevention)
    FOR v_item IN 
        SELECT elem 
        FROM jsonb_array_elements(p_items) AS elem 
        ORDER BY (elem->>'product_id')::UUID
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_qty := COALESCE((v_item->>'quantity')::INT, 1);
        v_variant_id := NULL;
        IF (v_item->>'variant_id') IS NOT NULL AND (v_item->>'variant_id') <> '' THEN
            v_variant_id := (v_item->>'variant_id')::UUID;
        END IF;

        IF v_qty <= 0 THEN
            RAISE EXCEPTION 'الكمية المطلوبة يجب أن تكون 1 على الأقل';
        END IF;

        -- قفل صف المنتج في قاعدة البيانات للتحقق من السعر الحقيقي والمخزون
        SELECT title, price, stock_quantity INTO v_prod_title, v_prod_price, v_current_stock
        FROM public.products
        WHERE id = v_product_id AND is_active = TRUE
        FOR UPDATE;

        IF v_prod_title IS NULL THEN
            RAISE EXCEPTION 'المنتج غير موجود أو غير متوفر حالياً';
        END IF;

        IF v_current_stock < v_qty THEN
            RAISE EXCEPTION 'الكمية المتاحة من المنتج "%" هي % فقط، يرجى تقليل الكمية', v_prod_title, v_current_stock;
        END IF;

        v_unit_price := v_prod_price;
        v_variant_name := NULL;

        -- فحص المتغير إن وجد وقفل الصف
        IF v_variant_id IS NOT NULL THEN
            SELECT name, additional_price, stock_quantity INTO v_variant_name, v_additional_price, v_variant_stock
            FROM public.product_variants
            WHERE id = v_variant_id AND product_id = v_product_id
            FOR UPDATE;

            IF v_variant_name IS NOT NULL THEN
                v_unit_price := v_unit_price + COALESCE(v_additional_price, 0);
                IF v_variant_stock < v_qty THEN
                    RAISE EXCEPTION 'الكمية المتاحة من الخيار "%" هي % فقط', v_variant_name, v_variant_stock;
                END IF;
                -- تخفيض مخزون المتغير
                UPDATE public.product_variants 
                SET stock_quantity = stock_quantity - v_qty 
                WHERE id = v_variant_id;
            END IF;
        END IF;

        -- تخفيض مخزون المنتج الرئيسي
        UPDATE public.products 
        SET stock_quantity = stock_quantity - v_qty, updated_at = NOW() 
        WHERE id = v_product_id;

        v_item_total := v_unit_price * v_qty;
        v_subtotal := v_subtotal + v_item_total;

        -- إدراج عنصر الطلب بالأسعار المعتمدة من الخادم
        INSERT INTO public.order_items (
            order_id, product_id, variant_id, product_title, variant_name, unit_price, quantity, total_price
        ) VALUES (
            v_order_id, v_product_id, v_variant_id, v_prod_title, v_variant_name, v_unit_price, v_qty, v_item_total
        );
    END LOOP;

    -- 7. فحص واعتماد كود الخصم من جدول coupons في الخادم
    IF p_coupon_code IS NOT NULL AND TRIM(p_coupon_code) <> '' THEN
        SELECT discount_percentage INTO v_coupon_pct
        FROM public.coupons
        WHERE code = UPPER(TRIM(p_coupon_code)) 
          AND is_active = TRUE 
          AND (expires_at IS NULL OR expires_at > NOW())
          AND (min_order_amount <= v_subtotal);

        IF v_coupon_pct > 0 THEN
            v_discount_amount := ROUND((v_subtotal * (v_coupon_pct::DECIMAL / 100.0)), 2);
        END IF;
    END IF;

    -- 8. فحص الشحن المجاني فوق 1000 ج.م
    IF (v_subtotal - v_discount_amount) >= v_free_shipping_threshold THEN
        v_shipping_fee := 0.00;
    END IF;

    -- 9. حساب الإجمالي النهائي المعتمد
    v_total_amount := (v_subtotal - v_discount_amount) + v_shipping_fee + v_vat_amount;

    -- 10. إدراج سجل الطلب النهائي (حالة الدفع: غير مدفوع unpaid للدفع عند الاستلام)
    INSERT INTO public.orders (
        id, order_number, idempotency_key, customer_name, customer_phone, customer_email, 
        governorate, detailed_address, order_notes,
        subtotal, discount_amount, coupon_code, shipping_fee, vat_amount, total_amount,
        payment_method, payment_status, order_status
    ) VALUES (
        v_order_id, v_order_number, NULLIF(TRIM(p_idempotency_key), ''), p_customer_name, p_customer_phone, p_customer_email,
        p_governorate, p_detailed_address, p_order_notes,
        v_subtotal, v_discount_amount, p_coupon_code, v_shipping_fee, v_vat_amount, v_total_amount,
        COALESCE(NULLIF(LOWER(TRIM(p_payment_method)), ''), 'cod'), 'unpaid', 'pending'
    );

    -- 11. إرجاع بيانات نجاح الطلب الرسمية
    RETURN jsonb_build_object(
        'success', true,
        'order_number', v_order_number,
        'customer_name', p_customer_name,
        'total_amount', v_total_amount,
        'shipping_fee', v_shipping_fee,
        'status', 'pending',
        'message', 'تم استلام طلبك بنجاح، وسيتواصل معك فريق خدمة العملاء هاتفياً لتأكيد الشحن.'
    );
END;
$$;

-- دالة آمنة لإلغاء الطلب واسترجاع كميات المخزون لمرة واحدة فقط وبشكل ذري
CREATE OR REPLACE FUNCTION public.cancel_order_and_restore_stock(
    p_order_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order RECORD;
    v_item RECORD;
BEGIN
    -- 1. جلب الطلب مع حجز القفل
    SELECT id, order_number, order_status INTO v_order
    FROM public.orders
    WHERE id = p_order_id
    FOR UPDATE;

    IF v_order.id IS NULL THEN
        RAISE EXCEPTION 'الطلب غير موجود في النظام';
    END IF;

    IF v_order.order_status IN ('cancelled', 'returned') THEN
        RAISE EXCEPTION 'الطلب ملغي أو مسترجع بالفعل، ولا يمكن استرجاع المخزون أكثر من مرة';
    END IF;

    -- 2. استرجاع المخزون لكل عنصر في الطلب
    FOR v_item IN
        SELECT product_id, variant_id, quantity
        FROM public.order_items
        WHERE order_id = p_order_id
    LOOP
        IF v_item.product_id IS NOT NULL THEN
            UPDATE public.products
            SET stock_quantity = stock_quantity + v_item.quantity,
                updated_at = NOW()
            WHERE id = v_item.product_id;
        END IF;

        IF v_item.variant_id IS NOT NULL THEN
            UPDATE public.product_variants
            SET stock_quantity = stock_quantity + v_item.quantity
            WHERE id = v_item.variant_id;
        END IF;
    END LOOP;

    -- 3. تحديث حالة الطلب إلى ملغي
    UPDATE public.orders
    SET order_status = 'cancelled',
        updated_at = NOW()
    WHERE id = p_order_id;

    RETURN jsonb_build_object(
        'success', true,
        'order_number', v_order.order_number,
        'message', 'تم إلغاء الطلب واسترجاع كميات المخزون إلى المستودع بنجاح'
    );
END;
$$;

