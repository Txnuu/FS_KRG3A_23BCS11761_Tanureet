import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Profile = () => {
  const { username, isLoggedIn } = useContext(UserContext);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Profile Component</h2>
      <p><strong>Username:</strong> {username}</p>
      <p><strong>Logged In:</strong> {isLoggedIn ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default Profile;

