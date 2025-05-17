import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  Code,
  Database,
  FileCode,
  Github,
  Layers,
  PanelLeft,
  Server,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/lib/components/ui/tabs";

const getAppInfo = createServerFn({ method: "GET" }).handler(async () => {
  return {
    appName: "My TanStack App",
    version: "1.0.0",
    description: "A modern web application built with TanStack Start",
  };
});

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => {
    return {
      appInfo: await getAppInfo(),
    };
  },
});

function Home() {
  const { appInfo } = Route.useLoaderData();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="relative w-full">
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 w-full h-[60vh] flex items-center justify-center">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center text-foreground">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center">
                {appInfo.appName}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl px-4">
                {appInfo.description}
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="font-medium">
                  <Link to="/app/fishes">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="font-medium">
                  <a
                    href="https://github.com/tanstack/start"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="mr-2 h-4 w-4" /> Source Code
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Built with TanStack</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A modern application template with everything you need to build
            production-ready web applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Layers className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">TanStack Router</h3>
            <p className="text-muted-foreground">
              Type-safe routing with loaders, actions, and nested layouts
            </p>
          </Card>

          <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Server className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Server Functions</h3>
            <p className="text-muted-foreground">
              End-to-end type-safe server functions with automatic validation
            </p>
          </Card>

          <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Modern Stack</h3>
            <p className="text-muted-foreground">
              React, TypeScript, Tailwind CSS, and Shadcn UI components
            </p>
          </Card>
        </div>

        {/* Getting Started section */}
        <div className="bg-muted rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Getting Started</h2>

          <Tabs
            defaultValue="overview"
            className="max-w-3xl mx-auto"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="routes">Routes</TabsTrigger>
              <TabsTrigger value="server">Server Functions</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="p-4 border rounded-md bg-background">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <FileCode className="mr-2 h-5 w-5" /> Project Structure
                </h3>
                <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
                  {`app/
├── lib/         # Shared utilities and components
├── routes/      # Application routes
├── server/      # Server-only code
└── router.tsx   # Router configuration`}
                </pre>
                <p className="text-muted-foreground mt-2">
                  This template follows TanStack Start's file-based routing convention and
                  provides a solid foundation for building modern web applications.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="routes" className="p-4 border rounded-md bg-background">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <PanelLeft className="mr-2 h-5 w-5" /> Creating Routes
                </h3>
                <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
                  {`// app/routes/about.tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: AboutPage,
})

function AboutPage() {
  return <div>About page content</div>
}`}
                </pre>
                <p className="text-muted-foreground mt-2">
                  Create new routes by adding files to the routes directory. TanStack
                  Router will automatically generate type-safe routes based on your file
                  structure.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="server" className="p-4 border rounded-md bg-background">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <Database className="mr-2 h-5 w-5" /> Server Functions
                </h3>
                <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
                  {`// Creating a server function
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

export const createUser = createServerFn()
  .input(
    z.object({
      name: z.string(),
      email: z.string().email(),
    })
  )
  .handler(async ({ name, email }) => {
    // Server-side code...
    return { id: 1, name, email }
  })`}
                </pre>
                <p className="text-muted-foreground mt-2">
                  Server functions provide end-to-end type safety and automatic validation
                  for your API calls. They're perfect for data fetching, mutations, and
                  more.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* UI Components Showcase */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">UI Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Cards</CardTitle>
                <CardDescription>
                  Versatile containers for displaying content and actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Cards can contain various elements like text, buttons, and other
                  components.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button size="sm" className="ml-2">
                  Save
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Buttons & Controls</CardTitle>
                <CardDescription>Interactive elements for user actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Code className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Jumpstart your next project with this powerful template. Explore the features,
            customize the UI, and build something amazing.
          </p>
          <Button asChild size="lg" className="font-medium">
            <Link to="/app/fishes">Explore Demo App</Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            {new Date().getFullYear()} {appInfo.appName} - Built with{" "}
            <a
              href="https://tanstack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              TanStack
            </a>{" "}
            and{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              shadcn/ui
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">Version {appInfo.version}</p>
        </div>
      </footer>
    </div>
  );
}
