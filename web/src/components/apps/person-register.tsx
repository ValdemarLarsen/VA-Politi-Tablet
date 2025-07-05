"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Users, Phone, ChevronUp, ChevronDown, Eye, AlertTriangle, Shield } from "lucide-react"
import { useWindows } from "@/contexts/window-context"
import PersonProfile from "./person-profile"
import { useSettings } from "@/contexts/settings-context"

interface Person {
  id: string
  firstName: string
  lastName: string
  fullName: string
  gender: "Mand" | "Kvinde" | "Andet"
  phone: string
  email: string
  address: string
  birthDate: string
  mugshot: string
  occupation: string
  notes: string
  cprNumber: string
  status: "Ren" | "Mistænkt" | "Eftersøgt" | "Fængslet" | "Advarsler"
  riskLevel: "Lav" | "Mellem" | "Høj" | "Kritisk"
  lastContact: string
  criminalHistory: CriminalRecord[]
  comments: Comment[]
  aliases: string[]
  knownAssociates: string[]
  warrants: Warrant[]
  cases: Case[]
}

interface Case {
  id: string
  caseNumber: string
  title: string
  type: "Trafik" | "Tyveri" | "Vold" | "Bedrageri" | "Narkotika" | "Andet"
  status: "Åben" | "Lukket" | "Under efterforskning" | "Afsluttet"
  date: string
  officer: string
  description: string
  outcome?: string
}

interface CriminalRecord {
  id: string
  date: string
  offense: string
  description: string
  status: "Anklaget" | "Dømt" | "Frifundet" | "Under efterforskning"
  officer: string
}

interface Comment {
  id: string
  date: string
  officer: string
  content: string
  type: "Info" | "Advarsel" | "Kontakt" | "Observation"
}

interface Warrant {
  id: string
  type: string
  description: string
  issueDate: string
  status: "Aktiv" | "Udført" | "Annulleret"
}

