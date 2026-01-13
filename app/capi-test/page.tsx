'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Send, CheckCircle2, AlertCircle, ExternalLink, Server, AlertTriangle } from 'lucide-react'

interface ApiResponse {
  ok: boolean
  data?: any
  sanitizedPayload?: any
  error?: string
}

export default function CapiTestPage() {
  const [isConfigured, setIsConfigured] = React.useState(false)
  const [mode, setMode] = React.useState<'broken' | 'fixed'>('broken')
  const [isLoading, setIsLoading] = React.useState(false)
  const [lastResponse, setLastResponse] = React.useState<ApiResponse | null>(null)
  const [lastTestTime, setLastTestTime] = React.useState<string | null>(null)
  const [testEventCode, setTestEventCode] = React.useState('')
  const [eventId, setEventId] = React.useState('')

  // Optional user data fields
  const [userData, setUserData] = React.useState({
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
    external_id: '',
    city: '',
    country: '',
  })

  // Check CAPI configuration on mount
  React.useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    try {
      const response = await fetch('/api/meta/capi')
      const data = await response.json()
      setIsConfigured(data.configured)
    } catch (error) {
      setIsConfigured(false)
    }
  }

  const sendTestEvent = async () => {
    setIsLoading(true)
    setLastResponse(null)

    try {
      const requestBody = {
        event_name: 'MTL_CAPI_ConnectionTest',
        mode,
        event_id: eventId || undefined,
        user_data: Object.keys(userData).some(key => userData[key as keyof typeof userData]) ? userData : undefined,
        custom_data: {
          test_source: 'Meta Tracking Lab',
        },
        client_ip_address: '127.0.0.1',
        client_user_agent: navigator.userAgent,
        event_source_url: window.location.href,
      }

      const response = await fetch('/api/meta/capi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data: ApiResponse = await response.json()
      setLastResponse(data)
      setLastTestTime(new Date().toLocaleTimeString())

      if (data.ok) {
        toast.success('Server Test Event Sent', {
          description: `Events received: ${data.data?.events_received || 0}`,
        })
      } else {
        toast.error('Failed to Send Event', {
          description: data.error || 'Unknown error',
        })
      }
    } catch (error) {
      toast.error('Failed to Send Event', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearResponse = () => {
    setLastResponse(null)
    setLastTestTime(null)
    toast.info('Response cleared')
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">CAPI Test</h1>
        <p className="mt-2 text-muted-foreground">
          Test Meta Conversions API server-side event tracking
        </p>
      </div>

      <div className="space-y-6">
        {/* Configuration Status Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {isConfigured ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <div>
                <h3 className="font-semibold">CAPI Configuration</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isConfigured
                    ? 'CAPI is properly configured and ready to send events'
                    : 'CAPI is not configured. Please check your environment variables.'}
                </p>
              </div>
            </div>
            <Badge variant={isConfigured ? 'default' : 'destructive'}>
              {isConfigured ? 'Configured' : 'Not Configured'}
            </Badge>
          </div>

          {!isConfigured && (
            <div className="mt-4 rounded-md bg-yellow-500/10 p-3 border border-yellow-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-900">Configuration Required</p>
                  <p className="text-yellow-800 mt-1">
                    Set the following environment variables in .env.local:
                  </p>
                  <ul className="mt-2 list-disc list-inside text-yellow-800 space-y-1">
                    <li className="font-mono text-xs">META_CAPI_ACCESS_TOKEN</li>
                    <li className="font-mono text-xs">NEXT_PUBLIC_FB_PIXEL_ID</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Mode Selection Card */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Server className="h-4 w-4" />
              Event Mode
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Choose between broken (demonstrating issues) and fixed (best practices) modes
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={mode === 'broken' ? 'destructive' : 'outline'}
              onClick={() => setMode('broken')}
              className="w-full"
              disabled={isLoading}
            >
              Broken Mode
            </Button>
            <Button
              variant={mode === 'fixed' ? 'default' : 'outline'}
              onClick={() => setMode('fixed')}
              className="w-full"
              disabled={isLoading}
            >
              Fixed Mode
            </Button>
          </div>
          {mode === 'broken' && (
            <div className="mt-4 rounded-md bg-red-500/10 p-3 border border-red-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-900">Broken Mode Warning</p>
                  <p className="text-red-800 mt-1">
                    This mode sends un-hashed PII and missing required fields to demonstrate what NOT to do.
                    Use dummy data only!
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Test Event Code Card */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Test Event Code (Optional)</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Include a test event code to see events in Meta Events Manager Test Events tab
            </p>
          </div>
          <Input
            type="text"
            placeholder="e.g., TEST12345"
            value={testEventCode}
            onChange={(e) => setTestEventCode(e.target.value)}
            disabled={isLoading}
          />
        </Card>

        {/* User Data Card */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold">User Data (Optional)</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add user data for better matching. In Fixed mode, PII will be hashed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              disabled={isLoading}
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              disabled={isLoading}
            />
            <Input
              type="text"
              placeholder="First Name"
              value={userData.first_name}
              onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
              disabled={isLoading}
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={userData.last_name}
              onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
              disabled={isLoading}
            />
            <Input
              type="text"
              placeholder="External ID"
              value={userData.external_id}
              onChange={(e) => setUserData({ ...userData, external_id: e.target.value })}
              disabled={isLoading}
            />
            <Input
              type="text"
              placeholder="City"
              value={userData.city}
              onChange={(e) => setUserData({ ...userData, city: e.target.value })}
              disabled={isLoading}
            />
            <Input
              type="text"
              placeholder="Country"
              value={userData.country}
              onChange={(e) => setUserData({ ...userData, country: e.target.value })}
              disabled={isLoading}
            />
            <Input
              type="text"
              placeholder="Event ID (optional)"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </Card>

        {/* Actions Card */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={sendTestEvent}
              disabled={!isConfigured || isLoading}
              className="w-full sm:w-auto gap-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Server Test Event</span>
            </Button>
            {lastTestTime && (
              <div className="flex items-center text-sm text-muted-foreground">
                Last test: {lastTestTime}
              </div>
            )}
          </div>
        </Card>

        {/* Response Card */}
        {lastResponse && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Request/Response</h3>
              <Button
                onClick={clearResponse}
                variant="outline"
                size="sm"
                className="h-8"
              >
                Clear
              </Button>
            </div>
            <ScrollArea className="h-96 rounded-md border bg-muted/20 p-3">
              <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                {JSON.stringify(lastResponse, null, 2)}
              </pre>
            </ScrollArea>
          </Card>
        )}

        {/* Instructions Card */}
        <Card className="border-blue-500/20 bg-blue-500/5 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            How to Verify
          </h3>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                1
              </span>
              <div>
                <p className="font-medium">Open Meta Events Manager</p>
                <p className="text-muted-foreground">
                  Go to{' '}
                  <a
                    href="https://business.facebook.com/events_manager2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Events Manager
                  </a>{' '}
                  and select your pixel
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                2
              </span>
              <div>
                <p className="font-medium">Navigate to Test Events</p>
                <p className="text-muted-foreground">
                  Click on <span className="rounded bg-muted px-1.5 py-0.5">Test Events</span> in the left sidebar
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                3
              </span>
              <div>
                <p className="font-medium">Send a Test Event</p>
                <p className="text-muted-foreground">
                  Click the <span className="rounded bg-muted px-1.5 py-0.5">Send Server Test Event</span> button above
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                4
              </span>
              <div>
                <p className="font-medium">Verify Event Received</p>
                <p className="text-muted-foreground">
                  Look for <span className="rounded bg-muted px-1.5 py-0.5">MTL_CAPI_ConnectionTest</span> event in the test events list
                </p>
              </div>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  )
}
