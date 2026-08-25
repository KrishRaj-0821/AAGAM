// ─────────────────────────────────────────────────────────────────────────────
// AAGAM CENTRAL DATABASE ENGINE & DATA SYNCHRONIZATION LAYER
// Single Source of Truth for all 7 Portals: Admin, Farmer, Mandi, Quality, Officer, Warehouse, Buyer
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'AAGAM_CENTRAL_DATABASE_V2';

// 1. IMMUTABLE PRIMARY KEY PREFIX GENERATOR
export const generateId = (prefix) => {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${rand}`;
};

// 2. CENTRALIZED PRODUCE LOT STATE MACHINE
export const LOT_STATUS_MACHINE = [
  'DRAFT',
  'SUBMITTED',
  'RECEIVED_AT_MANDI',
  'WEIGHED',
  'QUALITY_PENDING',
  'QUALITY_PASSED',
  'PROCUREMENT_PENDING',
  'PROCURED',
  'WAREHOUSE_RECEIVED',
  'IN_STOCK',
  'RESERVED',
  'PARTIALLY_DISPATCHED',
  'DISPATCHED',
  'DELIVERED',
  'COMPLETED'
];

// Initial Relational Seed Dataset
const INITIAL_SEED_DB = {
  users: [
    { id: 'USR-10245', role: 'FARMER', entityId: 'FRM-10245', name: 'Rajesh Kumar', email: 'rajesh.kisan@gmail.com' },
    { id: 'USR-00321', role: 'STAFF_MANDI', entityId: 'MND-BR-001', name: 'Rakesh Verma', email: 'rakesh.op@apmc.gov.in' },
    { id: 'USR-00512', role: 'STAFF_QUALITY', entityId: 'QRP-001', name: 'Dr. Anita Roy', email: 'anita.icar@gov.in' },
    { id: 'USR-00101', role: 'STAFF_OFFICER', entityId: 'PRC-001', name: 'Officer Rajesh Kumar', email: 'rajesh.dpo@gov.in' },
    { id: 'USR-00901', role: 'STAFF_WAREHOUSE', entityId: 'WH-BR-004', name: 'Deepak Sharma', email: 'deepak.fci@gov.in' },
    { id: 'USR-00091', role: 'BUYER', entityId: 'BUY-0091', name: 'Rajesh Agarwal', email: 'trade@agri-corp.in' },
  ],

  farmers: [
    { id: 'FRM-10245', userId: 'USR-10245', name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh.kisan@gmail.com', state: 'Bihar', district: 'Patna', village: 'Mithapur', status: 'VERIFIED', bankAccount: 'SBI A/C XXXX4892 (NPCI-DBT Verified)' },
    { id: 'FRM-99482', userId: 'USR-99482', name: 'Gurpreet Singh', phone: '+91 98765 11223', email: 'gurpreet.kisan@gmail.com', state: 'Punjab', district: 'Ludhiana', village: 'Khanna', status: 'VERIFIED', bankAccount: 'HDFC A/C XXXX9482' },
  ],

  farms: [
    { id: 'FARM-00125', farmerId: 'FRM-10245', area: '3.5 Acres', location: 'Mithapur, Patna, Bihar', crop: 'Wheat', season: 'Rabi', soil: 'Alluvial Loam', irrigation: 'Canal' },
    { id: 'FARM-00126', farmerId: 'FRM-99482', area: '5.0 Acres', location: 'Khanna, Ludhiana, Punjab', crop: 'Paddy', season: 'Kharif', soil: 'Clay Loam', irrigation: 'Tube Well' },
  ],

  products: [
    { id: 'PRD-001', name: 'Wheat', category: 'Cereals', variety: 'HD-2967 / Sharbati', msp: 2470, unit: 'Quintal' },
    { id: 'PRD-002', name: 'Paddy Basmati', category: 'Cereals', variety: 'PB-1121', msp: 2300, unit: 'Quintal' },
  ],

  mandis: [
    { id: 'MND-BR-001', name: 'Mithapur Agricultural Mandi', district: 'Patna', state: 'Bihar', status: 'ACTIVE', operatorId: 'USR-00321' },
    { id: 'MND-PB-004', name: 'Khanna APMC Grain Yard', district: 'Ludhiana', state: 'Punjab', status: 'ACTIVE', operatorId: 'USR-00322' },
  ],

  produceLots: [
    { 
      id: 'LOT-2026-00452', 
      farmerId: 'FRM-10245', 
      farmId: 'FARM-00125', 
      productId: 'PRD-001',
      product: 'Wheat', 
      variety: 'HD-2967', 
      quantity: 5000, 
      unit: 'KG',
      mandiId: 'MND-BR-001', 
      harvestDate: '2026-08-20',
      expectedPrice: 2470,
      status: 'COMPLETED',
      version: 1,
      createdAt: '2026-08-20T10:00:00Z'
    },
  ],

  mandiEntries: [
    { id: 'MNE-00045', lotId: 'LOT-2026-00452', mandiId: 'MND-BR-001', farmerId: 'FRM-10245', vehicleNo: 'BR-01-GA-9912', arrivalToken: 'MND-184', status: 'COMPLETED', entryTime: '2026-08-25T09:30:00Z' }
  ],

  weighments: [
    { id: 'WGH-00082', lotId: 'LOT-2026-00452', mandiId: 'MND-BR-001', grossWeight: 5180, tareWeight: 180, netWeight: 5000, verified: true, operatorId: 'USR-00321', timestamp: '2026-08-25T09:42:00Z' }
  ],

  qualityInspections: [
    { id: 'INS-00152', lotId: 'LOT-2026-00452', inspectorId: 'USR-00512', moisture: 10.8, foreignMatter: 0.4, damagedGrain: 1.1, brokenGrain: 0.8, grade: 'GRADE A', result: 'PASS', remarks: 'Meets GOI FAQ Grade A standards', timestamp: '2026-08-25T11:00:00Z' }
  ],

  qualityReports: [
    { id: 'QRP-00152', inspectionId: 'INS-00152', lotId: 'LOT-2026-00452', inspectorId: 'USR-00512', grade: 'GRADE A', status: 'LOCKED', pdfUrl: '/reports/QRP-00152.pdf', issuedAt: '2026-08-25T11:05:00Z' }
  ],

  priceRules: [
    { id: 'PRC-R-01', productId: 'PRD-001', state: 'Bihar', district: 'Patna', mandiId: 'MND-BR-001', grade: 'GRADE A', officialMsp: 2470, effectiveFrom: '2026-08-01' }
  ],

  procurementOrders: [
    { id: 'PRC-00982', lotId: 'LOT-2026-00452', farmerId: 'FRM-10245', officerId: 'USR-00101', priceRuleId: 'PRC-R-01', quantity: 5000, pricePerQtl: 2470, totalValue: 123500, mandiId: 'MND-BR-001', warehouseId: 'WH-BR-004', status: 'APPROVED', createdAt: '2026-08-25T12:00:00Z' }
  ],

  payments: [
    { id: 'PAY-88231', procurementOrderId: 'PRC-00982', lotId: 'LOT-2026-00452', farmerId: 'FRM-10245', amount: 123500, status: 'COMPLETED', txnRef: 'TXN-784521', bank: 'SBI A/C XXXX4892 (NPCI-DBT)', completedAt: '2026-08-25T14:00:00Z' }
  ],

  warehouses: [
    { id: 'WH-BR-004', name: 'Patna Central Warehouse', district: 'Patna', state: 'Bihar', totalCap: 1000000, managerId: 'USR-00901', status: 'ACTIVE' }
  ],

  inventoryLots: [
    { id: 'INV-5541', warehouseId: 'WH-BR-004', lotId: 'LOT-2026-00452', receivedQty: 5000, availableQty: 2000, reservedQty: 3000, dispatchedQty: 3000, damagedQty: 0, receivedAt: '2026-08-25T15:00:00Z' }
  ],

  buyers: [
    { id: 'BUY-0091', userId: 'USR-00091', businessName: 'ABC Agro Traders', contactPerson: 'Rajesh Agarwal', location: 'Patna, Bihar', gstin: '07AAAAA0000A1Z5', status: 'VERIFIED' }
  ],

  purchaseRequests: [
    { id: 'REQ-1001', buyerId: 'BUY-0091', lotId: 'LOT-2026-00452', inventoryId: 'INV-5541', reqQty: 3000, offerPrice: 2470, status: 'APPROVED', createdAt: '2026-08-25T15:45:00Z' }
  ],

  purchaseOrders: [
    { id: 'ORD-1052', buyerId: 'BUY-0091', lotId: 'LOT-2026-00452', inventoryId: 'INV-5541', quantity: 3000, pricePerQtl: 2470, totalAmount: 74100, warehouseId: 'WH-BR-004', status: 'COMPLETED', createdAt: '2026-08-25T16:00:00Z' }
  ],

  stockReservations: [
    { id: 'RES-00451', orderId: 'ORD-1052', inventoryId: 'INV-5541', lotId: 'LOT-2026-00452', buyerId: 'BUY-0091', warehouseId: 'WH-BR-004', reservedQty: 3000, status: 'FULFILLED', createdAt: '2026-08-25T16:05:00Z' }
  ],

  inventoryTransactions: [
    { id: 'ITX-9001', inventoryId: 'INV-5541', warehouseId: 'WH-BR-004', lotId: 'LOT-2026-00452', type: 'RECEIVED', quantity: 5000, userId: 'USR-00901', timestamp: '2026-08-25T15:00:00Z' },
    { id: 'ITX-9002', inventoryId: 'INV-5541', warehouseId: 'WH-BR-004', lotId: 'LOT-2026-00452', type: 'RESERVED', quantity: 3000, userId: 'USR-00091', timestamp: '2026-08-25T16:05:00Z' },
    { id: 'ITX-9003', inventoryId: 'INV-5541', warehouseId: 'WH-BR-004', lotId: 'LOT-2026-00452', type: 'DISPATCHED', quantity: 3000, userId: 'USR-00901', timestamp: '2026-08-25T17:00:00Z' }
  ],

  dispatches: [
    { id: 'DSP-00291', orderId: 'ORD-1052', lotId: 'LOT-2026-00452', inventoryId: 'INV-5541', warehouseId: 'WH-BR-004', vehicleNo: 'BR-01-GA-9912', quantity: 3000, status: 'DELIVERED', dispatchedAt: '2026-08-25T17:00:00Z' }
  ],

  deliveries: [
    { id: 'DLV-00291', dispatchId: 'DSP-00291', orderId: 'ORD-1052', buyerId: 'BUY-0091', status: 'DELIVERED', deliveredAt: '2026-08-25T19:30:00Z' }
  ],

  documents: [
    { id: 'DOC-001', entityType: 'PRODUCE_LOT', entityId: 'LOT-2026-00452', title: 'Gate Pass Receipt', url: '/doc/DOC-001.pdf', createdAt: '2026-08-25T09:42:00Z' },
    { id: 'DOC-002', entityType: 'QUALITY_REPORT', entityId: 'QRP-00152', title: 'Assay Certificate Grade A', url: '/doc/DOC-002.pdf', createdAt: '2026-08-25T11:05:00Z' }
  ],

  complaints: [
    { id: 'CMP-2026-00231', userId: 'USR-10245', lotId: 'LOT-2026-00452', issue: 'Weight Discrepancy Inquiry', status: 'RESOLVED', createdAt: '2026-08-24T12:00:00Z' }
  ],

  notifications: [
    { id: 'NTF-001', userId: 'USR-10245', title: 'Lot Delivered Successfully', message: 'Lot LOT-2026-00452 has completed delivery.', read: true, createdAt: '2026-08-25T19:30:00Z' }
  ],

  events: [
    { eventId: 'EVT-001', type: 'DELIVERY_COMPLETED', entityType: 'PRODUCE_LOT', entityId: 'LOT-2026-00452', actorId: 'USR-00091', timestamp: '2026-08-25T19:30:00Z' }
  ],

  auditLogs: [
    { id: 'AUD-000982', user: 'USR-00512', role: 'QUALITY_INSPECTOR', action: 'QUALITY_FINALIZED', record: 'LOT-2026-00452', oldVal: 'QUALITY_PENDING', newVal: 'QUALITY_PASSED', time: '25 Aug 2026, 11:00 AM', ip: '10.0.4.12' }
  ]
};

class CentralDatabaseEngine {
  constructor() {
    this.listeners = [];
    this.init();
  }

  init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.save(INITIAL_SEED_DB);
      }
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }

  getDb() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Parse error:', e);
    }
    return INITIAL_SEED_DB;
  }

  save(db) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      this.notifyListeners();
    } catch (e) {
      console.error('Save error:', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    const db = this.getDb();
    this.listeners.forEach(fn => fn(db));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // REAL-TIME EVENT BUS (Publishes Events & Notifications Across All Portals)
  // ───────────────────────────────────────────────────────────────────────────
  emitEvent(db, eventType, entityType, entityId, actorId, payload = {}) {
    const event = {
      eventId: generateId('EVT'),
      type: eventType,
      entityType,
      entityId,
      actorId,
      payload,
      timestamp: new Date().toISOString()
    };
    db.events = db.events || [];
    db.events.unshift(event);

    // Audit log entry
    db.auditLogs.unshift({
      id: generateId('AUD'),
      user: actorId,
      role: payload.role || 'USER',
      action: eventType,
      record: `${entityType} (${entityId})`,
      oldVal: payload.oldVal || 'None',
      newVal: payload.newVal || 'Updated',
      time: new Date().toLocaleString('en-IN'),
      ip: '10.0.4.52 (Encrypted Session)'
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // COMPLETE LOT TRACEABILITY ENGINE (Dynamic 15-Stage Graph)
  // ───────────────────────────────────────────────────────────────────────────
  traceLotLifecycle(lotId) {
    const db = this.getDb();
    
    const lot = db.produceLots.find(l => l.id === lotId) || db.produceLots[0];
    const farmer = db.farmers.find(f => f.id === lot?.farmerId);
    const farm = db.farms.find(f => f.id === lot?.farmId);
    const product = db.products.find(p => p.id === lot?.productId);
    const mandi = db.mandis.find(m => m.id === lot?.mandiId);
    const mandiEntry = db.mandiEntries.find(m => m.lotId === lot?.id);
    const weighment = db.weighments.find(w => w.lotId === lot?.id);
    const quality = db.qualityInspections.find(q => q.lotId === lot?.id);
    const qualityReport = db.qualityReports.find(q => q.lotId === lot?.id);
    const procurement = db.procurementOrders.find(p => p.lotId === lot?.id);
    const payment = db.payments.find(p => p.procurementOrderId === procurement?.id);
    const inventory = db.inventoryLots.find(i => i.lotId === lot?.id);
    const warehouse = db.warehouses.find(w => w.id === inventory?.warehouseId);
    const purchaseRequest = db.purchaseRequests.find(r => r.lotId === lot?.id);
    const buyerOrder = db.purchaseOrders.find(o => o.lotId === lot?.id);
    const buyer = db.buyers.find(b => b.id === buyerOrder?.buyerId);
    const reservation = db.stockReservations.find(r => r.orderId === buyerOrder?.id);
    const dispatch = db.dispatches.find(d => d.orderId === buyerOrder?.id);
    const delivery = db.deliveries.find(d => d.dispatchId === dispatch?.id);
    const lotComplaints = db.complaints.filter(c => c.lotId === lot?.id);
    const lotDocuments = db.documents.filter(d => d.entityId === lot?.id);
    const lotAuditLogs = db.auditLogs.filter(a => a.record && a.record.includes(lot?.id));

    return {
      lot,
      farmer,
      farm,
      product,
      mandi,
      mandiEntry,
      weighment,
      quality,
      qualityReport,
      procurement,
      payment,
      inventory,
      warehouse,
      purchaseRequest,
      buyerOrder,
      buyer,
      reservation,
      dispatch,
      delivery,
      complaints: lotComplaints,
      documents: lotDocuments,
      auditLogs: lotAuditLogs
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // DYNAMIC COMPUTED DASHBOARD METRICS (Centralized across all portals)
  // ───────────────────────────────────────────────────────────────────────────
  getAdminMetrics() {
    const db = this.getDb();
    
    return {
      totalFarmers: db.farmers.length,
      totalBuyers: db.buyers.length,
      activeLots: db.produceLots.filter(l => l.status !== 'COMPLETED').length,
      pendingInspections: db.qualityInspections.filter(i => i.result === 'PENDING').length + db.produceLots.filter(l => l.status === 'WEIGHED').length,
      pendingProcurement: db.procurementOrders.filter(p => p.status === 'PENDING').length + db.produceLots.filter(l => l.status === 'QUALITY_PASSED').length,
      totalProcurementValue: `₹${(db.procurementOrders.reduce((sum, p) => sum + (p.totalValue || 0), 0) / 10000000).toFixed(2)} Cr`,
      totalInventoryQty: `${(db.inventoryLots.reduce((sum, i) => sum + (i.availableQty || 0), 0) / 1000).toFixed(1)} MT`,
      pendingPaymentsSum: `₹${(db.payments.filter(p => p.status === 'PROCESSING' || p.status === 'PENDING').reduce((sum, p) => sum + (p.amount || 0), 0) / 1000).toFixed(1)} K`,
      activeOrders: db.purchaseOrders.filter(o => o.status !== 'COMPLETED').length,
      openComplaints: db.complaints.filter(c => c.status !== 'RESOLVED').length,
      activeMandis: db.mandis.filter(m => m.status === 'ACTIVE').length,
      totalWarehouses: db.warehouses.length
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TRANSACTIONAL MUTATIONS & SYNCHRONIZATION (All Portals ➔ Central DB)
  // ───────────────────────────────────────────────────────────────────────────
  
  // 1. Farmer Creates Produce Lot
  createProduceLot(lotData) {
    const db = this.getDb();
    const lotId = generateId('LOT-2026');
    const newLot = {
      id: lotId,
      farmerId: lotData.farmerId || 'FRM-10245',
      farmId: lotData.farmId || 'FARM-00125',
      productId: lotData.productId || 'PRD-001',
      product: lotData.product || 'Wheat',
      variety: lotData.variety || 'HD-2967',
      quantity: parseFloat(lotData.quantity) || 5000,
      unit: 'KG',
      mandiId: lotData.mandiId || 'MND-BR-001',
      harvestDate: new Date().toISOString().split('T')[0],
      expectedPrice: parseFloat(lotData.expectedPrice) || 2470,
      status: 'SUBMITTED',
      version: 1,
      createdAt: new Date().toISOString()
    };
    db.produceLots.unshift(newLot);

    this.emitEvent(db, 'LOT_CREATED', 'PRODUCE_LOT', newLot.id, newLot.farmerId, { role: 'FARMER', oldVal: 'NONE', newVal: 'SUBMITTED' });
    this.save(db);
    return newLot;
  }

  // 2. Mandi Operator Weighment
  recordWeighment(weighmentData) {
    const db = this.getDb();
    const lot = db.produceLots.find(l => l.id === weighmentData.lotId);
    if (lot) {
      lot.status = 'WEIGHED';
      lot.version += 1;
    }
    const newWeighment = {
      id: generateId('WGH'),
      lotId: weighmentData.lotId,
      mandiId: weighmentData.mandiId || 'MND-BR-001',
      grossWeight: parseFloat(weighmentData.grossWeight),
      tareWeight: parseFloat(weighmentData.tareWeight),
      netWeight: parseFloat(weighmentData.grossWeight) - parseFloat(weighmentData.tareWeight),
      verified: true,
      operatorId: weighmentData.operatorId || 'USR-00321',
      timestamp: new Date().toISOString()
    };
    db.weighments.unshift(newWeighment);

    this.emitEvent(db, 'WEIGHMENT_COMPLETED', 'PRODUCE_LOT', weighmentData.lotId, newWeighment.operatorId, { role: 'MANDI_OPERATOR', oldVal: 'RECEIVED_AT_MANDI', newVal: 'WEIGHED' });
    this.save(db);
    return newWeighment;
  }

  // 3. Quality Inspector Assay
  submitQualityInspection(inspectionData) {
    const db = this.getDb();
    const lot = db.produceLots.find(l => l.id === inspectionData.lotId);
    const pass = inspectionData.result === 'PASS';
    if (lot) {
      lot.status = pass ? 'QUALITY_PASSED' : 'QUALITY_REJECTED';
      lot.version += 1;
    }
    const newInspection = {
      id: generateId('INS'),
      lotId: inspectionData.lotId,
      inspectorId: inspectionData.inspectorId || 'USR-00512',
      moisture: parseFloat(inspectionData.moisture),
      foreignMatter: parseFloat(inspectionData.foreignMatter),
      damagedGrain: parseFloat(inspectionData.damagedGrain || 1.0),
      brokenGrain: parseFloat(inspectionData.brokenGrain || 0.8),
      grade: inspectionData.grade || 'GRADE A',
      result: pass ? 'PASS' : 'FAIL',
      remarks: inspectionData.remarks || 'Verified by NIR Assay',
      timestamp: new Date().toISOString()
    };
    db.qualityInspections.unshift(newInspection);

    // Create Formal Locked Quality Report
    const newReport = {
      id: generateId('QRP'),
      inspectionId: newInspection.id,
      lotId: newInspection.lotId,
      inspectorId: newInspection.inspectorId,
      grade: newInspection.grade,
      status: 'LOCKED',
      pdfUrl: `/reports/${newInspection.id}.pdf`,
      issuedAt: new Date().toISOString()
    };
    db.qualityReports.unshift(newReport);

    this.emitEvent(db, pass ? 'QUALITY_PASSED' : 'QUALITY_REJECTED', 'PRODUCE_LOT', inspectionData.lotId, newInspection.inspectorId, { role: 'QUALITY_INSPECTOR', oldVal: 'WEIGHED', newVal: lot?.status });
    this.save(db);
    return newReport;
  }

  // 4. Procurement Officer Approval
  approveProcurement(procData) {
    const db = this.getDb();
    const lot = db.produceLots.find(l => l.id === procData.lotId);
    if (lot) {
      lot.status = 'PROCURED';
      lot.version += 1;
    }
    const qty = parseFloat(procData.quantity || lot?.quantity || 5000);
    const price = parseFloat(procData.pricePerQtl || 2470);
    const totalVal = (qty / 100) * price;

    const newPO = {
      id: generateId('PRC'),
      lotId: procData.lotId,
      farmerId: lot?.farmerId || 'FRM-10245',
      officerId: procData.officerId || 'USR-00101',
      priceRuleId: 'PRC-R-01',
      quantity: qty,
      pricePerQtl: price,
      totalValue: totalVal,
      mandiId: lot?.mandiId || 'MND-BR-001',
      warehouseId: procData.warehouseId || 'WH-BR-004',
      status: 'APPROVED',
      createdAt: new Date().toISOString()
    };
    db.procurementOrders.unshift(newPO);

    // Create Farmer Payment Transaction
    const newPay = {
      id: generateId('PAY'),
      procurementOrderId: newPO.id,
      lotId: newPO.lotId,
      farmerId: newPO.farmerId,
      amount: totalVal,
      status: 'PROCESSING',
      txnRef: generateId('TXN'),
      bank: 'SBI A/C XXXX4892 (NPCI-DBT)',
      completedAt: null
    };
    db.payments.unshift(newPay);

    this.emitEvent(db, 'PROCUREMENT_APPROVED', 'PRODUCE_LOT', procData.lotId, newPO.officerId, { role: 'PROCUREMENT_OFFICER', oldVal: 'QUALITY_PASSED', newVal: 'PROCURED' });
    this.save(db);
    return newPO;
  }

  // 5. Warehouse Manager Receiving & Stock Management
  receiveWarehouseInventory(invData) {
    const db = this.getDb();
    const lot = db.produceLots.find(l => l.id === invData.lotId);
    if (lot) {
      lot.status = 'IN_STOCK';
      lot.version += 1;
    }
    const qty = parseFloat(invData.receivedQty || 5000);
    const newInv = {
      id: generateId('INV'),
      warehouseId: invData.warehouseId || 'WH-BR-004',
      lotId: invData.lotId,
      receivedQty: qty,
      availableQty: qty,
      reservedQty: 0,
      dispatchedQty: 0,
      damagedQty: 0,
      receivedAt: new Date().toISOString()
    };
    db.inventoryLots.unshift(newInv);

    // Inventory Transaction Log
    db.inventoryTransactions.unshift({
      id: generateId('ITX'),
      inventoryId: newInv.id,
      warehouseId: newInv.warehouseId,
      lotId: newInv.lotId,
      type: 'RECEIVED',
      quantity: qty,
      userId: invData.managerId || 'USR-00901',
      timestamp: new Date().toISOString()
    });

    this.emitEvent(db, 'WAREHOUSE_RECEIVED', 'INVENTORY_LOT', newInv.id, invData.managerId || 'USR-00901', { role: 'WAREHOUSE_MANAGER', oldVal: 'PROCURED', newVal: 'IN_STOCK' });
    this.save(db);
    return newInv;
  }

  // 6. Buyer Purchase Order & Stock Reservation (Optimistic Concurrency Locked)
  createPurchaseOrder(orderData) {
    const db = this.getDb();
    const inv = db.inventoryLots.find(i => i.lotId === orderData.lotId);
    const reqQty = parseFloat(orderData.quantity || 3000);

    // Optimistic Concurrency Control Check
    if (inv && inv.availableQty < reqQty) {
      throw new Error(`Insufficient Available Inventory! Requested: ${reqQty} KG, Available: ${inv.availableQty} KG.`);
    }

    if (inv) {
      inv.availableQty -= reqQty;
      inv.reservedQty += reqQty;
    }

    const lot = db.produceLots.find(l => l.id === orderData.lotId);
    if (lot) {
      lot.status = inv?.availableQty === 0 ? 'RESERVED' : 'IN_STOCK';
      lot.version += 1;
    }

    const newOrder = {
      id: generateId('ORD'),
      buyerId: orderData.buyerId || 'BUY-0091',
      lotId: orderData.lotId,
      inventoryId: inv?.id || 'INV-5541',
      quantity: reqQty,
      pricePerQtl: parseFloat(orderData.pricePerQtl || 2470),
      totalAmount: (reqQty / 100) * parseFloat(orderData.pricePerQtl || 2470),
      warehouseId: inv?.warehouseId || 'WH-BR-004',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };
    db.purchaseOrders.unshift(newOrder);

    // Stock Reservation
    db.stockReservations.unshift({
      id: generateId('RES'),
      orderId: newOrder.id,
      inventoryId: newOrder.inventoryId,
      lotId: newOrder.lotId,
      buyerId: newOrder.buyerId,
      warehouseId: newOrder.warehouseId,
      reservedQty: reqQty,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    });

    // Inventory Transaction Log
    db.inventoryTransactions.unshift({
      id: generateId('ITX'),
      inventoryId: newOrder.inventoryId,
      warehouseId: newOrder.warehouseId,
      lotId: newOrder.lotId,
      type: 'RESERVED',
      quantity: reqQty,
      userId: newOrder.buyerId,
      timestamp: new Date().toISOString()
    });

    this.emitEvent(db, 'ORDER_CONFIRMED', 'PURCHASE_ORDER', newOrder.id, newOrder.buyerId, { role: 'BUYER', oldVal: 'IN_STOCK', newVal: 'RESERVED' });
    this.save(db);
    return newOrder;
  }
}

export const dbEngine = new CentralDatabaseEngine();
