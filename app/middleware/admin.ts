export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  if (!user.value) {
    return navigateTo('/login')
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.value.sub)
    .single()

  if (error) {
    console.error('Failed to verify admin role:', error)
    return navigateTo('/dashboard')
  }

  const profile = data as { role: string } | null

  if (profile?.role !== 'ADMIN') {
    return navigateTo('/dashboard')
  }
})