import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { CHAT_ROUTES } from "@/shared/constants/routingConstants";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function UpgradePlanPrompt() {
  return (
    <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Unlock Token Sharing</CardTitle>
        <CardDescription className="max-w-[400px] mx-auto">
          Sharing tokens with team members is a Pro feature. Upgrade your plan to start collaborating with shared balances.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pt-4">
        <Button asChild className="bg-primary text-black shadow-lg shadow-primary/25">
          <Link href={CHAT_ROUTES.PRICING}>
            Upgrade to Pro
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
