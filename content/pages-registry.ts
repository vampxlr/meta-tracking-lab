export interface PageSection {
  heading: string
  body: string
}

export interface PageMetadata {
  title: string
  description: string
  badge?: "Stable" | "Draft" | "Beta" | "Experimental"
  sectionBlocks: PageSection[]
  showDemo?: boolean
  demoPreset?: {
    kind: "missing" | "duplicate" | "mismatch" | "low-match" | "wrong-params" | 
          "event-order" | "missing-id" | "dedup" | "cookie-fbp" | "aem-domain" | 
          "testing" | "first-party" | "retry" | "schema" | "security" | "setup" | "demo"
  }
}

export const pagesRegistry: Record<string, PageMetadata> = {
  "/getting-started/setup-checklist": {
    title: "Setup Checklist",
    description: "Get the Meta Tracking Lab running locally on your machine with this step-by-step setup guide.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Prerequisites",
        body: "Before getting started, ensure you have Node.js 18+ installed on your machine. You&apos;ll also need npm, yarn, or pnpm as your package manager. Additionally, you should have access to your Meta Business Manager with a Pixel created and a System User Access Token with the necessary permissions (ads_management, ads_read)."
      },
      {
        heading: "Step 1: Clone the Repository",
        body: "Clone the Meta Tracking Lab repository from GitHub using the following command:\n\n```bash\ngit clone https://github.com/vampxlr/meta-tracking-lab.git\ncd meta-tracking-lab\n```\n\nThis will download the project files to your local machine and navigate into the project directory."
      },
      {
        heading: "Step 2: Install Dependencies",
        body: "Install all required dependencies using your preferred package manager:\n\n```bash\nnpm install\n# or\nyarn install\n# or\npnpm install\n```\n\nThis will install Next.js, React, TypeScript, Tailwind CSS, and all other dependencies required for the project."
      },
      {
        heading: "Step 3: Configure Environment Variables",
        body: "Create a `.env.local` file in the root directory of the project. This file will contain your Meta Pixel ID and Conversions API Access Token:\n\n```bash\n# Meta Pixel Configuration\nNEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id_here\n\n# Conversions API Configuration (Future)\nFB_ACCESS_TOKEN=your_access_token_here\nFB_PIXEL_ID=your_pixel_id_here\n```\n\n**Where to find these values:**\n\n- **NEXT_PUBLIC_FB_PIXEL_ID**: Found in Meta Business Manager > Events Manager > Data Sources > Pixels. Look for your pixel and copy the Pixel ID (a numeric value).\n\n- **FB_ACCESS_TOKEN**: Generate this in Meta Business Manager > Business Settings > System Users. Create a System User, assign it to your pixel, and generate an access token with the ads_management and ads_read permissions.\n\n- **FB_PIXEL_ID**: Same as your Pixel ID, but used for server-side tracking.\n\n**Important:** Never commit your `.env.local` file to version control. It&apos;s already included in `.gitignore` for your security."
      },
      {
        heading: "Step 4: Run the Development Server",
        body: "Start the development server to see the Meta Tracking Lab in action:\n\n```bash\nnpm run dev\n# or\nyarn dev\n# or\npnpm dev\n```\n\nOpen your browser and navigate to http://localhost:3000. You should see the Meta Tracking Lab homepage with the navigation sidebar on the left."
      },
      {
        heading: "Step 5: Verify Your Setup",
        body: "To verify that everything is configured correctly:\n\n1. **Check the Setup Status Panel**: Look at the right sidebar on any page. It should show green checkmarks for the Pixel ID and CAPI Token if configured correctly.\n\n2. **Test the CAPI Integration**: Navigate to `/capi-test` and try sending a test event. You should see a success response from Meta&apos;s API.\n\n3. **Check the Events Manager**: Open the Meta Events Manager in a new tab and go to the Test Events. You should see your test events appearing there within a few seconds.\n\n4. **Explore the Demo**: Use the Event Playground (available on most pages via the right sidebar) to trigger different event types and see how they appear in your Meta Events Manager.\n\nIf you encounter any issues, double-check that your Pixel ID and Access Token are correct and that your System User has the appropriate permissions."
      },
      {
        heading: "Next Steps",
        body: "Now that you have the Meta Tracking Lab running locally, explore the documentation pages to learn about common tracking issues and how to fix them. Visit `/getting-started/demo-controls` to learn how to use the interactive Event Playground. Check out the `/capi-test` page to experiment with server-side event tracking using the Conversions API."
      }
    ],
    showDemo: false,
    demoPreset: { kind: "setup" }
  },

  "/getting-started/demo-controls": {
    title: "Demo Controls",
    description: "Master the interactive Event Playground with a comprehensive step-by-step guide to testing Meta Pixel events effectively.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Overview of the Event Playground",
        body: "The Event Playground is an interactive tool that allows you to simulate Meta Pixel events in real-time. It helps you test different configurations, identify tracking issues, and verify fixes before deploying to production. The playground appears in the right sidebar of most documentation pages."
      },
      {
        heading: "Understanding the Interface",
        body: "The playground interface consists of two main sections:\n\n**Controls Tab**: Configure event types, parameters, and trigger events with various settings\n\n**Logs Tab**: View event history, inspect JSON payloads, and copy data for testing\n\n**Mode Toggle**: Switch between Broken and Fixed implementations to compare differences\n\n**Real-time Feedback**: See immediate responses and validation of your event configurations"
      },
      {
        heading: "Step 1: Choose Your Mode",
        body: "Start by selecting between two modes:\n\n**Broken Mode**: Demonstrates common tracking mistakes. See how missing parameters, wrong event IDs, or improper data structures look in Meta&apos;s systems. This helps you identify issues in your own implementation.\n\n**Fixed Mode**: Shows the correct way to implement events. Compare the output to understand what proper data formatting and structure looks like.\n\nUse the radio buttons at the top of the playground to instantly switch between modes. Watch how the JSON payload changes to learn the difference."
      },
      {
        heading: "Step 2: Select an Event Type",
        body: "Choose from three standard e-commerce events:\n\n**ViewContent**: Tracks when users view product pages. Essential for building remarketing audiences and measuring initial interest.\n\n**AddToCart**: Fires when users add items to their cart. Critical for measuring engagement and optimizing ad delivery.\n\n**Purchase**: The most important conversion event, triggered on checkout completion. Required for accurate ROAS and ad optimization.\n\nUse the dropdown menu to select an event type. Each event supports different parameters that you can configure and test."
      },
      {
        heading: "Step 3: Configure Event Parameters",
        body: "Customize your event with optional and required parameters:\n\n**User Data (Advanced)**: email, phone, external_id. Improves match quality by providing Meta with hashed identifiers. Automatically hashed for privacy compliance.\n\n**Custom Data**: content_ids, contents, value, currency. These parameters help Meta&apos;s AI optimize your ads and provide accurate reporting.\n\n**Event ID**: Unique identifier for deduplication. Critical when using both client-side pixel and server-side Conversions API.\n\nFill in only the parameters relevant to your test scenario. The playground validates all inputs before sending events."
      },
      {
        heading: "Step 4: Trigger and Observe Events",
        body: "Send test events and analyze the results:\n\n1. Click the **Send Test Event** button to fire your configured event\n\n2. The event immediately appears in the **Logs** tab with a timestamp\n\n3. A colored badge shows the mode (Red = Broken, Green = Fixed)\n\n4. The complete JSON payload is displayed for inspection\n\n5. Use the **Copy** button to save payloads for reference or testing\n\n6. Trigger multiple events to build up a log history\n\n7. Use the **Clear Logs** button to reset and start fresh\n\nThe log viewer auto-scrolls to show the latest events, making it easy to monitor your test sequences."
      },
      {
        heading: "Step 5: Verify with Meta Events Manager",
        body: "Confirm your events are reaching Meta&apos;s servers:\n\n1. Open Meta Business Manager > Events Manager\n\n2. Navigate to the **Test Events** tab\n\n3. Trigger an event from the playground\n\n4. Your test event should appear within a few seconds\n\n5. Click on the event to see full details\n\n6. Use the Test Events tab to inspect the received data and troubleshoot\n\nThis real-time verification confirms your implementation is working correctly. Compare the playground output with what Meta receives to catch any discrepancies."
      },
      {
        heading: "Common Use Cases",
        body: "Practical applications of the playground:\n\n**Debug Missing Events**: Verify events appear in Events Manager by triggering them from the playground\n\n**Fix Parameter Issues**: Compare Broken vs Fixed modes side-by-side to identify missing fields\n\n**Test Deduplication**: Send identical events with the same event_id to verify Meta deduplicates them\n\n**Improve Match Quality**: Add user data parameters and observe better attribution in Events Manager\n\n**Validate Data Format**: Ensure your custom data structures match Meta&apos;s expected schema\n\nThe playground is a safe testing environment - events are not attributed to your ads and don&apos;t impact performance."
      },
      {
        heading: "Best Practices for Effective Testing",
        body: "Follow these guidelines for optimal results:\n\n**Mode Comparison**: Always test in both Broken and Fixed modes to understand implementation differences\n\n**Event IDs**: Use unique, consistent event IDs when testing deduplication scenarios\n\n**Payload Templates**: Copy successful Fixed mode payloads to use as templates in your production code\n\n**Real-time Verification**: Check that events appear in Test Events tab within 10 seconds of triggering\n\n**Pre-deployment Testing**: Always use the playground before deploying to production to catch issues early\n\n**Documentation**: Keep notes on custom parameters you add for future reference\n\nRemember: The playground is designed for learning and testing purposes only."
      },
      {
        heading: "Quick Reference Guide",
        body: "Event types and their key parameters:\n\n**ViewContent**: page_url, content_name, content_category, content_ids\n\n**AddToCart**: content_ids, contents, value, currency\n\n**Purchase**: content_ids, contents, value, currency, num_items\n\n**User Data**: email, phone, external_id, gender, date_of_birth, city, state, country, zip\n\n**Event ID**: Required for deduplication when using CAPI alongside pixel"
      }
    ],
    showDemo: true,
    demoPreset: { kind: "demo" }
  },

  "/problems/missing-events": {
    title: "Missing Events",
    description: "Diagnose why events aren&apos;t appearing in your Events Manager and learn how to fix common causes.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Common Causes",
        body: "Events may be missing due to incorrect pixel placement, ad blockers, JavaScript errors, or network connectivity issues. Check that the pixel code is properly installed on all relevant pages."
      },
      {
        heading: "Debugging Steps",
        body: "Use browser developer tools to check for JavaScript errors. Verify that the pixel is firing using the Network tab. Test with the Meta Pixel Helper extension to identify configuration issues."
      },
      {
        heading: "Prevention",
        body: "Implement error handling in your pixel implementation. Set up monitoring to alert you when event volumes drop unexpectedly. Regular testing helps catch issues early."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "missing" }
  },

  "/problems/duplicate-events": {
    title: "Duplicate Events",
    description: "Understand why duplicate events occur and how to prevent them from skewing your analytics.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Why Duplicates Happen",
        body: "Duplicate events often occur when the pixel code is loaded multiple times, when users refresh pages, or when events are triggered both client-side and server-side. This can lead to inflated conversion metrics."
      },
      {
        heading: "Detection Methods",
        body: "Check your Events Manager for unusually high event counts. Use event deduplication features like event_id parameters to identify and filter duplicates. Analyze time patterns to spot suspicious activity."
      },
      {
        heading: "Solutions",
        body: "Implement proper event deduplication using unique event IDs. Ensure that the pixel code is only loaded once. Use server-side tracking to complement client-side events while avoiding duplication."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "duplicate" }
  },

  "/problems/purchase-mismatch": {
    title: "Purchase Mismatch",
    description: "Resolve discrepancies between your actual sales and reported purchase events in Meta.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Understanding Mismatch",
        body: "Purchase mismatch occurs when the number or value of purchase events doesn&apos;t match your actual sales data. This can be caused by timing issues, currency conversion problems, or incorrect parameter values."
      },
      {
        heading: "Common Issues",
        body: "Missing currency codes, incorrect value formatting, or sending events at the wrong stage of the purchase flow can all contribute to mismatch. Ensure that events are sent only after successful transactions."
      },
      {
        heading: "Best Practices",
        body: "Always include currency and value parameters. Use consistent currency formatting. Send purchase events only after payment confirmation. Implement server-side tracking for more reliable purchase attribution."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "mismatch" }
  },

  "/problems/low-match-quality": {
    title: "Low Match Quality",
    description: "Improve the accuracy of user attribution by addressing low match quality issues.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "What is Match Quality",
        body: "Match quality refers to how well Meta can attribute events to users based on identifiers like email, phone, or cookie data. Low match quality means many events can&apos;t be properly attributed, reducing ad effectiveness."
      },
      {
        heading: "Factors Affecting Match Quality",
        body: "Cookie restrictions, ad blockers, incomplete user data, and cross-device browsing can all reduce match quality. Privacy regulations and browser settings also impact the ability to track users across sessions."
      },
      {
        heading: "Improvement Strategies",
        body: "Implement the Conversions API to send server-side events with hashed user data. Collect more user identifiers when possible. Use first-party cookies and consider implementing customer matching features."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "low-match" }
  },

  "/problems/wrong-parameters": {
    title: "Wrong Parameters",
    description: "Identify and fix incorrect or missing parameters in your Meta Pixel events.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Parameter Importance",
        body: "Correct parameters are essential for accurate tracking, optimization, and reporting. Missing or incorrect parameters can lead to poor ad performance, incorrect attribution, and wasted ad spend."
      },
      {
        heading: "Common Mistakes",
        body: "Using wrong data types, missing required fields, sending inconsistent values, or not including standard parameters like currency, value, or content_ids can all cause tracking issues."
      },
      {
        heading: "Validation",
        body: "Use Meta&apos;s event validation tools to check parameter correctness. Implement parameter validation in your code. Reference the official parameter documentation for each event type."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "wrong-params" }
  },

  "/problems/event-order": {
    title: "Event Order",
    description: "Understand the importance of correct event sequencing and how to fix order-related issues.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Why Order Matters",
        body: "Event order helps Meta understand the customer journey. Incorrect sequencing can lead to poor attribution models, inaccurate conversion paths, and suboptimal ad delivery."
      },
      {
        heading: "Common Order Issues",
        body: "Purchase events sent before AddToCart, ViewContent after Purchase, or missing intermediate events can confuse the attribution algorithm. Ensure that events follow a logical customer journey."
      },
      {
        heading: "Best Practices",
        body: "Map out your customer journey and ensure that events correspond to each stage. Use an event_id to link related events. Test the full user flow to verify correct event sequencing."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "event-order" }
  },

  "/problems/missing-event-id": {
    title: "Missing Event ID",
    description: "Learn why event IDs are crucial for deduplication and how to implement them correctly.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Event ID Purpose",
        body: "Event IDs are unique identifiers that help Meta deduplicate events across client-side and server-side tracking. Without event IDs, the same action may be counted multiple times, skewing your data."
      },
      {
        heading: "Implementation",
        body: "Generate a unique event ID for each event, preferably using a UUID or timestamp-based system. Send the same event ID for both client-side pixel and server-side Conversions API calls."
      },
      {
        heading: "Best Practices",
        body: "Use consistent ID generation across all tracking implementations. Ensure that IDs are truly unique and not reused. Store event IDs if you need to reference them later for debugging."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "missing-id" }
  },

  "/problems/dedup-misconfigured": {
    title: "Dedup Misconfigured",
    description: "Fix event deduplication issues that cause inflated metrics and wasted ad spend.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Deduplication Overview",
        body: "Event deduplication prevents the same user action from being counted multiple times. When misconfigured, you may see duplicate events in your reports, leading to incorrect performance metrics."
      },
      {
        heading: "Common Misconfigurations",
        body: "Missing event_id parameters, inconsistent ID formats, or sending events from multiple sources without proper deduplication setup can all cause duplicate counting issues."
      },
      {
        heading: "Correct Setup",
        body: "Implement event_id for all events. Use the same ID format across all tracking sources. Configure the Conversions API to use deduplication with client-side pixel events."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "dedup" }
  },

  "/problems/cookie-fbp-issues": {
    title: "Cookie FBP Issues",
    description: "Resolve problems related to Facebook browser cookies and their impact on tracking.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "FBP Cookie Purpose",
        body: "The _fbp cookie stores Facebook browser information for attribution and optimization. Issues with this cookie can lead to poor match quality and tracking failures."
      },
      {
        heading: "Common Problems",
        body: "Cookie consent banners blocking _fbp, browser privacy settings, ad blockers, or incorrect domain configuration can all prevent the cookie from being set or read properly."
      },
      {
        heading: "Solutions",
        body: "Ensure your cookie consent implementation allows necessary cookies. Configure first-party cookie settings. Implement server-side tracking as a fallback when cookies are unavailable."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "cookie-fbp" }
  },

  "/problems/aem-domain-issues": {
    title: "AEM Domain Issues",
    description: "Address domain-related problems that affect Meta Pixel tracking and event delivery.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Domain Verification",
        body: "Meta requires proper domain verification for accurate tracking. Issues with domain configuration can prevent events from being attributed correctly or cause them to be rejected."
      },
      {
        heading: "Common Issues",
        body: "Unverified domains, incorrect domain settings in Business Manager, or mismatched domains between your website and Meta configuration can all cause tracking problems."
      },
      {
        heading: "Resolution Steps",
        body: "Verify your domains in Meta Business Manager. Ensure that the pixel is configured for the correct domain. Check DNS settings if using CNAME or subdomain configurations."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "aem-domain" }
  },

  "/problems/testing-debugging": {
    title: "Testing & Debugging",
    description: "Master the tools and techniques for effectively testing and debugging your Meta Pixel implementation.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Testing Tools",
        body: "Meta provides several tools for testing: the Pixel Helper browser extension, Test Events tab in Events Manager, and browser developer tools. Each tool offers different insights into your pixel implementation."
      },
      {
        heading: "Debugging Workflow",
        body: "Start with the Pixel Helper to identify basic issues. Use the Test Events to see real-time event data. Check the browser console for JavaScript errors. Verify network requests in the Network tab."
      },
      {
        heading: "Common Debugging Scenarios",
        body: "Learn to identify and fix issues like events not firing, incorrect parameters, duplicate events, and attribution problems. Document your findings to build a knowledge base for future debugging."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "testing" }
  },

  "/problems/capi-setup": {
    title: "CAPI Setup",
    description: "Learn how to configure and test Meta Conversions API in this lab",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "What is CAPI?",
        body: "Conversions API (CAPI) is Meta&apos;s server-side tracking solution that allows you to send web events directly from your server to Meta&apos;s servers. Unlike client-side pixel tracking, CAPI is more reliable as it&apos;s not affected by browser restrictions, ad blockers, or cookie limitations. It provides better data accuracy, improved match quality, and enhanced privacy compliance. CAPI works alongside the Meta Pixel to ensure comprehensive event tracking and attribution."
      },
      {
        heading: "Testing CAPI",
        body: "Use the dedicated CAPI test page at `/capi-test` to experiment with Conversions API functionality. This interactive tool allows you to send test events to Meta&apos;s servers and observe the responses in real-time. You can configure event parameters, test different event types, and verify that your CAPI implementation is working correctly before deploying to production."
      },
      {
        heading: "Key Features",
        body: "The CAPI test page offers several powerful features for testing and learning: toggle between broken and fixed modes to simulate common issues and their solutions, automatic user data hashing for privacy compliance (email, phone, etc.), support for standard event types like Purchase and AddToCart, real-time response display showing success/failure status, and detailed event payload inspection. These features help you understand how CAPI works and troubleshoot any issues in your implementation."
      }
    ],
    showDemo: false
  },

  "/server/first-party-endpoint": {
    title: "First-Party Endpoint",
    description: "Implement and configure first-party endpoints for more reliable and privacy-compliant tracking.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "First-Party Benefits",
        body: "First-party endpoints improve tracking reliability by reducing the impact of ad blockers and browser restrictions. They also provide better privacy compliance and more control over data collection."
      },
      {
        heading: "Implementation",
        body: "Set up a proxy endpoint on your domain that forwards events to Meta. Configure your pixel to use this endpoint instead of the default Facebook domain. Ensure proper SSL certificates are in place."
      },
      {
        heading: "Configuration",
        body: "Update the pixel initialization to use your first-party endpoint. Test that events are properly forwarded to Meta. Monitor for any delivery issues or performance impacts."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "first-party" }
  },

  "/server/retry-queue": {
    title: "Retry Queue",
    description: "Implement a robust retry mechanism to ensure events are delivered even during temporary failures.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Why Retry Queues Matter",
        body: "Network failures, rate limits, or temporary Meta API issues can cause events to be lost. A retry queue ensures that events are stored and retried until successful delivery, improving data completeness."
      },
      {
        heading: "Implementation Strategy",
        body: "Store failed events in a queue with timestamps. Implement exponential backoff for retries. Set maximum retry limits and handle permanently failed events appropriately."
      },
      {
        heading: "Best Practices",
        body: "Use persistent storage for the queue to survive server restarts. Monitor queue size and alert on buildup. Implement dead letter queues for events that fail after maximum retries."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "retry" }
  },

  "/server/schema-guardrails": {
    title: "Schema Guardrails",
    description: "Implement validation and sanitization to ensure only properly formatted events reach Meta&apos;s servers.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Purpose of Guardrails",
        body: "Schema guardrails prevent malformed events from being sent to Meta, which can cause processing errors or data corruption. They act as a quality control layer before events leave your server."
      },
      {
        heading: "Validation Rules",
        body: "Validate event names against allowed values. Check parameter types and formats. Ensure that required fields are present. Sanitize data to prevent injection attacks or malformed content."
      },
      {
        heading: "Implementation",
        body: "Create schema definitions for each event type. Implement validation middleware or functions. Log validation failures for debugging. Reject or fix invalid events before sending."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "schema" }
  },

  "/server/security-privacy": {
    title: "Security & Privacy",
    description: "Implement best practices for securing your Meta Pixel implementation and protecting user privacy.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Security Considerations",
        body: "Protect against unauthorized access to your pixel ID and access tokens. Implement proper authentication for server-side endpoints. Validate and sanitize all incoming data."
      },
      {
        heading: "Privacy Compliance",
        body: "Comply with GDPR, CCPA, and other privacy regulations. Implement proper consent management. Provide opt-out mechanisms. Handle user data deletion requests appropriately."
      },
      {
        heading: "Data Protection",
        body: "Hash personally identifiable information before sending to Meta. Use HTTPS for all communications. Implement proper logging and monitoring without exposing sensitive user data."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "security" }
  }
}