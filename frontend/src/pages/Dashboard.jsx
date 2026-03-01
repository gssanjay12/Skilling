import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Sparkles, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [matches, setMatches] = useState([]);
    const [stats, setStats] = useState({ recently_joined: [], trending_skills: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [matchesRes, statsRes] = await Promise.all([
                    api.get('/matches'),
                    api.get('/dashboard/stats')
                ]);
                setMatches(matchesRes.data.slice(0, 3)); // Top 3 matches
                setStats(statsRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Top Matches Section */}
                <div className="col-span-2 space-y-6">
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        <h2 className="text-lg font-semibold text-gray-800">Top Matches For You</h2>
                    </div>

                    <div className="grid gap-4">
                        {matches.length === 0 ? (
                            <div className="card text-center py-8 text-gray-500">
                                <p>No matches yet. Try adding more skills to your profile!</p>
                                <Link to="/profile" className="text-primary-600 font-medium hover:underline mt-2 inline-block">Update Profile</Link>
                            </div>
                        ) : (
                            matches.map((match) => (
                                <div key={match.user.id} className="card hover:border-primary-200 transition-colors flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{match.user.full_name}</h3>
                                        <p className="text-sm text-gray-500">{match.user.college || 'No college specified'}</p>
                                        <div className="mt-2 flex space-x-2">
                                            <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium border border-indigo-100">
                                                Match Score: {match.score}
                                            </span>
                                            {match.mutual_swap && (
                                                <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium border border-emerald-100">
                                                    Mutual Swap
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Link to={`/u/${match.user.id}`} className="btn-secondary flex items-center text-sm">
                                        View Profile <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="card bg-gradient-to-br from-indigo-50 to-white">
                        <div className="flex items-center mb-4">
                            <TrendingUp className="w-5 h-5 text-indigo-500 mr-2" />
                            <h3 className="font-semibold text-gray-900">Trending Skills</h3>
                        </div>
                        <ul className="space-y-3">
                            {stats.trending_skills.map((ts, idx) => (
                                <li key={idx} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700">{ts.skill.name}</span>
                                    <span className="text-gray-500 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">{ts.count} users</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card">
                        <div className="flex items-center mb-4">
                            <Users className="w-5 h-5 text-gray-500 mr-2" />
                            <h3 className="font-semibold text-gray-900">New Users</h3>
                        </div>
                        <ul className="space-y-3">
                            {stats.recently_joined.map((u) => (
                                <li key={u.id} className="flex flex-col text-sm border-b border-gray-50 pb-2 last:border-0">
                                    <span className="text-gray-900 font-medium">{u.full_name}</span>
                                    <span className="text-gray-500 text-xs">{u.college || 'Just joined'}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
