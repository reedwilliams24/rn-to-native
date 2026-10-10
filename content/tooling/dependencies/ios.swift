// swift-tools-version: 5.10
// Package.swift for a local package. For the app
// target, use File → Add Package Dependencies…
import PackageDescription

let package = Package(
    name: "TodoFeature",
    platforms: [.iOS(.v17)],
    products: [
        .library(
            name: "TodoFeature",
            targets: ["TodoFeature"]
        ),
    ],
    dependencies: [
        .package(
            url: "https://github.com/kean/Nuke",
            from: "12.0.0"
        ),
    ],
    targets: [
        .target(
            name: "TodoFeature",
            dependencies: [
                .product(name: "NukeUI", package: "Nuke"),
            ]
        ),
    ]
)
