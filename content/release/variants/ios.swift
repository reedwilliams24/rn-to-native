// Staging.xcconfig, assigned to the "Staging" build configuration: // @link:variant
//   PRODUCT_BUNDLE_IDENTIFIER = com.acme.todos.staging // @link:bundle-id
//   INFOPLIST_KEY_CFBundleDisplayName = Todos (staging) // @link:name
//   API_URL = https:/$()/staging.api.acme.com // @link:api
//   SWIFT_ACTIVE_COMPILATION_CONDITIONS = $(inherited) STAGING
//
// Info.plist exposes the build setting to code:
//   <key>APIURL</key> <string>$(API_URL)</string>

enum AppConfig {
    static let apiURL: URL = { // @link:read
        guard let raw = Bundle.main.object(forInfoDictionaryKey: "APIURL") as? String, // @link:read
              let url = URL(string: raw) else {
            fatalError("APIURL missing from Info.plist. Check the scheme's xcconfig.")
        }
        return url
    }()

    static var isStaging: Bool { // @link:variant
        #if STAGING
        return true
        #else
        return false
        #endif
    }
}
