import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import { EventInputInterface } from './Interfaces';
import { AnyARecord } from 'dns';


// || ==================== GraphQL Queries/Mutations ==================== ||

const CREATE_EVENT = gql`
    mutation CreateEvent($input: EventInput) {
        createEvent(input: $input) {
            id
        }
    }
`;

// || ==================== Props Interface  ==================== ||

interface Props {
    // to do with opening and closing popup
    show: boolean;
    onClose: () => void;
    onClickShowForm: () => void;
    // passed down to be inserted into addEvent request
    members: any;
    currentFamily: any;
    familyMembers: any

    // whether is being displayed from month or day page
    day: string;
    refreshEvents: () => void;
    
}

// || ==================== Component ==================== ||

// const AddEvent: any = ({ show, onClose, family, members, day, refreshEvents }: Props) => {
const AddEvent: any = ({ onClose, day, refreshEvents, currentFamily, familyMembers, onClickShowForm }: Props) => {
    
    const [title, setTitle] = useState<string>("");
    const [date, setDate] = useState<string>("");
    if (day) { setDate(day) };
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [attendees, setAttendees] = useState<any>([]);

    const [createEvent, { data: createEventData, loading: createEventLoading, error: createEventError }] = useMutation(CREATE_EVENT);

    if (createEventLoading) return 'Submitting...';
    if (createEventError) return `Submission error! ${createEventError.message}`;

    //if(!show) { return null; }  returns null if popup is not to be shown

    // || ========== Functions ========== ||

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        const attendeesMod = [];
        for (let attendee of attendees){
            attendeesMod.push({id: attendee});
        }
        console.log("This is attendeesMod ", attendeesMod);
        const dateArray = date.split("-");
        const dateFormat = dateArray[2] +"/" +dateArray[1] + "/" + dateArray[0];

        const newEvent: EventInputInterface = {
            title: title,
            // family: currentFamily,
            attendees: attendeesMod,

            date: dateFormat,
            startTime: startTime,
            endTime: endTime
        }

        createEvent({ 
            variables: {
                input: { 
                    title: newEvent.title,
                    // family: newEvent.family,
                    attendees: newEvent.attendees,
                    date: newEvent.date,
                    startTime: newEvent.startTime,
                    endTime: newEvent.endTime
                }
            } 
        })
            .then(result => console.log(result))
            .then(() => refreshEvents())
            .then(() => {
                setDate("");
                setAttendees([]);
                setStartTime("");
                setEndTime("");
                setTitle("");
            })
            // .then(() =>onClickShowForm());
    }
   
    const memberDropdown = familyMembers.map((member: any) => {
        return(
            <>
                <input type="checkbox" id={member.name} name={member.name} value={member.id} onClick={(e) => handleOnChange(e)}></input>
                <label htmlFor={member.name}>{member.name}</label>
            </>
            
        )
        
       
    });
    const handleOnChange = (e:any) => {
        if (attendees.includes(e.target.value)){
            let filtered = attendees.filter((value:string) => {
                return value !==e.target.value;
            })
            setAttendees(filtered);
            console.log(filtered);
        } else {
            setAttendees([e.target.value,...attendees]);
        }
    } 


    // || ========== Render return ========== ||

    return (
        <div className= "event">
        <form className="event-form" onSubmit={(e) => handleSubmit(e)} >
            <button type="button" className="close-button" onClick={onClose}>X</button>
            <h1>Add Event</h1>

            <label htmlFor='title'>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            { day ?
            <>
                <p>Date: {day}</p>
            </>
            :
            <>
                <label htmlFor='date'>Date</label>
                <input type="date" value={date} onChange={(e) => {setDate(e.target.value)}} />
            </>
            }

            <label htmlFor='startTime'>Start Time</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

            <label htmlFor='endTime'>End Time</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

            <label htmlFor="attendees">Choose attendees</label>
            <div className="attendees">
                {memberDropdown}
            </div>
            


            <button type="submit">Submit</button>
        </form>
        </div>
    )
}

export default AddEvent;