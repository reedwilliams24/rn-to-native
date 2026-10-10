// Staging.xcconfig, assigned to the "Staging" build configuration:
//   PRODUCT_BUNDLE_IDENTIFIER = com.acme.todos.staging
//   INFOPLIST_KEY_CFBundleDisplayName = Todos (staging)
//   API_URL = https:/$()/staging.api.acme.com
//   SWIFT_ACTIVE_COMPILATION_CONDITIONS = $(inherited) STAGING
//
// Info.plist exposes the build setting to code:
//   <key>APIURL</key> <string>$(API_URL)</string>

enum AppConfig {
    static let apiURL: URL = {
        guard let raw = Bundle.main.object(forInfoDictionaryKey: "APIURL") as? String,
              let url = URL(string: raw) else {
            fatalError("APIURL missing from Info.plist. Check the scheme's xcconfig.")
        }
        return url
    }()

    static var isStaging: Bool {
        #if STAGING
        return true
        #else
        return false
        #endif
    }
}
