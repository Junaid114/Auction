import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Function to create a new user
  const registerUser = async () => {
    try {
      const response = await axios.post('/api/users', newUser);
      setUsers([...users, response.data]);
      setNewUser({ name: '', email: '', password: '' });
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  // Function to update an existing user
  const updateUser = async (userId, updatedUser) => {
    try {
      await axios.put(`/api/users/${userId}`, updatedUser);
      const updatedUsers = users.map((user) =>
        user.id === userId ? updatedUser : user
      );
      setUsers(updatedUsers);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Function to delete a user
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Function to set the user being edited
  const editUser = (user) => {
    setEditingUser(user);
  };

  return (
    <div>
      <h2>User Management</h2>

      {/* User Registration Form */}
      <h3>User Registration</h3>
      <input
        type="text"
        placeholder="Name"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      />
      <button onClick={registerUser}>Register</button>

      {/* User Listing Component */}
      <h3>User List</h3>
      {users.map((user) => (
        <div key={user.id}>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          {/* Update and Delete functionality */}
          {editingUser === user ? (
            <>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />
              <button onClick={() => updateUser(user.id, editingUser)}>
                Save
              </button>
              <button onClick={() => setEditingUser(null)}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => editUser(user)}>Edit</button>
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserManagement;
