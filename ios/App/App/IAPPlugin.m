//
//  IAPPlugin.m
//  App
//
//  Capacitor plugin registration for In-App Purchase
//

#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(IAPPlugin, "IAPPlugin",
    CAP_PLUGIN_METHOD(getProduct, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(purchase, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(restore, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(checkPurchase, CAPPluginReturnPromise);
)
