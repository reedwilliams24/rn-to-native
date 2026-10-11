// modules/native-settings/ios/NativeSettingsModule.swift (Expo Modules API) // @link:file
import ExpoModulesCore
import SwiftUI

public class NativeSettingsModule: Module {
    public func definition() -> ModuleDefinition {
        Name("NativeSettings") // @link:name

        AsyncFunction("open") { // @link:open
            let host = UIHostingController(rootView: SettingsScreen()) // @link:screen
            self.appContext?.utilities?.currentViewController()?.present(host, animated: true) // @link:present
        }.runOnQueue(.main)
    }
}

// SettingsScreen is a normal SwiftUI view.
// @Environment(\.dismiss) closes the hosting controller.
