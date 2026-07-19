-- Juan Valdez — imágenes oficiales de bebidas (juanvaldez.com WP amigo-productos)
ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;
UPDATE public.businesses SET
  logo_url = 'https://juanvaldez.com/wp-content/uploads/2024/03/Logo-principal.png',
  cover_url = 'https://juanvaldez.com/wp-content/uploads/2024/01/Alergenos_1400X600.jpg'
WHERE id = 'b1100000-0000-4000-a110-000000000012';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Tinto-Juan-Valdez-campesino.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ~* 'tinto';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Cafe-Americano-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ~* 'americano';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Espresso-tradicional-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ~* 'espresso';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Cappuccino-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ~* 'capuccino|cappuccino';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Latte-frio-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ~* '\blatte\b';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Mocca-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ~* 'mocaccino|mocca|mocha';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Torta-de-chocolate-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ~* 'chocolate';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Torta-de-chocolate-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ~* 't[eé]|infusi';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Cold-Brew-nitro-Juan-Valdez-1.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ~* 'cold brew';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/nevado_de_cafe___300ml_700x700px.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ~* 'frapp[eé]|nevado';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Latte-frio-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ~* 'latte helado|latte frio|latte frío';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Granizado-juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ~* 'granizado';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Flat-white-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ~* 'flat white';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Machiatto-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ~* 'macchiato';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Afogatto-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Afogatto Juan Valdez% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/6000e8e2fe9cc36e6b6ed7cb_Almojabana-Juan-Valdez.png'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Almojábana% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/rollito_de_canela.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Rollito de Canela% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Galleta-chips-de-chocolate-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Galleta Choco Chip% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Torta-de-zanahoria-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Torta de Zanahoria% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Torta-de-chocolate-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Torta de Chocolate% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Torta-de-banano-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Torta de Banano% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Pandebono-Juan-Valdez-1.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Pandebono de Bocadillo% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Pandebono-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Pandebono% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Palito-de-queso-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Palito de Queso% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/nevado_de_cafe___300ml_700x700px.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Nevado Café% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/nevado_reducido_en_azucar_300ml_700x700px.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Nevado Café Reducido en Azúcar% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/nevado_de_chocolate_300ml_700x700px.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Nevado Chocolate% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Nevado-Brownie-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Nevado Brownie% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Cold-Brew-nitro-Juan-Valdez-1.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Cold Brew Nitro% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Cold-Brew-nitro-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Cold Brew Original% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Nevado-Baileys-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Nevado Baileys% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Nevado-chai-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Nevado Chai% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Granizado-juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Granizado% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Latte-frio-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Latte Frío% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/AROMATICA-3.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Aromática Primavera% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/AROMATICA-2.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Aromática Silvestre% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/AROMATICA.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Aromática Bosque Infusión% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Chai-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Chai% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/pods.png'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Pods% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Machiatto-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Macchiato% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Espresso-tradicional-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Espresso% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Flat-white-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Flat White% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Chocolate-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Chocolate% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Latte-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Latte% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Mocca-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Mocca% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Cappuccino-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Cappuccino% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Cafe-Americano-Juan-Valdez.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Café Americano% Demo';
UPDATE public.products SET image_url = 'https://juanvaldez.com/wp-content/uploads/2025/03/Tinto-Juan-Valdez-campesino.jpg'
WHERE business_id = 'b1100000-0000-4000-a110-000000000012'
  AND name ILIKE '%Tintos% Demo';
ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;
