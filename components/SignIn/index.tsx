"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const SignIn = () => {
  const { data: session } = useSession();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {session ? (
          <>
            <p className="text-muted-foreground">
              Signed in as{" "}
              <span className="font-medium text-foreground">
                {session?.user?.name}
              </span>
            </p>
            <Button variant="destructive" onClick={() => signOut()}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">Not signed in</p>
            <Button onClick={() => signIn()}>Sign in with Worldcoin</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
