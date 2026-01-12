"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Users,
  Key,
  CreditCard,
  Check,
  ArrowRight,
  ArrowLeft,
  Copy,
  Plus,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { toast } from "@/shared/hooks/use-toast";
import { cn } from "@/features/platform/lib/utils";
import { useCreateTeam } from "@/features/platform/team/team.queries";
import { useCreateInvites } from "@/features/platform/invitation/invitation.hooks";
import { useDispatch } from "react-redux";
import { CreateInviteRequest } from "@/features/platform/invitation/invitation.types";
import {
  TeamMemberRole,
  TeamMemberAccessMode,
} from "@/features/platform/team/team.types";
import { useCreateProjectMutation } from "@/features/platform/projects/hooks/useProjectQueries";
import { useCreateApiKey } from "@/features/platform/api-keys/hooks/useProjectApiKeys";
import { ApiKeyCreateResponse } from "@/features/platform/api-keys/types/apiKeyTypes";
import { PLATFORM_ROUTES } from "@/shared/constants/routingConstants";
import { CreateProjectRequest } from "@/features/platform/projects/types/projectTypes";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Create Organization",
    description: "Set up your team workspace",
    icon: Building2,
  },
  {
    id: 2,
    title: "Invite Your Team",
    description: "Add team members",
    icon: Users,
  },
  {
    id: 3,
    title: "Make Your First API Call",
    description: "Create API key & project",
    icon: Key,
  },
  {
    id: 4,
    title: "Add API Credits",
    description: "Purchase credits to get started",
    icon: CreditCard,
  },
];

const creditPackages = [
  { id: 1, credits: 1000, price: 10, popular: false },
  { id: 2, credits: 5000, price: 45, popular: true },
  { id: 3, credits: 10000, price: 80, popular: false },
  { id: 4, credits: 50000, price: 350, popular: false },
];

