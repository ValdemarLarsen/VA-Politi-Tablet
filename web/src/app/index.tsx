import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


import ChartFilterDemo from "@/app/sider/minprofil/AttendanceGrid"

export default function Index() {
  const [hasReadToBottom, setHasReadToBottom] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false);
  const handleScroll = () => {
    const content = contentRef.current
    if (!content) return

    const scrollPercentage =
      content.scrollTop / (content.scrollHeight - content.clientHeight)
    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true)
    }
  }
  useNuiEvent<string>('setVisible', (data) => {
    console.log(data)

    if (data) {
      const userAcceptedTerms = localStorage.getItem("userAcceptedTerms")
      if (!userAcceptedTerms) {
        console.log("Brugeren har ikke godkendt terms")
        //Venter halvt sekund først
        setTimeout(() => {
          console.log("Der er gået 0.5 sekund")
          setOpen(true)
        }, 500)
      }
    }
  })



  const handleAcceptTerms = () => {
    localStorage.setItem("userAcceptedTerms", "true")
    setOpen(false)
  }


  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="border-b px-6 py-4 text-base">
              Terms & Conditions
            </DialogTitle>
            <div
              ref={contentRef}
              onScroll={handleScroll}
              className="overflow-y-auto"
            >
              <DialogDescription asChild>
                <div className="px-6 py-4">
                  <div className="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p>
                          <strong>Acceptance of Terms</strong>
                        </p>
                        <p>
                          By accessing and using this website, users agree to
                          comply with and be bound by these Terms of Service.
                          Users who do not agree with these terms should
                          discontinue use of the website immediately.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p>
                          <strong>User Account Responsibilities</strong>
                        </p>
                        <p>
                          Users are responsible for maintaining the
                          confidentiality of their account credentials. Any
                          activities occurring under a user&lsquo;s account are
                          the sole responsibility of the account holder. Users
                          must notify the website administrators immediately of
                          any unauthorized account access.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p>
                          <strong>Content Usage and Restrictions</strong>
                        </p>
                        <p>
                          The website and its original content are protected by
                          intellectual property laws. Users may not reproduce,
                          distribute, modify, create derivative works, or
                          commercially exploit any content without explicit
                          written permission from the website owners.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p>
                          <strong>Limitation of Liability</strong>
                        </p>
                        <p>
                          The website provides content &ldquo;as is&ldquo; without
                          any warranties. The website owners shall not be liable
                          for direct, indirect, incidental, consequential, or
                          punitive damages arising from user interactions with the
                          platform.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p>
                          <strong>User Conduct Guidelines</strong>
                        </p>
                        <ul className="list-disc pl-6">
                          <li>Not upload harmful or malicious content</li>
                          <li>Respect the rights of other users</li>
                          <li>
                            Avoid activities that could disrupt website
                            functionality
                          </li>
                          <li>
                            Comply with applicable local and international laws
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <p>
                          <strong>Modifications to Terms</strong>
                        </p>
                        <p>
                          The website reserves the right to modify these terms at
                          any time. Continued use of the website after changes
                          constitutes acceptance of the new terms.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p>
                          <strong>Termination Clause</strong>
                        </p>
                        <p>
                          The website may terminate or suspend user access without
                          prior notice for violations of these terms or for any
                          other reason deemed appropriate by the administration.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p>
                          <strong>Governing Law</strong>
                        </p>
                        <p>
                          These terms are governed by the laws of the jurisdiction
                          where the website is primarily operated, without regard
                          to conflict of law principles.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="border-t px-6 py-4 sm:items-center">
            {!hasReadToBottom && (
              <span className="text-muted-foreground grow text-xs max-sm:text-center">
                Read all terms before accepting.
              </span>
            )}
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleAcceptTerms} type="button" disabled={!hasReadToBottom}>
                I agree
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="grid w-full grid-cols-3 gap-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <ChartFilterDemo />
      </div>
    </>
  );
}