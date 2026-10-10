// modules/native-settings/ios/NativeSettingsModule.swift (Expo Modules API)
import ExpoModulesCore
import SwiftUI

public class NativeSettingsModule: Module {
    public func definition() -> ModuleDefinition {
        Name("NativeSettings")

        AsyncFunction("open") {
            let host = UIHostingController(rootView: SettingsScreen())
            self.appContext?.utilities?.currentViewController()?.present(host, animated: true)
        }.runOnQueue(.main)
    }
}

// SettingsScreen is a normal SwiftUI view.
// @Environment(\.dismiss) closes the hosting controller.
