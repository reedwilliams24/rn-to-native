import Security // @link:platform

enum Keychain {
    static func save(_ value: String, for account: String) throws { // @link:save
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: account,
        ]
        SecItemDelete(query as CFDictionary) // replace any existing item // @link:delete
        var item = query
        item[kSecValueData as String] = Data(value.utf8)
        item[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        let status = SecItemAdd(item as CFDictionary, nil) // @link:save
        guard status == errSecSuccess else { throw KeychainError(status: status) }
    }

    static func read(_ account: String) -> String? { // @link:read
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]
        var result: AnyObject?
        guard SecItemCopyMatching(query as CFDictionary, &result) == errSecSuccess, // @link:read
              let data = result as? Data else { return nil }
        return String(decoding: data, as: UTF8.self)
    }
}

struct KeychainError: Error { let status: OSStatus }
