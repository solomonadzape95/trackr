"use client"

import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent } from "@/components/ui/card"

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-8 ${className || ""}`}>
      <Spinner className="h-6 w-6 text-primary" />
    </div>
  )
}

export function LoadingOverlay({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8 text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
