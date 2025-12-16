import { SignIn } from "@clerk/clerk-react"

function Index() {
  return (
    <SignIn path='/auth/sign-in' signUpUrl="/auth/sign-up" forceRedirectUrl='/dashboard' />
  )
}

export default Index