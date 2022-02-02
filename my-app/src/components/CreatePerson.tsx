import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import './CreatePersonComponent.css';
import { Link, useNavigate } from 'react-router-dom';

const CREATE_PERSON = gql`
    mutation CreatePerson($input: PersonInput) {
        createPerson(input: $input){
            name
            birthday 
            events {
               id
            }
            colour
            family {
                id
            }
        }
    }
`;
const GET_FAMILY = gql`
    query {
       getAllFamilies {
           id
           email
            members {
               name 
               colour 
           }
            events {
                 id
             }
   }}
`;

function availableColours() {
    // compare each family.members.colour value to array of colours 
    // if in use, do not display in select colour  
    const colours: string[] = ["ffadad", "ffd6a5", "fdffb6", "caffbf", "a0c4ff", "bdb2ff", "ffc6ff"];
}


const CreatePerson: any = ({ }) => {
    const { data: getFamilyData, loading, error } = useQuery(GET_FAMILY);

    const redirect = useNavigate();

    const [name, setName] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [event, setEvent] = useState<[]>([]);
    const [colour, setColour] = useState<string>("");
    const [family, setFamily] = useState<[]>([]);
    const [createPerson, { data: createPersonData, loading: personLoading, error: personError }] = useMutation(CREATE_PERSON);


    const colours: string[] = ["ffadad", "ffd6a5", "fdffb6", "caffbf", "a0c4ff", "bdb2ff", "ffc6ff"];

    if (personLoading) return 'Submitting...';
    if (personError) return `Submission error! ${personError.message}`;
    if (loading) return 'loading...';
    if (error) return `Error: ${error.message}`;


    const addPerson = (e: React.FormEvent) => {
        e.preventDefault();

        createPerson({
            variables: {
                input: {
                    name: name,
                    birthday: birthday,
                    event: event,
                    colour: colour,
                    family: family
                }
            }
        })
        redirect("/month-calendar");
    }

    const handleName = (e: any) => {
        setName(e.target.value)
    }

    const handleBirthday = (e: any) => {
        setBirthday(e.target.value)
    }

    const handleEvents = (e: any) => {
        setEvent(e.target.value)
    }

    const handleColour = (e: any) => {
        setColour(e.target.value)
    }

    const handleFamily = (e: any) => {
        setFamily(e.target.value)
    }



    return (
        <section className="create-person-container">
            <div className="current-members">
                <h1>Current family members</h1>
                {/* map name and colour of existing members, if empty, return: no family members*/}
            </div>
            <form id="add-person" onSubmit={addPerson} className="form" >
                <h1>Add family member</h1>

                <label htmlFor="name">Name</label>
                <input type="text" id="name" className='person-input' onChange={handleName} />

                {/* <label htmlFor="family">Family</label>
                <select name="select-family" id="select-family" onChange={handleFamily} className="select-input">
                    <option value="" >Select family</option>
                    {getFamilyData.getAllFamilies.map((f: any) => (
                        <option key={f.id} value={f}>
                       {f.email}
                   </option>
               ))} 
                </select>  */}

                <label htmlFor="birthday">Birthday</label>
                <input type="date" id="birthday" className='person-input' onChange={handleBirthday} />


                <label htmlFor="colour">Choose colour</label>
                <select name="colour" id="colour" onChange={handleColour} className="select-input">
                    <option value="">Select colour</option>
                    {colours.map((c: any, i) => (
                        <option key={i}>{c}</option>
                    ))}
                </select>

                {/* 
               <label htmlFor="events">Events</label>
                <select id="events"  onChange={handleEvents} className="select-input">
                    <option value="">Select events</option>

                </select>  */}

               <button type="submit" className="submit-person" id="submit-btn" >Submit Person</button>
            </form >
                <Link to="/month-calendar" className="month-cal-link">Go to Monthly Calendar</Link>
        </section>
    )
}
export default CreatePerson;

