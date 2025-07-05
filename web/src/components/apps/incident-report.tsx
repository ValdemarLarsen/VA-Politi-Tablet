"use client"

import type React from "react"

import { useState, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Users,
  Shield,
  MapPin,
  Camera,
  Paperclip,
  Save,
  Printer,
  Send,
  Plus,
  X,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Scale,
  Phone,
  Mail,
} from "lucide-react"

interface Person {
  id: string
  fullName: string
  cprNumber: string
  phone: string
  address: string
  mugshot: string
}

interface Officer {
  id: string
  name: string
  badgeNumber: string
  rank: string
  department: string
}

interface Violation {
  id: string
  code: string
  description: string
  category: "Straffeloven" | "Færdselsloven" | "Våbenloven" | "Lov om euforiserende stoffer" | "Ordensbekendtgørelsen"
  subcategory: string
  severity: "Mindre" | "Alvorlig" | "Grov"
  minFine: number
  maxFine: number
  prisonTime?: string
  points: number // Klip i kørekort
  keywords: string[]
}

interface Lawyer {
  id: string
  name: string
  firm: string
  phone: string
  email: string
  specialization: string[]
}

interface IncidentReport {
  id: string
  reportNumber: string
  title: string
  date: string
  time: string
  location: string
  coordinates?: { lat: number; lng: number }
  description: string
  involvedPersons: {
    person: Person
    role: "Mistænkt" | "Vidne" | "Forurettet" | "Anmelder"
    violations: Violation[]
    acknowledges: boolean
    lawyer?: Lawyer
    statement: string
    penalty?: {
      fine: number
      prisonTime?: string
      drivingBan?: string
      other?: string
    }
  }[]
  officers: Officer[]
  reportingOfficer: Officer
  evidence: {
    id: string
    type: "Foto" | "Video" | "Dokument" | "Fysisk bevis"
    description: string
    url?: string
  }[]
  witnesses: {
    name: string
    phone: string
    address: string
    statement: string
  }[]
  status: "Kladde" | "Under behandling" | "Afsluttet" | "Arkiveret"
  priority: "Lav" | "Normal" | "Høj" | "Kritisk"
  followUpRequired: boolean
  followUpDate?: string
  notes: string
  createdAt: string
  updatedAt: string
}

