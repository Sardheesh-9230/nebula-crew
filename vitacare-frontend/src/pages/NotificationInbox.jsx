import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  Notifications,
  LocalHospital,
  Medication,
  Warning,
  Lightbulb,
  Science,
  NotificationImportant,
  Delete,
  DoneAll,
  FilterList,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const NotificationInbox = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'critical'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [filter, page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        ...(filter === 'unread' && { isRead: false }),
        ...(filter === 'critical' && { severity: 'critical' }),
      };

      const response = await api.get('/notifications', { params });
      const newNotifications = response.data.data.notifications;
      
      if (page === 1) {
        setNotifications(newNotifications);
      } else {
        setNotifications(prev => [...prev, ...newNotifications]);
      }
      
      setHasMore(newNotifications.length === 20);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event, newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await api.patch(`/notifications/${notification._id}/read`);
        setNotifications(prev =>
          prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
        );
      }
      
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (notificationId, event) => {
    event.stopPropagation();
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const getNotificationIcon = (type, severity) => {
    const iconProps = {
      sx: {
        color: severity === 'critical' ? '#f44336' :
               severity === 'high' ? '#ff9800' :
               severity === 'medium' ? '#2196f3' : '#4caf50'
      }
    };

    switch(type) {
      case 'appointment':
        return <LocalHospital {...iconProps} />;
      case 'medication':
        return <Medication {...iconProps} />;
      case 'outbreak_alert':
      case 'proximity_infection':
        return <Warning {...iconProps} />;
      case 'health_tip':
        return <Lightbulb {...iconProps} />;
      case 'test_result':
        return <Science {...iconProps} />;
      case 'emergency':
        return <LocalHospital {...iconProps} />;
      default:
        return <NotificationImportant {...iconProps} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      default: return '#4caf50';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Notifications sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4" fontWeight={700}>
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Chip
                  label={`${unreadCount} unread`}
                  color="error"
                  size="small"
                />
              )}
            </Box>
            {unreadCount > 0 && (
              <Button
                startIcon={<DoneAll />}
                variant="outlined"
                onClick={handleMarkAllRead}
              >
                Mark all read
              </Button>
            )}
          </Box>

          {/* Filter Tabs */}
          <Tabs
            value={filter}
            onChange={handleFilterChange}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<FilterList />} iconPosition="start" label="All" value="all" />
            <Tab icon={<Notifications />} iconPosition="start" label="Unread" value="unread" />
            <Tab icon={<Warning />} iconPosition="start" label="Critical" value="critical" />
          </Tabs>
        </Paper>

        {/* Notifications List */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {loading && page === 1 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <Notifications sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No notifications found
              </Typography>
            </Box>
          ) : (
            <>
              <List sx={{ p: 0 }}>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification._id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      button
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                        borderLeft: `4px solid ${getSeverityColor(notification.severity)}`,
                        '&:hover': {
                          bgcolor: 'action.selected',
                        },
                        py: 2,
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={(e) => handleDelete(notification._id, e)}
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: notification.isRead ? 'grey.300' : getSeverityColor(notification.severity) + '20',
                          }}
                        >
                          {getNotificationIcon(notification.type, notification.severity)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography
                              variant="body1"
                              fontWeight={notification.isRead ? 400 : 700}
                              sx={{ flex: 1 }}
                            >
                              {notification.title}
                            </Typography>
                            <Chip
                              label={notification.severity}
                              size="small"
                              sx={{
                                height: 22,
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                bgcolor: getSeverityColor(notification.severity),
                                color: '#fff',
                              }}
                            />
                            <Chip
                              label={notification.type.replace('_', ' ')}
                              size="small"
                              variant="outlined"
                              sx={{ height: 22, fontSize: '0.7rem' }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>

              {hasMore && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    variant="outlined"
                  >
                    {loading ? <CircularProgress size={24} /> : 'Load More'}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default NotificationInbox;
