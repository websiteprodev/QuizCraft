import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Typography } from '@material-tailwind/react';
import { db } from '@/configs/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export function UserManagement() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            let fetchedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (searchTerm) {
                fetchedUsers = fetchedUsers.filter(user => 
                    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setUsers(fetchedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const blockUser = async (userId) => {
        try {
            await updateDoc(doc(db, 'users', userId), {
                isBlocked: true,
            });
            fetchUsers();  
        } catch (error) {
            console.error('Error blocking user:', error);
        }
    };
    
    const unblockUser = async (userId) => {
        try {
            await updateDoc(doc(db, 'users', userId), {
                isBlocked: false,
            });
            fetchUsers();  
        } catch (error) {
            console.error('Error unblocking user:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Typography variant="h4" className="mb-4 text-gray-800">User Management</Typography>
            <Input
                label="Search Users"
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-6"
                color="blue"
            />
            <div className="mb-6">
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : (
                    users.length > 0 ? (
                        users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage).map((user) => (
                            <Card key={user.id} className="p-4 mb-4 flex justify-between items-center bg-white shadow-md">
                                <div>
                                    <Typography variant="h6" color="blue-gray">{user.firstName || 'No Name'}</Typography>
                                    <Typography variant="body2" color="gray">Email: {user.email || 'No Email'}</Typography>
                                    <Typography variant="body2" color="gray">Status: {user.isBlocked ? "Blocked" : "Active"}</Typography>
                                </div>
                                <div>
                                    {user.isBlocked ? (
                                        <Button 
                                            onClick={() => unblockUser(user.id)} 
                                            color="green"
                                            className="bg-green-500 hover:bg-green-600 text-white"
                                        >
                                            Unblock
                                        </Button>
                                    ) : (
                                        <Button 
                                            onClick={() => blockUser(user.id)} 
                                            color="red"
                                            className="bg-red-500 hover:bg-red-600 text-white"
                                        >
                                            Block
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Typography>No users found.</Typography>
                    )
                )}
            </div>
            <div className="flex justify-between">
                <Button 
                    onClick={handlePreviousPage} 
                    disabled={currentPage === 1}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Previous
                </Button>
                <Button 
                    onClick={handleNextPage} 
                    disabled={(currentPage * usersPerPage) >= users.length}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
