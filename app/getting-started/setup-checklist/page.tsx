"use client"

import { PageContent } from "@/components/page-content"
import { SetupStatusPanel } from "@/components/setup-status-panel"

export default function SetupChecklistPage() {
  return (
    <PageContent
      title="Setup Checklist"
      description="Get the Meta Tracking Lab running locally on your machine with this step-by-step setup guide."
      status="Stable"
      rightPanel={<SetupStatusPanel />}
    >
      
      {/* Prerequisites Section */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Prerequisites
        </h2>
        
        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Before getting started, ensure you have Node.js 18+ installed on your machine. You&apos;ll also need npm, yarn, or pnpm as your package manager. Additionally, you should have access to your Meta Business Manager with a Pixel created and a System User Access Token with the necessary permissions (ads_management, ads_read).
          </p>
          
          <div className="glass hover-glow rounded-xl border border-[#00d9ff]/20 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[#00d9ff] text-lg">ℹ</span>
              <span className="font-semibold text-[#00d9ff] font-mono">Required Tools</span>
            </div>
            <ul className="space-y-2 mt-3">
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                <span>Node.js 18 or higher</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                <span>Package manager (npm, yarn, or pnpm)</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                <span>Meta Business Manager access</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Step 1 */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Step 1: Clone the Repository
        </h2>
        
        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Clone the Meta Tracking Lab repository from GitHub using the following command:
          </p>
          
          <pre className="relative overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs md:text-sm">
            <code className="text-[#00ff41]">{`git clone https://github.com/vampxlr/meta-tracking-lab.git
cd meta-tracking-lab`}</code>
          </pre>
          
          <p className="leading-relaxed text-[#8b949e] text-sm">
            This will download the project files to your local machine and navigate into the project directory.
          </p>
        </div>
      </section>

      {/* Step 2 */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4">
          <span className="inline-block animate-pulse">▸</span> Step 2: Install Dependencies
        </h2>
        
        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Install all required dependencies using your preferred package manager:
          </p>
          
          <pre className="relative overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs md:text-sm">
            <code className="text-[#00ff41]">{`npm install
# or
yarn install
# or
pnpm install`}</code>
          </pre>
          
          <p className="leading-relaxed text-[#8b949e] text-sm">
            This will install Next.js, React, TypeScript, Tailwind CSS, and all other dependencies required for the project.
          </p>
        </div>
      </section>

      {/* Step 3 */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4">
          <span className="inline-block animate-pulse">▸</span> Step 3: Configure Environment Variables
        </h2>
        
        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Create a <code className="px-2 py-1 rounded bg-[#0d1117] text-[#00ff41] text-xs font-mono">.env.local</code> file in the root directory of the project. This file will contain your Meta Pixel ID and Conversions API Access Token:
          </p>
          
          <pre className="relative overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs md:text-sm">
            <code className="text-[#00ff41]">{`# Meta Pixel Configuration
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id_here

# Conversions API Configuration (Future)
FB_ACCESS_TOKEN=your_access_token_here
FB_PIXEL_ID=your_pixel_id_here`}</code>
          </pre>
          
          <div className="glass-strong hover-border-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-4">
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-4">
              Where to find these values:
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[#00ff41] mb-2">NEXT_PUBLIC_FB_PIXEL_ID</p>
                <p className="text-[#8b949e] text-sm">
                  Found in Meta Business Manager &gt; Events Manager &gt; Data Sources &gt; Pixels. Look for your pixel and copy the Pixel ID (a numeric value).
                </p>
              </div>
              
              <div>
                <p className="font-mono text-[#00ff41] mb-2">FB_ACCESS_TOKEN</p>
                <p className="text-[#8b949e] text-sm">
                  Generate this in Meta Business Manager &gt; Business Settings &gt; System Users. Create a System User, assign it to your pixel, and generate an access token with the ads_management and ads_read permissions.
                </p>
              </div>
              
              <div>
                <p className="font-mono text-[#00ff41] mb-2">FB_PIXEL_ID</p>
                <p className="text-[#8b949e] text-sm">
                  Same as your Pixel ID, but used for server-side tracking.
                </p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-yellow-400 text-lg">⚠</span>
              <span className="font-semibold text-yellow-400 font-mono">Important</span>
            </div>
            <p className="text-sm text-[#8b949e]">
              Never commit your <code className="px-1.5 py-0.5 rounded bg-[#0d1117] text-[#00ff41] text-xs font-mono">.env.local</code> file to version control. It&apos;s already included in <code className="px-1.5 py-0.5 rounded bg-[#0d1117] text-[#00ff41] text-xs font-mono">.gitignore</code> for your security.
            </p>
          </div>
        </div>
      </section>

      {/* Step 4 */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4">
          <span className="inline-block animate-pulse">▸</span> Step 4: Run the Development Server
        </h2>
        
        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Start the development server to see the Meta Tracking Lab in action:
          </p>
          
          <pre className="relative overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs md:text-sm">
            <code className="text-[#00ff41]">{`npm run dev
# or
yarn dev
# or
pnpm dev`}</code>
          </pre>
          
          <p className="leading-relaxed text-[#8b949e] text-sm">
            Open your browser and navigate to <span className="font-mono text-[#00d9ff]">http://localhost:3000</span>. You should see the Meta Tracking Lab homepage with the navigation sidebar on the left.
          </p>
        </div>
      </section>

      {/* Step 5 */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4">
          <span className="inline-block animate-pulse">▸</span> Step 5: Verify Your Setup
        </h2>
        
        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base mb-4">
            To verify that everything is configured correctly:
          </p>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Check the Setup Status Panel</h3>
                <p className="text-[#8b949e] text-sm">
                  Look at the right sidebar on any page. It should show green checkmarks for the Pixel ID and CAPI Token if configured correctly.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Test the CAPI Integration</h3>
                <p className="text-[#8b949e] text-sm">
                  Navigate to <code className="px-1.5 py-0.5 rounded bg-[#0d1117] text-[#00ff41] text-xs font-mono">/capi-test</code> and try sending a test event. You should see a success response from Meta&apos;s API.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Check the Events Manager</h3>
                <p className="text-[#8b949e] text-sm">
                  Open the Meta Events Manager in a new tab and go to the Test Events. You should see your test events appearing there within a few seconds.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">4</span>
              </div>
              <div className="flex-1">
                <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Explore the Demo</h3>
                <p className="text-[#8b949e] text-sm">
                  Use the Event Playground (available on most pages via the right sidebar) to trigger different event types and see how they appear in your Meta Events Manager.
                </p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 mt-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-red-400 text-lg">⚡</span>
              <span className="font-semibold text-red-400 font-mono">Troubleshooting</span>
            </div>
            <p className="text-sm text-[#8b949e]">
              If you encounter any issues, double-check that your Pixel ID and Access Token are correct and that your System User has the appropriate permissions.
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[600ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4">
          <span className="inline-block animate-pulse">▸</span> Next Steps
        </h2>
        
        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Now that you have the Meta Tracking Lab running locally, explore the documentation pages to learn about common tracking issues and how to fix them.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-4">
              <h3 className="font-mono text-[#00ff41] font-semibold mb-2">Demo Controls</h3>
              <p className="text-[#8b949e] text-sm mb-3">
                Learn how to use the interactive Event Playground
              </p>
              <code className="text-xs text-[#00d9ff] font-mono">/getting-started/demo-controls</code>
            </div>
            
            <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-4">
              <h3 className="font-mono text-[#00ff41] font-semibold mb-2">CAPI Test</h3>
              <p className="text-[#8b949e] text-sm mb-3">
                Experiment with server-side event tracking
              </p>
              <code className="text-xs text-[#00d9ff] font-mono">/capi-test</code>
            </div>
          </div>
        </div>
      </section>

    </PageContent>
  )
}