export default function Onboarding() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Form states
  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [inviteEmails, setInviteEmails] = useState<string[]>([""]);
  const [apiKeyName, setApiKeyName] = useState("");
  const [generatedApiKey, setGeneratedApiKey] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [readyToCreateKey, setReadyToCreateKey] = useState(false);

  //hooks
  const createTeam = useCreateTeam();
  const inviteMembers = useCreateInvites(selectedTeamId);
  const createProject = useCreateProjectMutation();
  const createApiKey = useCreateApiKey(selectedProject);

  const handleNext = () => {
    if (currentStep < 4) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateOrg = async () => {
    if (!orgName.trim()) {
      toast({
        title: "Error",
        description: "Organization name is required",
        variant: "destructive",
      });
      return;
    }
    const team = await createTeam.mutateAsync({
      name: orgName,
      description: orgDescription,
    });
    setSelectedTeamId(team.id);
    const projectRequest: CreateProjectRequest = {
      name: "Onboarding Project",
      description: "Onboarding Project",
    };
    const project = await createProject.mutateAsync({
      data: projectRequest,
      teamId: team.id,
    });
    console.log("Project created: ", project);
    setSelectedProject(project.id);
    handleNext();
  };

  const handleInviteTeam = async () => {
    const validEmails = inviteEmails.filter((email) => email.trim());
    if (validEmails.length > 0) {
      const req: CreateInviteRequest = {
        emails: validEmails,
        role: "ADMIN" as TeamMemberRole,
        accessMode: "ALL_PROJECTS" as TeamMemberAccessMode,
        expiresHours: 24,
      };
      console.log("Invite request: ", req);
      const res = await inviteMembers.mutateAsync(req);
      console.log("Invite response: ", res);
      //   toast({ title: "Invites Sent", description: `${validEmails.length} invitation(s) sent successfully!` });
    }
    handleNext();
  };

  const handleAddEmail = () => {
    setInviteEmails([...inviteEmails, ""]);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...inviteEmails];
    newEmails[index] = value;
    setInviteEmails(newEmails);
  };

  const handleGenerateApiKey = async () => {
    console.log("Generate API Key");
    if (!apiKeyName.trim()) {
      toast({
        title: "Error",
        description: "API key name is required",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    console.log("Generate API Key 2");
    try {
      console.log("Generate API Key 3");
      setReadyToCreateKey(true);
      const apiKey: ApiKeyCreateResponse = await createApiKey.mutateAsync({
        name: apiKeyName,
        allowAllModels: true,
        allowAllEndpoints: true,
      } as any);
      setGeneratedApiKey(apiKey.apiKey);
      toast({
        title: "Success",
        description: "API key generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(generatedApiKey);
    toast({ title: "Copied", description: "API key copied to clipboard!" });
  };

  const handlePurchaseCredits = () => {
    if (!selectedPackage) {
      toast({
        title: "Error",
        description: "Please select a credit package",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description:
        "Credits purchased successfully! Redirecting to dashboard...",
    });
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  const handleSkipToEnd = () => {
    router.push(PLATFORM_ROUTES.DASHBOARD);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name *</Label>
              <Input
                id="orgName"
                placeholder="Enter organization name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgDescription">Description (Optional)</Label>
              <Textarea
                id="orgDescription"
                placeholder="Describe your organization..."
                value={orgDescription}
                onChange={(e) => setOrgDescription(e.target.value)}
                className="bg-muted/50 min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={handleSkipToEnd}>
                Skip for now
              </Button>
              <Button onClick={handleCreateOrg}>
                Create Organization <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Invite Team Members by Email</Label>
              {inviteEmails.map((email, index) => (
                <Input
                  key={index}
                  placeholder="colleague@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className="bg-muted/50"
                />
              ))}
              <Button
                variant="outline"
                onClick={handleAddEmail}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Another Email
              </Button>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={handleNext}>
                  Skip
                </Button>
                <Button onClick={handleInviteTeam}>
                  Send Invites <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="apiKeyName">API Key Name *</Label>
                <Input
                  id="apiKeyName"
                  placeholder="Production Key"
                  value={apiKeyName}
                  onChange={(e) => setApiKeyName(e.target.value)}
                  className="bg-muted/50"
                />
              </div>
            </div>

            {!generatedApiKey ? (
              <div className="space-y-3">
                <Button
                  onClick={handleGenerateApiKey}
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    "Generating..."
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" /> Generate API Key
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Note: this key will have access to all models and endpoints.
                  If you want finer control, please create a key from within the
                  console.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Label>Your API Key</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                    {generatedApiKey}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyApiKey}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  ⚠️ Make sure to copy your API key now. You won't be able to
                  see it again!
                </p>
              </div>
            )}

            {generatedApiKey && (
              <Card className="bg-muted/30 border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Example API Call</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="p-3 bg-background rounded-md text-xs overflow-x-auto">
                    {`curl https://api.yourplatform.com/v1/chat/completions \\
  -H "Authorization: Bearer ${generatedApiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
                  </pre>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <div className="flex gap-3">
                {!generatedApiKey && (
                  <Button variant="ghost" onClick={handleNext}>
                    Skip
                  </Button>
                )}
                <Button onClick={handleNext} disabled={!generatedApiKey}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {creditPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50",
                    selectedPackage === pkg.id &&
                      "border-primary ring-1 ring-primary",
                    pkg.popular && "relative"
                  )}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl">
                      {pkg.credits.toLocaleString()}
                    </CardTitle>
                    <CardDescription>credits</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold">${pkg.price}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ${((pkg.price / pkg.credits) * 1000).toFixed(2)} per 1K
                      credits
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={handleSkipToEnd}>
                  Skip for now
                </Button>
                <Button onClick={handlePurchaseCredits}>
                  Purchase Credits <CreditCard className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                AI
              </span>
            </div>
            <span className="font-semibold">Platform Setup</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSkipToEnd}>
            Skip Setup
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Stepper */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() =>
                        completedSteps.includes(step.id) ||
                        step.id <= currentStep
                          ? setCurrentStep(step.id)
                          : null
                      }
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        currentStep === step.id
                          ? "bg-primary text-primary-foreground"
                          : completedSteps.includes(step.id)
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {completedSteps.includes(step.id) ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </button>
                    <div className="mt-2 text-center">
                      <div
                        className={cn(
                          "text-sm font-medium",
                          currentStep === step.id
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-4 mt-[-40px]",
                        completedSteps.includes(step.id)
                          ? "bg-primary"
                          : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderStepContent()}</CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
