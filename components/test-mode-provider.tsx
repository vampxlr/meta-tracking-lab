"use client"

import * as React from "react"

interface TestModeContextType {
    isEnabled: boolean
    setIsEnabled: (enabled: boolean) => void
    testCode: string
    setTestCode: (code: string) => void
}

const TestModeContext = React.createContext<TestModeContextType | undefined>(undefined)

export function TestModeProvider({ children }: { children: React.ReactNode }) {
    const [isEnabled, setIsEnabledState] = React.useState(false)
    const [testCode, setTestCodeState] = React.useState("")

    // Load from localStorage on mount
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const savedEnabled = localStorage.getItem("meta_lab_test_enabled")
            const savedCode = localStorage.getItem("meta_lab_test_code")

            if (savedEnabled) setIsEnabledState(savedEnabled === "true")
            if (savedCode) setTestCodeState(savedCode)
        }
    }, [])

    // Wrappers to sync with localStorage
    const setIsEnabled = (enabled: boolean) => {
        setIsEnabledState(enabled)
        localStorage.setItem("meta_lab_test_enabled", String(enabled))
    }

    const setTestCode = (code: string) => {
        setTestCodeState(code)
        localStorage.setItem("meta_lab_test_code", code)
    }

    return (
        <TestModeContext.Provider value={{ isEnabled, setIsEnabled, testCode, setTestCode }}>
            {children}
        </TestModeContext.Provider>
    )
}

export function useTestMode() {
    const context = React.useContext(TestModeContext)
    if (context === undefined) {
        throw new Error("useTestMode must be used within a TestModeProvider")
    }
    return context
}
