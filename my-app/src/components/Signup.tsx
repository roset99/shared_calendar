
import e from 'express';
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';        

const CREATE_FAMILY = gql`
    mutation CreateFamily($input: FamilyInput) {
        createFamily(input: $input){
            email
            password
        }
    }
`;

function SignUp(): any {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [createFamily, { data, loading, error }] = useMutation(CREATE_FAMILY);

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;
    
    const doStuff = (e: React.FormEvent) => {
        e.preventDefault();

        createFamily({ 
            variables: {
                input: { 
                    email: email,
                    password: password
                }
            } 
        });
    }

    const handleEmail = (e: any) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e: any) => {
        setPassword(e.target.value);
    }

    return (  
        <>
            <form onSubmit={doStuff} className="signup">
                <h1>Sign up</h1>

                <label htmlFor="email">Email</label>
                <input value={email} id="email" type="text" onChange={handleEmail} />

                <label htmlFor="psw">Password</label>
                <input value={password} id="psw" type="password" onChange={handlePassword} />

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