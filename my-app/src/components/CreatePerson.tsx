import React, {useEffect, useState} from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';   
import { Link } from 'react-router-dom';
//import GetFamily from './GetFamily';

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


const CreatePerson: any = ({}) => {
    const {data: getFamilyData, loading, error} = useQuery(GET_FAMILY);
    console.log(getFamilyData);
    
    const [name, setName] = useState("");
    // const [name, setName] = useState<string>(""); <- included data type
    const [birthday, setBirthday] = useState("");
    const [event, setEvent] = useState("");
    const [colour, setColour] = useState("");
    const [family, setFamily] = useState("");
    const [createPerson, { data: createPersonData, loading: personLoading, error: personError }] = useMutation(CREATE_PERSON);
   const [familyData, setFamilyData] = useState([]);
    
    useEffect(() => {
        if(getFamilyData){
        setFamilyData(getFamilyData.getAllFamilies);
        }
    }, []);

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
                    <option value="">Select colour</option>
                    {colours.map((c: any, i) => (
                  <option key={i}>{c}</option>
              )) }
                </select>

                <label htmlFor="family">Family</label>
                <select name="select-family" id="select-family" onChange={handleFamily} >
                    <option value="" disabled >Select family</option>
                    {getFamilyData.getAllFamilies.map((f: any) => (
                   <option key={f.id} value={f.email}>
                       {f.email}
                   </option>
               ))} 
                </select> 

                <button type="submit" className="submit-person" id="submit-btn" >Submit Person</button>
            </form >
           
            <div>
          
            </div>
          <Link to="/family">get family</Link>
   </>
    )
}
export default CreatePerson;

// make family required 