import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../store/notificationSlice';
import { updateProfile } from '../store/authSlice';
import { useAuth } from '../utils/hooks';
import { Card, Button, Input, Modal } from '../components';
import { formatDateTime, getUserFullName, getUserAvatar } from '../utils/helpers';

export const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications(user.id) as any);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [dispatch, user]);

  const handleOpenEditModal = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
      setError('');
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setError('');
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setIsLoading(true);

    try {
      await dispatch(
        updateProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }) as any
      ).unwrap();

      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await dispatch(markNotificationAsRead(id) as any);
  };

  const handleMarkAllAsRead = async () => {
    if (user) {
      await dispatch(markAllNotificationsAsRead(user.id) as any);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      default:
        return 'ℹ';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
          <p className="mt-2 text-gray-600">Gérez vos notifications et votre profil</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="primary" onClick={handleMarkAllAsRead}>
            Marquer tout comme lu
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="text-center">
            <img
              src={getUserAvatar(user)}
              alt={getUserFullName(user)}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-900">{getUserFullName(user)}</h2>
            <p className="text-gray-600 mb-4">{user?.email}</p>
            <Button variant="outline" onClick={handleOpenEditModal} className="w-full">
              Modifier le profil
            </Button>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-full">
                {unreadCount} non lues
              </span>
            )}
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune notification</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${
                    notification.read ? 'bg-gray-50' : getNotificationColor(notification.type)
                  } ${!notification.read ? 'border-l-4' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <p
                          className={`${
                            notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'
                          }`}
                        >
                          {notification.message}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 ml-7">
                        {formatDateTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Marquer comme lu
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Modifier le profil"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <Input
            label="Prénom"
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            placeholder="John"
          />
          <Input
            label="Nom"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            placeholder="Doe"
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="votre@email.com"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={handleCloseEditModal}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" isLoading={isLoading}>
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
