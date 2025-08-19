"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "~/app/_components/button";
import { Suspense } from "react";

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Server Configuration Error",
    description:
      "There is a problem with the server configuration. Please contact support.",
  },
  AccessDenied: {
    title: "Access Denied",
    description:
      "You don't have permission to log in to the application. Ensure your GitHub account has a verified @tec.mx/@exatec.mx email address linked.",
  },
  Verification: {
    title: "Email Verification Required",
    description:
      "Please check your email and click the verification link to continue.",
  },
  Default: {
    title: "Authentication Error",
    description:
      "An unexpected error occurred during authentication. Please try again or reach out to a mantainer.",
  },
  Signin: {
    title: "Sign In Error",
    description:
      "There was an error signing you in. Please try again with a different account.",
  },
  OAuthSignin: {
    title: "OAuth Sign In Error",
    description:
      "Error in constructing an authorization URL. Please try again.",
  },
  OAuthCallback: {
    title: "OAuth Callback Error",
    description: "Error in handling the response from the OAuth provider.",
  },
  OAuthCreateAccount: {
    title: "Account Creation Error",
    description: "Could not create OAuth account in the database.",
  },
  EmailCreateAccount: {
    title: "Email Account Creation Error",
    description: "Could not create email account in the database.",
  },
  Callback: {
    title: "Callback Error",
    description: "Error in the OAuth callback handler route.",
  },
  OAuthAccountNotLinked: {
    title: "Account Not Linked",
    description:
      "This account is already associated with another user. Please sign in with your original account.",
  },
  SessionRequired: {
    title: "Session Required",
    description: "You must be signed in to access this page.",
  },
};

function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Default";
  const errorInfo = errorMessages[error] ?? errorMessages.Default!;

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-8">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-[#E0E0E0]">
            {errorInfo.title}
          </h1>
          <p className="text-[#B0B0B0]">{errorInfo.description}</p>
        </div>

        <div className="flex flex-col space-y-4">
          <Link href="/">
            <Button className="w-full">Return to Home</Button>
          </Link>

          {error === "AccessDenied" ? (
            <>
              <p className="text-sm text-[#B0B0B0]">
                If you want to login using an account with a primary email that
                is not from Tec, see{" "}
                <strong>
                  <a
                    target="_blank"
                    href="https://docs.github.com/en/account-and-profile/how-tos/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/adding-an-email-address-to-your-github-account"
                  >
                    this guide
                  </a>
                </strong>{" "}
                to link your Tec email.
              </p>

              <p className="text-sm text-[#B0B0B0]">
                If you don&apos;t have access to your Tec account anymore, reach
                out to a maintainer to make an exception.
              </p>
            </>
          ) : (
            <Link href="/api/auth/signin">
              <Button className="w-full bg-gray-600 hover:bg-gray-700">
                Try Signing In Again
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPageWrapper() {
  return (
    <Suspense>
      <AuthErrorPage />
    </Suspense>
  );
}