const mockPersons: Person[] = [
  {
    id: "1",
    firstName: "Lars",
    lastName: "Nielsen",
    fullName: "Lars Nielsen",
    gender: "Mand",
    phone: "+45 20 12 34 56",
    email: "lars.nielsen@email.dk",
    address: "Hovedgade 123, 2100 København Ø",
    birthDate: "1985-03-15",
    mugshot: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    occupation: "Ingeniør",
    notes: "Registreret 2024",
    cprNumber: "150385-1234",
    status: "Ren",
    riskLevel: "Lav",
    lastContact: "2024-01-15",
    criminalHistory: [],
    comments: [
      {
        id: "1",
        date: "2024-01-15",
        officer: "Betjent Hansen",
        content: "Rutinemæssig kontrol. Samarbejdsvillig.",
        type: "Kontakt",
      },
    ],
    aliases: [],
    knownAssociates: ["Maria Hansen"],
    warrants: [],
    cases: [
      {
        id: "1",
        caseNumber: "2024-001234",
        title: "Fartbøde - Hovedgade",
        type: "Trafik",
        status: "Lukket",
        date: "2024-01-15",
        officer: "Betjent Hansen",
        description: "Kørte 65 km/t i 50 zone på Hovedgade",
        outcome: "Bøde på 1.500 kr.",
      },
    ],
  },
  {
    id: "2",
    firstName: "Maria",
    lastName: "Hansen",
    fullName: "Maria Hansen",
    gender: "Kvinde",
    phone: "+45 30 98 76 54",
    email: "maria.hansen@email.dk",
    address: "Nørregade 45, 8000 Aarhus C",
    birthDate: "1992-07-22",
    mugshot: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    occupation: "Lærer",
    notes: "Kontaktet flere gange",
    cprNumber: "220792-5678",
    status: "Mistænkt",
    riskLevel: "Mellem",
    lastContact: "2024-02-10",
    criminalHistory: [
      {
        id: "1",
        date: "2023-08-15",
        offense: "Fartbøde",
        description: "Kørte 65 km/t i 50 zone",
        status: "Dømt",
        officer: "Betjent Larsen",
      },
    ],
    comments: [
      {
        id: "1",
        date: "2024-02-10",
        officer: "Betjent Andersen",
        content: "Mistænkt for butikstyveri. Undersøges.",
        type: "Advarsel",
      },
    ],
    aliases: ["Marie"],
    knownAssociates: ["Lars Nielsen", "Peter Andersen"],
    warrants: [],
    cases: [
      {
        id: "1",
        caseNumber: "2023-005678",
        title: "Fartovertrædelse - Ringvejen",
        type: "Trafik",
        status: "Lukket",
        date: "2023-08-15",
        officer: "Betjent Larsen",
        description: "Hastighedsovertrædelse på Ringvejen",
        outcome: "Bøde betalt",
      },
      {
        id: "2",
        caseNumber: "2024-001122",
        title: "Mistænkt butikstyveri",
        type: "Tyveri",
        status: "Under efterforskning",
        date: "2024-02-10",
        officer: "Betjent Andersen",
        description: "Mistænkt for tyveri i Netto, Nørregade",
      },
    ],
  },
  {
    id: "3",
    firstName: "Peter",
    lastName: "Andersen",
    fullName: "Peter Andersen",
    gender: "Mand",
    phone: "+45 40 11 22 33",
    email: "peter.andersen@email.dk",
    address: "Vestergade 78, 5000 Odense C",
    birthDate: "1978-11-08",
    mugshot: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    occupation: "Advokat",
    notes: "VIP status",
    cprNumber: "081178-9012",
    status: "Eftersøgt",
    riskLevel: "Høj",
    lastContact: "2024-01-20",
    criminalHistory: [
      {
        id: "1",
        date: "2023-12-01",
        offense: "Bedrageri",
        description: "Mistænkt for økonomisk bedrageri",
        status: "Under efterforskning",
        officer: "Kriminalassistent Nielsen",
      },
    ],
    comments: [
      {
        id: "1",
        date: "2024-01-20",
        officer: "Kriminalassistent Nielsen",
        content: "EFTERSØGT - Udeblev fra retsmøde. Kan være farlig.",
        type: "Advarsel",
      },
    ],
    aliases: ["Pete", "P. Andersen"],
    knownAssociates: ["Maria Hansen"],
    warrants: [
      {
        id: "1",
        type: "Anholdelseskendelse",
        description: "Bedrageri - udeblev fra retsmøde",
        issueDate: "2024-01-18",
        status: "Aktiv",
      },
    ],
    cases: [
      {
        id: "1",
        caseNumber: "2023-009876",
        title: "Økonomisk bedrageri",
        type: "Bedrageri",
        status: "Under efterforskning",
        date: "2023-12-01",
        officer: "Kriminalassistent Nielsen",
        description: "Mistænkt for bedrageri mod ældre borgere",
      },
      {
        id: "2",
        caseNumber: "2024-000987",
        title: "Udeblev fra retsmøde",
        type: "Andet",
        status: "Åben",
        date: "2024-01-18",
        officer: "Kriminalassistent Nielsen",
        description: "Udeblev fra planlagt retsmøde",
      },
    ],
  },
]

type SortField = keyof Person
type SortDirection = "asc" | "desc"

