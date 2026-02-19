"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  TrendingDown,
  Clock,
  ArrowRight,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface CascadeNode {
  id: string
  label: string
  type: "origin" | "primary" | "secondary" | "tertiary"
  x: number
  y: number
  risk: number
  impact: string
  delay: number
  active: boolean
  description: string
}

interface CascadeEdge {
  from: string
  to: string
  active: boolean
}

function getRiskColor(risk: number) {
  if (risk >= 85) return "text-red-400"
  if (risk >= 70) return "text-amber-400"
  if (risk >= 50) return "text-yellow-400"
  return "text-emerald-400"
}

function getNodeBg(type: string, active: boolean) {
  if (!active) return "bg-secondary/50 border-border/50"
  switch (type) {
    case "origin": return "bg-red-500/20 border-red-500/60"
    case "primary": return "bg-amber-500/20 border-amber-500/60"
    case "secondary": return "bg-blue-500/20 border-blue-500/60"
    case "tertiary": return "bg-purple-500/20 border-purple-500/60"
    default: return "bg-secondary border-border"
  }
}

function getNodeGlow(type: string) {
  switch (type) {
    case "origin": return "shadow-[0_0_20px_rgba(239,68,68,0.3)]"
    case "primary": return "shadow-[0_0_15px_rgba(245,158,11,0.25)]"
    case "secondary": return "shadow-[0_0_12px_rgba(59,130,246,0.2)]"
    case "tertiary": return "shadow-[0_0_10px_rgba(168,85,247,0.2)]"
    default: return ""
  }
}

export default function CascadePage() {
  const [nodes, setNodes] = useState<CascadeNode[]>([])
  const [edges, setEdges] = useState<CascadeEdge[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const [inputValue, setInputValue] = useState("")
  const [isFetching, setIsFetching] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [hasResult, setHasResult] = useState(false)

  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSearch = async () => {
    if (!inputValue.trim() || isFetching) return

    setIsFetching(true)
    setAiResponse(null)
    setHasResult(false)
    setNodes([])
    setEdges([])
    setIsRunning(false)
    setCurrentStep(-1)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue }),
      })

      if (!res.ok) throw new Error("Failed to contact agents")

      const data = await res.json()
      setAiResponse(data.content)
      setHasResult(true)
      setInputValue("")
    } catch (e) {
      console.error(e)
      setAiResponse("Error: Could not reach the agent network. Please ensure the backend is running.")
      setHasResult(true)
    } finally {
      setIsFetching(false)
    }
  }

  const resetSimulation = useCallback(() => {
    setNodes([])
    setEdges([])
    setIsRunning(false)
    setCurrentStep(-1)
    setAiResponse(null)
    setHasResult(false)
    setInputValue("")
  }, [])

  const runSimulation = useCallback(() => {
    if (nodes.length === 0) return
    setIsRunning(true)
    setCurrentStep(0)
    setNodes(prev => prev.map(n => ({ ...n, active: false })))
    setEdges(prev => prev.map(e => ({ ...e, active: false })))
  }, [nodes])

  useEffect(() => {
    if (!isRunning || currentStep < 0) return

    const stepTypes = ["origin", "primary", "secondary", "tertiary"]
    if (currentStep >= stepTypes.length) {
      setIsRunning(false)
      return
    }

    const timer = setTimeout(() => {
      const currentType = stepTypes[currentStep]
      setNodes(prev =>
        prev.map(n => n.type === currentType ? { ...n, active: true } : n)
      )
      setEdges(prev =>
        prev.map(e => {
          const fromNode = nodes.find(n => n.id === e.from)
          if (!fromNode) return e
          const prevStep = currentStep === 0 ? "origin" : stepTypes[currentStep - 1]
          if (fromNode.type === prevStep || fromNode.type === currentType) {
            return { ...e, active: true }
          }
          return e
        })
      )
      setCurrentStep(prev => prev + 1)
    }, 800)

    return () => clearTimeout(timer)
  }, [isRunning, currentStep, nodes])

  const getNodeCenter = (node: CascadeNode) => ({
    x: node.x,
    y: node.y + 3,
  })

  const activeNodes = nodes.filter(n => n.active)
  const totalRisk = activeNodes.length > 0
    ? Math.round(activeNodes.reduce((acc, n) => acc + n.risk, 0) / activeNodes.length)
    : 0

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Cascade Simulator
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Model how disruptions propagate through global supply chains
            </p>
          </div>
          <div className="flex gap-3">
            <ModeToggle />
            <Button
              onClick={runSimulation}
              disabled={isRunning || nodes.length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Play className="mr-2 h-4 w-4" />
              Run Simulation
            </Button>
            <Button
              onClick={resetSimulation}
              variant="outline"
              className="border-border text-foreground hover:bg-secondary"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Scenario Input */}
      <div className="mb-6">
        <div className="glass rounded-xl p-4 relative z-50">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-2">Simulate Any Scenario</span>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
              placeholder="Describe a scenario (e.g. 'What happens if India has a wheat shortage?')"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isFetching}
            />
            <Button
              onClick={handleSearch}
              disabled={!inputValue.trim() || isFetching}
              className="bg-primary hover:bg-primary/90 min-w-[110px]"
            >
              {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-2" />Analyze</>}
            </Button>
          </div>
        </div>
      </div>

      {/* Idle / Result State */}
      {!hasResult && !isFetching && (
        <div className="flex items-center justify-center min-h-[320px]">
          <div className="text-center space-y-3">
            <AlertTriangle className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <p className="text-sm text-muted-foreground">Enter a scenario above to begin cascade analysis</p>
            <p className="text-xs text-muted-foreground/60">e.g. "Ukraine grain crisis", "Somalia drought impact", "Iran oil sanctions"</p>
          </div>
        </div>
      )}

      {isFetching && (
        <div className="flex items-center justify-center min-h-[320px]">
          <div className="text-center space-y-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground animate-pulse">Agents analyzing cascade effects...</p>
          </div>
        </div>
      )}

      {/* AI Response Panel */}
      {hasResult && aiResponse && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl border border-primary/20 p-6 bg-primary/5"
          >
            <div className="flex items-center gap-2 mb-4 text-primary font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              Cascade Analysis
            </div>
            <div className="prose prose-invert max-w-none text-sm text-foreground leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {aiResponse}
              </ReactMarkdown>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
