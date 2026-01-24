# Event Tracking & Identification Guide

## Overview

All events sent from this application now include **tracking metadata** in the `custom_data` field. This allows you to identify exactly which page and example each event came from when viewing them in Meta Events Manager.

---

## 📋 Tracking Metadata Fields

Every event includes these custom fields:

| Field | Description | Example |
|-------|-------------|---------|
| `source_page` | The route/page the event was sent from | `/getting-started/demo-controls` |
| `example_name` | The specific example that triggered the event | `"Purchase - Fixed Example"` |
| `test_mode` | Whether it was broken/fixed/test mode | `"fixed"` |

---

## 🔍 How to View in Meta Events Manager

### Step 1: Open Events Manager
1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your Pixel ID
3. Navigate to **"Test Events"** or **"Overview"**

### Step 2: View Event Details
1. Click on any event in the list
2. Scroll to the **"Custom Data"** section
3. You'll see the tracking fields:

```json
{
  "currency": "USD",
  "value": 149.98,
  "num_items": 2,
  "order_id": "order_1768497234567",
  "source_page": "/getting-started/demo-controls",
  "example_name": "Purchase - Fixed Example",
  "test_mode": "fixed"
}
```

### Step 3: Filter Events
You can filter events by custom data parameters to find specific examples:
- Filter by `source_page` to see all events from a specific documentation page
- Filter by `example_name` to track a specific example
- Filter by `test_mode` to separate broken vs fixed events

---

## 📊 Event Tracking Matrix

### Demo Controls Page (`/getting-started/demo-controls`)

| Event Name | Example Name | Test Mode |
|------------|--------------|-----------|
| ViewContent | ViewContent - Fixed Example | fixed |
| Search | Search - Fixed Example | fixed |
| AddToCart | AddToCart - Fixed Example | fixed |
| InitiateCheckout | InitiateCheckout - Fixed Example | fixed |
| Purchase | Purchase - Fixed Example | fixed |
| CompleteRegistration | CompleteRegistration - Fixed Example | fixed |

### Example Pages (Other Routes)

Each documentation page includes similar metadata:
- `/problems/missing-event-id` → Events tagged with this source_page
- `/problems/dedup-misconfigured` → Events tagged with this source_page
- `/problems/capi-setup` → Events tagged with this source_page
- etc.

---

## 🎯 Use Cases

### 1. **Debugging Specific Examples**
When testing an example, check Events Manager to verify:
- The event was received
- All custom data fields are present
- The `source_page` and `example_name` match what you clicked

### 2. **Comparing Broken vs Fixed**
You can now easily compare events:
- Send a broken event (`test_mode: "broken"`)
- Send a fixed event (`test_mode: "fixed"`)
- Filter in Events Manager to see the difference

### 3. **Tracking User Learning Journey**
See which documentation pages users are interacting with:
- Group by `source_page` to see most-used pages
- Track progression through the documentation
- Identify which examples are most helpful

### 4. **Quality Assurance**
Verify all examples are working:
- Check that each `example_name` appears in Events Manager
- Ensure all pages are sending events correctly
- Validate metadata is accurate

---

## 💡 Example Queries in Events Manager

### Filter by Page
```
custom_data.source_page = "/getting-started/demo-controls"
```

### Filter by Example
```
custom_data.example_name = "Purchase - Fixed Example"
```

### Filter by Mode
```
custom_data.test_mode = "fixed"
```

### Combine Filters
```
custom_data.source_page = "/problems/missing-event-id" 
AND custom_data.test_mode = "fixed"
```

---

## 🔧 Implementation Details

### Adding Metadata to Your Events

All fixed payload examples include:

```javascript
custom_data: {
  // ... your normal custom_data fields (currency, value, etc.)
  
  // Tracking metadata (add these 3 fields)
  source_page: "/your-page-route",
  example_name: "Event Name - Description",
  test_mode: "fixed" // or "broken" or "test"
}
```

### Standard Format

```javascript
{
  event_name: "Purchase",
  event_id: "uuid-here",
  event_time: 1768497234,
  event_source_url: "https://meta-tracking-lab.vercel.app",
  action_source: "website",
  custom_data: {
    // Required commerce fields
    currency: "USD",
    value: 149.98,
    
    // Tracking metadata - ALWAYS INCLUDE
    source_page: "/getting-started/demo-controls",
    example_name: "Purchase - Fixed Example",
    test_mode: "fixed"
  },
  user_data: { ... }
}
```

---

## 📈 Benefits

1. **🎯 Precise Tracking**: Know exactly where each event originated
2. **🐛 Easier Debugging**: Quickly identify problematic examples
3. **📊 Better Analytics**: Analyze user engagement with specific pages
4. **✅ QA Testing**: Verify all examples are working correctly
5. **📚 Documentation**: Clear audit trail of all test events

---

## 🚀 Next Steps

1. **Test It Out**: 
   - Go to `/getting-started/demo-controls`
   - Click "Test Purchase" in Fixed mode
   - Check Events Manager for the event
   - Look for `source_page`, `example_name`, and `test_mode` in Custom Data

2. **Apply to Other Pages**:
   - Use the same pattern for all examples
   - Update `source_page` to match the route
   - Make `example_name` descriptive and unique

3. **Monitor & Debug**:
   - Use Events Manager filters
   - Track which examples are most used
   - Verify all events have proper metadata

---

## 📝 Notes

- **Non-Intrusive**: These fields don't affect event processing or attribution
- **Best Practice**: Meta allows custom fields in `custom_data`
- **Filterable**: Events Manager supports filtering by custom data parameters
- **Scalable**: Can add more metadata fields as needed (e.g., `user_type`, `experiment_group`, etc.)

---

## 🔗 Related Resources

- [Meta Custom Data Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/custom-data)
- [Events Manager Guide](https://www.facebook.com/business/help/898185560232180)
- [Test Events Tool](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api#test-events)
