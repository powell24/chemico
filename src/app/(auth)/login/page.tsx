"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      {/* Mobile-only logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">C</span>
        </div>
        <span className="text-lg font-bold text-primary">Chemico Group</span>
      </div>

      <Card className="shadow-md">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold text-foreground">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your Compliance Copilot account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@thechemicogroup.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-accent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Sign in
          </Button>

          <Separator />

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent font-medium hover:underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        By signing in you agree to Chemico&apos;s{" "}
        <span className="underline cursor-pointer">Terms of Service</span>
        {" "}and{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>.
      </p>
    </div>
  )
}
