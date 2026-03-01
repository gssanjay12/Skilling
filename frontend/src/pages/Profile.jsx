import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Settings, Plus, X, Trash2 } from 'lucide-react';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        bio: user.bio || '',
        college: user.college || '',
        availability: user.availability || '',
    });

    const [allSkills, setAllSkills] = useState([]);
    const [newSkill, setNewSkill] = useState({ skill_id: '', type: 'know', level: 'Beginner' });
    const [isCreatingSkill, setIsCreatingSkill] = useState(false);
    const [customSkillName, setCustomSkillName] = useState('');

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await api.get('/skills');
                setAllSkills(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSkills();
    }, []);

    const handleSaveProfile = async () => {
        try {
            const res = await api.put('/users/me', formData);
            setUser(res.data);
            setEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();

        let targetSkillId = newSkill.skill_id;

        // Create the new skill first if user selected "Create new"
        if (targetSkillId === 'new') {
            if (!customSkillName.trim()) {
                alert("Please enter a skill name");
                return;
            }
            try {
                const res = await api.post('/skills/', { name: customSkillName.trim() });
                targetSkillId = res.data.id;

                // Refresh skills list
                const skillsRes = await api.get('/skills');
                setAllSkills(skillsRes.data);
                setIsCreatingSkill(false);
                setCustomSkillName('');
            } catch (err) {
                console.error(err);
                alert("Failed to create new skill");
                return;
            }
        }

        if (!targetSkillId) return;

        try {
            await api.post('/users/me/skills', {
                skill_id: parseInt(targetSkillId),
                type: newSkill.type,
                level: newSkill.level
            });
            // Refresh user
            const res = await api.get('/users/me');
            setUser(res.data);
            setNewSkill({ skill_id: '', type: 'know', level: 'Beginner' });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.detail || 'Failed to add skill');
        }
    };

    const handleRemoveSkill = async (id) => {
        try {
            await api.delete(`/users/me/skills/${id}`);
            const res = await api.get('/users/me');
            setUser(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const knows = user.skills?.filter(s => s.type === 'know') || [];
    const learns = user.skills?.filter(s => s.type === 'learn') || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Basic Info</h2>
                            <button onClick={() => setEditing(!editing)} className="text-gray-400 hover:text-primary-600">
                                {editing ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                            </button>
                        </div>

                        {editing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="label-text">Bio</label>
                                    <textarea
                                        className="input-field h-24"
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label-text">College</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.college}
                                        onChange={e => setFormData({ ...formData, college: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label-text">Availability</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Weekends, Evenings"
                                        className="input-field"
                                        value={formData.availability}
                                        onChange={e => setFormData({ ...formData, availability: e.target.value })}
                                    />
                                </div>
                                <button onClick={handleSaveProfile} className="btn-primary w-full py-2">Save Changes</button>
                            </div>
                        ) : (
                            <div className="space-y-4 text-sm">
                                <div>
                                    <h3 className="text-gray-500 font-medium">Name</h3>
                                    <p className="text-gray-900">{user.full_name}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-500 font-medium">Email</h3>
                                    <p className="text-gray-900">{user.email}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-500 font-medium">College</h3>
                                    <p className="text-gray-900">{user.college || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-500 font-medium">Bio</h3>
                                    <p className="text-gray-900">{user.bio || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-500 font-medium">Availability</h3>
                                    <p className="text-gray-900">{user.availability || '-'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills Management */}
                <div className="md:col-span-2 space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Manage Skills</h2>
                        <form onSubmit={handleAddSkill} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                            <div className="flex-1">
                                <label className="label-text text-xs">Skill</label>
                                {isCreatingSkill ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            className="input-field py-2 text-sm flex-1"
                                            placeholder="Type skill name..."
                                            value={customSkillName}
                                            onChange={(e) => setCustomSkillName(e.target.value)}
                                            autoFocus
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => { setIsCreatingSkill(false); setNewSkill({ ...newSkill, skill_id: '' }); }}
                                            className="text-gray-400 hover:text-gray-600 p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <select
                                        className="input-field py-2 text-sm"
                                        value={newSkill.skill_id}
                                        onChange={e => {
                                            if (e.target.value === 'new') {
                                                setIsCreatingSkill(true);
                                                setNewSkill({ ...newSkill, skill_id: 'new' });
                                            } else {
                                                setNewSkill({ ...newSkill, skill_id: e.target.value })
                                            }
                                        }}
                                        required
                                    >
                                        <option value="">Select a skill...</option>
                                        <option value="new" className="font-semibold text-primary-600">+ Create new skill</option>
                                        <option disabled>──────────</option>
                                        {allSkills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                )}
                            </div>
                            <div className="w-32">
                                <label className="label-text text-xs">I want to</label>
                                <select
                                    className="input-field py-2 text-sm"
                                    value={newSkill.type}
                                    onChange={e => setNewSkill({ ...newSkill, type: e.target.value })}
                                >
                                    <option value="know">Teach (Know)</option>
                                    <option value="learn">Learn</option>
                                </select>
                            </div>
                            <div className="w-32">
                                <label className="label-text text-xs">Level</label>
                                <select
                                    className="input-field py-2 text-sm"
                                    value={newSkill.level}
                                    onChange={e => setNewSkill({ ...newSkill, level: e.target.value })}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-primary py-2 px-4 shadow-none"><Plus className="w-5 h-5" /></button>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Skills I Know</h3>
                                {knows.length === 0 ? <p className="text-sm text-gray-500">None added yet.</p> : (
                                    <ul className="space-y-3">
                                        {knows.map(s => (
                                            <li key={s.id} className="flex justify-between items-center bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                                                <div>
                                                    <span className="font-medium text-indigo-900 text-sm">{s.skill.name}</span>
                                                    <span className="text-xs text-indigo-500 block">{s.level}</span>
                                                </div>
                                                <button onClick={() => handleRemoveSkill(s.id)} className="text-indigo-400 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Skills I Want to Learn</h3>
                                {learns.length === 0 ? <p className="text-sm text-gray-500">None added yet.</p> : (
                                    <ul className="space-y-3">
                                        {learns.map(s => (
                                            <li key={s.id} className="flex justify-between items-center bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                                                <div>
                                                    <span className="font-medium text-emerald-900 text-sm">{s.skill.name}</span>
                                                    <span className="text-xs text-emerald-500 block">{s.level}</span>
                                                </div>
                                                <button onClick={() => handleRemoveSkill(s.id)} className="text-emerald-400 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
