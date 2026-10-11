// DEBUG is set for the Debug build configuration // @link:flag
#if DEBUG // @link:flag,url
let apiURL = URL(string: "http://localhost:3000")! // @link:dev-url,url
#else
let apiURL = URL(string: "https://api.example.com")! // @link:prod-url
#endif

func logConfig() {
    #if DEBUG // @link:debug-check
    print("Using API", apiURL) // @link:log
    #endif
}
