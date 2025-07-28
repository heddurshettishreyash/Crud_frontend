import { useState } from "react";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import axios from "axios";

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const action = isRegistering ? "register" : "login";
      const url = `https://crud-backend-lfj2.onrender.com/${action}`;

      const response = await axios.post(url, {
        username: email,
        password: password,
      });

      if (response.status === 200) {
        if (isRegistering) {
          setMessage("Registration successful! Please log in.");
          setTimeout(() => setMessage(""), 5000);
          setIsRegistering(false);
        } else {
          onLogin(); // Call the onLogin function passed as a prop to update app state
        }
      } else {
        setMessage(
          isRegistering
            ? "Registration failed."
            : "Invalid username or password."
        );
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <MDBContainer className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="p-4 shadow-sm rounded"
        style={{ width: "300px", backgroundColor: "#fff" }}
      >
        <h3 className="text-center mb-3">
          {isRegistering ? "Register" : "Login"}
        </h3>
        <form onSubmit={handleSubmit}>
          <MDBInput
            wrapperClass="mb-4"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {message && (
            <p
              className="text-center"
              style={{
                color: message.includes("successful") ? "green" : "red",
              }}
            >
              {message}
            </p>
          )}
          <MDBBtn
            block
            type="submit"
            style={{
              maxHeight: "50px",
            }}
          >
            {isRegistering ? "Register" : "Sign In"}
          </MDBBtn>
        </form>
        <p className="text-center mt-3">
          {isRegistering ? (
            <>
              Already a member?{" "}
              <a href="#!" onClick={() => setIsRegistering(false)}>
                Login
              </a>
            </>
          ) : (
            <>
              Not a member?{" "}
              <a href="#!" onClick={() => setIsRegistering(true)}>
                Register
              </a>
            </>
          )}
        </p>
      </div>
    </MDBContainer>
  );
}

export default LoginPage;
