// DEBUG is set for the Debug build configuration
#if DEBUG
let apiURL = URL(string: "http://localhost:3000")!
#else
let apiURL = URL(string: "https://api.example.com")!
#endif

func logConfig() {
    #if DEBUG
    print("Using API", apiURL)
    #endif
}
