import { create } from 'zustand'

interface PersonregisterData {
    identifier: string
    firstname: string
    lastname: string
    avatar_url: string
}

interface PersonRegisterStore {
    data: PersonregisterData[]
    lastUpdated: string | null
    rowCount: number
    loading: boolean

    setData: (newData: PersonregisterData[]) => void
    setLoading: (loading: boolean) => void
}

export const usePersonRegisterStore = create<PersonRegisterStore>((set) => ({
    data: [],
    lastUpdated: null,
    rowCount: 0,
    loading: false,

    setData: (newData) =>
        set({
            data: newData,
            lastUpdated: new Date().toISOString(),
            rowCount: newData.length,
        }),

    setLoading: (loading) => set({ loading }),
}))
