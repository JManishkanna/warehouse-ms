// BazzerCart Dark Store Quick-Commerce Mock & Telemetry Dataset (Indian Rupees ₹)

export const formatINR = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

export const GROCERY_CATEGORIES = [
  'All',
  'Dairy & Bread',
  'Fresh Produce',
  'Staples & Grains',
  'Snacks & Munchies',
  'Beverages & Juices',
  'Instant & Frozen Food',
  'Cleaning & Household',
];

export const INITIAL_GROCERY_PRODUCTS = [
  {
    id: 1,
    sku: 'BLK-DRY-001',
    name: 'Amul Taaza Toned Fresh Milk',
    packSize: '1 Litre Pouch',
    category: 'Dairy & Bread',
    temperatureZone: 'Chilled (2-4°C)',
    batchNo: 'B-AMUL-9821',
    costPrice: 50.00,
    unitPrice: 56.00,
    quantity: 140,
    reorderLevel: 40,
    shelf: { id: 1, label: 'A-1-1', aisle: 'A', rowNum: 1, colNum: 1, capacity: 200 },
    expiryDate: '2026-11-04',
    freshnessScore: 'Fresh (4 days left)',
    description: 'Pasteurized homogenized toned milk. Keep refrigerated below 4°C.',
  },
  {
    id: 2,
    sku: 'BLK-STP-002',
    name: 'Aashirvaad Shudh Chakki Atta',
    packSize: '5 kg Bag',
    category: 'Staples & Grains',
    temperatureZone: 'Ambient (Dry)',
    batchNo: 'B-AASH-4412',
    costPrice: 220.00,
    unitPrice: 265.00,
    quantity: 48,
    reorderLevel: 20,
    shelf: { id: 2, label: 'A-1-2', aisle: 'A', rowNum: 1, colNum: 2, capacity: 60 },
    expiryDate: '2027-04-15',
    freshnessScore: 'Optimal (6 months)',
    description: '100% whole wheat grain atta with dietary fiber for soft rotis.',
  },
  {
    id: 3,
    sku: 'BLK-SNK-003',
    name: "Lay's India's Magic Masala Chips",
    packSize: '90g Party Pack',
    category: 'Snacks & Munchies',
    temperatureZone: 'Ambient (Dry)',
    batchNo: 'B-LAYS-7731',
    costPrice: 28.00,
    unitPrice: 35.00,
    quantity: 210,
    reorderLevel: 50,
    shelf: { id: 7, label: 'B-1-1', aisle: 'B', rowNum: 1, colNum: 1, capacity: 250 },
    expiryDate: '2027-02-28',
    freshnessScore: 'Optimal (4 months)',
    description: 'Spiced potato ridged chips prepared in edible vegetable oil.',
  },
  {
    id: 4,
    sku: 'BLK-BEV-004',
    name: 'Coca-Cola Original Zero Sugar',
    packSize: '750ml PET Bottle',
    category: 'Beverages & Juices',
    temperatureZone: 'Chilled (4-8°C)',
    batchNo: 'B-COKE-1022',
    costPrice: 32.00,
    unitPrice: 40.00,
    quantity: 95,
    reorderLevel: 30,
    shelf: { id: 8, label: 'B-1-2', aisle: 'B', rowNum: 1, colNum: 2, capacity: 150 },
    expiryDate: '2027-06-30',
    freshnessScore: 'Optimal (8 months)',
    description: 'Sparkling zero calorie soft drink with refreshing carbonation.',
  },
  {
    id: 5,
    sku: 'BLK-FRO-005',
    name: "McCain French Fries Crispy",
    packSize: '420g Frozen Pack',
    category: 'Instant & Frozen Food',
    temperatureZone: 'Frozen (-18°C)',
    batchNo: 'B-MCIN-3329',
    costPrice: 95.00,
    unitPrice: 125.00,
    quantity: 18,
    reorderLevel: 25,
    shelf: { id: 13, label: 'C-1-1', aisle: 'C', rowNum: 1, colNum: 1, capacity: 50 },
    expiryDate: '2027-08-30',
    freshnessScore: 'Optimal (10 months)',
    description: 'Ready to fry crisp french fries made from premium Russet potatoes.',
  },
  {
    id: 6,
    sku: 'BLK-STP-006',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    packSize: '1 Litre Pouch',
    category: 'Staples & Grains',
    temperatureZone: 'Ambient (Dry)',
    batchNo: 'B-FORT-5501',
    costPrice: 118.00,
    unitPrice: 138.00,
    quantity: 65,
    reorderLevel: 20,
    shelf: { id: 3, label: 'A-1-3', aisle: 'A', rowNum: 1, colNum: 3, capacity: 100 },
    expiryDate: '2027-07-15',
    freshnessScore: 'Optimal (9 months)',
    description: 'Light and healthy refined sunflower oil enriched with Vitamins A and D.',
  },
  {
    id: 7,
    sku: 'BLK-DRY-007',
    name: 'Britannia 100% Whole Wheat Bread',
    packSize: '400g Loaf',
    category: 'Dairy & Bread',
    temperatureZone: 'Ambient (Dry)',
    batchNo: 'B-BRIT-8810',
    costPrice: 40.00,
    unitPrice: 50.00,
    quantity: 12,
    reorderLevel: 25,
    shelf: { id: 4, label: 'A-2-1', aisle: 'A', rowNum: 2, colNum: 1, capacity: 80 },
    expiryDate: '2026-11-03',
    freshnessScore: 'Expiring Soon (3 days)',
    description: 'Nutritious fiber-rich brown bread with zero added maida.',
  },
  {
    id: 8,
    sku: 'BLK-FRS-008',
    name: 'Fresh Farm Cavendish Bananas',
    packSize: '1 kg (approx 5-6 pcs)',
    category: 'Fresh Produce',
    temperatureZone: 'Ambient (Cool)',
    batchNo: 'B-BAN-0091',
    costPrice: 45.00,
    unitPrice: 62.00,
    quantity: 55,
    reorderLevel: 20,
    shelf: { id: 14, label: 'C-1-2', aisle: 'C', rowNum: 1, colNum: 2, capacity: 80 },
    expiryDate: '2026-11-04',
    freshnessScore: 'Fresh (4 days)',
    description: 'Farm-fresh naturally ripened potassium rich bananas.',
  },
  {
    id: 9,
    sku: 'BLK-INS-009',
    name: 'Nestlé Maggi 2-Minute Masala Noodles',
    packSize: 'Pack of 12 (840g)',
    category: 'Instant & Frozen Food',
    temperatureZone: 'Ambient (Dry)',
    batchNo: 'B-MAG-6622',
    costPrice: 148.00,
    unitPrice: 172.00,
    quantity: 110,
    reorderLevel: 30,
    shelf: { id: 9, label: 'B-1-3', aisle: 'B', rowNum: 1, colNum: 3, capacity: 150 },
    expiryDate: '2027-05-10',
    freshnessScore: 'Optimal (7 months)',
    description: 'Instant wheat noodles spiced with signature roasted spice mix.',
  },
  {
    id: 10,
    sku: 'BLK-CLN-010',
    name: 'Surf Excel Matic Liquid Detergent',
    packSize: '2 Litre Refill Pouch',
    category: 'Cleaning & Household',
    temperatureZone: 'Ambient (Dry)',
    batchNo: 'B-SURF-9941',
    costPrice: 340.00,
    unitPrice: 415.00,
    quantity: 32,
    reorderLevel: 15,
    shelf: { id: 10, label: 'B-2-1', aisle: 'B', rowNum: 2, colNum: 1, capacity: 50 },
    expiryDate: '2028-09-30',
    freshnessScore: 'Optimal (2 years)',
    description: 'Superior stain removal formulation designed for automatic washing machines.',
  },
];

