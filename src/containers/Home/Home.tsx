import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosApi from '../../axiosApi';
import { PageData } from '../../types';

const Home: React.FC = () => {
    const { pageName } = useParams<{ pageName: string }>();
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPageData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosApi.get<PageData>(`/pages/${pageName}.json`);
                setPageData(response.data);
            } catch (error) {
                setError('Failed to fetch page data');
                console.error('Failed to fetch page data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, [pageName]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
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
