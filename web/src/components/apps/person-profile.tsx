"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Edit,
  Save,
  Camera,
  AlertTriangle,
  Shield,
  Clock,
  FileText,
  Plus,
  MessageSquare,
  User,
  Phone,
} from "lucide-react"

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

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

interface PersonProfileProps {
  person: Person
  onUpdate?: (person: Person) => void
}

export default function PersonProfile({ person, onUpdate }: PersonProfileProps) {
  const [editMode, setEditMode] = useState(false)
  const [editedPerson, setEditedPerson] = useState<Person | null>(null)
  const [newComment, setNewComment] = useState("")
  const [newCommentType, setNewCommentType] = useState<"Info" | "Advarsel" | "Kontakt" | "Observation">("Info")
  const [activeTab, setActiveTab] = useState<"overview" | "cases" | "history" | "comments">("overview")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ren":
        return "text-green-700 bg-green-50 border-green-200"
      case "Mistænkt":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "Eftersøgt":
        return "text-red-700 bg-red-50 border-red-200"
      case "Fængslet":
        return "text-gray-700 bg-gray-50 border-gray-200"
      case "Advarsler":
        return "text-orange-700 bg-orange-50 border-orange-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Lav":
        return "text-green-700 bg-green-50 border-green-200"
      case "Mellem":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "Høj":
        return "text-orange-700 bg-orange-50 border-orange-200"
      case "Kritisk":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const handleEdit = () => {
    setEditedPerson({ ...person })
    setEditMode(true)
  }

  const handleSave = () => {
    if (editedPerson && onUpdate) {
      onUpdate(editedPerson)
      setEditMode(false)
    }
  }

  const handleCancel = () => {
    setEditedPerson(null)
    setEditMode(false)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("da-DK"),
        officer: "Betjent Aktuel",
        content: newComment,
        type: newCommentType,
      }

      const updatedPerson = {
        ...person,
        comments: [comment, ...person.comments],
      }

      if (onUpdate) {
        onUpdate(updatedPerson)
      }
      setNewComment("")
    }
  }

  const handleMugshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && editedPerson) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditedPerson({
          ...editedPerson,
          mugshot: e.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const currentPerson = editMode ? editedPerson || person : person

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={currentPerson.mugshot || "/placeholder.svg"}
                alt={`${currentPerson.fullName} mugshot`}
                className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src =
                    "/placeholder.svg?height=80&width=80&text=" +
                    currentPerson.firstName.charAt(0) +
                    currentPerson.lastName.charAt(0)
                }}
              />
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-gray-600 hover:bg-gray-700 rounded-full p-1.5 cursor-pointer">
                  <Camera className="w-3 h-3 text-white" />
                  <input type="file" accept="image/*" onChange={handleMugshotUpload} className="hidden" />
                </label>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentPerson.fullName}</h1>
              <p className="text-gray-600">{currentPerson.occupation}</p>
              <div className="flex items-center space-x-3 mt-2">
                <span
                  className={`px-3 py-1 rounded-md text-sm font-medium border ${getStatusColor(currentPerson.status)}`}
                >
                  {currentPerson.status === "Eftersøgt" && <AlertTriangle className="w-3 h-3 mr-1 inline" />}
                  {currentPerson.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-md text-sm font-medium border ${getRiskColor(currentPerson.riskLevel)}`}
                >
                  Risiko: {currentPerson.riskLevel}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!editMode ? (
              <Button onClick={handleEdit} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Rediger
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} className="bg-gray-900 hover:bg-gray-800">
                  <Save className="w-4 h-4 mr-2" />
                  Gem
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  Annuller
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: "overview", label: "Oversigt", icon: User },
            { id: "cases", label: "Sager", icon: FileText },
            { id: "history", label: "Historie", icon: Clock },
            { id: "comments", label: "Kommentarer", icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personlige Oplysninger
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fornavn</label>
                    {editMode ? (
                      <Input
                        value={editedPerson?.firstName || ""}
                        onChange={(e) =>
                          setEditedPerson((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  firstName: e.target.value,
                                  fullName: `${e.target.value} ${prev.lastName}`,
                                }
                              : null,
                          )
                        }
                      />
                    ) : (
                      <p className="text-gray-900">{currentPerson.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Efternavn</label>
                    {editMode ? (
                      <Input
                        value={editedPerson?.lastName || ""}
                        onChange={(e) =>
                          setEditedPerson((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  lastName: e.target.value,
                                  fullName: `${prev.firstName} ${e.target.value}`,
                                }
                              : null,
                          )
                        }
                      />
                    ) : (
                      <p className="text-gray-900">{currentPerson.lastName}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPR-nummer</label>
                  {editMode ? (
                    <Input
                      value={editedPerson?.cprNumber || ""}
                      onChange={(e) =>
                        setEditedPerson((prev) => (prev ? { ...prev, cprNumber: e.target.value } : null))
                      }
                    />
                  ) : (
                    <p className="text-gray-900 font-mono">{currentPerson.cprNumber}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Køn</label>
                    {editMode ? (
                      <select
                        value={editedPerson?.gender || ""}
                        onChange={(e) =>
                          setEditedPerson((prev) => (prev ? { ...prev, gender: e.target.value as any } : null))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Mand">Mand</option>
                        <option value="Kvinde">Kvinde</option>
                        <option value="Andet">Andet</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{currentPerson.gender}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fødselsdato</label>
                    {editMode ? (
                      <Input
                        type="date"
                        value={editedPerson?.birthDate || ""}
                        onChange={(e) =>
                          setEditedPerson((prev) => (prev ? { ...prev, birthDate: e.target.value } : null))
                        }
                      />
                    ) : (
                      <p className="text-gray-900">{new Date(currentPerson.birthDate).toLocaleDateString("da-DK")}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Kontaktoplysninger
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  {editMode ? (
                    <Input
                      value={editedPerson?.phone || ""}
                      onChange={(e) => setEditedPerson((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                    />
                  ) : (
                    <p className="text-gray-900">{currentPerson.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {editMode ? (
                    <Input
                      value={editedPerson?.email || ""}
                      onChange={(e) => setEditedPerson((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                    />
                  ) : (
                    <p className="text-gray-900">{currentPerson.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  {editMode ? (
                    <Textarea
                      value={editedPerson?.address || ""}
                      onChange={(e) => setEditedPerson((prev) => (prev ? { ...prev, address: e.target.value } : null))}
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-900">{currentPerson.address}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Erhverv</label>
                  {editMode ? (
                    <Input
                      value={editedPerson?.occupation || ""}
                      onChange={(e) =>
                        setEditedPerson((prev) => (prev ? { ...prev, occupation: e.target.value } : null))
                      }
                    />
                  ) : (
                    <p className="text-gray-900">{currentPerson.occupation}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Police Status */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Politi Status
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  {editMode ? (
                    <select
                      value={editedPerson?.status || ""}
                      onChange={(e) =>
                        setEditedPerson((prev) => (prev ? { ...prev, status: e.target.value as any } : null))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Ren">Ren</option>
                      <option value="Mistænkt">Mistænkt</option>
                      <option value="Eftersøgt">Eftersøgt</option>
                      <option value="Fængslet">Fængslet</option>
                      <option value="Advarsler">Advarsler</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${getStatusColor(currentPerson.status)}`}
                    >
                      {currentPerson.status}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Risikoniveau</label>
                  {editMode ? (
                    <select
                      value={editedPerson?.riskLevel || ""}
                      onChange={(e) =>
                        setEditedPerson((prev) => (prev ? { ...prev, riskLevel: e.target.value as any } : null))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Lav">Lav</option>
                      <option value="Mellem">Mellem</option>
                      <option value="Høj">Høj</option>
                      <option value="Kritisk">Kritisk</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${getRiskColor(currentPerson.riskLevel)}`}
                    >
                      {currentPerson.riskLevel}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sidste kontakt</label>
                  <p className="text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(currentPerson.lastContact).toLocaleDateString("da-DK")}
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Statistics */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-6 text-gray-900">Detaljeret Statistik</h3>

                {/* Quick Numbers */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{currentPerson.cases.length}</div>
                    <div className="text-sm text-gray-600">Sager</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{currentPerson.comments.length}</div>
                    <div className="text-sm text-gray-600">Kommentarer</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{currentPerson.warrants.length}</div>
                    <div className="text-sm text-gray-600">Kendelser</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{currentPerson.knownAssociates.length}</div>
                    <div className="text-sm text-gray-600">Forbindelser</div>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Case Types Chart */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-md font-semibold mb-4 text-gray-800">Sager efter Type</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={(() => {
                          const caseTypes = currentPerson.cases.reduce(
                            (acc, case_) => {
                              acc[case_.type] = (acc[case_.type] || 0) + 1
                              return acc
                            },
                            {} as Record<string, number>,
                          )

                          return Object.entries(caseTypes).map(([type, count]) => ({
                            type,
                            count,
                            fill:
                              type === "Trafik"
                                ? "#3b82f6"
                                : type === "Tyveri"
                                  ? "#ef4444"
                                  : type === "Vold"
                                    ? "#dc2626"
                                    : type === "Bedrageri"
                                      ? "#f59e0b"
                                      : type === "Narkotika"
                                        ? "#8b5cf6"
                                        : "#6b7280",
                          }))
                        })()}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                          }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Case Status Pie Chart */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-md font-semibold mb-4 text-gray-800">Sager efter Status</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={(() => {
                            const statusCounts = currentPerson.cases.reduce(
                              (acc, case_) => {
                                acc[case_.status] = (acc[case_.status] || 0) + 1
                                return acc
                              },
                              {} as Record<string, number>,
                            )

                            const colors = {
                              Lukket: "#10b981",
                              Åben: "#ef4444",
                              "Under efterforskning": "#f59e0b",
                              Afsluttet: "#6b7280",
                            }

                            return Object.entries(statusCounts).map(([status, count]) => ({
                              name: status,
                              value: count,
                              fill: colors[status as keyof typeof colors] || "#6b7280",
                            }))
                          })()}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        ></Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Activity Timeline */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-md font-semibold mb-4 text-gray-800">Aktivitet over Tid</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart
                        data={(() => {
                          // Generer månedlig aktivitet baseret på sager og kommentarer
                          const months = [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "Maj",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Okt",
                            "Nov",
                            "Dec",
                          ]
                          const currentYear = new Date().getFullYear()

                          return months.map((month, index) => {
                            const monthCases = currentPerson.cases.filter((case_) => {
                              const caseDate = new Date(case_.date)
                              return caseDate.getMonth() === index && caseDate.getFullYear() === currentYear
                            }).length

                            const monthComments = currentPerson.comments.filter((comment) => {
                              const commentDate = new Date(comment.date.split("/").reverse().join("-"))
                              return commentDate.getMonth() === index && commentDate.getFullYear() === currentYear
                            }).length

                            return {
                              month,
                              sager: monthCases,
                              kommentarer: monthComments,
                              total: monthCases + monthComments,
                            }
                          })
                        })()}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="total"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Risk Assessment */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-md font-semibold mb-4 text-gray-800">Risiko Vurdering</h4>
                    <div className="space-y-4">
                      {/* Risk Level Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Nuværende Risiko</span>
                          <span className="font-medium">{currentPerson.riskLevel}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${
                              currentPerson.riskLevel === "Lav"
                                ? "bg-green-500 w-1/4"
                                : currentPerson.riskLevel === "Mellem"
                                  ? "bg-yellow-500 w-2/4"
                                  : currentPerson.riskLevel === "Høj"
                                    ? "bg-orange-500 w-3/4"
                                    : "bg-red-500 w-full"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Risk Factors */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Kriminel Historie</span>
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-2 ${
                                currentPerson.criminalHistory.length === 0
                                  ? "bg-green-500"
                                  : currentPerson.criminalHistory.length <= 2
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            />
                            <span className="text-sm font-medium">{currentPerson.criminalHistory.length} sager</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Aktive Kendelser</span>
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-2 ${
                                currentPerson.warrants.filter((w) => w.status === "Aktiv").length === 0
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <span className="text-sm font-medium">
                              {currentPerson.warrants.filter((w) => w.status === "Aktiv").length} aktive
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Seneste Kontakt</span>
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-2 ${
                                new Date(currentPerson.lastContact) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              }`}
                            />
                            <span className="text-sm font-medium">
                              {Math.floor(
                                (Date.now() - new Date(currentPerson.lastContact).getTime()) / (1000 * 60 * 60 * 24),
                              )}{" "}
                              dage siden
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "cases" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Sager & Hændelser</h3>
              <span className="text-sm text-gray-500">{currentPerson.cases.length} sager i alt</span>
            </div>

            {currentPerson.cases.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sagsnummer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Titel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Betjent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPerson.cases.map((case_) => (
                      <tr key={case_.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {case_.caseNumber}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{case_.title}</div>
                          <div className="text-sm text-gray-500">{case_.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800 border border-gray-200">
                            {case_.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border ${
                              case_.status === "Lukket"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : case_.status === "Åben"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : case_.status === "Under efterforskning"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                          >
                            {case_.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(case_.date).toLocaleDateString("da-DK")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{case_.officer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen sager</h3>
                <p className="text-gray-500">Denne person har ingen registrerede sager</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Kriminel Historie</h3>
            {currentPerson.criminalHistory.length > 0 ? (
              <div className="space-y-4">
                {currentPerson.criminalHistory.map((record) => (
                  <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{record.offense}</h4>
                      <span className="text-sm text-gray-500">{record.date}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{record.description}</p>
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-3 py-1 rounded-md text-sm font-medium border ${
                          record.status === "Dømt"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : record.status === "Frifundet"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {record.status}
                      </span>
                      <span className="text-sm text-gray-500">Behandlet af: {record.officer}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen kriminel historie</h3>
                <p className="text-gray-500">Denne person har en ren straffeattest</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "comments" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Kommentarer & Noter</h3>
            </div>

            {/* Add New Comment */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h4 className="font-semibold mb-3 text-gray-900">Tilføj Kommentar</h4>
              <div className="space-y-3">
                <select
                  value={newCommentType}
                  onChange={(e) => setNewCommentType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Info">Info</option>
                  <option value="Advarsel">Advarsel</option>
                  <option value="Kontakt">Kontakt</option>
                  <option value="Observation">Observation</option>
                </select>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Skriv kommentar..."
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="bg-gray-900 hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tilføj Kommentar
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {currentPerson.comments.map((comment) => (
                <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={`px-3 py-1 rounded-md text-sm font-medium border ${
                        comment.type === "Advarsel"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : comment.type === "Kontakt"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : comment.type === "Observation"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {comment.type}
                    </span>
                    <span className="text-sm text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-gray-900 mb-3">{comment.content}</p>
                  <p className="text-sm text-gray-500">Af: {comment.officer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
