// There's no Swift involved in signing. It's configured in the Xcode project
// (Signing & Capabilities tab) and these build settings:
//
//   DEVELOPMENT_TEAM = ABCDE12345
//   CODE_SIGN_STYLE = Manual            // Automatic is fine for local dev
//   CODE_SIGN_IDENTITY = Apple Distribution
//   PROVISIONING_PROFILE_SPECIFIER = match AppStore com.acme.todos
//
// fastlane/Fastfile (Ruby) is the usual way to do it on CI:
//
//   lane :beta do
//     match(type: "appstore", readonly: true)   # certs + profiles from a private repo
//     increment_build_number(build_number: ENV["GITHUB_RUN_NUMBER"])
//     build_app(scheme: "Todos (Production)", export_method: "app-store")
//     upload_to_testflight(skip_waiting_for_build_processing: true)
//   end
//
// Without fastlane:
//   xcodebuild archive -scheme "Todos (Production)" -archivePath build/Todos.xcarchive
//   xcodebuild -exportArchive -archivePath build/Todos.xcarchive \
//     -exportOptionsPlist ExportOptions.plist -exportPath build/
