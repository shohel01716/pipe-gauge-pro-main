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
    
    @objc func getProduct(_ call: CAPPluginCall) {
        let productId = call.getString("productId") ?? "com.pipegaugepro.lifetime"
        
        if let productInfo = IAPManager.shared.getProductInfo() {
            call.resolve(["product": productInfo])
        } else {
            // Fetch product first
            IAPManager.shared.fetchProduct { success in
                if success, let productInfo = IAPManager.shared.getProductInfo() {
                    call.resolve(["product": productInfo])
                } else {
                    call.reject("Product not available")
                }
            }
        }
    }
    
    @objc func purchase(_ call: CAPPluginCall) {
        IAPManager.shared.purchase { success, productId, transactionId in
            if success {
                call.resolve([
                    "success": true,
                    "productId": productId ?? "",
                    "transactionId": transactionId ?? ""
                ])
            } else {
                call.resolve([
                    "success": false,
                    "error": transactionId ?? "Purchase failed"
                ])
            }
        }
    }
    
    @objc func restore(_ call: CAPPluginCall) {
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
    
    @objc func checkPurchase(_ call: CAPPluginCall) {
        let hasPurchase = IAPManager.shared.hasPurchased()
        call.resolve(["hasPurchase": hasPurchase])
    }
}