const INITIAL_WAREHOUSES = [
  { id: 1, name: 'BazzerCart Dark Store #BLR-KORAMANGALA', address: 'Plot 44, 80ft Road, 4th Block, Koramangala, Bengaluru - 560034', capacity: 3500 },
];

const generateDarkStoreShelves = () => {
  const shelves = [];
  let id = 1;
  const aisles = ['A', 'B', 'C'];
  for (const aisle of aisles) {
    for (let r = 1; r <= 4; r++) {
      for (let c = 1; c <= 3; c++) {
        shelves.push({
          id: id++,
          aisle,
          rowNum: r,
          colNum: c,
          label: `${aisle}-${r}-${c}`,
          capacity: aisle === 'A' ? 120 : aisle === 'B' ? 180 : 80,
          warehouse: INITIAL_WAREHOUSES[0],
        });
      }
    }
  }
  return shelves;
};

const INITIAL_SHELVES = generateDarkStoreShelves();

const INITIAL_SUPPLIERS = [
  { id: 1, name: 'Amul Gujarat Co-op Federation (GCDMF)', contactPerson: 'Rajesh Patel', email: 'blr-depot@amul.coop', phone: '+91-98450-11223', address: 'Whitefield Cold Depot, Bengaluru', rating: 5 },
  { id: 2, name: 'ITC FMCG Distribution Center', contactPerson: 'Anita Rao', email: 'anita.rao@itc.in', phone: '+91-99801-44556', address: 'Yeshwanthpur Industrial Suburb, Bengaluru', rating: 5 },
  { id: 3, name: 'PepsiCo India Fritolay Division', contactPerson: 'Vikram Joshi', email: 'orders.south@pepsico.com', phone: '+91-98765-77889', address: 'Electronic City Phase 2, Bengaluru', rating: 4 },
  { id: 4, name: 'Hindustan Unilever Limited (HUL)', contactPerson: 'Suresh Kumar', email: 'supplychain@hul.com', phone: '+91-99000-33221', address: 'Peenya Industrial Area 3rd Stage, Bengaluru', rating: 5 },
];

