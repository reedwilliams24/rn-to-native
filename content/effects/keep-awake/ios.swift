struct RecipeScreen: View {
    var body: some View {
        RecipeSteps()
            .onAppear { UIApplication.shared.isIdleTimerDisabled = true }
            .onDisappear { UIApplication.shared.isIdleTimerDisabled = false }
    }
}
