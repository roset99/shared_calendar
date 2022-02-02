import React, { useState } from 'react';
import { gql, useMutation} from '@apollo/client';
import './CreatePersonComponent.css';
import { Link, useNavigate } from 'react-router-dom';

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

const CreatePerson: any = ({ currentFamily}: any) => {
    
    const redirect = useNavigate();

    const [name, setName] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [colour, setColour] = useState<string>("");
    const [createPerson, { data: createPersonData, loading: personLoading, error: personError }] = useMutation(CREATE_PERSON);

    const colours: string[] = ["ffadad", "ffd6a5", "fdffb6", "caffbf", "a0c4ff", "bdb2ff", "ffc6ff"];

    if (personLoading) return 'Submitting...';
    if (personError) return `Submission error! ${personError.message}`;
  
    const addPerson = (e: React.FormEvent) => {
        e.preventDefault();
    
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
        redirect("/month-calendar");
    }

    const handleName = (e: any) => {
        setName(e.target.value)
    }

    const handleBirthday = (e: any) => {
        setBirthday(e.target.value)
    }

    const handleColour = (e: any) => {
        setColour(e.target.value)
    }

    return (
        <section className="create-person-container">
            <form id="add-person" onSubmit={addPerson} className="form" >
                <h1>Add family member</h1>

                <label htmlFor="name">Name</label>
                <input type="text" id="name" className='person-input' onChange={handleName} />

                <label htmlFor="birthday">Birthday</label>
                <input type="date" id="birthday" className='person-input' onChange={handleBirthday} />

                <label htmlFor="colour">Choose colour</label>
                <select name="colour" id="colour" onChange={handleColour} className="select-input">
                    <option value="">Select colour</option>
                    {colours.map((c: any, i) => (
                        <option key={i}>{c}</option>
                    ))}
                </select>
               <button type="submit" className="submit-person-btn" id="submit-btn" >Submit Person</button>
            </form >
                <Link to="/month-calendar" className="month-cal-link">Go to Monthly Calendar</Link>
        </section>
    )
}
export default CreatePerson;

