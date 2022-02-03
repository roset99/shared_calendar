import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import bcrypt from "bcryptjs"
import e from 'express';

interface Props {
    onLoginSetFamily: any,
}

const salt = bcrypt.genSaltSync(10);

function Login({onLoginSetFamily}: Props) {
    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hashed, setHashed] = useState("");

    const handleForm = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/month-calendar");
    }

    const handleEmail = (e: any) => {
        setEmail(e.target.value);
    }
    
    const handlePassword = (e: any) => {
        setPassword(e.target.value);
        setHashed(bcrypt.hashSync(e.target.value, salt));
    }

    const handleLogout = () => {
        sessionStorage.removeItem("currentFamily")
        // sessionStorage.setItem();
        navigate("/")
    }

    return(
        <>
                <form className="login" onSubmit={handleForm}>
                    <h1>Login</h1>
                    <label htmlFor="name" className="login-input-label">Name</label>
                    <input id="name" type="text" value={email} onChange={handleEmail} />

                    <label htmlFor="psw" className="login-input-label">Password</label>
                    <input id="psw" type="password" value={password} onChange={handlePassword} />
                    <div className="remember-div">
                    <label htmlFor="remember-me">Remember me</label>
                    <input type="checkbox" />
                    </div>
                    <button type="submit" className="loginbtn">Login</button>
                    <p>Need an account?</p>
                    <Link to="/signup" className="signup-link">Sign up here</Link>
                </form>
                    <button onClick={handleLogout}>Logout</button>
        </>
    );
}

export default Login;