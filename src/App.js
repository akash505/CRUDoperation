import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(null); // null indicates a new user
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false); // Toggle form display

  // Fetch users from JSONPlaceholder
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");
        setData(response.data);
      } catch (err) {
        setError("Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  // Handle editing a user
  const handleEdit = (id) => {
    const user = data.find((item) => item.id === id);
    if (user) {
      setIsUpdate(true);
      setId(id);
      setFirstName(user.name.split(" ")[0]);
      setLastName(user.name.split(" ")[1] || "");
      setEmail(user.email);
      setShowForm(true); // Show the form when editing
    }
  };

  // Handle creating a new user (POST)
  const handleSave = async (e) => {
    e.preventDefault();
    const newUser = {
      name: `${firstName} ${lastName}`,
      email: email,
      phone: `123-456-7890`,
    };

    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/users", newUser);
      setData([...data, response.data]);
      handleClear();
    } catch (err) {
      setError("Error saving user");
    }
  };

  // Handle updating a user (PUT)
  const handleUpdate = async () => {
    const updatedUser = {
      name: `${firstName} ${lastName}`,
      email: email,
      phone: `123-456-7890`,
    };

    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, updatedUser);
      const updatedData = data.map((user) => (user.id === id ? { ...user, ...updatedUser } : user));
      setData(updatedData);
      handleClear();
    } catch (err) {
      setError("Error updating user");
    }
  };

  // Handle deleting a user (DELETE)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setData(data.filter((user) => user.id !== id));
    } catch (err) {
      setError("Error deleting user");
    }
  };

  // Clear the form
  const handleClear = () => {
    setId(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setIsUpdate(false);
    setShowForm(false); // Hide the form after saving or updating
    setError("");
  };

  return (
    <div className="App">
      <div className="btn-create">
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          Create New User
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <div>
            <label>First Name</label>
            <input
              type="text"
              placeholder="Enter First Name"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Enter Last Name"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div>
            {!isUpdate ? (
              <button className="btn btn-primary" onClick={(e) => handleSave(e)}>
                Save
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleUpdate}>
                Update
              </button>
            )}
            &nbsp;
            <button className="btn btn-danger" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="table-wrapper">
        <table className="table table-hover">
          <thead className="header table-header">
            <tr>
              <th>Sr.No</th>
              <th>Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.id}</td>
                <td>{item.name.split(" ")[0]}</td>
                <td>{item.name.split(" ")[1] || ""}</td>
                <td>{item.email}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
