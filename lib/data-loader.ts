import fs from "fs"
import path from "path"
import { CountryRisk, DashboardData } from "@/lib/types"

const DATA_PATH = path.join(process.cwd(), "data", "risk_scores.json")

let cachedData: any = null

function loadData() {
    if (cachedData) return cachedData

    try {
        const fileContent = fs.readFileSync(DATA_PATH, "utf-8")
        cachedData = JSON.parse(fileContent)
        return cachedData
    } catch (error) {
        console.error("Error loading risk scores:", error)
        return null
    }
}

export function getDashboardData(): DashboardData | null {
    const data = loadData()
    if (!data) return null

    const countries = Object.values(data.countries) as any[]

    return {
        summary: data.summary,
        alerts: data.alerts,
        threat_matrix: data.threat_matrix,
        countries: countries,
    }
}


export function getCountryData(iso3: string): CountryRisk | null {
    const data = loadData()
    if (!data) return null

    // Look up by iso3 (lowercase keys in JSON)
    const key = iso3.toLowerCase()
    const country = data.countries[key]

    if (!country) return null

    return country
}
