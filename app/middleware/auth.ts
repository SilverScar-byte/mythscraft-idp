export default defineNuxtRouteMiddleware(async () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    if (!user.value) {
        const { data } = await supabase.auth.getUser()

        if (!data.user) {
            return navigateTo('/login')
        }
    }
})