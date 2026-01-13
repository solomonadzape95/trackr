import { getSession } from "@/lib/auth-utils"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Shield, ClipboardList, HardDrive, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Trackr - IT Helpdesk & Asset Management",
  description: "Smart IT Helpdesk and Asset Tracking System for Government Offices",
}

export default async function HomePage() {
  const session = await getSession()

  // Redirect authenticated users to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
                Smart IT Helpdesk & Asset Tracking
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                Professional ticketing system and hardware inventory management for government offices
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg">
                <Link href="/login">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage IT support and hardware inventory in one unified system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <ClipboardList className="h-8 w-8 text-foreground mb-2" />
                <CardTitle className="text-lg">Ticketing System</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Report IT issues formally, track progress, and manage resolutions with priority levels
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <HardDrive className="h-8 w-8 text-foreground mb-2" />
                <CardTitle className="text-lg">Asset Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Centralized hardware register with searchable database and maintenance history tracking
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-foreground mb-2" />
                <CardTitle className="text-lg">Role-Based Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Staff, IT Officers, and Admin roles with tailored dashboards and permissions
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <CheckCircle2 className="h-8 w-8 text-foreground mb-2" />
                <CardTitle className="text-lg">Audit Trails</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Append-only maintenance logs provide complete audit records for compliance
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/40 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Ready to streamline IT support?</h2>
          <p className="text-lg text-muted-foreground">
            Sign in with your credentials to access the full Trackr system
          </p>
          <Button asChild size="lg">
            <Link href="/login">
              Sign In
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Trackr - Professional IT Helpdesk & Asset Management System</p>
          <p className="mt-2">Demo Credentials: admin@trackr.gov / AdminPassword123!</p>
        </div>
      </footer>
    </div>
  )
}
