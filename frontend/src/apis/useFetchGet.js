import { useEffect, useState } from "react";

export function useFetchGet(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    async function fetchData() {
        const token = localStorage.getItem("token");            
        const headers = {
            "Content-Type": "application/json",
        }

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        try {
            setLoading(true);
            const response = await fetch(url, {
                headers: headers,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data.");
            }

            const result = await response.json();
            if (result) {
                setData(result);
            }                
        } catch (err) {
            setLoading(false);
            setError(err.message)
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchData()
    }, [url]);

    return { data, loading, error, fetchData};
}