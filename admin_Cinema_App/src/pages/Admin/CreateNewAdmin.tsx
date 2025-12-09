import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminImage from "../../assets/admin.jfif.png"; 
import "./CreateNewAdmin.css";
import AdminNavbar from "../../components/AdminNavbar";
import LoginFooter from "../Auth/LoginFooter";

export default function CreateAdmin() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "employee">("admin");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!username || !password || !fullName) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/api/v6/admins",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            password,
            full_name: fullName,
            role
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create admin");
      } else {
        setMessage("Admin account successfully created!");
        setUsername("");
        setPassword("");
        setFullName("");
        setRole("admin");
      }
    } catch (err) {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="create-admin-page">
        <div className="create-admin-card">
          {/* تصویر سمت چپ */}
          <div className="create-admin-image">
            <img src={adminImage} alt="Admin" />
          </div>

          {/* فرم سمت راست */}
          <div className="create-admin-form-container">
            <h2>Create New Admin</h2>

            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}

            <form onSubmit={handleSubmit} className="create-admin-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="johndoe123"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as "admin" | "employee")}
                >
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Admin"}
              </button>
            </form>

            <button className="back-btn" onClick={() => navigate("/admin/")}>
              Back to home page
            </button>
          </div>
        </div>
      </div>
      <LoginFooter />
  </div>
  );
}
