import { useState,  } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateAdmin() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "super_admin">("admin");

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
        "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/admins",
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
    <div style={styles.container}>
      <h2>Create New Admin</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="johndoe123"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value as "admin" | "super_admin")}
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating..." : "Create Admin"}
        </button>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </form>
      <button onClick={()=>{navigate("/admin/")}}> Back to home bage</button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "450px",
    margin: "40px auto",
    padding: "25px",
    borderRadius: "12px",
    background: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  button: {
    padding: "12px",
    background: "#007bff",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  success: {
    color: "green",
    marginTop: "10px",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: "10px",
    fontWeight: "bold",
  },
};
