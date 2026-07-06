/**
 * Textos sugeridos para comercios — solo plantillas locales (sin APIs de pago).
 * Cuando el proyecto tenga presupuesto, se puede conectar OpenAI u otro proveedor.
 */

const CATEGORY_COPY = {
  comida: 'sabor casero y porción generosa',
  farmacia: 'producto de confianza para tu bienestar',
  mercado: 'fresco y listo para tu hogar',
  licoreria: 'selección para compartir',
  default: 'calidad que vale la pena pedir',
};

function productDescription({ productName, category, businessName, municipio, price }) {
  const tone = CATEGORY_COPY[category] || CATEGORY_COPY.default;
  const priceLine = price ? ` Desde ${Number(price).toLocaleString('es-CO')} en UrabApp.` : '';
  return `${productName} de ${businessName} en ${municipio || 'Urabá'}. ${tone.charAt(0).toUpperCase() + tone.slice(1)}.${priceLine} Pide fácil desde la app.`;
}

function storeDescription({ businessName, category, municipio }) {
  const tone = CATEGORY_COPY[category] || CATEGORY_COPY.default;
  return `${businessName} en ${municipio || 'Urabá'}: ${tone}. Pedidos con seguimiento, entrega local y promos exclusivas en UrabApp.`;
}

function promoCopy({ businessName, discountType, discountValue, municipio }) {
  const discount = discountType === 'percent'
    ? `${discountValue}% OFF`
    : `$${Number(discountValue).toLocaleString('es-CO')} de descuento`;
  return {
    title: `${discount} en ${businessName}`,
    subtitle: `Solo en UrabApp · ${municipio || 'Urabá'} · Pide hoy`,
  };
}

function winbackMessage({ businessName, municipio }) {
  return `Hola, te extrañamos en ${businessName}. Vuelve a pedir desde UrabApp${municipio ? ` en ${municipio}` : ''} — tenemos novedades listas para ti.`;
}

export async function generateProductDescription({ business, productName, category, price }) {
  return {
    text: productDescription({
      productName,
      category: category || business.category,
      businessName: business.name,
      municipio: business.municipio,
      price,
    }),
  };
}

export async function generateStoreDescription({ business }) {
  return {
    text: storeDescription({
      businessName: business.name,
      category: business.category,
      municipio: business.municipio,
    }),
  };
}

export async function generatePromoCopy({ business, discountType, discountValue }) {
  return promoCopy({
    businessName: business.name,
    municipio: business.municipio,
    discountType,
    discountValue,
  });
}

export async function generateWinbackMessage({ business }) {
  return {
    text: winbackMessage({
      businessName: business.name,
      municipio: business.municipio,
    }),
  };
}
