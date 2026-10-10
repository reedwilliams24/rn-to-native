// eas.json: EAS holds the keystore and certificates for you
{
  "cli": { "appVersionSource": "remote" },
  "build": {
    "staging": {
      "env": { "APP_VARIANT": "staging" },
      "distribution": "internal"
    },
    "production": {
      "env": { "APP_VARIANT": "production" },
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "android": { "track": "internal" },
      "ios": { "ascAppId": "1234567890" }
    }
  }
}
