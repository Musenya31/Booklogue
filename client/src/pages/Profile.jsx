import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import Header from '../components/common/Header';
import { getInitials } from '../utils/formatters';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const inputFileRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', bio: '', avatar: '' });
  const [editing, setEditing] = useState(false);
  const [feedback, setFeedback] = useState({ error: '', success: '', uploading: false });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?._id) loadProfile();
  }, [isAuthenticated, navigate, user]);

  const loadProfile = async () => {
    try {
      const { data } = await userService.getUserProfile(user._id);
      setProfile(data);
      setFormData(data);
    } catch {
      setFeedback({ error: 'Failed to load profile', success: '' });
    }
  };

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ ...feedback, error: 'Please select an image file.' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFeedback({ ...feedback, error: 'Image size must be less than 2MB.' });
      return;
    }

    setFeedback({ error: '', success: '', uploading: true });

    try {
      const response = await userService.uploadFile(file);
      setFormData((prev) => ({ ...prev, avatar: response.data.url }));
      setFeedback({ uploading: false, error: '', success: 'Avatar uploaded successfully!' });
    } catch {
      setFeedback({ uploading: false, error: 'Failed to upload avatar.', success: '' });
    }
  };

  const triggerFileSelect = () => inputFileRef.current?.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ error: '', success: '', uploading: false });

    try {
      await userService.updateProfile(formData);
      setFeedback({ error: '', success: 'Profile updated!', uploading: false });
      setEditing(false);
      loadProfile();
      localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
    } catch {
      setFeedback({ error: 'Update failed', success: '', uploading: false });
    }
  };

  if (!profile)
    return (
      <div className="min-h-screen bg-cream-50">
        <Header />
        <div className="container mx-auto p-20 text-center">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="container mx-auto p-10 max-w-4xl">
        {feedback.success && <p className="text-green-600 mb-4">{feedback.success}</p>}
        {feedback.error && <p className="text-red-600 mb-4">{feedback.error}</p>}

        <div className="bg-cream-100 rounded-lg border border-brown-600/12 p-8 mb-8 flex flex-col md:flex-row gap-6 items-center">
          <div
            className="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-teal-500 cursor-pointer"
            onClick={triggerFileSelect}
          >
            {formData.avatar ? (
              <img src={formData.avatar} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-teal-500 flex items-center justify-center text-white text-4xl font-semibold select-none">
                {getInitials(profile.username)}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={inputFileRef}
              onChange={handleAvatarChange}
              disabled={feedback.uploading}
            />
            {feedback.uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg">
                Uploading...
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            {!editing ? (
              <>
                <h1 className="text-3xl font-semibold text-slate-900">{profile.username}</h1>
                <p className="text-slate-500 my-2">{profile.email}</p>
                <p className="text-slate-900 mb-4">{profile.bio || 'No bio yet'}</p>
                <div className="flex gap-3">
                  <button onClick={() => setEditing(true)} className="btn-primary">
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="btn-secondary"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="username" value={formData.username} onChange={handleChange} className="input-field" placeholder="Username" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="Email" />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  className="input-field"
                  placeholder="Bio"
                />
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary" disabled={feedback.uploading}>
                    Save Changes
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
