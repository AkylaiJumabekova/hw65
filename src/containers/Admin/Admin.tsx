import React, { useState, useEffect } from 'react';
import axiosApi from '../../axiosApi';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { PageData } from '../../types';

const Admin: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState<string>('about');
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const navigate = useNavigate();

    const fetchPageData = async (pageName: string) => {
        setLoading(true);
        try {
            const response = await axiosApi.get<PageData>(`/pages/${pageName}.json`);
            setPageData(response.data);
        } catch (error) {
            console.error('Failed to fetch page data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPage = event.target.value;
        setSelectedPage(newPage);
        fetchPageData(newPage);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setPageData(prevState => prevState ? { ...prevState, [name]: value } : null);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (pageData) {
                await axiosApi.put(`/pages/${selectedPage}.json`, pageData);
                alert('Page saved successfully!');
                navigate(`/pages/${selectedPage}`);
            }
        } catch (error) {
            console.error('Failed to save page data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNewPage = async () => {
        const newPageName = prompt('Enter the name of the new page:');
        if (!newPageName) return;

        setLoading(true);
        try {
            await axiosApi.put(`/pages/${newPageName}.json`, { title: 'New Page', content: 'New Content' });
            alert('New page created successfully!');
            setSelectedPage(newPageName);
            fetchPageData(newPageName);
        } catch (error) {
            console.error('Failed to create new page:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePage = async () => {
        setLoading(true);
        try {
            await axiosApi.delete(`/pages/${selectedPage}.json`);
            alert('Page deleted successfully!');
            setSelectedPage('about');
            fetchPageData('about');
        } catch (error) {
            console.error('Failed to delete page:', error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDeletePage = () => {
        setShowConfirm(true);
    };

    const onConfirmDelete = async () => {
        setShowConfirm(false);
        await handleDeletePage();
    };

    useEffect(() => {
        fetchPageData(selectedPage);
    }, [selectedPage]);

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
                            value={pageData ? pageData.title : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Content</label>
                        <textarea
                            className="form-control"
                            name="content"
                            value={pageData ? pageData.content : ''}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <button className="btn btn-primary" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary" onClick={handleCreateNewPage}>Create New Page</button>
                    <button className="btn btn-danger" onClick={confirmDeletePage}>Delete Page</button>
                </>
            )}
            <ConfirmModal
                show={showConfirm}
                message="Are you sure you want to delete this page?"
                onConfirm={onConfirmDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
};

export default Admin;
