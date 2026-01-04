// In-App Purchase Service for iOS
import { Capacitor } from '@capacitor/core';

interface IAPPluginInterface {
  getProduct(options: { productId: string }): Promise<{ product: IAPProduct }>;
  purchase(options: { productId: string }): Promise<PurchaseResult>;
  restore(options: Record<string, never>): Promise<PurchaseResult>;
  checkPurchase(options: Record<string, never>): Promise<{ hasPurchase: boolean }>;
}

// For Capacitor 6+, we need to check if plugin exists
let IAPNativePlugin: IAPPluginInterface | null = null;

try {
  // Try to load the plugin
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IAPNativePlugin = (Capacitor as any).Plugins?.IAPPlugin as IAPPluginInterface | undefined || null;
  
  if (!IAPNativePlugin) {
    console.warn('IAPPlugin not found in Capacitor.Plugins');
  } else {
    console.log('✅ IAPPlugin loaded from Capacitor.Plugins');
  }
} catch (error) {
  console.error('Failed to load IAPPlugin:', error);
}

export interface IAPProduct {
  productId: string;
  price: string;
  priceValue: number;
  currency: string;
  title: string;
  description: string;
}

export interface PurchaseResult {
  success: boolean;
  productId?: string;
  transactionId?: string;
  error?: string;
}

// Product ID from App Store Connect
export const LIFETIME_PRO_PRODUCT_ID = 'com.pipegaugepro.lifetime';

class IAPService {
  private isNative = Capacitor.isNativePlatform();

  /**
   * Initialize the IAP service (iOS only)
   */
  async initialize(): Promise<void> {
    if (!this.isNative) {
      console.log('IAP: Running in web mode, skipping initialization');
      return;
    }

    try {
      // On iOS, we'll call native Swift code through Capacitor plugin
      const result = await Capacitor.getPlatform();
      console.log('IAP: Initialized on platform:', result);
    } catch (error) {
      console.error('IAP: Initialization failed:', error);
    }
  }

  /**
   * Fetch product information from App Store
   */
  async getProduct(productId: string = LIFETIME_PRO_PRODUCT_ID): Promise<IAPProduct | null> {
    if (!this.isNative) {
      // Return mock data for web testing
      return {
        productId: LIFETIME_PRO_PRODUCT_ID,
        price: '$29.99',
        priceValue: 29.99,
        currency: 'USD',
        title: 'PipeGauge Pro - Lifetime Access',
        description: 'Unlock all professional features forever'
      };
    }

    try {
      // Call native iOS code to fetch product
      if (!IAPNativePlugin) {
        console.error('IAP: Plugin not available');
        return null;
      }
      const result = await IAPNativePlugin.getProduct({ productId });
      console.log('IAP: Product result:', result);
      return result.product || null;
    } catch (error) {
      console.error('IAP: Failed to get product:', error);
      return null;
    }
  }

  /**
   * Purchase a product
   */
  async purchase(productId: string = LIFETIME_PRO_PRODUCT_ID): Promise<PurchaseResult> {
    if (!this.isNative) {
      // Simulate successful purchase for web testing
      console.log('IAP: Simulating purchase for web');
      return {
        success: true,
        productId,
        transactionId: 'web_test_' + Date.now()
      };
    }

    try {
      if (!IAPNativePlugin) {
        console.error('IAP: Plugin not available for purchase');
        return {
          success: false,
          error: 'IAP plugin not available'
        };
      }
      const result = await IAPNativePlugin.purchase({ productId });
      console.log('IAP: Purchase result:', result);
      return result;
    } catch (error: unknown) {
      console.error('IAP: Purchase failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Purchase failed'
      };
    }
  }

  /**
   * Restore previous purchases
   */
  async restorePurchases(): Promise<PurchaseResult> {
    if (!this.isNative) {
      // Simulate no purchases for web testing
      console.log('IAP: Simulating restore for web');
      return {
        success: false,
        error: 'No previous purchases found (web mode)'
      };
    }

    try {
      const result = await IAPNativePlugin.restore({});
      return result;
    } catch (error: unknown) {
      console.error('IAP: Restore failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Restore failed'
      };
    }
  }

  /**
   * Check if user has active purchase (from local verification)
   */
  async hasActivePurchase(): Promise<boolean> {
    if (!this.isNative) {
      // In web mode, check localStorage
      const stored = localStorage.getItem('pipegauge_iap_verified');
      return stored === 'true';
    }

    try {
      const result = await IAPNativePlugin.checkPurchase({});
      return result.hasPurchase || false;
    } catch (error) {
      console.error('IAP: Failed to check purchase:', error);
      return false;
    }
  }
}

export const iapService = new IAPService();
