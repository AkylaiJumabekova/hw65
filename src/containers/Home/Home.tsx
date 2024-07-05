import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosApi from '../../axiosApi';

interface PageData {
    title: string;
    content: string;
}

const Home: React.FC = () => {
    const { pageName } = useParams<{ pageName: string }>();
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const response = await axiosApi.get<PageData>(`/pages/${pageName}.json`);
                setPageData(response.data);
            } catch (error) {
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
