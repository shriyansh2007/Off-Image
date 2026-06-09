import { useState, useEffect } from 'react';
import {toast} from 'sonner';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export const useConvexQuery = (query, ...args) => {
    const result = useQuery(query,...args);
    const [data, setData] = useState(undefined);
    const [isLoading, setisLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (result === undefined) {
            setisLoading(true);
        }
        else {
            try {
                setData(result);
                setError(null);
            }
            catch (err) {
                setError(err);
                toast.error(err.message)
            } finally {
                setisLoading(false)
            }
        }
    }, [result])
    return { data, isLoading, error };
}
export const useConvexMutation = (mutation, ...args) => {
    const response = useMutation(mutation, ...args);
    const [data, setData] = useState(undefined);
    const [isLoading, setisLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (response === undefined) {
            setisLoading(true);
        }
        else {
            try {
                setData(response);
                setError(null);
            }
            catch (err) {
                setError(err);
                toast.error(err.message)
            } finally {
                setisLoading(false)
            }
        }
    }, [response])
    return { data, isLoading, error };
}