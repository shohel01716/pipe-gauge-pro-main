//
//  IAPPlugin.swift
//  App
//
//  Capacitor plugin for In-App Purchase bridge
//

import Foundation
import Capacitor

@objc(IAPPlugin)
public class IAPPlugin: CAPPlugin {
    
    override public func load() {
        print("🎯 IAPPlugin: Plugin loaded successfully!")
        NotificationCenter.default.post(name: Notification.Name("IAPPluginLoaded"), object: nil)
    }
    
    @objc public func getProduct(_ call: CAPPluginCall) {
        let productId = call.getString("productId") ?? "com.pipegaugepro.lifetime"
        print("🛒 IAPPlugin: getProduct called for: \(productId)")
        
        if let productInfo = IAPManager.shared.getProductInfo() {
            print("✅ IAPPlugin: Returning cached product info")
            call.resolve(["product": productInfo])
        } else {
            // Fetch product first
            print("📦 IAPPlugin: Fetching product from App Store...")
            IAPManager.shared.fetchProduct { success in
                if success, let productInfo = IAPManager.shared.getProductInfo() {
                    print("✅ IAPPlugin: Product fetched successfully")
                    call.resolve(["product": productInfo])
                } else {
                    print("❌ IAPPlugin: Failed to fetch product")
                    call.reject("PRODUCT_UNAVAILABLE", "Product not available from App Store")
                }
            }
        }
    }
    
    @objc public func purchase(_ call: CAPPluginCall) {
        print("💳 IAPPlugin: purchase called")
        IAPManager.shared.purchase { success, productId, transactionId in
            if success {
                print("✅ IAPPlugin: Purchase succeeded")
                call.resolve([
                    "success": true,
                    "productId": productId ?? "",
                    "transactionId": transactionId ?? ""
                ])
            } else {
                print("❌ IAPPlugin: Purchase failed - \(transactionId ?? "unknown error")")
                call.resolve([
                    "success": false,
                    "error": transactionId ?? "Purchase failed"
                ])
            }
        }
    }
    
    @objc public func restore(_ call: CAPPluginCall) {
        IAPManager.shared.restorePurchases { success, productId, transactionId in
            if success {
                call.resolve([
                    "success": true,
                    "productId": productId ?? "",
                    "transactionId": transactionId ?? ""
                ])
            } else {
                call.resolve([
                    "success": false,
                    "error": transactionId ?? "No previous purchases found"
                ])
            }
        }
    }
    
    @objc public func checkPurchase(_ call: CAPPluginCall) {
        let hasPurchase = IAPManager.shared.hasPurchased()
        call.resolve(["hasPurchase": hasPurchase])
    }
}
