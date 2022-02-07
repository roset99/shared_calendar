import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
// import bcrypt from "bcryptjs"
import { gql, useMutation } from '@apollo/client';        

interface Props {
    onLoginSetFamily: any,
}

const LOGIN = gql`
    mutation Login($email: String, $password: String) {
        login(email: $email, password: $password) 
    }
`;

function Login({onLoginSetFamily}: Props): any {

    const navigate = useNavigate();
    const [login, {data, loading, error}] = useMutation(LOGIN);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hashed, setHashed] = useState("");

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

    const handleForm = async (e: React.FormEvent) => {
        e.preventDefault();

        await login({
            variables: {
                    email: email,
                    password: password
            }
        }).then(
            (result) => 
            onLoginSetFamily(result.data.login));

        navigate("/month-calendar");
    }

    const handleEmail = (e: any) => {
        setEmail(e.target.value);
    }
    
    const handlePassword = async (e: any) => {
        setPassword(e.target.value);
        // setHashed(await bcrypt.hash(e.target.value, 12));
    }

    const handleLogout = () => {
        sessionStorage.clear()
        // sessionStorage.removeItem("currentFamily")
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