import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Filter, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Directory = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [levelFill, setLevelFill] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('skill', search);
            if (levelFill) params.append('level', levelFill);

            const res = await api.get(`/users/directory?${params.toString()}`);
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search, levelFill]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">User Directory</h1>

                <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by skill..."
                            className="w-full pl-9 pr-4 py-2 text-sm outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="border-l border-gray-200 flex items-center bg-gray-50 px-2 lg:px-4">
                        <Filter className="w-4 h-4 text-gray-400 mr-2" />
                        <select
                            className="bg-transparent text-sm outline-none text-gray-600"
                            value={levelFill}
                            onChange={(e) => setLevelFill(e.target.value)}
                        >
                            <option value="">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading directory...</div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
                    No users found matching these criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map(user => (
                        <div key={user.id} className="card hover:border-gray-300 transition-colors flex flex-col h-full">
                            <div className="flex-1">
                                <Link to={`/u/${user.id}`} className="hover:text-primary-600">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{user.full_name}</h3>
                                </Link>
                                <p className="text-sm text-gray-500 mb-3">{user.college || 'No college specified'}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="text-xs font-medium text-gray-500 flex items-center">
                                        <BookOpen className="w-3 h-3 mr-1" /> Knows
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {user.skills?.filter(s => s.type === 'know').slice(0, 3).map(s => (
                                            <span key={s.id} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
                                                {s.skill.name}
                                            </span>
                                        ))}
                                        {(user.skills?.filter(s => s.type === 'know').length || 0) > 3 && (
                                            <span className="bg-gray-50 text-gray-500 text-xs px-2 py-1 rounded-md">+{user.skills.filter(s => s.type === 'know').length - 3}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-xs font-medium text-gray-500 flex items-center">
                                        <BookOpen className="w-3 h-3 mr-1" /> Learns
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {user.skills?.filter(s => s.type === 'learn').slice(0, 3).map(s => (
                                            <span key={s.id} className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-md">
                                                {s.skill.name}
                                            </span>
                                        ))}
                                        {(user.skills?.filter(s => s.type === 'learn').length || 0) > 3 && (
                                            <span className="bg-primary-50 text-primary-500 text-xs px-2 py-1 rounded-md">+{user.skills.filter(s => s.type === 'learn').length - 3}</span>
                                        )}
                                    </div>
                                </div>

                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <Link to={`/u/${user.id}`} className="text-sm text-primary-600 font-medium hover:text-primary-700 block text-center w-full py-1">
                                    View full profile
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Directory;
