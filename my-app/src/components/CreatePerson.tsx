import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery} from '@apollo/client';
import './CreatePersonComponent.css';
import { Link, useNavigate } from 'react-router-dom';
import e from 'express';

const CREATE_PERSON = gql`
    mutation CreatePerson($input: PersonInput) {
        createPerson(input: $input){
            name
            birthday 
            colour
            family {
                id
            }
        }
    }
`;


/*
query to get family by id : name, email, password, members {} events {}
use currentFamily id 
list current family members (if any)
compare colours to colours already in use (if any) : members.colour? 
not actually doing anything with this data moving forward, just need to see the data in the component

once person is added: do a refetch to then see the updated family members list 
*/

    

const GET_FAMILY = gql`
        query GetFamilyById($id: ID){
            getFamilyById(id: $id){
                name
                email 
                members {
                    id
                    name
                    colour
                }
            }
        }
    `;

const CreatePerson: any = ({ currentFamily}: any) => {
    const redirect = useNavigate();

    const [name, setName] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [colour, setColour] = useState<string>("");
    const [members, setMembers] = useState<[]>([]);
    const [createPerson, { data: createPersonData, loading: personLoading, error: personError, }] = useMutation(CREATE_PERSON);
    // get person back using query? 

    const familyId: string = currentFamily.id;

    const {data: getFamilyData, loading, error, refetch} = useQuery(GET_FAMILY, {variables: {id: familyId}});

    const coloursObj: {}[] = [{value:"ffadad", text:"Red"}, {value:"ffd6a5", text:"Orange"}, {value: "fdffb6", text:"Yellow"}, {value: "caffbf", text:"Green"}, {value:"a0c4ff", text:"Blue"}, {value: "bdb2ff", text:"Purple"}, {value:"ffc6ff", text:"Pink"}];

    if (personLoading) return 'Submitting...';
    if (personError) return `Submission error! ${personError.message}`;

 console.log("current family id", currentFamily.id)
 console.log(typeof currentFamily.id)

 const addedMembers: {}[] = [];

 //const family = getFamilyData;

    console.log(getFamilyData); // an object 

 
 const addPerson = (e: React.FormEvent) => {
     // e.preventDefault();
     
     createPerson({
         variables: {
             input: {
                 name: name,
                 birthday: birthday,
                 colour: colour,
                 family: currentFamily
                }
            }
        })
        //.then(refetch);

      //  console.log(getFamilyData)
        
        // .then(response => response.json())
        // return person;
        // addedMembers.push(person);
        // console.log(addedMembers)
        // console.log(typeof person) 
        //redirect("/month-calendar");
     //   console.log(createPersonData);
        // seeMembers();
    }

    // const addMembers = () => {
    //     addedMembers.push(person)
    // }

    // const seeMembers = () => {
    //     refetch();
    // }

    const handleName = (e: any) => {
        setName(e.target.value)
    }

    const handleBirthday = (e: any) => {
        setBirthday(e.target.value)
    }

    const handleColour = (e: any) => {
        setColour(e.target.value)
        console.log("colour is", colour)
    }

    return (
        <section className="create-person-container">
                <h1 className="add-person-title">Add family member</h1>
            <form id="add-person" onSubmit={addPerson} className="form" >
                <label htmlFor="name">Name</label>
                <input type="text" id="name" className='person-input' onChange={handleName} />

                <label htmlFor="birthday">Birthday</label>
                <input type="date" id="birthday" className='person-input' onChange={handleBirthday} />

                <label htmlFor="colour">Choose colour</label>
                <select name="colour" id="colour" onChange={handleColour} className="select-input">
                    <option value="">Select colour</option>
                    {coloursObj.map(({value, text}: any) => (
                        <option key={value} value={value}>{text}</option>
                    ))}
                </select>
               <button type="submit" className="submit-person-btn" id="submit-btn" >Submit Person</button>
            </form >
            <div className="members-div">
                <h4>Family members:</h4>
                <h5>existing members</h5>
                <ul></ul>
                {/* {getFamilyData.getFamilyById.members.map((m: any, i: any) => (
                    <li key={m.id}>{m.name}</li>
                ))} */}
                {/* {getFamilyData.map(({key, text}: any) => (
                    <li key={key}>{text}</li>
                ))} */}
                <h5>new members</h5>
                <ul>
                    <li>hi</li>
                    {addedMembers.map((p: any, i) => (
                        <li key={i}>{p.name}</li>
                    ))}
                </ul>
            </div>
                <Link to="/month-calendar" className="month-cal-link">Go to Monthly Calendar</Link>
        </section>
    )
}
export default CreatePerson;

