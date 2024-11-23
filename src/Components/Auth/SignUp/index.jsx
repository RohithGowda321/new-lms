import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../Services/Firebase";
import { setDoc, doc } from "firebase/firestore"; // Firebase Firestore functions
import "./Styles.scss";
import Loader from "../../../Components/Loaders";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import GoogleIcon from "@mui/icons-material/Google";
import { Person } from "@mui/icons-material";

const Signup = ({ setLoading }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [error, setError] = useState(null);
  const [role, setRole] = useState(""); // to store selected role (Driver/Admin)
  const [roleError, setRoleError] = useState(""); // to store error if no role selected
  const [passwordError, setPasswordError] = useState(""); // to store password mismatch error
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRoleError(""); // Reset role error
    setPasswordError(""); // Reset password mismatch error

    // Validate that the role is selected
    if (!role) {
      setRoleError("Please select either Driver or Admin.");
      setLoading(false);
      return;
    }

    // Validate that passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Register the user using Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Store additional user data in Firestore
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role,
        // Add any additional fields here
      });

      // Redirect to dashboard after successful sign-up
      navigate("/dashboard");
    } catch (err) {
      setError("Error creating account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="signup-form">
      <div className="form-header">
        <h2>SIGNUP</h2>
        <div className="role-selection">
          <label className="role-label">Role:</label>
          <div className="role-options">
            <div className="radio-option">
              <input
                type="radio"
                id="driver"
                name="role"
                value="driver"
                checked={role === "driver"}
                onChange={() => setRole("driver")}
              />
              <label htmlFor="driver">Driver</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="admin"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={() => setRole("admin")}
              />
              <label htmlFor="admin">Admin</label>
            </div>
          </div>
        </div>
      </div>
      {roleError && <div className="role-error">{roleError}</div>}
      <div className="flex-column">
        <label>Name</label>
      </div>
      <div className="inputForm">
        <Person style={{ color: "#9e9e9e" }} />
        <input
          type="text"
          className="input"
          placeholder="Enter your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex-column">
        <label>Email</label>
      </div>
      <div className="inputForm">
        <EmailIcon style={{ color: "#9e9e9e" }} />
        <input
          type="email"
          className="input"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex-column">
        <label>Password</label>
      </div>
      <div className="inputForm">
        <LockIcon style={{ color: "#9e9e9e" }} />
        <input
          type="password"
          className="input"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex-column">
        <label>Confirm Password</label>
      </div>
      <div className="inputForm">
        <LockIcon style={{ color: "#9e9e9e" }} />
        <input
          type="password"
          className="input"
          placeholder="Confirm your Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {passwordError && <div className="password-error">{passwordError}</div>} {/* Password error message */}

      <div className="flex-row">
        <span className="span">Forgot password?</span>
      </div>
      {error && <p className="error-message">{error}</p>}
      <button className="button-submit" onClick={handleSubmit}>
        Sign Up
      </button>
      <p className="p">
        Already have an account?{" "}
        <span
          className="span"
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/")}
        >
          Login
        </span>
      </p>

      <div className="flex-row">
        <button className="btn google">
          <GoogleIcon />
          Google
        </button>
      </div>
    </form>
  );
};

export default Loader(Signup);
