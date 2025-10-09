import { useEffect, useState } from "react";

export function useFetchPost(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    async function postData(JSONData) {
        const token = sessionStorage.getItem("token");            
        const headers = {
            "Content-Type": "application/json",
        }

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        try {
            setLoading(true);
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(JSONData),
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

    return { data, loading, error, postData};
}