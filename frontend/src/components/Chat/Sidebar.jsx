import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ users, selectedUser, onSelectUser, onlineUsers }) => {
  const { user, logout } = useAuth();

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const getInitials = (username) => {
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Messages</h2>
        <div className="sidebar-subtitle">
          <span className="online-indicator"></span>
          <span>{user?.username}</span>
        </div>
      </div>

      <div className="sidebar-users">
        {users.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted-text)', fontSize: '14px' }}>
            No users available
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className={`user-item ${selectedUser?._id === u._id ? 'active' : ''}`}
              onClick={() => onSelectUser(u)}
            >
              <div className="user-avatar">
                {getInitials(u.username)}
              </div>
              <div className="user-info">
                <div className="user-name">{u.username}</div>
                <div className="user-status">
                  <span className={`status-dot ${isUserOnline(u._id) ? '' : 'offline'}`}></span>
                  <span>{isUserOnline(u._id) ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="logout-btn" onClick={logout}>
        Sign out
      </button>
    </div>
  );
};

export default Sidebar;