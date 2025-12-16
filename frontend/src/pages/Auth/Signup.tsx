import { SignUp } from "@clerk/clerk-react"

function Index() {
  return (
    <SignUp path='/auth/sign-up' signInUrl="/auth/sign-in" />
  )
}

export default Index