// Mock data
const mockPersons: Person[] = [
  {
    id: "1",
    fullName: "Lars Nielsen",
    cprNumber: "150385-1234",
    phone: "+45 20 12 34 56",
    address: "Hovedgade 123, 2100 København Ø",
    mugshot: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2",
    fullName: "Maria Hansen",
    cprNumber: "220792-5678",
    phone: "+45 30 98 76 54",
    address: "Nørregade 45, 8000 Aarhus C",
    mugshot: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "3",
    fullName: "Peter Andersen",
    cprNumber: "081178-9012",
    phone: "+45 40 11 22 33",
    address: "Vestergade 78, 5000 Odense C",
    mugshot: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
]

const mockOfficers: Officer[] = [
  { id: "1", name: "Betjent Hansen", badgeNumber: "1234", rank: "Betjent", department: "Patruljetjeneste" },
  { id: "2", name: "Betjent Larsen", badgeNumber: "1235", rank: "Betjent", department: "Patruljetjeneste" },
  {
    id: "3",
    name: "Kriminalassistent Nielsen",
    badgeNumber: "2001",
    rank: "Kriminalassistent",
    department: "Kriminalpoliti",
  },
  { id: "4", name: "Politikommissær Andersen", badgeNumber: "3001", rank: "Politikommissær", department: "Ledelse" },
]

const mockViolations: Violation[] = [
  // STRAFFELOVEN
  {
    id: "strl_244",
    code: "§ 244",
    description:
      "Den, som øver vold mod eller på anden måde angriber en andens person, straffes med fængsel indtil 3 år.",
    category: "Straffeloven",
    subcategory: "Forbrydelser mod person",
    severity: "Alvorlig",
    minFine: 5000,
    maxFine: 15000,
    prisonTime: "Indtil 3 år",
    points: 0,
    keywords: ["vold", "angreb", "person", "simpel vold"],
  },
  {
    id: "strl_245",
    code: "§ 245",
    description: "Grov vold - særlig rå, brutal eller farlig vold eller vold af særlig krænkende karakter",
    category: "Straffeloven",
    subcategory: "Forbrydelser mod person",
    severity: "Grov",
    minFine: 15000,
    maxFine: 50000,
    prisonTime: "Indtil 6 år",
    points: 0,
    keywords: ["grov vold", "brutal", "farlig", "krænkende"],
  },
  {
    id: "strl_276",
    code: "§ 276",
    description: "Den, som borttager en fremmed rørlig ting i den hensigt at tilegne sig den, straffes for tyveri",
    category: "Straffeloven",
    subcategory: "Forbrydelser mod formue",
    severity: "Alvorlig",
    minFine: 3000,
    maxFine: 20000,
    prisonTime: "Indtil 1 år og 6 måneder",
    points: 0,
    keywords: ["tyveri", "borttager", "tilegne", "stjæle"],
  },
  {
    id: "strl_279",
    code: "§ 279",
    description: "Groft tyveri - tyveri af særlig grov beskaffenhed",
    category: "Straffeloven",
    subcategory: "Forbrydelser mod formue",
    severity: "Grov",
    minFine: 10000,
    maxFine: 40000,
    prisonTime: "Indtil 6 år",
    points: 0,
    keywords: ["groft tyveri", "særlig grov", "organiseret"],
  },
  {
    id: "strl_191",
    code: "§ 191",
    description: "Bedrageri - ved svig bringer en anden til at foretage eller undlade en handling",
    category: "Straffeloven",
    subcategory: "Forbrydelser mod formue",
    severity: "Grov",
    minFine: 10000,
    maxFine: 50000,
    prisonTime: "Indtil 8 år",
    points: 0,
    keywords: ["bedrageri", "svig", "snyd", "falsk"],
  },
  {
    id: "strl_291",
    code: "§ 291",
    description: "Hærværk - ødelæggelse, beskadigelse eller tilsøling af andres ting",
    category: "Straffeloven",
    subcategory: "Forbrydelser mod formue",
    severity: "Mindre",
    minFine: 2000,
    maxFine: 10000,
    prisonTime: "Indtil 1 år og 6 måneder",
    points: 0,
    keywords: ["hærværk", "ødelæggelse", "beskadigelse", "tilsøling", "graffiti"],
  },

  // FÆRDSELSLOVEN
  {
    id: "fsl_42_1",
    code: "§ 42, stk. 1",
    description: "Hastighedsovertrædelse - kørsel med hastighed indtil 20 km/t over den tilladte",
    category: "Færdselsloven",
    subcategory: "Hastighedsovertrædelser",
    severity: "Mindre",
    minFine: 1000,
    maxFine: 2500,
    prisonTime: "",
    points: 0,
    keywords: ["hastighed", "fart", "20 km/t", "mindre"],
  },
  {
    id: "fsl_42_2",
    code: "§ 42, stk. 2",
    description: "Hastighedsovertrædelse - kørsel med hastighed 21-30 km/t over den tilladte",
    category: "Færdselsloven",
    subcategory: "Hastighedsovertrædelser",
    severity: "Alvorlig",
    minFine: 2500,
    maxFine: 5000,
    prisonTime: "",
    points: 1,
    keywords: ["hastighed", "fart", "21-30 km/t", "klip"],
  },
  {
    id: "fsl_42_3",
    code: "§ 42, stk. 3",
    description: "Hastighedsovertrædelse - kørsel med hastighed over 30 km/t over den tilladte",
    category: "Færdselsloven",
    subcategory: "Hastighedsovertrædelser",
    severity: "Grov",
    minFine: 5000,
    maxFine: 20000,
    prisonTime: "Indtil 20 dage",
    points: 3,
    keywords: ["hastighed", "fart", "over 30 km/t", "betinget frakendelse"],
  },
  {
    id: "fsl_53",
    code: "§ 53",
    description: "Spirituskørsel - kørsel med alkoholpromille over 0,50",
    category: "Færdselsloven",
    subcategory: "Spirituskørsel",
    severity: "Grov",
    minFine: 10000,
    maxFine: 30000,
    prisonTime: "Indtil 1 år",
    points: 3,
    keywords: ["alkohol", "spiritus", "promille", "druk", "frakendelse"],
  },
  {
    id: "fsl_54",
    code: "§ 54",
    description: "Kørsel under påvirkning af euforiserende stoffer",
    category: "Færdselsloven",
    subcategory: "Narkokørsel",
    severity: "Grov",
    minFine: 10000,
    maxFine: 30000,
    prisonTime: "Indtil 2 år",
    points: 3,
    keywords: ["narkotika", "euforiserende", "stoffer", "hash", "kokain", "frakendelse"],
  },
  {
    id: "fsl_56",
    code: "§ 56",
    description: "Kørsel uden førerret",
    category: "Færdselsloven",
    subcategory: "Førerret",
    severity: "Alvorlig",
    minFine: 8000,
    maxFine: 16000,
    prisonTime: "Indtil 4 måneder",
    points: 0,
    keywords: ["uden kørekort", "førerret", "unlicensed"],
  },

  // VÅBENLOVEN
  {
    id: "vbl_1",
    code: "§ 1",
    description: "Besiddelse af skydevåben uden tilladelse",
    category: "Våbenloven",
    subcategory: "Skydevåben",
    severity: "Grov",
    minFine: 15000,
    maxFine: 40000,
    prisonTime: "Indtil 4 år",
    points: 0,
    keywords: ["skydevåben", "pistol", "riffel", "våben", "tilladelse"],
  },
  {
    id: "vbl_4",
    code: "§ 4",
    description: "Besiddelse af kniv med klinge over 12 cm på offentligt tilgængeligt sted",
    category: "Våbenloven",
    subcategory: "Blankvåben",
    severity: "Alvorlig",
    minFine: 3000,
    maxFine: 10000,
    prisonTime: "Indtil 2 år",
    points: 0,
    keywords: ["kniv", "blankvåben", "12 cm", "offentligt"],
  },

  // NARKOTIKALOVEN
  {
    id: "nark_3",
    code: "§ 3",
    description: "Besiddelse af narkotika til eget forbrug",
    category: "Lov om euforiserende stoffer",
    subcategory: "Besiddelse",
    severity: "Mindre",
    minFine: 2000,
    maxFine: 5000,
    prisonTime: "Indtil 2 år",
    points: 0,
    keywords: ["narkotika", "hash", "kokain", "besiddelse", "eget forbrug"],
  },
  {
    id: "nark_3_handel",
    code: "§ 3 (handel)",
    description: "Handel med narkotika",
    category: "Lov om euforiserende stoffer",
    subcategory: "Handel",
    severity: "Grov",
    minFine: 20000,
    maxFine: 100000,
    prisonTime: "Indtil 10 år",
    points: 0,
    keywords: ["narkotika", "handel", "salg", "distribution", "pusher"],
  },

  // ORDENSBEKENDTGØRELSEN
  {
    id: "orden_3",
    code: "§ 3",
    description: "Forstyrrelse af den offentlige orden",
    category: "Ordensbekendtgørelsen",
    subcategory: "Offentlig orden",
    severity: "Mindre",
    minFine: 1000,
    maxFine: 3000,
    prisonTime: "",
    points: 0,
    keywords: ["forstyrrelse", "orden", "offentlig", "larm", "ballade"],
  },
  {
    id: "orden_11",
    code: "§ 11",
    description: "Ophold på offentligt sted i beruset tilstand",
    category: "Ordensbekendtgørelsen",
    subcategory: "Beruselse",
    severity: "Mindre",
    minFine: 800,
    maxFine: 2000,
    prisonTime: "",
    points: 0,
    keywords: ["beruset", "offentligt", "alkohol", "druk"],
  },
]

const mockLawyers: Lawyer[] = [
  {
    id: "1",
    name: "Jens Jensen",
    firm: "Advokatfirmaet Jensen & Co.",
    phone: "+45 12 34 56 78",
    email: "jens.jensen@jensenogco.dk",
    specialization: ["Strafferet", "Familieret"],
  },
  {
    id: "2",
    name: "Anna Andersen",
    firm: "Andersen Law",
    phone: "+45 87 65 43 21",
    email: "anna@andersenlaw.dk",
    specialization: ["Ejendomsret", "Erhvervsret"],
  },
  {
    id: "3",
    name: "Peter Petersen",
    firm: "Petersen Legal",
    phone: "+45 45 45 45 45",
    email: "peter@petersenlegal.dk",
    specialization: ["Kontraktret", "Skatteret"],
  },
]

const reportTemplates = {
  trafik: `TRAFIKUHELD/OVERTRÆDELSE

Dato og tid: [DATO] kl. [TID]
Sted: [LOKATION]

BESKRIVELSE AF HÆNDELSEN:
[Beskriv detaljeret hvad der skete, vejrforhold, trafikforhold, etc.]

INVOLVEREDE KØRETØJER:
[Beskrivelse af køretøjer, skader, etc.]

PERSONSKADER:
[Eventuelle personskader]

VIDNER:
[Vidneudsagn]

KONKLUSION:
[Vurdering af skyld og ansvar]`,

  vold: `VOLDSANMELDELSE

Dato og tid: [DATO] kl. [TID]
Sted: [LOKATION]

ANMELDELSE:
[Hvem anmeldte og hvornår]

BESKRIVELSE AF VOLDEN:
[Detaljeret beskrivelse af voldshandlingen]

SKADER PÅ FORURETTEDE:
[Beskrivelse af skader, lægebehandling]

GERNINGSPERSONENS HANDLING:
[Beskrivelse af gerningspersonens adfærd]

VIDNER:
[Vidneudsagn]

BEVISER:
[Fysiske beviser, fotos, etc.]`,

  tyveri: `TYVERIANMELDELSE

Dato og tid for tyveri: [DATO] kl. [TID]
Anmeldt: [ANMELDELSESDATO]
Sted: [LOKATION]

STJÅLNE GENSTANDE:
[Detaljeret liste over stjålne genstande med værdi]

GERNINGSSTED:
[Beskrivelse af gerningssted, adgangsforhold]

GERNINGSPERSON:
[Beskrivelse af mistænkt person]

SPOR OG BEVISER:
[Fingeraftryk, DNA, videoovervågning, etc.]

VIDNER:
[Vidneudsagn]`,

  standard: `POLITIRAPPORT

Dato og tid: [DATO] kl. [TID]
Sted: [LOKATION]
Rapportnummer: [RAPPORTNUMMER]

SAMMENDRAG:
[Kort sammendrag af hændelsen]

DETALJERET BESKRIVELSE:
[Detaljeret beskrivelse af hændelsesforløbet]

INVOLVEREDE PERSONER:
[Liste over involverede personer og deres roller]

HANDLINGER FORETAGET:
[Hvilke handlinger politiet har foretaget]

OPFØLGNING:
[Nødvendig opfølgning]`,
}

export default function IncidentReport() {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [report, setReport] = useState<Partial<IncidentReport>>({
    reportNumber: `RPT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    status: "Kladde",
    priority: "Normal",
    involvedPersons: [],
    officers: [],
    evidence: [],
    witnesses: [],
    followUpRequired: false,
  })

  const [activeTab, setActiveTab] = useState<"basic" | "persons" | "evidence" | "report" | "review">("basic")
  const [showPersonSearch, setShowPersonSearch] = useState(false)
  const [showOfficerSearch, setShowOfficerSearch] = useState(false)
  const [showViolationSearch, setShowViolationSearch] = useState(false)
  const [showLawyerSearch, setShowLawyerSearch] = useState(false)
  const [selectedPersonIndex, setSelectedPersonIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showTemplateMenu, setShowTemplateMenu] = useState(false)
  const [templateMenuPosition, setTemplateMenuPosition] = useState({ x: 0, y: 0 })

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleAddPerson = (person: Person) => {
    const newInvolvedPerson = {
      person,
      role: "Mistænkt" as const,
      violations: [],
      acknowledges: false,
      statement: "",
    }

    setReport((prev) => ({
      ...prev,
      involvedPersons: [...(prev.involvedPersons || []), newInvolvedPerson],
    }))
    setShowPersonSearch(false)
  }

  const handleAddOfficer = (officer: Officer) => {
    setReport((prev) => ({
      ...prev,
      officers: [...(prev.officers || []), officer],
    }))
    setShowOfficerSearch(false)
  }

  const handleAddViolation = (violation: Violation) => {
    if (selectedPersonIndex !== null) {
      setReport((prev) => {
        const newInvolvedPersons = [...(prev.involvedPersons || [])]
        newInvolvedPersons[selectedPersonIndex].violations.push(violation)
        return { ...prev, involvedPersons: newInvolvedPersons }
      })
    }
    setShowViolationSearch(false)
    setSelectedPersonIndex(null)
  }

  const handleAddLawyer = (lawyer: Lawyer) => {
    if (selectedPersonIndex !== null) {
      setReport((prev) => {
        const newInvolvedPersons = [...(prev.involvedPersons || [])]
        newInvolvedPersons[selectedPersonIndex].lawyer = lawyer
        return { ...prev, involvedPersons: newInvolvedPersons }
      })
    }
    setShowLawyerSearch(false)
    setSelectedPersonIndex(null)
  }

  const handleTemplateInsert = (templateKey: string) => {
    const template = reportTemplates[templateKey as keyof typeof reportTemplates]
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const currentText = report.description || ""
      const newText = currentText.substring(0, start) + template + currentText.substring(end)

      setReport((prev) => ({ ...prev, description: newText }))

      // Restore cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + template.length, start + template.length)
      }, 0)
    }
    setShowTemplateMenu(false)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setTemplateMenuPosition({ x: e.clientX, y: e.clientY })
    setShowTemplateMenu(true)
  }

  const calculateTotalFine = () => {
    return (report.involvedPersons || []).reduce((total, person) => {
      return (
        total +
        person.violations.reduce((personTotal, violation) => {
          return personTotal + (person.penalty?.fine || violation.minFine)
        }, 0)
      )
    }, 0)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Mindre":
        return "bg-green-100 text-green-800 border-green-200"
      case "Alvorlig":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Grov":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredViolations = useMemo(() => {
    return mockViolations.filter((violation) => {
      const matchesCategory = !selectedCategory || violation.category === selectedCategory
      const matchesSearch =
        !searchTerm ||
        violation.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        violation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        violation.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
        violation.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        violation.subcategory.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchTerm])

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-gray-700" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Hændelsesrapport</h1>
              <p className="text-sm text-gray-500">Rapportnummer: {report.reportNumber}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-md text-sm font-medium border ${
                report.status === "Kladde"
                  ? "bg-gray-100 text-gray-800 border-gray-200"
                  : report.status === "Under behandling"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : report.status === "Afsluttet"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-blue-100 text-blue-800 border-blue-200"
              }`}
            >
              {report.status}
            </span>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Gem
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Udskriv
            </Button>
            <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
              <Send className="w-4 h-4 mr-2" />
              Indsend
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-4">
          {[
            { id: "basic", label: "Grundinfo", icon: FileText },
            { id: "persons", label: "Personer", icon: Users },
            { id: "evidence", label: "Beviser", icon: Camera },
            { id: "report", label: "Rapport", icon: FileText },
            { id: "review", label: "Gennemgang", icon: CheckCircle },
          ].map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
              {index < 4 && <span className="text-gray-400 ml-2">→</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "basic" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Grundlæggende Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                  <Input
                    value={report.title || ""}
                    onChange={(e) => setReport((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Kort beskrivelse af hændelsen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioritet</label>
                  <select
                    value={report.priority || "Normal"}
                    onChange={(e) => setReport((prev) => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Lav">Lav</option>
                    <option value="Normal">Normal</option>
                    <option value="Høj">Høj</option>
                    <option value="Kritisk">Kritisk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dato</label>
                  <Input
                    type="date"
                    value={report.date || ""}
                    onChange={(e) => setReport((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tidspunkt</label>
                  <Input
                    type="time"
                    value={report.time || ""}
                    onChange={(e) => setReport((prev) => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lokation</label>
                  <div className="flex space-x-2">
                    <Input
                      value={report.location || ""}
                      onChange={(e) => setReport((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Adresse eller beskrivelse af stedet"
                      className="flex-1"
                    />
                    <Button variant="outline">
                      <MapPin className="w-4 h-4 mr-2" />
                      GPS
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Rapporterende Betjent</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Betjent</label>
                  <select
                    value={report.reportingOfficer?.id || ""}
                    onChange={(e) => {
                      const officer = mockOfficers.find((o) => o.id === e.target.value)
                      setReport((prev) => ({ ...prev, reportingOfficer: officer }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Vælg betjent</option>
                    {mockOfficers.map((officer) => (
                      <option key={officer.id} value={officer.id}>
                        {officer.name} ({officer.badgeNumber})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={report.status || "Kladde"}
                    onChange={(e) => setReport((prev) => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Kladde">Kladde</option>
                    <option value="Under behandling">Under behandling</option>
                    <option value="Afsluttet">Afsluttet</option>
                    <option value="Arkiveret">Arkiveret</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Opfølgning</h3>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={report.followUpRequired || false}
                    onChange={(e) => setReport((prev) => ({ ...prev, followUpRequired: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Kræver opfølgning</span>
                </label>
              </div>
              {report.followUpRequired && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opfølgningsdato</label>
                  <Input
                    type="date"
                    value={report.followUpDate || ""}
                    onChange={(e) => setReport((prev) => ({ ...prev, followUpDate: e.target.value }))}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "persons" && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Involverede Personer</h3>
                <Button onClick={() => setShowPersonSearch(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tilføj Person
                </Button>
              </div>

              <div className="space-y-4">
                {(report.involvedPersons || []).map((involvedPerson, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={involvedPerson.person.mugshot || "/placeholder.svg"}
                          alt={involvedPerson.person.fullName}
                          className="w-12 h-12 rounded-full object-cover border border-gray-300"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{involvedPerson.person.fullName}</h4>
                          <p className="text-sm text-gray-500">CPR: {involvedPerson.person.cprNumber}</p>
                          <p className="text-sm text-gray-500">{involvedPerson.person.phone}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReport((prev) => ({
                            ...prev,
                            involvedPersons: prev.involvedPersons?.filter((_, i) => i !== index),
                          }))
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
                        <select
                          value={involvedPerson.role}
                          onChange={(e) => {
                            setReport((prev) => {
                              const newInvolvedPersons = [...(prev.involvedPersons || [])]
                              newInvolvedPersons[index].role = e.target.value as any
                              return { ...prev, involvedPersons: newInvolvedPersons }
                            })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="Mistænkt">Mistænkt</option>
                          <option value="Vidne">Vidne</option>
                          <option value="Forurettet">Forurettet</option>
                          <option value="Anmelder">Anmelder</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={involvedPerson.acknowledges}
                            onChange={(e) => {
                              setReport((prev) => {
                                const newInvolvedPersons = [...(prev.involvedPersons || [])]
                                newInvolvedPersons[index].acknowledges = e.target.checked
                                return { ...prev, involvedPersons: newInvolvedPersons }
                              })
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">Erkender forhold</span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        {involvedPerson.lawyer ? (
                          <div className="flex items-center space-x-2 text-sm">
                            <Scale className="w-4 h-4 text-gray-500" />
                            <span>{involvedPerson.lawyer.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setReport((prev) => {
                                  const newInvolvedPersons = [...(prev.involvedPersons || [])]
                                  delete newInvolvedPersons[index].lawyer
                                  return { ...prev, involvedPersons: newInvolvedPersons }
                                })
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPersonIndex(index)
                              setShowLawyerSearch(true)
                            }}
                          >
                            <Scale className="w-4 h-4 mr-1" />
                            Tilføj Advokat
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Violations */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Overtrædelser</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPersonIndex(index)
                            setShowViolationSearch(true)
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Tilføj
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {involvedPerson.violations.map((violation, vIndex) => (
                          <div key={vIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">{violation.code}</span>
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(violation.severity)}`}
                                >
                                  {violation.severity}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{violation.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Bøde: {violation.minFine.toLocaleString()} - {violation.maxFine.toLocaleString()} kr.
                                {violation.prisonTime && ` | Fængsel: ${violation.prisonTime}`}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setReport((prev) => {
                                  const newInvolvedPersons = [...(prev.involvedPersons || [])]
                                  newInvolvedPersons[index].violations = newInvolvedPersons[index].violations.filter(
                                    (_, i) => i !== vIndex,
                                  )
                                  return { ...prev, involvedPersons: newInvolvedPersons }
                                })
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Penalty */}
                    {involvedPerson.violations.length > 0 && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Straf</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Bøde (kr.)</label>
                            <Input
                              type="number"
                              value={involvedPerson.penalty?.fine || ""}
                              onChange={(e) => {
                                setReport((prev) => {
                                  const newInvolvedPersons = [...(prev.involvedPersons || [])]
                                  if (!newInvolvedPersons[index].penalty) {
                                    newInvolvedPersons[index].penalty = {}
                                  }
                                  newInvolvedPersons[index].penalty!.fine = Number(e.target.value)
                                  return { ...prev, involvedPersons: newInvolvedPersons }
                                })
                              }}
                              placeholder="0"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Fængsel</label>
                            <Input
                              value={involvedPerson.penalty?.prisonTime || ""}
                              onChange={(e) => {
                                setReport((prev) => {
                                  const newInvolvedPersons = [...(prev.involvedPersons || [])]
                                  if (!newInvolvedPersons[index].penalty) {
                                    newInvolvedPersons[index].penalty = {}
                                  }
                                  newInvolvedPersons[index].penalty!.prisonTime = e.target.value
                                  return { ...prev, involvedPersons: newInvolvedPersons }
                                })
                              }}
                              placeholder="f.eks. 30 dage"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Kørselsforbud</label>
                            <Input
                              value={involvedPerson.penalty?.drivingBan || ""}
                              onChange={(e) => {
                                setReport((prev) => {
                                  const newInvolvedPersons = [...(prev.involvedPersons || [])]
                                  if (!newInvolvedPersons[index].penalty) {
                                    newInvolvedPersons[index].penalty = {}
                                  }
                                  newInvolvedPersons[index].penalty!.drivingBan = e.target.value
                                  return { ...prev, involvedPersons: newInvolvedPersons }
                                })
                              }}
                              placeholder="f.eks. 6 måneder"
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Statement */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Forklaring</label>
                      <Textarea
                        value={involvedPerson.statement}
                        onChange={(e) => {
                          setReport((prev) => {
                            const newInvolvedPersons = [...(prev.involvedPersons || [])]
                            newInvolvedPersons[index].statement = e.target.value
                            return { ...prev, involvedPersons: newInvolvedPersons }
                          })
                        }}
                        placeholder="Personens forklaring af hændelsen..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Officers */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Deltagende Betjente</h3>
                <Button onClick={() => setShowOfficerSearch(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tilføj Betjent
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(report.officers || []).map((officer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-8 h-8 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm">{officer.name}</p>
                        <p className="text-xs text-gray-500">
                          {officer.rank} | {officer.badgeNumber}
                        </p>
                        <p className="text-xs text-gray-500">{officer.department}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReport((prev) => ({
                          ...prev,
                          officers: prev.officers?.filter((_, i) => i !== index),
                        }))
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "evidence" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Beviser</h3>
                <Button
                  onClick={() => {
                    const newEvidence = {
                      id: Date.now().toString(),
                      type: "Foto" as const,
                      description: "",
                    }
                    setReport((prev) => ({
                      ...prev,
                      evidence: [...(prev.evidence || []), newEvidence],
                    }))
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tilføj Bevis
                </Button>
              </div>

              <div className="space-y-4">
                {(report.evidence || []).map((evidence, index) => (
                  <div key={evidence.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={evidence.type}
                          onChange={(e) => {
                            setReport((prev) => {
                              const newEvidence = [...(prev.evidence || [])]
                              newEvidence[index].type = e.target.value as any
                              return { ...prev, evidence: newEvidence }
                            })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="Foto">Foto</option>
                          <option value="Video">Video</option>
                          <option value="Dokument">Dokument</option>
                          <option value="Fysisk bevis">Fysisk bevis</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivelse</label>
                        <Input
                          value={evidence.description}
                          onChange={(e) => {
                            setReport((prev) => {
                              const newEvidence = [...(prev.evidence || [])]
                              newEvidence[index].description = e.target.value
                              return { ...prev, evidence: newEvidence }
                            })
                          }}
                          placeholder="Beskrivelse af beviset"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Paperclip className="w-4 h-4 mr-1" />
                          Vedhæft fil
                        </Button>
                        {evidence.type === "Foto" && (
                          <Button variant="outline" size="sm">
                            <Camera className="w-4 h-4 mr-1" />
                            Tag foto
                          </Button>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReport((prev) => ({
                            ...prev,
                            evidence: prev.evidence?.filter((_, i) => i !== index),
                          }))
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Witnesses */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Vidner</h3>
                <Button
                  onClick={() => {
                    const newWitness = { name: "", phone: "", address: "", statement: "" }
                    setReport((prev) => ({
                      ...prev,
                      witnesses: [...(prev.witnesses || []), newWitness],
                    }))
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tilføj Vidne
                </Button>
              </div>

              <div className="space-y-4">
                {(report.witnesses || []).map((witness, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Navn</label>
                        <Input
                          value={witness.name}
                          onChange={(e) => {
                            setReport((prev) => {
                              const newWitnesses = [...(prev.witnesses || [])]
                              newWitnesses[index].name = e.target.value
                              return { ...prev, witnesses: newWitnesses }
                            })
                          }}
                          placeholder="Vidnets navn"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                        <Input
                          value={witness.phone}
                          onChange={(e) => {
                            setReport((prev) => {
                              const newWitnesses = [...(prev.witnesses || [])]
                              newWitnesses[index].phone = e.target.value
                              return { ...prev, witnesses: newWitnesses }
                            })
                          }}
                          placeholder="Telefonnummer"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                        <Input
                          value={witness.address}
                          onChange={(e) => {
                            setReport((prev) => {
                              const newWitnesses = [...(prev.witnesses || [])]
                              newWitnesses[index].address = e.target.value
                              return { ...prev, witnesses: newWitnesses }
                            })
                          }}
                          placeholder="Adresse"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vidneudsagn</label>
                      <Textarea
                        value={witness.statement}
                        onChange={(e) => {
                          setReport((prev) => {
                            const newWitnesses = [...(prev.witnesses || [])]
                            newWitnesses[index].statement = e.target.value
                            return { ...prev, witnesses: newWitnesses }
                          })
                        }}
                        placeholder="Hvad vidnet så og oplevede..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReport((prev) => ({
                            ...prev,
                            witnesses: prev.witnesses?.filter((_, i) => i !== index),
                          }))
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "report" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Detaljeret Rapport</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleContextMenu(e)}
                    onContextMenu={handleContextMenu}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Skabeloner
                  </Button>
                </div>
              </div>

              <Textarea
                ref={textareaRef}
                value={report.description || ""}
                onChange={(e) => setReport((prev) => ({ ...prev, description: e.target.value }))}
                onContextMenu={handleContextMenu}
                placeholder="Skriv den detaljerede rapport her... Højreklik for skabeloner."
                rows={20}
                className="font-mono text-sm"
              />

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Formatering hjælp:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Højreklik i tekst-området for at indsætte skabeloner</p>
                  <p>• Brug [DATO], [TID], [LOKATION] som pladsholdere</p>
                  <p>• Skabeloner tilpasser sig automatisk til hændelsestypen</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Noter</h3>
              <Textarea
                value={report.notes || ""}
                onChange={(e) => setReport((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Interne noter, opfølgning, etc..."
                rows={5}
              />
            </div>
          </div>
        )}

        {activeTab === "review" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Rapport Oversigt</h3>

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Rapportnummer:</span>
                    <span className="text-sm text-gray-900">{report.reportNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Dato & Tid:</span>
                    <span className="text-sm text-gray-900">
                      {report.date} kl. {report.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Lokation:</span>
                    <span className="text-sm text-gray-900">{report.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Prioritet:</span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        report.priority === "Kritisk"
                          ? "bg-red-100 text-red-800"
                          : report.priority === "Høj"
                            ? "bg-orange-100 text-orange-800"
                            : report.priority === "Normal"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {report.priority}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span className="text-sm text-gray-900">{report.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Rapporterende:</span>
                    <span className="text-sm text-gray-900">{report.reportingOfficer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Involverede:</span>
                    <span className="text-sm text-gray-900">{(report.involvedPersons || []).length} personer</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Total bøde:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {calculateTotalFine().toLocaleString()} kr.
                    </span>
                  </div>
                </div>
              </div>

              {/* Involved Persons Summary */}
              {(report.involvedPersons || []).length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Involverede Personer</h4>
                  <div className="space-y-2">
                    {(report.involvedPersons || []).map((person, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={person.person.mugshot || "/placeholder.svg"}
                            alt={person.person.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-medium text-sm">{person.person.fullName}</span>
                            <span className="text-xs text-gray-500 ml-2">({person.role})</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {person.acknowledges ? (
                            <CheckCircle className="w-4 h-4 text-green-500" title="Erkender" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" title="Erkender ikke" />
                          )}
                          {person.lawyer && <Scale className="w-4 h-4 text-blue-500" title="Har advokat" />}
                          <span className="text-sm font-medium">{person.violations.length} overtrædelser</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-3">Validering</h4>
                <div className="space-y-2">
                  {[
                    { check: report.title, label: "Titel udfyldt" },
                    { check: report.date && report.time, label: "Dato og tid angivet" },
                    { check: report.location, label: "Lokation angivet" },
                    { check: report.reportingOfficer, label: "Rapporterende betjent valgt" },
                    { check: (report.involvedPersons || []).length > 0, label: "Mindst én person involveret" },
                    { check: report.description && report.description.length > 50, label: "Detaljeret beskrivelse" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {item.check ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm ${item.check ? "text-gray-700" : "text-red-600"}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Modals */}
      {showPersonSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Vælg Person</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowPersonSearch(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Søg efter navn eller CPR..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-auto">
              <div className="space-y-2">
                {mockPersons
                  .filter(
                    (person) =>
                      person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      person.cprNumber.includes(searchTerm),
                  )
                  .map((person) => (
                    <button
                      key={person.id}
                      onClick={() => handleAddPerson(person)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg text-left"
                    >
                      <img
                        src={person.mugshot || "/placeholder.svg"}
                        alt={person.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{person.fullName}</p>
                        <p className="text-sm text-gray-500">CPR: {person.cprNumber}</p>
                        <p className="text-sm text-gray-500">{person.phone}</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showOfficerSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Vælg Betjent</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowOfficerSearch(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-auto">
              <div className="space-y-2">
                {mockOfficers.map((officer) => (
                  <button
                    key={officer.id}
                    onClick={() => handleAddOfficer(officer)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg text-left"
                  >
                    <Shield className="w-10 h-10 text-gray-500" />
                    <div>
                      <p className="font-medium">{officer.name}</p>
                      <p className="text-sm text-gray-500">
                        {officer.rank} | {officer.badgeNumber}
                      </p>
                      <p className="text-sm text-gray-500">{officer.department}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showViolationSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex">
            {/* Sidebar med kategorier */}
            <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Vælg Overtrædelse</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowViolationSearch(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Søg efter paragraf eller nøgleord..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Kategorier */}
              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-2">
                  {[
                    { name: "Alle", count: mockViolations.length },
                    ...Array.from(new Set(mockViolations.map((v) => v.category))).map((category) => ({
                      name: category,
                      count: mockViolations.filter((v) => v.category === category).length,
                    })),
                  ].map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name === "Alle" ? "" : category.name)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        (selectedCategory === "" && category.name === "Alle") || selectedCategory === category.name
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.count} paragraffer</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hovedindhold */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedCategory || "Alle kategorier"}</h4>
                    <p className="text-sm text-gray-500">{filteredViolations.length} paragraffer fundet</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Sortér efter:</span>
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option>Paragraf nummer</option>
                      <option>Sværhedsgrad</option>
                      <option>Bøde (lav til høj)</option>
                      <option>Bøde (høj til lav)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-3">
                  {filteredViolations.map((violation) => (
                    <button
                      key={violation.id}
                      onClick={() => handleAddViolation(violation)}
                      className="w-full p-4 hover:bg-gray-50 rounded-lg text-left border border-gray-200 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-lg text-blue-600">{violation.code}</span>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(violation.severity)}`}
                            >
                              {violation.severity}
                            </span>
                            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 border border-blue-200">
                              {violation.category}
                            </span>
                            {violation.subcategory && (
                              <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 border border-gray-200">
                                {violation.subcategory}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-900 mb-3 leading-relaxed">{violation.description}</p>

                      {/* Straf information */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="font-medium text-gray-700">💰 Bøde:</span>
                            <div className="text-gray-900 font-semibold">
                              {violation.minFine.toLocaleString()} - {violation.maxFine.toLocaleString()} kr.
                            </div>
                          </div>

                          {violation.prisonTime && (
                            <div>
                              <span className="font-medium text-gray-700">🔒 Fængsel:</span>
                              <div className="text-gray-900 font-semibold">{violation.prisonTime}</div>
                            </div>
                          )}

                          {violation.points > 0 && (
                            <div>
                              <span className="font-medium text-gray-700">📋 Klip:</span>
                              <div className="text-gray-900 font-semibold">
                                {violation.points} klip
                                {violation.points >= 3 && (
                                  <span className="text-red-600 ml-1">(Betinget frakendelse)</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Ekstra information for alvorlige forbrydelser */}
                        {violation.severity === "Grov" && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <div className="flex items-center text-xs text-red-600">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              <span className="font-medium">Grov forbrydelse - kan medføre ubetinget fængsel</span>
                            </div>
                          </div>
                        )}

                        {violation.category === "Færdselsloven" && violation.points >= 3 && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <div className="flex items-center text-xs text-orange-600">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              <span className="font-medium">
                                Kan medføre betinget eller ubetinget frakendelse af kørekortet
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Nøgleord for søgning */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {violation.keywords.slice(0, 4).map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                        {violation.keywords.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{violation.keywords.length - 4} flere
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLawyerSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Vælg Advokat</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowLawyerSearch(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-auto">
              <div className="space-y-2">
                {mockLawyers.map((lawyer) => (
                  <button
                    key={lawyer.id}
                    onClick={() => handleAddLawyer(lawyer)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg text-left"
                  >
                    <Scale className="w-10 h-10 text-gray-500" />
                    <div>
                      <p className="font-medium">{lawyer.name}</p>
                      <p className="text-sm text-gray-500">{lawyer.firm}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {lawyer.phone}
                        </span>
                        <span className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {lawyer.email}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Specialer: {lawyer.specialization.join(", ")}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Context Menu */}
      {showTemplateMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[9999] min-w-[200px]"
          style={{ left: templateMenuPosition.x, top: templateMenuPosition.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">Indsæt Skabelon</div>
          {Object.entries(reportTemplates).map(([key, template]) => (
            <button
              key={key}
              onClick={() => handleTemplateInsert(key)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
            >
              {key === "trafik" && "🚗 Trafik Rapport"}
              {key === "vold" && "⚡ Volds Rapport"}
              {key === "tyveri" && "🔒 Tyveri Rapport"}
              {key === "standard" && "📋 Standard Rapport"}
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close template menu */}
      {showTemplateMenu && <div className="fixed inset-0 z-[9998]" onClick={() => setShowTemplateMenu(false)} />}
    </div>
  )
}
