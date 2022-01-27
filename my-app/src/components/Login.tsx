import React from 'react';
import { Link } from 'react-router-dom'

function Login():JSX.Element {
    return(
        <>
                <form className="login">
                    <h1>Login</h1>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" />

                    <label htmlFor="psw">Password</label>
                    <input id="psw" type="password" />

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