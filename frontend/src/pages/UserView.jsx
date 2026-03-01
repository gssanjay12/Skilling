import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, BookOpen, Clock, Building } from 'lucide-react';

const UserView = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/users/${id}`);
                setProfile(res.data);
            } catch (err) {
                setError('User not found or error loading profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    if (loading) return <div className="text-center py-12 text-gray-500">Loading profile...</div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
    if (!profile) return null;

    const knows = profile.skills?.filter(s => s.type === 'know') || [];
    const learns = profile.skills?.filter(s => s.type === 'learn') || [];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link to="/directory" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Directory
            </Link>

            <div className="card overflow-hidden">
                <div className="border-b border-gray-100 pb-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>

                    <div className="flex flex-wrap items-center mt-3 gap-y-2 gap-x-6 text-sm text-gray-600">
                        {profile.college && (
                            <span className="flex items-center">
                                <Building className="w-4 h-4 mr-1.5 text-gray-400" />
                                {profile.college}
                            </span>
                        )}
                        {profile.availability && (
                            <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                                {profile.availability}
                            </span>
                        )}
                        <a
                            href={`mailto:${profile.email}`}
                            className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                        >
                            <Mail className="w-4 h-4 mr-1.5" />
                            Contact {profile.full_name.split(' ')[0]}
                        </a>
                    </div>

                    {profile.bio && (
                        <p className="mt-4 text-gray-700 whitespace-pre-line">{profile.bio}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
                            Skills Known
                        </h3>
                        {knows.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No skills listed</p>
                        ) : (
                            <ul className="space-y-3">
                                {knows.map(s => (
                                    <li key={s.id} className="flex justify-between items-center bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                                        <span className="font-medium text-indigo-900">{s.skill.name}</span>
                                        <span className="text-xs text-indigo-500 px-2 py-0.5 bg-white rounded-full shadow-sm">{s.level}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-emerald-500" />
                            Skills Wanted
                        </h3>
                        {learns.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No skills listed</p>
                        ) : (
                            <ul className="space-y-3">
                                {learns.map(s => (
                                    <li key={s.id} className="flex justify-between items-center bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                                        <span className="font-medium text-emerald-900">{s.skill.name}</span>
                                        <span className="text-xs text-emerald-500 px-2 py-0.5 bg-white rounded-full shadow-sm">{s.level}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserView;
