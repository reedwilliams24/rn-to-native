import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import SwiftUI

final class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
    override func bundleURL() -> URL? {
        #if DEBUG
        RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
        Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
}

// One React Native instance for the whole app
@MainActor
final class ReactHost {
    static let shared = ReactHost()
    private let delegate = ReactNativeDelegate()
    let factory: RCTReactNativeFactory

    private init() {
        delegate.dependencyProvider = RCTAppDependencyProvider()
        factory = RCTReactNativeFactory(delegate: delegate)
    }
}

// Drop any registered RN screen into SwiftUI
struct ReactScreen: UIViewRepresentable {
    let moduleName: String

    func makeUIView(context: Context) -> UIView {
        ReactHost.shared.factory.rootViewFactory.view(withModuleName: moduleName)
    }

    func updateUIView(_ uiView: UIView, context: Context) {}
}
