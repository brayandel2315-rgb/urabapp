import { formatCOP } from './currency';

const SKIP_CUSTOMIZER_CATEGORIES = ['bebidas', 'bebida', 'jugos', 'frutos', 'cubiertos', 'acompañamientos', 'acompanamientos'];

export const COMMON_REMOVE_GROUP = {
  id: 'tpl-remove',
  name: 'Quitar ingredientes',
  description: 'Personaliza lo que no quieres',
  selection_type: 'multiple',
  min_select: 0,
  is_required: false,
  modifiers: [
    { id: 'tpl-no-onion', name: 'Sin cebolla', price_delta: 0, action_type: 'remove' },
    { id: 'tpl-no-tomato', name: 'Sin tomate', price_delta: 0, action_type: 'remove' },
    { id: 'tpl-no-sauce', name: 'Sin salsa', price_delta: 0, action_type: 'remove' },
    { id: 'tpl-no-lettuce', name: 'Sin lechuga', price_delta: 0, action_type: 'remove' },
  ],
};

export const COMMON_EXTRAS_GROUP = {
  id: 'tpl-extra',
  name: 'Agregar extras',
  description: 'Complementa tu pedido',
  selection_type: 'multiple',
  min_select: 0,
  is_required: false,
  modifiers: [
    { id: 'tpl-cheese', name: 'Extra queso', price_delta: 2500, action_type: 'add' },
    { id: 'tpl-avocado', name: 'Extra aguacate', price_delta: 3000, action_type: 'add' },
    { id: 'tpl-egg', name: 'Extra huevo', price_delta: 2000, action_type: 'add' },
    { id: 'tpl-platano', name: 'Extra patacón', price_delta: 2000, action_type: 'add' },
    { id: 'tpl-papas', name: 'Extra papas', price_delta: 3500, action_type: 'add' },
  ],
};

export const COMMON_DRINKS_GROUP = {
  id: 'tpl-drinks',
  name: 'Bebida',
  description: 'Agrega una bebida a tu pedido',
  selection_type: 'single',
  min_select: 0,
  max_select: 1,
  is_required: false,
  modifiers: [
    { id: 'tpl-drink-none', name: 'Sin bebida', price_delta: 0, action_type: 'add', is_default: true },
    { id: 'tpl-gaseosa', name: 'Gaseosa 400ml', price_delta: 3500, action_type: 'add' },
    { id: 'tpl-jugo', name: 'Jugo natural', price_delta: 5000, action_type: 'add' },
    { id: 'tpl-agua', name: 'Agua', price_delta: 2500, action_type: 'add' },
    { id: 'tpl-cerveza', name: 'Cerveza', price_delta: 4500, action_type: 'add' },
  ],
};

function cloneGroup(group) {
  return {
    ...group,
    modifiers: group.modifiers.map((m) => ({ ...m })),
  };
}

/** Productos que abren el menú de personalización al pulsar + */
export function isDishLikeProduct(product, businessCategory) {
  if (product?.requires_customization) return true;
  const productCat = (product?.category || '').toLowerCase();
  if (SKIP_CUSTOMIZER_CATEGORIES.some((k) => productCat.includes(k))) return false;
  const bizCat = (businessCategory || '').toLowerCase();
  const NON_FOOD_STORES = new Set(['farmacia', 'mercado', 'licoreria', 'tecnologia', 'belleza', 'mascotas', 'tiendas']);
  if (NON_FOOD_STORES.has(bizCat)) return false;
  if (bizCat === 'comida' || bizCat.includes('restaur') || bizCat.includes('corrient')) return true;
  if (productCat && !SKIP_CUSTOMIZER_CATEGORIES.some((k) => productCat.includes(k))) {
    return !['otros', ''].includes(productCat);
  }
  return false;
}

function defaultComidaOptions() {
  return [
    cloneGroup(COMMON_DRINKS_GROUP),
    cloneGroup(COMMON_EXTRAS_GROUP),
    cloneGroup(COMMON_REMOVE_GROUP),
  ];
}

