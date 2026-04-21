"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function SignOutButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <>
      <Button
        variant="outline"
        className="cursor-pointer w-full justify-start gap-2 text-white bg-transparent border-transparent hover:bg-red-600 hover:text-white group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0 group-data-[state=collapsed]:w-9 group-data-[state=collapsed]:h-9 group-data-[state=collapsed]:mx-auto"
        onClick={() => setOpen(true)}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        <span className="group-data-[state=collapsed]:hidden">Sign Out</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign out of Aria?</DialogTitle>
            <DialogDescription>
              Your session will be ended and you'll be redirected to the login page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1 gap-2" onClick={handleSignOut} disabled={loading}>
              <LogOut className="h-4 w-4" />
              {loading ? "Signing out…" : "Sign Out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
