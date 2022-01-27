
import React from 'react';

function SignUp(): JSX.Element {
        return (  
            <>
                <form className="signup">
                    <h1>Sign up</h1>
                    <p>Please fill out this form to create an account.</p>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" />

                    <label htmlFor="dob">Date of Birth</label>
                    <input id="dob" type="date" />

                    <label htmlFor="colour">Favourite Colour</label>
                    <select id="colour">
                        <option value="" disabled>Select a colour</option>
                        <option value="">1</option>
                        <option value="">2</option>
                        <option value="">3</option>
                        <option value="">4</option>
                    </select>

                    <label htmlFor="psw">Password</label>
                    <input id="psw" type="password" />

                    <label htmlFor="re-psw">Repeat Password</label>
                    <input id="re-psw" type="password" />

                    <button type="submit" className="signupbtn">Sign Up</button>
                </form>
            </>
        );
    }
 
export default SignUp;