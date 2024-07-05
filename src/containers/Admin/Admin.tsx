import React, { useState, useEffect, useCallback } from 'react';
import axiosApi from '../../axiosApi';
import { useNavigate } from 'react-router-dom';

interface PageData {
    title: string;
    content: string;
}

const Admin: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState<string>('about');
    const [pageData, setPageData] = useState<PageData>({ title: '', content: '' });
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const fetchPageData = useCallback(async (pageName: string) => {
        setLoading(true);
        try {
            const response = await axiosApi.get<PageData>(`/pages/${pageName}.json`);
            setPageData(response.data || { title: '', content: '' });
        } catch (error) {
            console.error('Failed to fetch page data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPage = event.target.value;
        setSelectedPage(newPage);
        fetchPageData(newPage);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setPageData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await axiosApi.put(`/pages/${selectedPage}.json`, pageData);
            alert('Page saved successfully!');
            navigate(`/pages/${selectedPage}`);
        } catch (error) {
            console.error('Failed to save page data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPageData(selectedPage);
    }, [selectedPage, fetchPageData]);

    return (
        <div>
            <h1>Edit pages</h1>
            <select className="form-control" value={selectedPage} onChange={handlePageChange}>
                <option value="about">About</option>
                <option value="contacts">Contacts</option>
                <option value="divisions">Divisions</option>
            </select>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={pageData.title}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Content</label>
                        <textarea
                            className="form-control"
                            name="content"
                            value={pageData.content}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <button className="btn btn-primary" onClick={handleSave}>Save</button>
                </>
            )}
        </div>
    );
};

export default Admin;
