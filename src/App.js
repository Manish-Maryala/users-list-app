import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  // Make sure to import the CSS for styling

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null);  // State for selected user details

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  // Filter users based on the search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort users based on selected field and order
  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortField === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === 'email') {
      return sortOrder === 'asc'
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    }
    return 0;
  });

  const handleClick = (user) => {
    setSelectedUser(prevUser => 
      prevUser && prevUser.id === user.id ? null : user // Toggle visibility of the user details
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <h1>User List</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}  // Update search term on input change
      />
      
      {/* Sort Options */}
      <div>
        <button onClick={() => setSortField('name')}>
          Sort by Name
        </button>
        <button onClick={() => setSortField('email')}>
          Sort by Email
        </button>
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
        </button>
      </div>
      
      {/* User List */}
      <ul>
        {sortedUsers.map(user => (
          <li 
            key={user.id} 
            onClick={() => handleClick(user)} 
            className={selectedUser?.id === user.id ? 'selected' : ''} // Highlight selected user
          >
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
      
      {/* User Details Section */}
      {selectedUser && (
        <div className="details">
          <h2>Details for {selectedUser.name}</h2>
          <p>Email: {selectedUser.email}</p>
          <p>Phone: {selectedUser.phone}</p>
          <p>Company: {selectedUser.company.name}</p>
          <p>Address: {selectedUser.address.street}, {selectedUser.address.city}</p>
        </div>
      )}
    </div>
  );
}

export default App;