export default function PersonRegister() {
  const { darkMode } = useSettings()
  const [searchTerm, setSearchTerm] = useState("")
  const [genderFilter, setGenderFilter] = useState<string>("alle")
  const [statusFilter, setStatusFilter] = useState<string>("alle")
  const [sortField, setSortField] = useState<SortField>("fullName")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [persons, setPersons] = useState<Person[]>(mockPersons)
  const itemsPerPage = 5

  const { openWindow } = useWindows()

  const filteredAndSortedPersons = useMemo(() => {
    const filtered = persons.filter((person) => {
      const matchesSearch =
        person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.phone.includes(searchTerm) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.cprNumber.includes(searchTerm)

      const matchesGender = genderFilter === "alle" || person.gender === genderFilter
      const matchesStatus = statusFilter === "alle" || person.status === statusFilter

      return matchesSearch && matchesGender && matchesStatus
    })

    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue, "da")
        return sortDirection === "asc" ? comparison : -comparison
      }

      return 0
    })

    return filtered
  }, [searchTerm, genderFilter, statusFilter, sortField, sortDirection, persons])

  const totalPages = Math.ceil(filteredAndSortedPersons.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentPersons = filteredAndSortedPersons.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ren":
        return "bg-green-100 text-green-800"
      case "Mistænkt":
        return "bg-yellow-100 text-yellow-800"
      case "Eftersøgt":
        return "bg-red-100 text-red-800"
      case "Fængslet":
        return "bg-gray-100 text-gray-800"
      case "Advarsler":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Lav":
        return "bg-green-100 text-green-800"
      case "Mellem":
        return "bg-yellow-100 text-yellow-800"
      case "Høj":
        return "bg-orange-100 text-orange-800"
      case "Kritisk":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleOpenProfile = (person: Person) => {
    openWindow({
      title: `Profil - ${person.fullName}`,
      component: (
        <PersonProfile
          person={person}
          onUpdate={(updatedPerson) => {
            setPersons((prev) => prev.map((p) => (p.id === updatedPerson.id ? updatedPerson : p)))
          }}
        />
      ),
      position: { x: 100, y: 50 },
      size: { width: 1200, height: 800 },
    })
  }

  return (
    <div className={`h-full flex flex-col ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      {/* Header */}
      <div className={`border-b p-4 ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className={`w-6 h-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`} />
            <h1 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Politi Personregister
            </h1>
          </div>
          <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {filteredAndSortedPersons.length} personer fundet
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Søg efter navn, CPR, telefon, email, adresse..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="alle">Alle køn</option>
              <option value="Mand">Mænd</option>
              <option value="Kvinde">Kvinder</option>
              <option value="Andet">Andet</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="alle">Alle status</option>
              <option value="Ren">Ren</option>
              <option value="Mistænkt">Mistænkt</option>
              <option value="Eftersøgt">Eftersøgt</option>
              <option value="Fængslet">Fængslet</option>
              <option value="Advarsler">Advarsler</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className={`sticky top-0 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            <tr>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-gray-500 uppercase">Foto</span>
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("fullName")}
              >
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-gray-500 uppercase">Fulde Navn</span>
                  {getSortIcon("fullName")}
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 uppercase">CPR</span>
              </th>
              <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort("phone")}>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-gray-500 uppercase">Telefon</span>
                  {getSortIcon("phone")}
                </div>
              </th>
              <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort("status")}>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-gray-500 uppercase">Status</span>
                  {getSortIcon("status")}
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 uppercase">Risiko</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 uppercase">Handlinger</span>
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
            {currentPersons.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={person.mugshot || "/placeholder.svg"}
                    alt={`${person.fullName} mugshot`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src =
                        "/placeholder.svg?height=48&width=48&text=" +
                        person.firstName.charAt(0) +
                        person.lastName.charAt(0)
                    }}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{person.fullName}</div>
                  <div className="text-sm text-gray-500">{person.occupation}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-mono text-gray-900">{person.cprNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{person.phone}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(person.status)}`}
                  >
                    {person.status === "Eftersøgt" && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {person.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(person.riskLevel)}`}
                  >
                    {person.riskLevel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenProfile(person)}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Vis profil
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentPersons.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen personer fundet</h3>
            <p className="text-gray-500">Prøv at justere dine søgekriterier</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Viser {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedPersons.length)} af{" "}
            {filteredAndSortedPersons.length} personer
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Forrige
            </Button>
            <span className="text-sm text-gray-700">
              Side {currentPage} af {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Næste
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
