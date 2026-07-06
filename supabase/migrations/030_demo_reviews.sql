-- Reseñas de demostración para poblar Top 3 por municipio (feedback con estrellas)

INSERT INTO public.reviews (business_id, business_rating, comment, created_at) VALUES
-- Apartadó — Top 1: Farmacia San Rafael (~4.93)
('a0000001-0000-0000-0000-000000000003', 5, 'Siempre tienen lo que necesito y llega rápido.', NOW() - INTERVAL '12 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Muy buena atención en mostrador.', NOW() - INTERVAL '11 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Domicilio puntual, recomendada.', NOW() - INTERVAL '10 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Precios justos y buen surtido.', NOW() - INTERVAL '9 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Excelente servicio en Apartadó.', NOW() - INTERVAL '8 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'La mejor farmacia del barrio.', NOW() - INTERVAL '7 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Pedí medicamentos y llegaron bien empacados.', NOW() - INTERVAL '6 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Confiable para urgencias.', NOW() - INTERVAL '5 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Muy amables por WhatsApp.', NOW() - INTERVAL '4 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Siempre cumplen el tiempo de entrega.', NOW() - INTERVAL '3 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Volveré a pedir sin duda.', NOW() - INTERVAL '2 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Todo llegó correcto.', NOW() - INTERVAL '1 day'),
('a0000001-0000-0000-0000-000000000003', 5, 'Súper recomendados en Laureles.', NOW() - INTERVAL '20 hours'),
('a0000001-0000-0000-0000-000000000003', 5, 'Atención de primera.', NOW() - INTERVAL '10 hours'),
('a0000001-0000-0000-0000-000000000003', 4, 'Bien en general, solo tardó un poco un día.', NOW() - INTERVAL '2 hours'),

-- Apartadó — Top 2: Restaurante El Bananero (4.80)
('a0000001-0000-0000-0000-000000000001', 5, 'El sancocho es espectacular, sabor casero.', NOW() - INTERVAL '14 days'),
('a0000001-0000-0000-0000-000000000001', 5, 'Comida típica del Urabá bien servida.', NOW() - INTERVAL '13 days'),
('a0000001-0000-0000-0000-000000000001', 5, 'Patacón crujiente, me encantó.', NOW() - INTERVAL '12 days'),
('a0000001-0000-0000-0000-000000000001', 5, 'Porciones generosas y buen precio.', NOW() - INTERVAL '11 days'),
('a0000001-0000-0000-0000-000000000001', 5, 'Llegó caliente y a tiempo.', NOW() - INTERVAL '10 days'),
('a0000001-0000-0000-0000-000000000001', 5, 'Mi restaurante favorito en Apartadó.', NOW() - INTERVAL '9 days'),
('a0000001-0000-0000-0000-000000000001', 5, 'El arroz con camarón es una delicia.', NOW() - INTERVAL '8 days'),
('a0000001-0000-0000-0000-000000000001', 5, 'Muy buen sazón urabaense.', NOW() - INTERVAL '7 days'),
('a0000001-0000-0000-0000-000000000001', 4, 'Rico todo, solo faltó un poco más de hogao.', NOW() - INTERVAL '6 days'),
('a0000001-0000-0000-0000-000000000001', 4, 'Buen pedido, domicilio correcto.', NOW() - INTERVAL '5 days'),

-- Apartadó — Top 3: Mecato La Esquina (4.75)
('a0000001-0000-0000-0000-000000000002', 5, 'Salchipapas enormes, ideal para compartir.', NOW() - INTERVAL '10 days'),
('a0000001-0000-0000-0000-000000000002', 5, 'Rápidos y el perro caliente muy bueno.', NOW() - INTERVAL '9 days'),
('a0000001-0000-0000-0000-000000000002', 5, 'Perfecto para el mecato de la noche.', NOW() - INTERVAL '8 days'),
('a0000001-0000-0000-0000-000000000002', 5, 'Llegó en menos de 20 minutos.', NOW() - INTERVAL '7 days'),
('a0000001-0000-0000-0000-000000000002', 5, 'Buen precio y buena porción.', NOW() - INTERVAL '6 days'),
('a0000001-0000-0000-0000-000000000002', 4, 'Todo bien, las salsas podrían traer más.', NOW() - INTERVAL '5 days'),
('a0000001-0000-0000-0000-000000000002', 4, 'Buen servicio en Ortiz.', NOW() - INTERVAL '4 days'),
('a0000001-0000-0000-0000-000000000002', 5, 'Recomendado para antojos.', NOW() - INTERVAL '3 days'),

-- Apartadó — otros comercios con reseñas
('a0000001-0000-0000-0000-000000000004', 5, 'Mercado completo y buenos precios.', NOW() - INTERVAL '8 days'),
('a0000001-0000-0000-0000-000000000004', 5, 'Frutas y víveres frescos.', NOW() - INTERVAL '7 days'),
('a0000001-0000-0000-0000-000000000004', 4, 'Buen surtido, volveré a pedir.', NOW() - INTERVAL '6 days'),
('a0000001-0000-0000-0000-000000000004', 4, 'Domicilio puntual.', NOW() - INTERVAL '5 days'),
('a0000001-0000-0000-0000-000000000004', 5, 'Muy práctico para la casa.', NOW() - INTERVAL '4 days'),
('b0000001-0000-0000-0000-000000000020', 5, 'Ceviche fresco, sabor costeño.', NOW() - INTERVAL '6 days'),
('b0000001-0000-0000-0000-000000000020', 4, 'Muy rico, buena porción.', NOW() - INTERVAL '5 days'),
('b0000001-0000-0000-0000-000000000020', 4, 'Recomendado si te gusta el marisco.', NOW() - INTERVAL '4 days'),
('b0000001-0000-0000-0000-000000000020', 5, 'Llegó bien empacado.', NOW() - INTERVAL '3 days'),
('b0000001-0000-0000-0000-000000000006', 4, 'Pizza buena para el precio.', NOW() - INTERVAL '5 days'),
('b0000001-0000-0000-0000-000000000006', 4, 'Llegó caliente.', NOW() - INTERVAL '4 days'),
('b0000001-0000-0000-0000-000000000006', 4, 'Sabor aceptable, pediría de nuevo.', NOW() - INTERVAL '3 days'),

-- Turbo
('c0000002-0000-0000-0000-000000000043', 5, 'Farmacia confiable en Turbo.', NOW() - INTERVAL '9 days'),
('c0000002-0000-0000-0000-000000000043', 5, 'Rápidos con el domicilio portuario.', NOW() - INTERVAL '8 days'),
('c0000002-0000-0000-0000-000000000043', 5, 'Buena atención.', NOW() - INTERVAL '7 days'),
('c0000002-0000-0000-0000-000000000043', 5, 'Siempre encuentro lo que busco.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000043', 4, 'Muy bien en general.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000041', 5, 'Comida rápida sabrosa en el puerto.', NOW() - INTERVAL '8 days'),
('c0000002-0000-0000-0000-000000000041', 5, 'Buen precio para trabajadores.', NOW() - INTERVAL '7 days'),
('c0000002-0000-0000-0000-000000000041', 4, 'Llegó a tiempo.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000041', 5, 'Recomendado en Turbo.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000042', 5, 'Mercado bien surtido.', NOW() - INTERVAL '7 days'),
('c0000002-0000-0000-0000-000000000042', 4, 'Buen servicio.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000042', 4, 'Precios del barrio.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000042', 4, 'Volveré a pedir.', NOW() - INTERVAL '4 days'),

-- Carepa
('c0000002-0000-0000-0000-000000000044', 5, 'Comida casera muy rica en Carepa.', NOW() - INTERVAL '8 days'),
('c0000002-0000-0000-0000-000000000044', 5, 'Buen sazón y porción abundante.', NOW() - INTERVAL '7 days'),
('c0000002-0000-0000-0000-000000000044', 5, 'Domicilio rápido.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000044', 4, 'Muy buena experiencia.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000045', 5, 'Tienda completa para la casa.', NOW() - INTERVAL '7 days'),
('c0000002-0000-0000-0000-000000000045', 4, 'Buen surtido en Carepa.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000045', 4, 'Atención amable.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000045', 4, 'Recomendada.', NOW() - INTERVAL '4 days'),

-- Chigorodó
('c0000002-0000-0000-0000-000000000046', 5, 'Almuerzo delicioso en Chigorodó.', NOW() - INTERVAL '7 days'),
('c0000002-0000-0000-0000-000000000046', 5, 'Sabor casero auténtico.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000046', 4, 'Buen pedido.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000046', 5, 'Llegó caliente y rápido.', NOW() - INTERVAL '4 days'),
('c0000002-0000-0000-0000-000000000047', 4, 'Mercado práctico del municipio.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000047', 4, 'Buenos precios.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000047', 4, 'Domicilio correcto.', NOW() - INTERVAL '4 days'),
('c0000002-0000-0000-0000-000000000047', 5, 'Surtido variado.', NOW() - INTERVAL '3 days'),

-- Necoclí
('c0000002-0000-0000-0000-000000000048', 5, 'Excelente comida en la costa.', NOW() - INTERVAL '7 days'),
('c0000002-0000-0000-0000-000000000048', 5, 'Sabor playero, muy recomendado.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000048', 5, 'Rápido y fresco.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000048', 4, 'Muy buena atención.', NOW() - INTERVAL '4 days'),
('c0000002-0000-0000-0000-000000000048', 5, 'El mejor de Necoclí en la app.', NOW() - INTERVAL '3 days');
