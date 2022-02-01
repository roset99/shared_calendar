import React from 'react';
import { Link } from 'react-router-dom'

function Login():JSX.Element {
    return(
        <>
                <form className="login">
                    <h1 className="login-title">Login</h1>
                    <label htmlFor="name" className="login-input-label">Name</label>
                    <input id="name" type="text" className="text-input" />

                    <label htmlFor="psw" className="login-input-label">Password</label>
                    <input id="psw" type="password" className="text-input"/>

                    <div className="remember-div">
                    <label htmlFor="remember-me">Remember me</label>
                    <input type="checkbox" />
                    </div>
                    <button type="submit" className="loginbtn">Login</button>

                    <p>Need an account?</p>
                    <Link to="/signup" className="signup-link">Sign up here</Link>
                </form>
        </>
    );
}

export default Login;