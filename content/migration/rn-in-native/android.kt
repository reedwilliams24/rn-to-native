// One activity per legacy RN screen (registered in AndroidManifest.xml).
// Your Application class must also implement ReactApplication;
// see React Native's "Integration with Existing Apps" guide.
class LegacyOrdersActivity : ReactActivity() { // @link:host
    override fun getMainComponentName(): String = "Orders" // @link:orders

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}

// From native code (Compose, a deep link, a notification…)
fun openLegacyOrders(context: Context) {
    context.startActivity(Intent(context, LegacyOrdersActivity::class.java))
}
