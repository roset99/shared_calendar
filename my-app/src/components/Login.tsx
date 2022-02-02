import React from 'react';
import { Link } from 'react-router-dom'
import { useState } from 'react';
import bcrypt from "bcryptjs"


const salt = bcrypt.genSaltSync(10);



function Login():JSX.Element {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hashed, setHashed] = useState("");

    const handleForm = (e: React.FormEvent) => {
        e.preventDefault();
        
    }

    const handleEmail = (e: any) => {
        setEmail(e.target.value);
    }
    
    const handlePassword = (e: any) => {
        setPassword(e.target.value);
        setHashed(bcrypt.hashSync(e.target.value, salt));
    }

    return(
        <>
                <form className="login" onSubmit={handleForm}>
                    <h1>Login</h1>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" value={email} onChange={handleEmail} />

                    <label htmlFor="psw">Password</label>
                    <input id="psw" type="password" value={password} onChange={handlePassword} />

                    <label htmlFor="remember-me">Remember me</label>
                    <input type="checkbox" />

                    <button type="submit" className="loginbtn">Login</button>

                    <p>Need an account?</p>
                    <Link to="/signup">Sign up here</Link>
                </form>
        </>
    );
}

export default Login;