/** Plantillas inferidas cuando el comercio aún no configuró complementos en BD */
export function inferModifierGroupsFromProduct(product) {
  const text = `${product?.name || ''} ${product?.description || ''}`.toLowerCase();

  if (/patac[oó]n|patacon/i.test(text)) {
    return [
      {
        id: 'inf-patacon-base',
        name: 'Elige tu patacón',
        description: 'Opción base — obligatorio',
        selection_type: 'single',
        min_select: 1,
        max_select: 1,
        is_required: true,
        modifiers: [
          { id: 'inf-pt-sencillo', name: 'Patacón sencillo', price_delta: 0, action_type: 'add' },
          { id: 'inf-pt-doble', name: 'Patacón doble', price_delta: 3000, action_type: 'add' },
          { id: 'inf-pt-queso', name: 'Patacón con queso', price_delta: 2500, action_type: 'add' },
          { id: 'inf-pt-carne', name: 'Patacón con carne', price_delta: 5000, action_type: 'add' },
        ],
      },
      {
        id: 'inf-hogao',
        name: 'Hogao',
        description: 'Cómo quieres el hogao — obligatorio',
        selection_type: 'single',
        min_select: 1,
        max_select: 1,
        is_required: true,
        modifiers: [
          { id: 'inf-hogao-con', name: 'Con hogao', price_delta: 0, action_type: 'add' },
          { id: 'inf-hogao-aparte', name: 'Hogao aparte', price_delta: 0, action_type: 'add' },
          { id: 'inf-hogao-extra', name: 'Hogao extra', price_delta: 1500, action_type: 'add' },
          { id: 'inf-hogao-sin', name: 'Sin hogao', price_delta: 0, action_type: 'remove' },
        ],
      },
      cloneGroup(COMMON_EXTRAS_GROUP),
      cloneGroup(COMMON_REMOVE_GROUP),
      cloneGroup(COMMON_DRINKS_GROUP),
    ];
  }

  if (/hamburg|burger|perro|salchicha/i.test(text)) {
    return [
      {
        id: 'inf-burger-base',
        name: 'Tipo de preparación',
        description: 'Obligatorio',
        selection_type: 'single',
        min_select: 1,
        max_select: 1,
        is_required: true,
        modifiers: [
          { id: 'inf-bg-clasica', name: 'Clásica', price_delta: 0, action_type: 'add' },
          { id: 'inf-bg-doble', name: 'Doble carne', price_delta: 4000, action_type: 'add' },
          { id: 'inf-bg-especial', name: 'Especial de la casa', price_delta: 2500, action_type: 'add' },
        ],
      },
      cloneGroup(COMMON_REMOVE_GROUP),
      cloneGroup(COMMON_EXTRAS_GROUP),
      cloneGroup(COMMON_DRINKS_GROUP),
    ];
  }

  if (/pizza/i.test(text)) {
    return [
      {
        id: 'inf-pizza-size',
        name: 'Tamaño',
        description: 'Elige el tamaño — obligatorio',
        selection_type: 'single',
        min_select: 1,
        max_select: 1,
        is_required: true,
        modifiers: [
          { id: 'inf-pz-personal', name: 'Personal', price_delta: 0, action_type: 'add' },
          { id: 'inf-pz-mediana', name: 'Mediana', price_delta: 5000, action_type: 'add' },
          { id: 'inf-pz-familiar', name: 'Familiar', price_delta: 12000, action_type: 'add' },
        ],
      },
      {
        id: 'inf-pizza-toppings',
        name: 'Adiciones',
        description: 'Extras para tu pizza',
        selection_type: 'multiple',
        min_select: 0,
        is_required: false,
        modifiers: [
          { id: 'inf-pz-queso', name: 'Extra queso', price_delta: 3000, action_type: 'add' },
          { id: 'inf-pz-jamon', name: 'Jamón', price_delta: 3500, action_type: 'add' },
          { id: 'inf-pz-champ', name: 'Champiñones', price_delta: 2500, action_type: 'add' },
        ],
      },
      cloneGroup(COMMON_DRINKS_GROUP),
      cloneGroup(COMMON_REMOVE_GROUP),
    ];
  }

  if (/helado|sundae|malteada|postre/i.test(text)) {
    return [
      {
        id: 'inf-helado-sabor',
        name: 'Sabor',
        description: 'Elige tu sabor — obligatorio',
        selection_type: 'single',
        min_select: 1,
        max_select: 1,
        is_required: true,
        modifiers: [
          { id: 'inf-hl-vainilla', name: 'Vainilla', price_delta: 0, action_type: 'add' },
          { id: 'inf-hl-chocolate', name: 'Chocolate', price_delta: 0, action_type: 'add' },
          { id: 'inf-hl-fresa', name: 'Fresa', price_delta: 0, action_type: 'add' },
          { id: 'inf-hl-mix', name: 'Mixto', price_delta: 500, action_type: 'add' },
        ],
      },
      {
        id: 'inf-helado-cobertura',
        name: 'Cobertura',
        description: 'Opcional',
        selection_type: 'multiple',
        min_select: 0,
        is_required: false,
        modifiers: [
          { id: 'inf-hl-chispas', name: 'Chispas de chocolate', price_delta: 1500, action_type: 'add' },
          { id: 'inf-hl-arequipe', name: 'Arequipe', price_delta: 2000, action_type: 'add' },
          { id: 'inf-hl-granola', name: 'Granola', price_delta: 1500, action_type: 'add' },
        ],
      },
    ];
  }

  if (/sushi|wok|roll/i.test(text)) {
    return [
      {
        id: 'inf-sushi-salsa',
        name: 'Salsa',
        description: 'Elige tu salsa',
        selection_type: 'single',
        min_select: 1,
        max_select: 1,
        is_required: true,
        modifiers: [
          { id: 'inf-sv-soya', name: 'Soya', price_delta: 0, action_type: 'add' },
          { id: 'inf-sv-picante', name: 'Picante', price_delta: 0, action_type: 'add' },
          { id: 'inf-sv-aguacate', name: 'Salsa de aguacate', price_delta: 2000, action_type: 'add' },
        ],
      },
      cloneGroup(COMMON_EXTRAS_GROUP),
      cloneGroup(COMMON_DRINKS_GROUP),
    ];
  }

  if (/ceviche|coctel/i.test(text)) {
    return [
      {
        id: 'inf-ceviche-picante',
        name: 'Nivel de picante',
        description: 'Obligatorio',
        selection_type: 'single',
        min_select: 1,
        max_select: 1,
        is_required: true,
        modifiers: [
          { id: 'inf-cv-suave', name: 'Suave', price_delta: 0, action_type: 'add' },
          { id: 'inf-cv-medio', name: 'Medio', price_delta: 0, action_type: 'add' },
          { id: 'inf-cv-picante', name: 'Bien picante', price_delta: 0, action_type: 'add' },
        ],
      },
      {
        id: 'inf-ceviche-extra',
        name: 'Adiciones',
        selection_type: 'multiple',
        min_select: 0,
        is_required: false,
        modifiers: [
          { id: 'inf-cv-aguacate', name: 'Extra aguacate', price_delta: 3000, action_type: 'add' },
          { id: 'inf-cv-patacon', name: 'Patacones', price_delta: 4000, action_type: 'add' },
        ],
      },
      cloneGroup(COMMON_DRINKS_GROUP),
    ];
  }

  if (/empanada/i.test(text)) {
    return [
      {
        id: 'inf-emp-salsa',
        name: 'Salsa',
        description: 'Elige tu salsa',
        selection_type: 'single',
        min_select: 0,
        max_select: 1,
        is_required: false,
        modifiers: [
          { id: 'inf-em-aji', name: 'Ají casero', price_delta: 0, action_type: 'add' },
          { id: 'inf-em-tomate', name: 'Salsa de tomate', price_delta: 0, action_type: 'add' },
          { id: 'inf-em-limon', name: 'Limón', price_delta: 0, action_type: 'add' },
        ],
      },
      cloneGroup(COMMON_DRINKS_GROUP),
    ];
  }

  if (/arepa/i.test(text)) {
    return [
      {
        id: 'inf-arepa-relleno',
        name: 'Relleno',
        description: 'Obligatorio',
        selection_type: 'single',
        min_select: 1,
        max_select: 1,
        is_required: true,
        modifiers: [
          { id: 'inf-ar-huevo', name: 'Con huevo', price_delta: 0, action_type: 'add' },
          { id: 'inf-ar-queso', name: 'Con queso', price_delta: 1500, action_type: 'add' },
          { id: 'inf-ar-mix', name: 'Huevo y queso', price_delta: 2500, action_type: 'add' },
        ],
      },
      cloneGroup(COMMON_DRINKS_GROUP),
      cloneGroup(COMMON_EXTRAS_GROUP),
    ];
  }

  if (/pollo|broaster|alitas/i.test(text)) {
    return [
      {
        id: 'inf-pollo-salsa',
        name: 'Salsa del pollo',
        description: 'Obligatorio',
        selection_type: 'single',
        min_select: 1,
        max_select: 1,
        is_required: true,
        modifiers: [
          { id: 'inf-pl-bbq', name: 'BBQ', price_delta: 0, action_type: 'add' },
          { id: 'inf-pl-picante', name: 'Picante', price_delta: 0, action_type: 'add' },
          { id: 'inf-pl-natural', name: 'Natural', price_delta: 0, action_type: 'add' },
        ],
      },
      cloneGroup(COMMON_EXTRAS_GROUP),
      cloneGroup(COMMON_DRINKS_GROUP),
    ];
  }

  if (/carne|res|cerdo|churrasco|lomo|costilla|asado|bistec|picada/i.test(text)) {
    return [
      {
        id: 'inf-meat-done',
        name: 'Punto de la carne',
        description: 'Obligatorio',
        selection_type: 'single',
        min_select: 1,
        max_select: 1,
        is_required: true,
        modifiers: [
          { id: 'inf-done', name: 'Bien cocido', price_delta: 0, action_type: 'add' },
          { id: 'inf-medium', name: 'Término medio', price_delta: 0, action_type: 'add' },
          { id: 'inf-juicy', name: 'Jugoso', price_delta: 0, action_type: 'add' },
        ],
      },
      cloneGroup(COMMON_REMOVE_GROUP),
      cloneGroup(COMMON_EXTRAS_GROUP),
      cloneGroup(COMMON_DRINKS_GROUP),
    ];
  }

  if (/arroz|bandeja|corrientazo|almuerzo|men[uú]/i.test(text)) {
    return [
      {
        id: 'inf-protein',
        name: 'Proteína principal',
        description: 'Elige una — obligatorio',
        selection_type: 'single',
        min_select: 1,
        max_select: 1,
        is_required: true,
        modifiers: [
          { id: 'inf-pol', name: 'Pollo', price_delta: 0, action_type: 'add' },
          { id: 'inf-res', name: 'Carne de res', price_delta: 2000, action_type: 'add' },
          { id: 'inf-pesc', name: 'Pescado', price_delta: 1500, action_type: 'add' },
          { id: 'inf-cerdo', name: 'Cerdo', price_delta: 1000, action_type: 'add' },
        ],
      },
      cloneGroup(COMMON_REMOVE_GROUP),
      cloneGroup(COMMON_EXTRAS_GROUP),
      cloneGroup(COMMON_DRINKS_GROUP),
    ];
  }

  if (/caf[eé]|desayuno|pandebono/i.test(text)) {
    return [
      {
        id: 'inf-cafe-tipo',
        name: 'Tipo de café',
        description: 'Obligatorio',
        selection_type: 'single',
        min_select: 1,
        max_select: 1,
        is_required: true,
        modifiers: [
          { id: 'inf-cf-leche', name: 'Con leche', price_delta: 0, action_type: 'add' },
          { id: 'inf-cf-negro', name: 'Negro', price_delta: 0, action_type: 'add' },
          { id: 'inf-cf-descafe', name: 'Descafeinado', price_delta: 500, action_type: 'add' },
        ],
      },
      {
        id: 'inf-cafe-pan',
        name: 'Acompañamiento',
        selection_type: 'multiple',
        min_select: 0,
        is_required: false,
        modifiers: [
          { id: 'inf-cf-pandebono', name: 'Pandebono extra', price_delta: 2500, action_type: 'add' },
          { id: 'inf-cf-arepa', name: 'Arepa', price_delta: 3000, action_type: 'add' },
        ],
      },
      cloneGroup(COMMON_DRINKS_GROUP),
    ];
  }

  return defaultComidaOptions();
}

