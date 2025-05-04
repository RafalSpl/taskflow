import { useState } from "react";
import axios from "axios";

import './LoginForm.scss';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
       e.preventDefault();
         try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
            const token = response.data.token;
            localStorage.setItem('token', token);
            alert("Login successful!");
         } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data?.message || "An error occurred");
            } else {
                setError("An error occurred");
            }
         }
    }

    return (
        <form className="login-form" onSubmit={handleLogin}>
            <h2>Logowanie</h2>
            {error && <p className="error">{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <button type="submit">Zaloguj</button>
        </form>
    )
}

export default LoginForm;