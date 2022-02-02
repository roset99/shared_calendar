import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import { EventInputInterface } from './Interfaces';

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

    // passed down to be inserted into addEvent request
    family: any;
    members: any;

    // whether is being displayed from month or day page
    day: string;
    refreshEvents: () => void;
}

// || ==================== Component ==================== ||

// const AddEvent: any = ({ show, onClose, family, members, day, refreshEvents }: Props) => {
const AddEvent: any = ({ onClose, day, refreshEvents }: Props) => {
    
    const [title, setTitle] = useState<string>("");
    const [date, setDate] = useState<string>("");
    if (day) { setDate(day) };
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [attendees, setAttendees] = useState<[]>([]);

    const [createEvent, { data: createEventData, loading: createEventLoading, error: createEventError }] = useMutation(CREATE_EVENT);

    if (createEventLoading) return 'Submitting...';
    if (createEventError) return `Submission error! ${createEventError.message}`;

    //if(!show) { return null; }  returns null if popup is not to be shown

    // || ========== Functions ========== ||

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        const newEvent: EventInputInterface = {
            title: title,
            family: { id: "61f2dae90357581390862808" },
            attendees: [],
            date: date,
            startTime: startTime,
            endTime: endTime
        }

        createEvent({ 
            variables: {
                input: { 
                    title: newEvent.title,
                    family: newEvent.family,
                    attendees: newEvent.attendees,
                    date: newEvent.date,
                    startTime: newEvent.startTime,
                    endTime: newEvent.endTime
                }
            } 
        })
            .then(result => console.log(result))
            .then(() => refreshEvents())
    }

    // || ========== Render return ========== ||

    return (
        <form className="event" onSubmit={(e) => handleSubmit(e)} >
            <button type="button" onClick={onClose}>X</button>
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
                <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
            </>
            }

            <label htmlFor='startTime'>Start Time</label>
            <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

            <label htmlFor='endTime'>End Time</label>
            <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

            <button type="submit">Submit</button>
        </form>
    )
}

export default AddEvent;