import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Sale, KPI } from '../types';
import { toast } from 'sonner-native';

interface AppContextType {
  products: Product[];
  sales: Sale[];
  kpis: KPI;
  updateInventory: (productId: string, quantity: number, isAddition?: boolean) => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addSale: (sale: Sale) => void;
  updateSale: (saleId: string, updates: Sale) => void;
  deleteSale: (saleId: string) => void;
}

const initialKPIs: KPI = {
  totalSales: 0,
  totalRevenue: 0,
  totalProfit: 0,
  monthlyRevenue: 0,
  monthlySales: 0,
};

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Fortune Rice (5kg)',
    sku: 'FR5KG',
    hsnCode: '1006',
    price: 80,
    quantity: 500,
    costPrice: 65,
  },
  {
    id: '2',
    name: 'Tata Salt (1kg)',
    sku: 'TS1KG',
    hsnCode: '2501',
    price: 25,
    quantity: 1000,
    costPrice: 18,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sales, setSales] = useState<Sale[]>([]);
  const [kpis, setKpis] = useState<KPI>(initialKPIs);

  const updateInventory = (productId: string, quantity: number, isAddition = false) => {
    setProducts(currentProducts =>
      currentProducts.map(product =>
        product.id === productId
          ? { 
              ...product, 
              quantity: isAddition 
                ? product.quantity + quantity 
                : product.quantity - quantity 
            }
          : product
      )
    );
    
    if (isAddition) {
      toast.success(`Added ${quantity} units to inventory`);
    } else {
      toast.success(`Removed ${quantity} units from inventory`);
    }
  };

  const addProduct = (product: Product) => {
    setProducts(currentProducts => [...currentProducts, product]);
    toast.success('Product added successfully');
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(currentProducts =>
      currentProducts.map(product =>
        product.id === productId
          ? { ...product, ...updates }
          : product
      )
    );
    toast.success('Product updated successfully');
  };

  const deleteProduct = (productId: string) => {
    // Check if product is used in any sales
    const isUsedInSales = sales.some(sale =>
      sale.items.some(item => item.productId === productId)
    );

    if (isUsedInSales) {
      toast.error('Cannot delete product as it is used in sales records');
      return;
    }

    setProducts(currentProducts =>
      currentProducts.filter(product => product.id !== productId)
    );
    toast.success('Product deleted successfully');
  };

  const addSale = (sale: Sale) => {
    // Initialize payment-related fields
    const saleWithPayment = {
      ...sale,
      paidAmount: 0,
      paymentStatus: 'pending' as const,
      payments: [],
    };

    setSales(currentSales => [...currentSales, saleWithPayment]);
    
    // Update inventory for each product in the sale
    sale.items.forEach(item => {
      updateInventory(item.productId, item.quantity);
    });

    toast.success('Sale added successfully');
  };

  const updateSale = (saleId: string, updates: Sale) => {
    setSales(currentSales =>
      currentSales.map(sale =>
        sale.id === saleId
          ? updates
          : sale
      )
    );
    toast.success('Sale updated successfully');
  };

  const deleteSale = (saleId: string) => {
    // Find the sale before deleting
    const saleToDelete = sales.find(sale => sale.id === saleId);
    
    if (!saleToDelete) {
      toast.error('Sale not found');
      return;
    }

    // Revert inventory changes
    saleToDelete.items.forEach(item => {
      updateInventory(item.productId, item.quantity, true); // Add back to inventory
    });

    // Remove the sale
    setSales(currentSales => currentSales.filter(sale => sale.id !== saleId));
    
    toast.success('Sale deleted and inventory restored');
  };

  // Update KPIs whenever sales change
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const newKpis = sales.reduce(
      (acc, sale) => {
        const saleDate = new Date(sale.createdAt);
        const isCurrentMonth = 
          saleDate.getMonth() === currentMonth && 
          saleDate.getFullYear() === currentYear;

        // Calculate profit
        const profit = sale.items.reduce((itemAcc, item) => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            return itemAcc + (item.price - product.costPrice) * item.quantity;
          }
          return itemAcc;
        }, 0);

        return {
          totalSales: acc.totalSales + 1,
          totalRevenue: acc.totalRevenue + sale.totalAmount,
          totalProfit: acc.totalProfit + profit,
          monthlyRevenue: acc.monthlyRevenue + (isCurrentMonth ? sale.totalAmount : 0),
          monthlySales: acc.monthlySales + (isCurrentMonth ? 1 : 0),
        };
      },
      { ...initialKPIs }
    );

    setKpis(newKpis);
  }, [sales, products]);

  return (
    <AppContext.Provider value={{ 
      products, 
      sales, 
      kpis, 
      updateInventory,
      addProduct,
      updateProduct,
      deleteProduct,
      addSale,
      updateSale,
      deleteSale 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 