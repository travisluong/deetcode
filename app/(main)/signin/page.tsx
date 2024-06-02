import { Button } from "@/components/ui/button";
import { signIn, providerMap } from "@/lib/auth";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

const SIGNIN_ERROR_URL = "/";

export default async function SignInPage() {
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      {Object.values(providerMap).map((provider) => (
        <form
          action={async () => {
            "use server";
            try {
              await signIn(provider.id, { redirectTo: "/problems" });
            } catch (error) {
              // Signin can fail for a number of reasons, such as the user
              // not existing, or the user not having the correct role.
              // In some cases, you may want to redirect to a custom error
              if (error instanceof AuthError) {
                return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
              }

              // Otherwise if a redirects happens NextJS can handle it
              // so you can just re-thrown the error and let NextJS handle it.
              // Docs:
              // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
              throw error;
            }
          }}
        >
          <Button type="submit" className="flex items-center gap-2">
            <GitHubLogoIcon /> <span>Sign in with {provider.name}</span>
          </Button>
        </form>
      ))}
    </div>
  );
}
