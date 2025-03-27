export const mockInventoryData = [
  {
    sku: 'FMCG001',
    name: 'Tata Salt (1kg)',
    quantity: 500,
    threshold: 100,
    price: 24,
    hsn: '25010020',
  },
  {
    sku: 'FMCG002',
    name: 'Fortune Oil (1L)',
    quantity: 300,
    threshold: 50,
    price: 140,
    hsn: '15079010',
  },
  {
    sku: 'FMCG003',
    name: 'Aashirvaad Atta (5kg)',
    quantity: 200,
    threshold: 40,
    price: 270,
    hsn: '11010000',
  },
  {
    sku: 'FMCG004',
    name: 'Maggi Noodles (Pack of 6)',
    quantity: 600,
    threshold: 120,
    price: 156,
    hsn: '19023010',
  },
];

export const mockCustomers = [
  {
    id: 1,
    name: 'SuperMart Retail',
    gstin: '29ABCDE1234F1Z5',
    email: 'orders@supermart.com',
    address: '123 MG Road, Bangalore, Karnataka',
    state: 'Karnataka',
  },
  {
    id: 2,
    name: 'Metro Grocers',
    gstin: '27FGHIJ5678K2Y6',
    email: 'purchase@metrogrocers.com',
    address: '456 Link Road, Mumbai, Maharashtra',
    state: 'Maharashtra',
  },
  {
    id: 3,
    name: 'Delhi Stores Ltd',
    gstin: '07KLMNO9012P3X7',
    email: 'info@delhistores.com',
    address: '789 Chandni Chowk, New Delhi, Delhi',
    state: 'Delhi',
  },
  {
    id: 4,
    name: 'Chennai Superstore',
    gstin: '33PQRST3456U4W8',
    email: 'orders@chennaisuper.com',
    address: '321 Anna Salai, Chennai, Tamil Nadu',
    state: 'Tamil Nadu',
  },
  {
    id: 5,
    name: 'Kochi Traders',
    gstin: '32UVWXY7890Z5V9',
    email: 'info@kochitraders.com',
    address: '654 Marine Drive, Kochi, Kerala',
    state: 'Kerala',
  }
];

export const states = [
  'Andhra Pradesh', 'Karnataka', 'Kerala', 'Maharashtra', 
  'Tamil Nadu', 'Telangana', 'Delhi', 'Gujarat', 'West Bengal'
];

export const mockFinancialData = {
  dailySales: 12500,
  weeklySales: 87500,
  monthlySales: 350000,
  grossProfit: 175000,
  operatingExpenses: 210000,
  revenue: 350000,
  ebitda: 140000,
  netProfitMargin: 28.5,
};