export function buildModifierLineSummary(modifiers = []) {
  if (!modifiers.length) return '';
  return modifiers.map((m) => {
    const prefix = m.action_type === 'remove' ? 'Sin' : m.action_type === 'substitute' ? 'Cambio:' : '+';
    const label = m.action_type === 'remove' ? m.name.replace(/^Sin\s+/i, '') : m.name;
    const price = m.price_delta > 0 ? ` (${formatCOP(m.price_delta)})` : '';
    return `${prefix} ${label}${price}`.trim();
  }).join(' · ');
}

export function calculateUnitPrice(basePrice, modifiers = []) {
  const delta = modifiers.reduce((sum, m) => sum + (Number(m.price_delta) || 0), 0);
  return Math.max(0, Number(basePrice) + delta);
}

export function validateModifierSelection(groups, selectedByGroup) {
  const errors = [];
  for (const group of groups) {
    const selected = selectedByGroup[group.id] || [];
    const minRequired = group.is_required
      ? Math.max(1, group.min_select || 0)
      : (group.min_select || 0);

    if (selected.length < minRequired) {
      errors.push(
        group.is_required
          ? `Debes elegir una opción en "${group.name}"`
          : `"${group.name}" requiere al menos ${minRequired} opción(es)`,
      );
      continue;
    }
    if (group.max_select && selected.length > group.max_select) {
      errors.push(`"${group.name}" permite máximo ${group.max_select} opción(es)`);
    }
  }
  return errors;
}

