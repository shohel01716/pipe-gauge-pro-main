//
//  ViewController.swift
//  App
//
//  Custom ViewController to register IAP plugin
//

import UIKit
import Capacitor

class ViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Register custom plugins
        if let bridge = self.bridge {
            print("🔌 Registering IAPPlugin with Capacitor bridge")
            bridge.registerPluginInstance(IAPPlugin())
            print("✅ IAPPlugin registered successfully")
        } else {
            print("❌ Bridge not available for plugin registration")
        }
    }
}
