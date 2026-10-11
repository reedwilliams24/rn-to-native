struct RecipeScreen: View { // @link:fn
    var body: some View {
        RecipeSteps() // @link:content
            .onAppear { UIApplication.shared.isIdleTimerDisabled = true } // @link:effect,on
            .onDisappear { UIApplication.shared.isIdleTimerDisabled = false } // @link:cleanup,off
    }
}
