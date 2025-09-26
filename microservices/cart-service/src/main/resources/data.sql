-- Insert some carts
INSERT INTO carts (cart_id, user_id) VALUES
(1, 'user1'),
(2, 'user2');

-- Insert cart items for user1's cart
INSERT INTO cart_items (item_id, cart_id, product_id, quantity) VALUES
(1, 1, 'prod-100', 2),
(2, 1, 'prod-101', 1);

-- Insert cart items for user2's cart
INSERT INTO cart_items (item_id, cart_id, product_id, quantity) VALUES
(3, 2, 'prod-102', 5);
