# iOS In-App Purchase Integration Guide
## PipeGauge Pro - Lifetime Access

This guide covers the complete integration of iOS In-App Purchase for the lifetime Pro upgrade feature.

## ✅ What's Been Done

### 1. JavaScript/TypeScript Layer
- ✅ Created `/src/lib/iapService.ts` - IAP service with Capacitor plugin integration
- ✅ Updated `/src/pages/Upgrade.tsx` - Real IAP purchase & restore functionality
- ✅ Updated `/src/pages/Home.tsx` - Changed pricing to "Lifetime Access"
- ✅ Product ID configured: `com.pipegaugepro.lifetime`

### 2. iOS Native Layer
- ✅ Created `/ios/App/App/IAPManager.swift` - StoreKit purchase manager
- ✅ Created `/ios/App/App/IAPPlugin.swift` - Capacitor bridge plugin
- ✅ Updated `/ios/App/App/AppDelegate.swift` - Initialize IAP on app launch

## 🔧 Steps to Complete Integration

### Step 1: Add Swift Files to Xcode Project

The Swift files have been created but need to be added to the Xcode project:

1. Open `/ios/App/App.xcodeproj` in Xcode
2. Right-click on the `App` folder in the navigator
3. Select "Add Files to 'App'..."
4. Navigate to and select:
   - `IAPManager.swift`
   - `IAPPlugin.swift`
5. Make sure "Copy items if needed" is **UNCHECKED**
6. Make sure "Add to targets" has **App** checked
7. Click "Add"

### Step 2: Register the Capacitor Plugin

Edit `capacitor.config.ts` in the project root and ensure the plugin is registered:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.katiemelissa.pipegaugepro',
  appName: 'App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    IAPPlugin: {
      // Plugin will be auto-registered
    }
  }
};

export default config;
```

### Step 3: Add StoreKit Capability

1. In Xcode, select your project in the navigator
2. Select the **App** target
3. Go to **Signing & Capabilities** tab
4. Click **+ Capability**
5. Add **In-App Purchase**

### Step 4: Configure App Store Connect

You mentioned you've already created the In-App Purchase product. Verify these settings:

1. **Product ID**: `com.pipegaugepro.lifetime`
2. **Type**: Should be **Non-Consumable** (one-time purchase, lifetime access)
3. **Price**: Set your preferred price (currently shows $29.99 as default)
4. **Localization**: Add product name and description
5. **Review Information**: Add screenshot if required
6. **Status**: Should be "Ready to Submit"

### Step 5: Test with Sandbox Account

Before submitting to App Store:

1. **Create Sandbox Tester**:
   - Go to App Store Connect > Users and Access > Sandbox Testers
   - Create a new sandbox tester account

2. **Test on Device**:
   - Build and install the app on a physical iOS device (simulator won't work for IAP)
   - Sign out of your real Apple ID in Settings > App Store
   - Launch your app and tap "Get Lifetime Access"
   - Sign in with the sandbox tester account when prompted
   - Complete the test purchase (you won't be charged)

3. **Test Restore**:
   - Delete and reinstall the app
   - Tap "Restore Purchase"
   - Verify Pro features are unlocked

### Step 6: Build and Sync

After adding files to Xcode:

```bash
# Build the web assets
npm run build

# Sync to iOS
npx cap sync ios

# Open in Xcode to build
npx cap open ios
```

### Step 7: Submit to App Store

1. In Xcode, select **Any iOS Device** as the build target
2. Product > Archive
3. Once archived, click **Distribute App**
4. Choose **App Store Connect**
5. Follow the wizard to upload to App Store Connect
6. In App Store Connect, go to your app version
7. In the **In-App Purchases** section, make sure `com.pipegaugepro.lifetime` is added
8. Submit for review

## 📝 Important Notes

### Product Type
The product **MUST** be set as **Non-Consumable** in App Store Connect because:
- It's a one-time purchase
- Provides lifetime access
- Can be restored on other devices

### Receipt Validation
The current implementation uses local verification (`UserDefaults`). For production, you should implement:
- Server-side receipt validation
- OR use Apple's App Store Server API
- This prevents users from bypassing the purchase

To add server validation:
1. Send receipt to your server after purchase
2. Server validates with Apple's verification endpoint
3. Server stores purchase status in database
4. App checks server on launch

### Testing Checklist
- [ ] Purchase flow works
- [ ] Restore purchase works
- [ ] Pro features unlock after purchase
- [ ] Pro status persists after app restart
- [ ] Works on different devices with same Apple ID
- [ ] Purchase UI shows correct price from App Store
- [ ] Loading states work correctly
- [ ] Error messages are user-friendly

## 🐛 Troubleshooting

### "Product not available"
- Verify product ID matches exactly: `com.pipegaugepro.lifetime`
- Ensure product is "Ready to Submit" in App Store Connect
- Wait a few hours after creating the product
- Check Bundle ID matches your app

### "Cannot connect to iTunes Store"
- Use a real device, not simulator
- Sign out of real Apple ID
- Use sandbox tester account
- Check internet connection

### Purchase doesn't unlock Pro features
- Check console logs for errors
- Verify `setProStatus(true)` is being called
- Check `UserDefaults` value: `pipegauge_pro_purchased`
- Ensure transaction is marked as finished

## 📞 Additional Resources

- [Apple In-App Purchase Documentation](https://developer.apple.com/in-app-purchase/)
- [StoreKit Framework](https://developer.apple.com/documentation/storekit)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Testing In-App Purchases](https://developer.apple.com/documentation/storekit/in-app_purchase/testing_in-app_purchases)

## 🎯 Next Steps

1. Add the Swift files to Xcode project
2. Build and test on a physical device with sandbox account
3. Verify all purchase flows work correctly
4. Submit to App Store for review
5. (Optional) Implement server-side receipt validation for added security

---

**Note**: The implementation is ready for testing. The main remaining tasks are:
1. Adding Swift files to Xcode
2. Testing with sandbox account
3. Submitting to App Store

Good luck with your app submission! 🚀
