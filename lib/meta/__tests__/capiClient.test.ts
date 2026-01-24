import { sendCapiEvent } from '../capiClient'
import { hashUserData } from '../capiHelpers'

// Mock the environment variables
jest.mock('../../env', () => ({
    env: {
        NEXT_PUBLIC_FB_PIXEL_ID: () => '1234567890',
        META_CAPI_ACCESS_TOKEN: () => 'EAAB...',
        META_GRAPH_API_VERSION: () => 'v19.0',
        META_TEST_EVENT_CODE: () => undefined,
    },
}))

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: () => 'test-uuid-1234',
        subtle: {
            digest: async () => new Uint8Array([1, 2, 3]) // Dummy hash
        }
    }
})

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ events_received: 1 }),
    })
) as jest.Mock

describe('CAPI Client Logic', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear()
    })

    // Test 1: Event ID Generation
    it('should generate an event_id if one is not provided', async () => {
        await sendCapiEvent({
            event_name: 'ViewContent',
            user_data: { client_user_agent: 'TestAgent' },
            event_source_url: 'http://test.com'
        })

        const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
        const payload = JSON.parse(fetchCall[1].body)
        const event = payload.data[0]

        expect(event.event_id).toBe('test-uuid-1234')
    })

    // Test 2: IP Address Handling (The "Localhost Paradox")
    // Case A: Loopback IP should be OMITTED
    it('should OMIT client_ip_address if override IP is localhost (::1)', async () => {
        await sendCapiEvent({
            event_name: 'Purchase',
            event_source_url: 'http://localhost:3000',
            user_data: { client_user_agent: 'TestAgent' }
        }, {
            clientIp: '::1' // Simulate localhost header
        })

        const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
        const payload = JSON.parse(fetchCall[1].body)
        const userData = payload.data[0].user_data

        expect(userData.client_ip_address).toBeUndefined()
    })

    it('should OMIT client_ip_address if override IP is 127.0.0.1', async () => {
        await sendCapiEvent({
            event_name: 'Purchase',
            event_source_url: 'http://localhost:3000',
            user_data: { client_user_agent: 'TestAgent' }
        }, {
            clientIp: '127.0.0.1' // Simulate localhost header
        })

        const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
        const payload = JSON.parse(fetchCall[1].body)
        const userData = payload.data[0].user_data

        expect(userData.client_ip_address).toBeUndefined()
    })

    // Case B: Public IP should be INCLUDED
    it('should INCLUDE client_ip_address if override IP is a public IP', async () => {
        const publicIp = '24.50.100.200'
        await sendCapiEvent({
            event_name: 'Purchase',
            event_source_url: 'http://myshop.com',
            user_data: { client_user_agent: 'TestAgent' }
        }, {
            clientIp: publicIp // Simulate real user IP
        })

        const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
        const payload = JSON.parse(fetchCall[1].body)
        const userData = payload.data[0].user_data

        expect(userData.client_ip_address).toBe(publicIp)
    })

    // Test 3: Prioritize Header IP over Body IP
    it('should prioritize the override IP (header) over the body IP ("auto")', async () => {
        const headerIp = '1.2.3.4'
        const bodyIp = 'auto'

        await sendCapiEvent({
            event_name: 'Purchase',
            event_source_url: 'http://test.com',
            client_ip_address: bodyIp, // Passed from client
            user_data: { client_user_agent: 'TestAgent' }
        }, {
            clientIp: headerIp // Extracted from server headers
        })

        const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
        const payload = JSON.parse(fetchCall[1].body)
        const userData = payload.data[0].user_data

        expect(userData.client_ip_address).toBe(headerIp)
    })
})
