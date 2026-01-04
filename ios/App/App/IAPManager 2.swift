//
//  IAPManager.swift
//  App
//
//  Handles iOS In-App Purchases for PipeGauge Pro
//

import Foundation
import StoreKit

class IAPManager: NSObject, SKProductsRequestDelegate, SKPaymentTransactionObserver {
    static let shared = IAPManager()
    
    // Product ID from App Store Connect
    private let productIdentifier = "com.pipegaugepro.lifetime"
    
    private var product: SKProduct?
    private var productRequest: SKProductsRequest?
    private var purchaseCallback: ((Bool, String?, String?) -> Void)?
    private var restoreCallback: ((Bool, String?, String?) -> Void)?
    
    private override init() {
        super.init()
        SKPaymentQueue.default().add(self)
    }
    
    deinit {
        SKPaymentQueue.default().remove(self)
    }
    
    // MARK: - Public Methods
    
    /// Initialize and fetch product information
    func initialize(completion: @escaping (Bool) -> Void) {
        fetchProduct { [weak self] success in
            if success {
                print("IAP: Initialized successfully")
            } else {
                print("IAP: Initialization failed")
            }
            completion(success)
        }
    }
    
    /// Fetch product information from App Store
    func fetchProduct(completion: @escaping (Bool) -> Void) {
        let productIdentifiers: Set<String> = [productIdentifier]
        productRequest = SKProductsRequest(productIdentifiers: productIdentifiers)
        productRequest?.delegate = self
        productRequest?.start()
        
        // Store completion handler for later use
        DispatchQueue.main.asyncAfter(deadline: .now() + 10) { [weak self] in
            if self?.product == nil {
                completion(false)
            }
        }
    }
    
    /// Get product information as dictionary
    func getProductInfo() -> [String: Any]? {
        guard let product = product else {
            return nil
        }
        
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.locale = product.priceLocale
        
        return [
            "productId": product.productIdentifier,
            "price": formatter.string(from: product.price) ?? "$0.00",
            "priceValue": product.price.doubleValue,
            "currency": product.priceLocale.currencyCode ?? "USD",
            "title": product.localizedTitle,
            "description": product.localizedDescription
        ]
    }
    
    /// Purchase the product
    func purchase(completion: @escaping (Bool, String?, String?) -> Void) {
        guard SKPaymentQueue.canMakePayments() else {
            completion(false, nil, "Purchases are disabled on this device")
            return
        }
        
        guard let product = product else {
            completion(false, nil, "Product not available")
            return
        }
        
        purchaseCallback = completion
        let payment = SKPayment(product: product)
        SKPaymentQueue.default().add(payment)
    }
    
    /// Restore previous purchases
    func restorePurchases(completion: @escaping (Bool, String?, String?) -> Void) {
        restoreCallback = completion
        SKPaymentQueue.default().restoreCompletedTransactions()
    }
    
    /// Check if user has purchased (local check only)
    func hasPurchased() -> Bool {
        return UserDefaults.standard.bool(forKey: "pipegauge_pro_purchased")
    }
    
    /// Mark product as purchased
    private func markAsPurchased() {
        UserDefaults.standard.set(true, forKey: "pipegauge_pro_purchased")
        UserDefaults.standard.synchronize()
    }
    
    // MARK: - SKProductsRequestDelegate
    
    func productsRequest(_ request: SKProductsRequest, didReceive response: SKProductsResponse) {
        if let product = response.products.first {
            self.product = product
            print("IAP: Product loaded - \\(product.localizedTitle)")
        }
        
        if !response.invalidProductIdentifiers.isEmpty {
            print("IAP: Invalid product identifiers: \\(response.invalidProductIdentifiers)")
        }
    }
    
    func request(_ request: SKRequest, didFailWithError error: Error) {
        print("IAP: Product request failed - \\(error.localizedDescription)")
    }
    
    // MARK: - SKPaymentTransactionObserver
    
    func paymentQueue(_ queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
        for transaction in transactions {
            switch transaction.transactionState {
            case .purchased:
                handlePurchased(transaction)
            case .restored:
                handleRestored(transaction)
            case .failed:
                handleFailed(transaction)
            case .deferred, .purchasing:
                break
            @unknown default:
                break
            }
        }
    }
    
    private func handlePurchased(_ transaction: SKPaymentTransaction) {
        print("IAP: Purchase successful - \\(transaction.transactionIdentifier ?? "unknown")")
        
        markAsPurchased()
        SKPaymentQueue.default().finishTransaction(transaction)
        
        purchaseCallback?(true, transaction.payment.productIdentifier, transaction.transactionIdentifier)
        purchaseCallback = nil
    }
    
    private func handleRestored(_ transaction: SKPaymentTransaction) {
        print("IAP: Purchase restored - \\(transaction.transactionIdentifier ?? "unknown")")
        
        markAsPurchased()
        SKPaymentQueue.default().finishTransaction(transaction)
        
        if restoreCallback != nil {
            restoreCallback?(true, transaction.payment.productIdentifier, transaction.transactionIdentifier)
            restoreCallback = nil
        }
    }
    
    private func handleFailed(_ transaction: SKPaymentTransaction) {
        let errorMessage: String
        
        if let error = transaction.error as? SKError {
            switch error.code {
            case .paymentCancelled:
                errorMessage = "Purchase was cancelled"
            case .paymentNotAllowed:
                errorMessage = "Purchases are not allowed"
            case .storeProductNotAvailable:
                errorMessage = "Product is not available"
            default:
                errorMessage = error.localizedDescription
            }
        } else {
            errorMessage = transaction.error?.localizedDescription ?? "Unknown error"
        }
        
        print("IAP: Purchase failed - \\(errorMessage)")
        
        SKPaymentQueue.default().finishTransaction(transaction)
        
        purchaseCallback?(false, nil, errorMessage)
        purchaseCallback = nil
    }
    
    func paymentQueueRestoreCompletedTransactionsFinished(_ queue: SKPaymentQueue) {
        if queue.transactions.isEmpty {
            // No previous purchases
            restoreCallback?(false, nil, "No previous purchases found")
            restoreCallback = nil
        }
        // If there are transactions, handleRestored will be called
    }
    
    func paymentQueue(_ queue: SKPaymentQueue, restoreCompletedTransactionsFailedWithError error: Error) {
        print("IAP: Restore failed - \\(error.localizedDescription)")
        restoreCallback?(false, nil, error.localizedDescription)
        restoreCallback = nil
    }
}
