import React, {useEffect, useState} from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';   

// need to access: events, colour, family 
// family passed down? query for family ! inc. people already in family & their colours 
// signup family -> add family member(person)
// login family -> see members / add family member 
//function -> look at people colour chosen vs list 

const CREATE_PERSON = gql`
    mutation CreatePerson($input: PersonInput) {
        createPerson(input: $input){
            name
            birthday 
            events
            colour
            family
        }
    }
`;
//mutation line: define arguments to be received & data type 
// different for events, family 
// colour is enum in schema 

const GET_FAMILY = gql`
    query {
        getAllFamilies {
        family {
            id
            email
            members {
                name 
                colour 
            }
            events {

            }
        }
    }}
`;

function getFamily() {
    const {loading, error, data} = useQuery(GET_FAMILY);
    if (loading) return 'loading...';
    if (error) return `Error: ${error.message}`;

   // const [familyData, setFamilyData] = useState("");

    // useEffect(() => {
    //     if (data){
    //    setFamilyData(data.getAllFamiliies);
    //     }
    // }, [data]);

    return (
    //    <select name="family">
    //        {data.family.map((f: any) => (
    //            <option key={f.id} value={f.email}>
    //                {f.email}
    //            </option>
    //        ))}
    //    </select>
    <></>
    );
}

// interface for family data? look up typescript


function availableColours() {
 // compare each family.members.colour value to array of colours 
 // if in use, do not display in select colour  
 const colours: string[] = ["ffadad", "ffd6a5", "fdffb6", "caffbf", "a0c4ff", "bdb2ff", "ffc6ff"];   
}

const CreatePersonComponent = () => {

    const [name, setName] = useState("");
    // const [name, setName] = useState<string>(""); <- included data type
    const [birthday, setBirthday] = useState("");
    const [event, setEvent] = useState("");
    const [colour, setColour] = useState("");
    const [family, setFamily] = useState("");
    

    const [createPerson, { data, loading, error }] = useMutation(CREATE_PERSON);

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

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
        <>
            <form id="add-person" onSubmit={addPerson} >
                <h1>Add family member</h1>

                <label htmlFor="name">Name</label>
                <input type="text" id="name" className='person-input' onChange={handleName}/>

                <label htmlFor="birthday">Birthday</label>
                <input type="date" id="birthday" className='person-input' onChange={handleBirthday}/>

                <label htmlFor="events">Events</label>
                <input type="text" id="events" className='person-input' onChange={handleEvents} />

                <label htmlFor="colour">Choose colour</label>
                <select name="colour" id="colour" onChange={handleColour}>
                    <option value="" disabled >Select colour</option>
                    <option value=""></option>
                </select>

                <label htmlFor="family">Family</label>
                <select name="select-family" id="select-family" onChange={handleFamily} >
                    <option value="" disabled >Select family</option>
                    <option value=""></option>
                </select>

                <button type="submit" className="submit-person" id="submit-btn" >Submit Person</button>
            </form >
        </>
    )
}
export default CreatePersonComponent;

// make family required 