const INITIAL_ORDERS = [
  {
    id: 8401,
    orderType: 'INBOUND',
    status: 'COMPLETED',
    supplier: INITIAL_SUPPLIERS[0],
    customerName: null,
    items: [{ id: 1, product: INITIAL_GROCERY_PRODUCTS[0], quantity: 200, unitPrice: 50.00 }],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 8402,
    orderType: 'OUTBOUND',
    status: 'COMPLETED',
    supplier: null,
    customerName: 'BazzerCart Rider Batch #109 (10-Min Dispatch)',
    items: [
      { id: 2, product: INITIAL_GROCERY_PRODUCTS[0], quantity: 4, unitPrice: 56.00 },
      { id: 3, product: INITIAL_GROCERY_PRODUCTS[2], quantity: 6, unitPrice: 35.00 },
      { id: 4, product: INITIAL_GROCERY_PRODUCTS[6], quantity: 2, unitPrice: 50.00 },
    ],
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 8403,
    orderType: 'INBOUND',
    status: 'PROCESSING',
    supplier: INITIAL_SUPPLIERS[1],
    customerName: null,
    items: [{ id: 5, product: INITIAL_GROCERY_PRODUCTS[1], quantity: 50, unitPrice: 220.00 }],
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_TASKS = [
  { id: 1, title: 'Restock Chilled Milk Bay A-1-1', description: 'Transfer 60 Amul Taaza pouches from cold walk-in to picking bin A-1-1.', assignedTo: { id: 3, username: 'worker', role: 'WORKER' }, status: 'IN_PROGRESS', dueDate: '2026-11-01' },
  { id: 2, title: 'Freshness Inspection on Bread & Bakery', description: 'Audit expiration tags on Britannia bread loaves and clear short-dated units.', assignedTo: { id: 2, username: 'manager', role: 'MANAGER' }, status: 'TODO', dueDate: '2026-10-31' },
  { id: 3, title: 'Deep Freezer Temp Log Verification (-18°C)', description: 'Log calibrated temperature sensor data for McCain frozen racks in Aisle C.', assignedTo: { id: 3, username: 'worker', role: 'WORKER' }, status: 'DONE', dueDate: '2026-10-31' },
];

const INITIAL_ALERTS = [
  { id: 1, alertType: 'EXPIRY_WARNING', message: "Product 'Britannia 100% Whole Wheat Bread' (SKU: BLK-DRY-007) has only 3 days shelf life remaining. Prioritize for front-bin quick dispatch.", isRead: false, product: INITIAL_GROCERY_PRODUCTS[6], createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 2, alertType: 'LOW_STOCK', message: "Product 'McCain French Fries Crispy' (SKU: BLK-FRO-005) below safety threshold (18 units in bin). Reorder from Frozen Foods distributor.", isRead: false, product: INITIAL_GROCERY_PRODUCTS[4], createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 3, alertType: 'REORDER_NEEDED', message: "Daily replenishment manifest required for Amul Dairy delivery at 05:00 AM.", isRead: true, product: null, createdAt: new Date(Date.now() - 86400000).toISOString() },
];

const INITIAL_USERS = [
  { id: 1, username: 'admin', email: 'store.lead@bazzercart.internal', role: 'ADMIN', active: true, createdAt: '2026-09-01' },
  { id: 2, username: 'manager', email: 'inventory.mgr@bazzercart.internal', role: 'MANAGER', active: true, createdAt: '2026-09-15' },
  { id: 3, username: 'worker', email: 'picker.lead@bazzercart.internal', role: 'WORKER', active: true, createdAt: '2026-10-01' },
];

// Comprehensive Financial Analytics Data for BazzerCart Dark Store (in Indian Rupees ₹)
export const BAZZERCART_FINANCIALS = {
  daily: [
    { period: '24 Oct', revenue: 64200, cost: 51200, profit: 13000, margin: '20.2%' },
    { period: '25 Oct', revenue: 78500, cost: 62400, profit: 16100, margin: '20.5%' },
    { period: '26 Oct', revenue: 89400, cost: 70800, profit: 18600, margin: '20.8%' },
    { period: '27 Oct', revenue: 94100, cost: 74200, profit: 19900, margin: '21.1%' },
    { period: '28 Oct', revenue: 71200, cost: 56900, profit: 14300, margin: '20.1%' },
    { period: '29 Oct', revenue: 82600, cost: 65100, profit: 17500, margin: '21.2%' },
    { period: '30 Oct', revenue: 98900, cost: 77500, profit: 21400, margin: '21.6%' },
    { period: '31 Oct (Today)', revenue: 104500, cost: 81500, profit: 23000, margin: '22.0%' },
  ],
  monthly: [
    { period: 'Nov 2025', revenue: 1840000, cost: 1472000, profit: 368000, margin: '20.0%' },
    { period: 'Dec 2025', revenue: 2210000, cost: 1745000, profit: 465000, margin: '21.0%' },
    { period: 'Jan 2026', revenue: 2050000, cost: 1620000, profit: 430000, margin: '21.0%' },
    { period: 'Feb 2026', revenue: 1980000, cost: 1564000, profit: 416000, margin: '21.0%' },
    { period: 'Mar 2026', revenue: 2340000, cost: 1848000, profit: 492000, margin: '21.0%' },
    { period: 'Apr 2026', revenue: 2190000, cost: 1730000, profit: 460000, margin: '21.0%' },
    { period: 'May 2026', revenue: 2480000, cost: 1934000, profit: 546000, margin: '22.0%' },
    { period: 'Jun 2026', revenue: 2390000, cost: 1864000, profit: 526000, margin: '22.0%' },
    { period: 'Jul 2026', revenue: 2560000, cost: 1996000, profit: 564000, margin: '22.0%' },
    { period: 'Aug 2026', revenue: 2710000, cost: 2113000, profit: 597000, margin: '22.0%' },
    { period: 'Sep 2026', revenue: 2650000, cost: 2067000, profit: 583000, margin: '22.0%' },
    { period: 'Oct 2026', revenue: 2890000, cost: 2225000, profit: 665000, margin: '23.0%' },
  ],
  yearly: [
    { period: 'FY 2023-24', revenue: 18200000, cost: 14742000, profit: 3458000, margin: '19.0%' },
    { period: 'FY 2024-25', revenue: 24800000, cost: 19840000, profit: 4960000, margin: '20.0%' },
    { period: 'FY 2025-26', revenue: 31500000, cost: 24570000, profit: 6930000, margin: '22.0%' },
    { period: 'FY 2026-27 (YTD)', revenue: 17200000, cost: 13416000, profit: 3784000, margin: '22.0%' },
  ],
};

export const BLINKIT_FINANCIALS = BAZZERCART_FINANCIALS;

const getStore = (key, defaultVal) => {
  try {
    const s = localStorage.getItem(`bazzercart_wms_${key}`) || localStorage.getItem(`blinkit_wms_${key}`);
    return s ? JSON.parse(s) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setStore = (key, val) => {
  try {
    localStorage.setItem(`bazzercart_wms_${key}`, JSON.stringify(val));
  } catch (_) {}
};

export function handleMockRequest(url, method, data, params) {
  let path = url || '';
  try {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      const parsed = new URL(path);
      path = parsed.pathname;
    }
  } catch (_) {}
  path = path.replace(/^\/api/, '');
  if (!path.startsWith('/')) path = '/' + path;
  path = path.split('?')[0];

  const m = (method || 'get').toLowerCase();

  // Auth: Login
  if (path === '/auth/login' && m === 'post') {
    const { username } = data || {};
    const uLower = (username || 'admin').trim().toLowerCase();
    const users = getStore('users', INITIAL_USERS);
    let user = users.find((u) => u.username.toLowerCase() === uLower);

    if (!user) {
      user = {
        id: uLower === 'admin' ? 1 : uLower === 'manager' ? 2 : 3,
        username: uLower,
        email: `${uLower}@bazzercart.internal`,
        role: (uLower === 'admin' ? 'ADMIN' : uLower === 'manager' ? 'MANAGER' : 'WORKER'),
        active: true,
      };
    }

    return {
      data: {
        success: true,
        data: {
          token: `demo-jwt-bazzercart-${user.role.toLowerCase()}-${Date.now()}`,
          username: user.username,
          email: user.email,
          role: user.role,
          userId: user.id,
        },
      },
    };
  }

  // Dashboard Stats (Tailored for BazzerCart Dark Store)
  if (path === '/dashboard/stats' && m === 'get') {
    const products = getStore('products', INITIAL_GROCERY_PRODUCTS);
    const orders = getStore('orders', INITIAL_ORDERS);
    const suppliers = getStore('suppliers', INITIAL_SUPPLIERS);
    const alerts = getStore('alerts', INITIAL_ALERTS);

    const lowStockCount = products.filter((p) => p.quantity <= p.reorderLevel).length;
    const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
    const unreadAlerts = alerts.filter((a) => !a.isRead && !a.read).length;

    return {
      data: {
        success: true,
        data: {
          totalProducts: products.length,
          lowStockCount,
          pendingOrders,
          totalSuppliers: suppliers.length,
          unreadAlerts,
          todayOrders: 342,
          todayRevenue: 104500,
          todayProfit: 23000,
          financials: BAZZERCART_FINANCIALS,
          stockTrend: [
            { date: '10/25', delta: 450 },
            { date: '10/26', delta: -320 },
            { date: '10/27', delta: 580 },
            { date: '10/28', delta: -410 },
            { date: '10/29', delta: 620 },
            { date: '10/30', delta: -390 },
            { date: '10/31', delta: 480 },
          ],
          ordersByStatus: [
            { status: 'DELIVERED (10-MIN)', count: 295 },
            { status: 'DISPATCHING', count: 32 },
            { status: 'PICKING IN BIN', count: 15 },
          ],
          topProducts: products
            .slice()
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5)
            .map((p) => ({ name: p.name, quantity: p.quantity, price: p.unitPrice })),
        },
      },
    };
  }

  // Products
  if (path === '/products' && m === 'get') {
    let products = getStore('products', INITIAL_GROCERY_PRODUCTS);
    if (params && params.search) {
      const q = params.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }
    return { data: { success: true, data: products } };
  }

  if (path === '/products/low-stock' && m === 'get') {
    const products = getStore('products', INITIAL_GROCERY_PRODUCTS);
    return { data: { success: true, data: products.filter((p) => p.quantity <= p.reorderLevel) } };
  }

  if (path.match(/^\/products\/\d+\/forecast$/) && m === 'get') {
    const id = parseInt(path.split('/')[2], 10);
    const today = new Date();
    const forecast = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      forecast.push({
        date: d.toISOString().substring(5, 10),
        predictedDemand: Math.max(12, Math.round(35 + Math.sin(i * 1.5) * 14)),
      });
    }
    return {
      data: {
        success: true,
        data: {
          productId: id,
          historicalDataPoints: 30,
          predictedDailyDemand: 38,
          trend: 'INCREASING (High Quick-Commerce Velocity)',
          forecast,
        },
      },
    };
  }

  if (path === '/products' && m === 'post') {
    const products = getStore('products', INITIAL_GROCERY_PRODUCTS);
    const shelves = getStore('shelves', INITIAL_SHELVES);
    const shelf = shelves.find((s) => s.id === parseInt(data.shelfId, 10)) || null;
    const newProd = {
      ...data,
      id: Date.now(),
      shelf,
      freshnessScore: 'Fresh',
    };
    products.unshift(newProd);
    setStore('products', products);
    return { data: { success: true, data: newProd } };
  }

  if (path.match(/^\/products\/\d+$/) && m === 'put') {
    const id = parseInt(path.split('/')[2], 10);
    let products = getStore('products', INITIAL_GROCERY_PRODUCTS);
    const shelves = getStore('shelves', INITIAL_SHELVES);
    const shelf = shelves.find((s) => s.id === parseInt(data.shelfId, 10)) || null;
    products = products.map((p) => (p.id === id ? { ...p, ...data, id, shelf } : p));
    setStore('products', products);
    return { data: { success: true, data: { id, ...data, shelf } } };
  }

  if (path.match(/^\/products\/\d+$/) && m === 'delete') {
    const id = parseInt(path.split('/')[2], 10);
    let products = getStore('products', INITIAL_GROCERY_PRODUCTS);
    products = products.filter((p) => p.id !== id);
    setStore('products', products);
    return { data: { success: true, data: null } };
  }

  // Warehouse & Shelves
  if (path === '/warehouse' && m === 'get') {
    return { data: { success: true, data: INITIAL_WAREHOUSES } };
  }

  if (path === '/warehouse/shelves' && m === 'get') {
    const shelves = getStore('shelves', INITIAL_SHELVES);
    return { data: { success: true, data: shelves } };
  }

  if (path.match(/^\/warehouse\/\d+\/map$/) && m === 'get') {
    const shelves = getStore('shelves', INITIAL_SHELVES);
    const products = getStore('products', INITIAL_GROCERY_PRODUCTS);

    const mapData = shelves.map((shelf) => {
      const shelfProds = products.filter((p) => p.shelf && p.shelf.id === shelf.id);
      let status = 'EMPTY';
      if (shelfProds.length > 0) {
        const anyLow = shelfProds.some((p) => p.quantity <= p.reorderLevel);
        status = anyLow ? 'LOW' : 'OCCUPIED';
      }
      return {
        shelf,
        products: shelfProds,
        status,
      };
    });
    return { data: { success: true, data: mapData } };
  }

  // Orders
  if (path === '/orders' && m === 'get') {
    const orders = getStore('orders', INITIAL_ORDERS);
    return { data: { success: true, data: orders } };
  }

  if (path === '/orders' && m === 'post') {
    const orders = getStore('orders', INITIAL_ORDERS);
    const suppliers = getStore('suppliers', INITIAL_SUPPLIERS);
    const products = getStore('products', INITIAL_GROCERY_PRODUCTS);
    const supplier = suppliers.find((s) => s.id === parseInt(data.supplierId, 10)) || null;

    const items = (data.items || []).map((it, idx) => ({
      id: idx + 1,
      product: products.find((p) => p.id === parseInt(it.productId, 10)) || null,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
    }));

    const newOrder = {
      id: Math.floor(8400 + Math.random() * 500),
      orderType: data.orderType,
      status: 'PENDING',
      supplier,
      customerName: data.customerName,
      items,
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    setStore('orders', orders);
    return { data: { success: true, data: newOrder } };
  }

  if (path.match(/^\/orders\/\d+\/status$/) && m === 'patch') {
    const id = parseInt(cleanUrlOrPath(path).split('/')[2], 10);
    const status = params?.status || 'COMPLETED';
    let orders = getStore('orders', INITIAL_ORDERS);
    orders = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setStore('orders', orders);
    return { data: { success: true, data: { id, status } } };
  }

  if (path.match(/^\/orders\/\d+$/) && m === 'delete') {
    const id = parseInt(cleanUrlOrPath(path).split('/')[2], 10);
    let orders = getStore('orders', INITIAL_ORDERS);
    orders = orders.filter((o) => o.id !== id);
    setStore('orders', orders);
    return { data: { success: true, data: null } };
  }

  // Suppliers
  if (path === '/suppliers' && m === 'get') {
    const suppliers = getStore('suppliers', INITIAL_SUPPLIERS);
    return { data: { success: true, data: suppliers } };
  }

  // Tasks
  if (path === '/tasks' && m === 'get') {
    const tasks = getStore('tasks', INITIAL_TASKS);
    return { data: { success: true, data: tasks } };
  }

  // Alerts
  if (path === '/alerts' && m === 'get') {
    const alerts = getStore('alerts', INITIAL_ALERTS);
    return { data: { success: true, data: alerts } };
  }

  if (path === '/alerts/count' && m === 'get') {
    const alerts = getStore('alerts', INITIAL_ALERTS);
    const count = alerts.filter((a) => !a.isRead && !a.read).length;
    return { data: { success: true, data: count } };
  }

  if (path.match(/^\/alerts\/\d+\/read$/) && m === 'patch') {
    const id = parseInt(cleanUrlOrPath(path).split('/')[2], 10);
    let alerts = getStore('alerts', INITIAL_ALERTS);
    alerts = alerts.map((a) => (a.id === id ? { ...a, isRead: true, read: true } : a));
    setStore('alerts', alerts);
    return { data: { success: true, data: { id, read: true } } };
  }

  if (path === '/alerts/read-all' && m === 'post') {
    let alerts = getStore('alerts', INITIAL_ALERTS);
    alerts = alerts.map((a) => ({ ...a, isRead: true, read: true }));
    setStore('alerts', alerts);
    return { data: { success: true, data: null } };
  }

  // Users
  if (path === '/users' && m === 'get') {
    const users = getStore('users', INITIAL_USERS);
    return { data: { success: true, data: users } };
  }

  return { data: { success: true, data: null } };
}

function cleanUrlOrPath(p) {
  return p;
}
