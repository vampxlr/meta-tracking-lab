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
    description: "A comprehensive checklist to ensure your Meta Pixel is properly configured and ready for accurate event tracking.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Before You Begin",
        body: "Ensure you have access to your Meta Business Manager and have created a Pixel. This checklist covers the essential steps to set up your pixel correctly for accurate event tracking."
      },
      {
        heading: "Installation Steps",
        body: "Install the Meta Pixel base code on your website. Place it in the `<head>` section of every page to ensure comprehensive tracking coverage. Verify the pixel is firing using browser developer tools or Meta Pixel Helper."
      },
      {
        heading: "Event Configuration",
        body: "Configure standard events like ViewContent, AddToCart, and Purchase based on your business model. Custom events can be added for specific user actions. Ensure all required parameters are included for optimal matching."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "setup" }
  },

  "/getting-started/demo-controls": {
    title: "Demo Controls",
    description: "Learn how to use the interactive Event Playground to simulate and test various Meta Pixel event scenarios.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Understanding the Playground",
        body: "The Event Playground allows you to simulate Meta Pixel events in real-time. You can test different configurations, identify issues, and verify fixes before deploying to production."
      },
      {
        heading: "Control Panel Features",
        body: "Use the control panel to select event types, configure parameters, and trigger events. The panel displays real-time feedback showing what data is being sent and any potential issues with your event configuration."
      },
      {
        heading: "Testing Scenarios",
        body: "Test common problems like missing events, duplicate events, parameter mismatches, and more. Each scenario helps you understand how to identify and fix tracking issues in your implementation."
      }
    ],
    showDemo: true,
    demoPreset: { kind: "demo" }
  },

  "/problems/missing-events": {
    title: "Missing Events",
    description: "Diagnose why events aren't appearing in your Events Manager and learn how to fix common causes.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Common Causes",
        body: "Events may be missing due to incorrect pixel placement, ad blockers, JavaScript errors, or network connectivity issues. Check that the pixel code is properly installed on all relevant pages."
      },
      {
        heading: "Debugging Steps",
        body: "Use browser developer tools to check for JavaScript errors. Verify the pixel is firing using the Network tab. Test with Meta Pixel Helper extension to identify configuration issues."
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
        body: "Implement proper event deduplication using unique event IDs. Ensure pixel code is only loaded once. Use server-side tracking to complement client-side events while avoiding duplication."
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
        body: "Purchase mismatch occurs when the number or value of purchase events doesn't match your actual sales data. This can be caused by timing issues, currency conversion problems, or incorrect parameter values."
      },
      {
        heading: "Common Issues",
        body: "Missing currency codes, incorrect value formatting, or sending events at the wrong stage of the purchase flow can all contribute to mismatch. Ensure events are sent only after successful transactions."
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
        body: "Match quality refers to how well Meta can attribute events to users based on identifiers like email, phone, or cookie data. Low match quality means many events can't be properly attributed, reducing ad effectiveness."
      },
      {
        heading: "Factors Affecting Match Quality",
        body: "Cookie restrictions, ad blockers, incomplete user data, and cross-device browsing can all reduce match quality. Privacy regulations and browser settings also impact the ability to track users across sessions."
      },
      {
        heading: "Improvement Strategies",
        body: "Implement Conversions API to send server-side events with hashed user data. Collect more user identifiers when possible. Use first-party cookies and consider implementing customer matching features."
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
        body: "Use Meta's event validation tools to check parameter correctness. Implement parameter validation in your code. Reference the official parameter documentation for each event type."
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
        body: "Purchase events sent before AddToCart, ViewContent after Purchase, or missing intermediate events can confuse the attribution algorithm. Ensure events follow the logical customer journey."
      },
      {
        heading: "Best Practices",
        body: "Map out your customer journey and ensure events correspond to each stage. Use event_id to link related events. Test the full user flow to verify correct event sequencing."
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
        body: "Use consistent ID generation across all tracking implementations. Ensure IDs are truly unique and not reused. Store event IDs if you need to reference them later for debugging."
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
        body: "Implement event_id for all events. Use the same ID format across all tracking sources. Configure Conversions API to use deduplication with client-side pixel events."
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
        body: "Verify your domains in Meta Business Manager. Ensure pixel is configured for the correct domain. Check DNS settings if using CNAME or subdomain configurations."
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
        body: "Meta provides several tools for testing: Pixel Helper browser extension, Test Events tab in Events Manager, and browser developer tools. Each tool offers different insights into your pixel implementation."
      },
      {
        heading: "Debugging Workflow",
        body: "Start with Pixel Helper to identify basic issues. Use Test Events to see real-time event data. Check browser console for JavaScript errors. Verify network requests in the Network tab."
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
        body: "Conversions API (CAPI) is Meta's server-side tracking solution that allows you to send web events directly from your server to Meta's servers. Unlike client-side pixel tracking, CAPI is more reliable as it's not affected by browser restrictions, ad blockers, or cookie limitations. It provides better data accuracy, improved match quality, and enhanced privacy compliance. CAPI works alongside the Meta Pixel to ensure comprehensive event tracking and attribution."
      },
      {
        heading: "Testing CAPI",
        body: "Use the dedicated CAPI test page at /capi-test to experiment with Conversions API functionality. This interactive tool allows you to send test events to Meta's servers and observe the responses in real-time. You can configure event parameters, test different event types, and verify that your CAPI implementation is working correctly before deploying to production."
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
        body: "Update pixel initialization to use your first-party endpoint. Test that events are properly forwarded to Meta. Monitor for any delivery issues or performance impacts."
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
        body: "Network failures, rate limits, or temporary Meta API issues can cause events to be lost. A retry queue ensures events are stored and retried until successful delivery, improving data completeness."
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
    description: "Implement validation and sanitization to ensure only properly formatted events reach Meta's servers.",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Purpose of Guardrails",
        body: "Schema guardrails prevent malformed events from being sent to Meta, which can cause processing errors or data corruption. They act as a quality control layer before events leave your server."
      },
      {
        heading: "Validation Rules",
        body: "Validate event names against allowed values. Check parameter types and formats. Ensure required fields are present. Sanitize data to prevent injection attacks or malformed content."
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
