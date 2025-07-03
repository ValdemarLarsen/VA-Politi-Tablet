import { useEffect } from "react";
import PersonregisterTable from "./PersonregisterTable";
import { fetchNui } from "@/utils/fetchNui";

// Zustand store
import { usePersonRegisterStore } from "@/store/personRegisterStore";

interface PersonregisterData {
    identifier: string;
    firstname: string;
    lastname: string;
    avatar_url: string;
}

export default function PersonRegisterSide() {
    const { data, setData, setLoading, loading } = usePersonRegisterStore();

    useEffect(() => {
        console.log('useEffect triggered. data.length =', data.length)
        if (data.length > 0) {
            console.log("Springer fetch over – data findes allerede")
            return
        }

        console.log("Personregister loader")
        setLoading(true)

        fetchNui<PersonregisterData[]>("va-tablet:hentClientPersonRegister")
            .then((retData) => {
                console.log("Got return data from client scripts:")
                console.dir(retData) // brug dette fremfor console.log(JSON.stringify(...))
                setData(retData)
                setLoading(false)
            })
            .catch((e) => {
                console.error("Setting mock data due to error", e)
                setLoading(false)
            })
    }, [data, setData, setLoading])


    return (
        <>
            {loading ? <div>Loading...</div> : <PersonregisterTable personer={data} />}
        </>
    );
}
