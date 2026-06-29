-- ============================================
-- Supabase Setup for Veerabhadra Pooja Store
-- Run this in Supabase SQL Editor (one time only)
-- ============================================

-- 1. Sequence for auto-generating order IDs (VRB100013, VRB100014, ...)
CREATE SEQUENCE IF NOT EXISTS order_id_seq START WITH 100013;

-- 2. Function to generate VRB-prefixed order IDs
CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'VRB' || nextval('order_id_seq')::TEXT;
END;
$$ LANGUAGE plpgsql;

-- 3. Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT generate_order_id(),
  customer_name TEXT NOT NULL DEFAULT 'WhatsApp Customer',
  mobile_number TEXT DEFAULT 'Via WhatsApp',
  address TEXT DEFAULT 'Provided via WhatsApp',
  order_date TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  total_amount NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT 'UPI/Cash',
  status TEXT DEFAULT 'Pending',
  notification_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security with public access
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON orders FOR UPDATE USING (true) WITH CHECK (true);

-- 5. Seed data (12 sample orders)
INSERT INTO orders (id, customer_name, mobile_number, address, order_date, items, total_amount, payment_method, status, notification_history) VALUES
('VRB100001', 'Rajesh Patel', '9845012345', '45, 2nd Main, Indiranagar, Bangalore - 560038', '2026-06-28 10:30 AM', '[{"name":"Handcrafted Brass Diya (Pair)","price":249,"quantity":1},{"name":"Daily Pooja Essentials Kit","price":149,"quantity":2}]'::jsonb, 547, 'UPI', 'Pending', '[]'::jsonb),
('VRB100002', 'Lakshmi Narasimhan', '9731234567', 'Flat 302, Sai Residency, Malleshwaram, Bangalore - 560003', '2026-06-28 11:15 AM', '[{"name":"Ornate Brass Pooja Handbell","price":179,"quantity":1},{"name":"Goddess Lakshmi Gold-Plated Frame","price":199,"quantity":1}]'::jsonb, 378, 'Cash', 'Confirmed', '[]'::jsonb),
('VRB100003', 'Amit Sharma', '8123456789', '78/A, 10th Cross, Jayanagar, Bangalore - 560041', '2026-06-27 03:45 PM', '[{"name":"Vratam Peta Setup Kit","price":299,"quantity":1}]'::jsonb, 799, 'Card', 'Preparing', '[]'::jsonb),
('VRB100004', 'Priya Sridhar', '9008012345', '12, Temple Street, Basavanagudi, Bangalore - 560004', '2026-06-27 09:00 AM', '[{"name":"Pure Copper Pooja Kalash","price":349,"quantity":1},{"name":"Traditional Copper Pooja Lota","price":279,"quantity":1},{"name":"Premium Sandalwood Paste","price":99,"quantity":3}]'::jsonb, 925, 'UPI', 'Packed', '[]'::jsonb),
('VRB100005', 'Venkat Rao', '9448098765', '204, Vaikunta Apartments, Rajajinagar, Bangalore - 560010', '2026-06-26 05:20 PM', '[{"name":"Lord Ganesha Gold-Plated Frame","price":199,"quantity":2}]'::jsonb, 398, 'UPI', 'Ready for Pickup', '[]'::jsonb),
('VRB100006', 'Sunitha Hegde', '9880123456', '56, Coconut Grove Road, Koramangala, Bangalore - 560034', '2026-06-25 11:00 AM', '[{"name":"Daily Pooja Essentials Kit","price":149,"quantity":1},{"name":"Organic Camphor Tablets (100g)","price":79,"quantity":2}]'::jsonb, 307, 'UPI', 'Delivered', '[]'::jsonb),
('VRB100007', 'Vikram Singh', '7022099887', 'Flat 101, Prestige Heights, Whitefield, Bangalore - 560066', '2026-06-25 02:30 PM', '[{"name":"Engraved Brass Aarti Plate","price":299,"quantity":1}]'::jsonb, 299, 'Card', 'Cancelled', '[]'::jsonb),
('VRB100008', 'Ananth Prasad', '9663123456', '15, Sri Rama Temple St, Banashankari, Bangalore - 560085', '2026-06-24 09:15 AM', '[{"name":"Pure Copper Pooja Kalash","price":349,"quantity":2}]'::jsonb, 698, 'UPI', 'Delivered', '[]'::jsonb),
('VRB100009', 'Deepa Rao', '8971098765', '89, 4th Block, HSR Layout, Bangalore - 560102', '2026-06-24 11:45 AM', '[{"name":"Premium Sandalwood Paste (Chandanam)","price":99,"quantity":5}]'::jsonb, 495, 'UPI', 'Delivered', '[]'::jsonb),
('VRB100010', 'Kiran Gowda', '9844112233', '10, 1st Cross, Vijayanagar, Bangalore - 560040', '2026-06-23 04:30 PM', '[{"name":"Traditional Copper Pooja Lota","price":279,"quantity":1},{"name":"Organic Camphor Tablets (100g)","price":79,"quantity":3}]'::jsonb, 516, 'Cash', 'Cancelled', '[]'::jsonb),
('VRB100011', 'Sujatha Iyer', '9900223344', '77, Margosa Road, Malleshwaram, Bangalore - 560003', '2026-06-23 10:00 AM', '[{"name":"Lord Ganesha Gold-Plated Frame","price":199,"quantity":1},{"name":"Goddess Lakshmi Gold-Plated Frame","price":199,"quantity":1}]'::jsonb, 398, 'UPI', 'Delivered', '[]'::jsonb),
('VRB100012', 'Prashanth Bhat', '9845099887', 'Flat A102, Shanthi Niketan, Vidyaranyapura, Bangalore - 560097', '2026-06-22 02:15 PM', '[{"name":"Daily Pooja Essentials Kit","price":149,"quantity":4}]'::jsonb, 596, 'UPI', 'Delivered', '[]'::jsonb);
