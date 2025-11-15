import React, { useState, useEffect } from 'react';
import './Profile.css';
import { 
    User, 
    Mail, 
    Phone, 
    Camera, 
    Edit3, 
    Save,
    X,
    Award,
    Target,
    TrendingUp,
    Clock,
    Download,
    Lock,
    Bell,
    Moon,
    Sun,
    Trash2,
    Calendar,
    Filter,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { user: authUser, logout } = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // overview, history, settings
    
    // Edit profile state
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        bio: ''
    });

    // Password change state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Settings state
    const [settings, setSettings] = useState({
        emailNotifications: true,
        theme: 'dark'
    });

    // History state
    const [history, setHistory] = useState([]);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyFilter, setHistoryFilter] = useState({
        category: '',
        startDate: '',
        endDate: ''
    });
    const [pagination, setPagination] = useState(null);

    // Fetch profile data
    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/users/profile');
            
            console.log('Profile API Response:', response.data);
            
            if (response.data.success) {
                setProfileData(response.data.data);
                
                // Initialize edit form
                setEditForm({
                    name: response.data.data.user.name || '',
                    email: response.data.data.user.email || '',
                    phone: response.data.data.user.phone || '',
                    bio: response.data.data.user.bio || ''
                });

                // Initialize settings
                setSettings({
                    emailNotifications: response.data.data.user.settings?.emailNotifications ?? true,
                    theme: response.data.data.user.settings?.theme || 'dark'
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            console.error('Error response:', error.response?.data);
            setError(error.response?.data?.message || error.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    // Fetch quiz history
    const fetchHistory = async (page = 1) => {
        try {
            const params = new URLSearchParams({
                page,
                limit: 10,
                ...historyFilter
            });

            const response = await api.get(`/users/history?${params}`);
            
            if (response.data.success) {
                setHistory(response.data.data.attempts);
                setPagination(response.data.data.pagination);
                setHistoryPage(page);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    // Load history when tab changes
    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory(1);
        }
    }, [activeTab, historyFilter]);

    // Handle profile update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        try {
            const response = await api.put('/users/profile', editForm);
            
            if (response.data.success) {
                alert('Profile updated successfully!');
                setIsEditing(false);
                fetchProfileData();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'Failed to update profile');
        }
    };

    // Handle password change
    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            alert('Password must be at least 6 characters!');
            return;
        }

        try {
            const response = await api.put('/users/password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            
            if (response.data.success) {
                alert('Password changed successfully!');
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert(error.response?.data?.message || 'Failed to change password');
        }
    };

    // Handle settings update
    const handleUpdateSettings = async (key, value) => {
        try {
            const newSettings = { ...settings, [key]: value };
            setSettings(newSettings);

            await api.put('/users/settings', { [key]: value });
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    // Export history
    const handleExportHistory = async () => {
        try {
            const response = await api.get('/users/history/export', {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'quiz-history.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting history:', error);
            alert('Failed to export history');
        }
    };

    // Handle account deletion
    const handleDeleteAccount = async () => {
        const password = prompt('Enter your password to confirm account deletion:');
        
        if (!password) return;

        if (!confirm('Are you sure? This action cannot be undone!')) return;

        try {
            await api.delete('/users/account', { data: { password } });
            alert('Account deleted successfully');
            logout();
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(error.response?.data?.message || 'Failed to delete account');
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="profile-page">
                <div className="error-container">
                    <p>{error || 'Failed to load profile'}</p>
                    <button onClick={fetchProfileData} className="btn-edit-profile">Retry</button>
                </div>
            </div>
        );
    }

    const { user, statistics, categoryPerformance, recentBadges } = profileData;

    return (
        <div className="profile-page">
            <div className="profile-container">
                
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar-section">
                        <div className="avatar-wrapper">
                            <img 
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&size=200&background=a855f7&color=fff`} 
                                alt={user.name}
                                className="profile-avatar"
                            />
                            <button className="avatar-upload-btn">
                                <Camera size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="profile-info">
                        <h1 className="profile-name">{user.name}</h1>
                        <p className="profile-email">{user.email}</p>
                        <div className="profile-badges-inline">
                            <span className="level-badge">Level {user.level}</span>
                            <span className="rank-badge">{user.rank}</span>
                            <span className="xp-badge">{user.xp} XP</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        {!isEditing ? (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="btn-edit-profile"
                            >
                                <Edit3 size={18} />
                                Edit Profile
                            </button>
                        ) : (
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="btn-cancel"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* Edit Profile Form */}
                {isEditing && (
                    <div className="edit-profile-section">
                        <form onSubmit={handleUpdateProfile} className="edit-profile-form">
                            <h3>Edit Profile Information</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>
                                        <User size={18} />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <Mail size={18} />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <Phone size={18} />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>

                            <div className="form-group">
                                <label>Bio</label>
                                <textarea
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    rows={4}
                                    maxLength={500}
                                    placeholder="Tell us about yourself..."
                                />
                                <small>{editForm.bio.length}/500</small>
                            </div>

                            <button type="submit" className="btn-save">
                                <Save size={18} />
                                Save Changes
                            </button>
                        </form>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="profile-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <Target size={18} />
                        Overview
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <Calendar size={18} />
                        Quiz History
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Lock size={18} />
                        Settings
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="overview-tab">
                            
                            {/* Statistics Cards */}
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: '#a855f7' }}>
                                        <Target size={24} />
                                    </div>
                                    <div className="stat-details">
                                        <div className="stat-value">{statistics.totalQuizzes}</div>
                                        <div className="stat-label">Total Quizzes</div>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: '#10b981' }}>
                                        <TrendingUp size={24} />
                                    </div>
                                    <div className="stat-details">
                                        <div className="stat-value">{statistics.averageScore.toFixed(1)}%</div>
                                        <div className="stat-label">Average Score</div>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: '#f59e0b' }}>
                                        <Award size={24} />
                                    </div>
                                    <div className="stat-details">
                                        <div className="stat-value">#{user.rank}</div>
                                        <div className="stat-label">Global Rank</div>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: '#ec4899' }}>
                                        <Clock size={24} />
                                    </div>
                                    <div className="stat-details">
                                        <div className="stat-value">{user.streak?.currentStreak || 0}</div>
                                        <div className="stat-label">Day Streak</div>
                                    </div>
                                </div>
                            </div>

                            {/* Category Performance */}
                            <div className="performance-section">
                                <h3>Category Performance</h3>
                                <div className="category-performance-list">
                                    {categoryPerformance && categoryPerformance.length > 0 ? (
                                        categoryPerformance.map((cat, idx) => (
                                            <div key={idx} className="category-perf-item">
                                                <div className="category-info">
                                                    <span className="category-name">{cat._id}</span>
                                                    <span className="category-count">{cat.count} quizzes</span>
                                                </div>
                                                <div className="category-progress">
                                                    <div 
                                                        className="progress-bar"
                                                        style={{ 
                                                            width: `${cat.avgScore}%`,
                                                            background: cat.avgScore >= 70 ? '#10b981' : cat.avgScore >= 50 ? '#f59e0b' : '#ef4444'
                                                        }}
                                                    >
                                                        <span>{cat.avgScore.toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                                <span className="best-score">Best: {cat.bestScore.toFixed(1)}%</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">No quiz data yet. Start practicing!</p>
                                    )}
                                </div>
                            </div>

                            {/* Recent Badges */}
                            <div className="badges-section">
                                <h3>Recent Achievements</h3>
                                <div className="badges-grid">
                                    {recentBadges && recentBadges.length > 0 ? (
                                        recentBadges.map((badge, idx) => (
                                            <div key={idx} className="badge-card">
                                                <Award className="badge-icon" />
                                                <div className="badge-name">{badge.name}</div>
                                                <div className="badge-date">{formatDate(badge.earnedAt)}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">No badges earned yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div className="history-tab">
                            
                            {/* Filters and Export */}
                            <div className="history-controls">
                                <div className="history-filters">
                                    <select 
                                        value={historyFilter.category}
                                        onChange={(e) => setHistoryFilter({ ...historyFilter, category: e.target.value })}
                                    >
                                        <option value="">All Categories</option>
                                        <option value="DSA">DSA</option>
                                        <option value="OS">OS</option>
                                        <option value="SQL">SQL</option>
                                        <option value="DBMS">DBMS</option>
                                        <option value="Networks">Networks</option>
                                    </select>

                                    <input
                                        type="date"
                                        value={historyFilter.startDate}
                                        onChange={(e) => setHistoryFilter({ ...historyFilter, startDate: e.target.value })}
                                        placeholder="Start Date"
                                    />

                                    <input
                                        type="date"
                                        value={historyFilter.endDate}
                                        onChange={(e) => setHistoryFilter({ ...historyFilter, endDate: e.target.value })}
                                        placeholder="End Date"
                                    />
                                </div>

                                <button onClick={handleExportHistory} className="btn-export">
                                    <Download size={18} />
                                    Export CSV
                                </button>
                            </div>

                            {/* History List */}
                            <div className="history-list">
                                {history && history.length > 0 ? (
                                    history.map((attempt) => (
                                        <div key={attempt._id} className="history-item">
                                            <div className="history-date">
                                                <Calendar size={16} />
                                                {formatDate(attempt.completedAt)}
                                            </div>
                                            <div className="history-details">
                                                <div className="history-subject">{attempt.subject}</div>
                                                <div className="history-difficulty">{attempt.difficulty}</div>
                                                <div className="history-score">
                                                    Score: {attempt.score}/{attempt.totalQuestions}
                                                </div>
                                                <div className="history-percentage">
                                                    {attempt.percentage.toFixed(1)}%
                                                </div>
                                                <div className="history-time">
                                                    <Clock size={14} />
                                                    {formatTime(attempt.timeTaken)}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => navigate(`/result/${attempt._id}`)}
                                                className="btn-view-results"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-data">No quiz history found</p>
                                )}
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="pagination">
                                    <button 
                                        onClick={() => fetchHistory(historyPage - 1)}
                                        disabled={historyPage === 1}
                                        className="btn-page"
                                    >
                                        <ChevronLeft size={18} />
                                        Previous
                                    </button>
                                    
                                    <span className="page-info">
                                        Page {pagination.currentPage} of {pagination.totalPages}
                                    </span>
                                    
                                    <button 
                                        onClick={() => fetchHistory(historyPage + 1)}
                                        disabled={historyPage === pagination.totalPages}
                                        className="btn-page"
                                    >
                                        Next
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="settings-tab">
                            
                            {/* Change Password */}
                            <div className="settings-section">
                                <h3>
                                    <Lock size={20} />
                                    Change Password
                                </h3>
                                <form onSubmit={handleChangePassword} className="password-form">
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            required
                                            minLength={6}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            required
                                            minLength={6}
                                        />
                                    </div>

                                    <button type="submit" className="btn-change-password">
                                        Update Password
                                    </button>
                                </form>
                            </div>

                            {/* Preferences */}
                            <div className="settings-section">
                                <h3>
                                    <Bell size={20} />
                                    Preferences
                                </h3>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <Bell size={18} />
                                        <div>
                                            <div className="setting-label">Email Notifications</div>
                                            <div className="setting-description">Receive emails about your quizzes and achievements</div>
                                        </div>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.emailNotifications}
                                            onChange={(e) => handleUpdateSettings('emailNotifications', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="setting-item">
                                    <div className="setting-info">
                                        {settings.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                        <div>
                                            <div className="setting-label">Theme</div>
                                            <div className="setting-description">Choose your preferred color theme</div>
                                        </div>
                                    </div>
                                    <select 
                                        value={settings.theme}
                                        onChange={(e) => handleUpdateSettings('theme', e.target.value)}
                                        className="theme-select"
                                    >
                                        <option value="dark">Dark</option>
                                        <option value="light">Light</option>
                                    </select>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="settings-section danger-zone">
                                <h3>
                                    <Trash2 size={20} />
                                    Danger Zone
                                </h3>
                                <div className="danger-content">
                                    <div>
                                        <div className="danger-label">Delete Account</div>
                                        <div className="danger-description">
                                            Once you delete your account, there is no going back. All your data will be permanently removed.
                                        </div>
                                    </div>
                                    <button onClick={handleDeleteAccount} className="btn-delete">
                                        <Trash2 size={18} />
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
