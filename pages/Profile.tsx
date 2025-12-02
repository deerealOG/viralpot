import React, { useState } from 'react';
import { Camera, Edit3, LogOut, Settings } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { User } from '../types';
import { db } from '../services/db';
import { Modal } from '../components/Modal';
import { toast } from '../services/toast';
import { Input } from '../components/Input';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onNavigate?: (tab: any) => void;
}

const AVATAR_PRESETS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Molly",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Simba",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Cookie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Ginger"
];

export const Profile: React.FC<ProfileProps> = ({ user, onLogout, onNavigate }) =>  {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar || AVATAR_PRESETS[0]);
  const [editName, setEditName] = useState(user.name || '');
  const [saving, setSaving] = useState(false);

  const handleUpdateAvatar = async (url: string) => {
      const updatedUser = { ...user, avatar: url };
      await db.auth.updateUser(updatedUser);
      window.location.reload(); 
  };

  const handleUpdateProfile = async () => {
      if (!editName.trim()) {
          toast.error('Name cannot be empty');
          return;
      }
      setSaving(true);
      try {
          const updatedUser = { ...user, name: editName };
          await db.auth.updateUser(updatedUser);
          toast.success('Profile updated successfully!');
          setIsEditingProfile(false);
          window.location.reload();
      } catch (e) {
          toast.error('Failed to update profile');
      } finally {
          setSaving(false);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-6 mb-8">
         <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => setIsEditingAvatar(true)}>
               <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                   <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover" />
               </div>
               <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera className="w-6 h-6 text-white" />
               </div>
            </div>
            
            <div>
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{user.name || 'User'}</h2>
               <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
               <div className="flex items-center gap-2 mt-2">
                   <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                       user.role === 'business' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                       user.role === 'agency' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                       'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                   }`}>
                       {user.role === 'business' && '💼'}
                       {user.role === 'agency' && '🚀'}
                       {user.role === 'creator' && '🎨'}
                       {user.role} Account
                   </span>
               </div>
            </div>
         </div>

         <Button variant="outline" onClick={() => { setEditName(user.name || ''); setIsEditingProfile(true); }}>
             <Edit3 className="w-4 h-4 mr-2" />
             Edit Profile
         </Button>
      </div>

      {/* Profile Info from Onboarding */}
      {(user.niche || user.platforms || user.bio) && (
        <Card title="Your Profile">
          <div className="space-y-4">
            {user.niche && (
              <div>
                <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Content Niche</span>
                <span className="text-slate-900 dark:text-white font-medium">{user.niche}</span>
              </div>
            )}
            {user.platforms && user.platforms.length > 0 && (
              <div>
                <span className="block text-xs font-bold uppercase text-slate-500 mb-2">Primary Platforms</span>
                <div className="flex flex-wrap gap-2">
                  {user.platforms.map(p => (
                    <span key={p} className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full text-sm font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {user.bio && (
              <div>
                <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Bio / Brand Statement</span>
                <p className="text-slate-700 dark:text-slate-300">{user.bio}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      <Card title="Account Settings">
        <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">Email Notifications</span>
                <div className="w-10 h-6 bg-teal-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">Dark Mode</span>
                <span className="text-xs text-slate-400">Managed in header</span>
            </div>
            <div className="flex justify-between items-center py-2">
                <span className="text-slate-700 dark:text-slate-300">App Version</span>
                <span className="text-slate-500">v3.2.0</span>
            </div>
        </div>
      </Card>

      {!user.isGuest && (
        <div className="pt-4">
           <Button variant="danger" fullWidth onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
           </Button>
        </div>
      )}

      {/* Avatar Picker Modal */}
      <Modal isOpen={isEditingAvatar} onClose={() => setIsEditingAvatar(false)} title="Choose Avatar">
          <div className="grid grid-cols-4 gap-4 p-2">
              {AVATAR_PRESETS.map((url, i) => (
                  <button 
                    key={i}
                    onClick={() => { handleUpdateAvatar(url); setIsEditingAvatar(false); }}
                    className="aspect-square rounded-full overflow-hidden border-2 border-transparent hover:border-teal-500 hover:scale-105 transition-all"
                  >
                      <img src={url} alt={`Avatar ${i}`} className="w-full h-full" />
                  </button>
              ))}
          </div>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditingProfile} onClose={() => setIsEditingProfile(false)} title="Edit Profile">
          <div className="space-y-4">
              <Input 
                  label="Display Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
              />
              <p className="text-xs text-slate-500">This is how your name will appear across the app.</p>
              <div className="flex gap-2 pt-4">
                  <Button fullWidth variant="outline" onClick={() => setIsEditingProfile(false)}>
                      Cancel
                  </Button>
                  <Button fullWidth onClick={handleUpdateProfile} isLoading={saving}>
                      Save Changes
                  </Button>
              </div>
          </div>
      </Modal>

    </div>
  );
};
