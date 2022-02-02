
import e from 'express';
import React, { useState } from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';        
import bcrypt from 'bcryptjs';
import { useNavigate } from "react-router-dom"

const CREATE_FAMILY = gql`
    mutation CreateFamily($input: FamilyInput) {
        createFamily(input: $input){
            id
            email
            password
        }
    }
`;

function validateEmail (email: string) {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  }

function validatePassword (pwd: string) {
    const regexp = /^(?=.*\d)(?=.*[!@#$%^&*.])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regexp.test(pwd);
}

function SignUp({onLoginSetFamily}:any): any {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [hashed, setHashed] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [pwdError, setPwdError] = useState(false);
    const [errorPwdMsg, setErrorPwdMsg] = useState("");
    const [repwdError, setRepwdError] = useState(false)

    const [createFamily, {data, loading, error}] = useMutation(CREATE_FAMILY);


    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;
    
    let invalid = false;

    const doStuff = (e: React.FormEvent) => {
        e.preventDefault();

        console.log(email, validateEmail(email));
        console.log(password, validatePassword(password))

        if(email === "" || email === null) {
            setEmailError(true);
            setErrorMsg("Email field cannot be empty!")
            invalid = true;
            } 
        else if(!validateEmail(email)) {
            setEmailError(true);
            setErrorMsg("Email must be valid");
            invalid = true;
        }

        if(!validatePassword(password)) {
            setPwdError(true);
            setErrorPwdMsg("Password must contain: Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character")
            invalid = true;
        }

        if(password !== repassword) {
            setRepwdError(true);
            invalid = true;
        }

        if(invalid) {
            return
        }

        createFamily({ 
            variables: {
                input: { 
                    email: email,
                    password: hashed
                }
            } 
        });
        
        onLoginSetFamily({id: data.createFamily.id});
        navigate("/members");
    }

    //Generate salt to always be added to password
    const salt = bcrypt.genSaltSync(10);


    const handleEmail = (e: any) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e: any) => {
        setPassword(e.target.value);
        setHashed(bcrypt.hashSync(e.target.value, salt));
    }

    const handleRepassword = (e: any) => {
        setRepassword(e.target.value);
    }



    return (  
        <>
            <form onSubmit={doStuff} className="signup">
                <h1>Sign up</h1>

                <label htmlFor="email">Email</label>
                <input value={email} id="email" type="text" onChange={handleEmail} />
                <p className={emailError ? "" : "clear"}>{errorMsg}</p>

                <label htmlFor="psw">Password</label>
                <input value={password} id="psw" type="password" required onChange={handlePassword} />
                <p className={pwdError ? "" : "clear"}>{errorPwdMsg}</p>

                <label htmlFor="re-psw">Re-Enter Password</label>
                <input value={repassword} id="re-psw" type="password" required onChange={handleRepassword} />
                <p className={repwdError ? "" : "clear"}>Passwords must match</p>

                <button type="submit" className="signupbtn">Sign Up</button>
            </form>
        </>
    );
}
 
export default SignUp;


// const query = 
        // `mutation CreateFamily($input: FamilyInput) {
        //     createFamily(input: $input){
        //         id
        //         email
        //         password
        //     }
        // }`;

        // fetch('http://localhost:8080/graphql', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         query,
        //         variables: {
        //             input: {
        //                 email,
        //                 password
        //             }
        //         }
        //     })
        // })
        //     .then(r => r.json())
        //     .then(data =>  console.log(data));