export function flattenSelectedModifiers(groups, selectedByGroup) {
  const flat = [];
  for (const group of groups) {
    const ids = selectedByGroup[group.id] || [];
    for (const modifierId of ids) {
      const modifier = group.modifiers.find((m) => m.id === modifierId);
      if (modifier) {
        flat.push({
          group_id: group.id,
          group_name: group.name,
          modifier_id: modifier.id,
          name: modifier.name,
          price_delta: modifier.price_delta || 0,
          action_type: modifier.action_type || 'add',
        });
      }
    }
  }
  return flat;
}

/** Restaura la selección de un ítem del carrito o pedido anterior */
export function selectionFromModifiers(groups, modifiers = []) {
  const selected = {};
  for (const group of groups) {
    selected[group.id] = modifiers
      .filter((m) => m.group_id === group.id)
      .map((m) => m.modifier_id);
  }
  return selected;
}

/** Solo preselecciona opciones marcadas is_default; obligatorios quedan vacíos hasta que el cliente elija */
export function getDefaultSelection(groups) {
  const selected = {};
  for (const group of groups) {
    const defaults = group.modifiers.filter((m) => m.is_default).map((m) => m.id);
    selected[group.id] = defaults.length
      ? defaults.slice(0, group.max_select || defaults.length)
      : [];
  }
  return selected;
}

export function countRequiredGroups(groups = []) {
  return groups.filter((g) => g.is_required).length;
}

export function countSatisfiedRequiredGroups(groups, selectedByGroup) {
  return groups.filter((g) => {
    if (!g.is_required) return true;
    const selected = selectedByGroup[g.id] || [];
    const min = Math.max(1, g.min_select || 0);
    return selected.length >= min;
  }).length;
}
