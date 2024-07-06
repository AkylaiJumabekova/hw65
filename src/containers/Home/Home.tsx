import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axiosApi from '../../axiosApi';
import { PageData } from '../../types';

const Home: React.FC = () => {
    const { pageName } = useParams<{ pageName: string }>();
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchPageData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosApi.get<PageData>(`/pages/${pageName}.json`);
            if (response.data) {
                setPageData(response.data);
            } else {
                setPageData(null);
            }
        } catch (error) {
            console.error('Failed to fetch page data:', error);
            setPageData(null);
        } finally {
            setLoading(false);
        }
    }, [pageName]);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!pageData) {
        return <p>Page not found</p>;
    }

    return (
        <div>
            <h1>{pageData.title}</h1>
            <p>{pageData.content}</p>
        </div>
    );
};

export default Home;
