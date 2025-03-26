import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null); 

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

 
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


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
      prevUser && prevUser.id === user.id ? null : user 
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

     
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}  
      />
      
    
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
      
    
      <ul>
        {sortedUsers.map(user => (
          <li 
            key={user.id} 
            onClick={() => handleClick(user)} 
            className={selectedUser?.id === user.id ? 'selected' : ''} 
          >
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
      
     
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
