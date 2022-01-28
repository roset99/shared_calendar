import React, { useState } from 'react';

import { EventInputInterface } from './Interfaces';

interface Props {
    // to do with opening and closing popup
    show: boolean;
    onClose: () => void;

    // to do with handling add event
    handleAddEvent: (e: React.FormEvent, newEvent: EventInputInterface) => void;
    event: string;
    setEvent: React.Dispatch<React.SetStateAction<string>>;

    // passed down to be inserted into addEvent request
    family: any
    members: any
}

const AddEvent: React.FC<Props> = ({show, onClose, handleAddEvent, event, setEvent, family, members}) => {
    
    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [attendees, setAttendees] = useState<[]>([]);

    if(!show) { return null; }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newEvent: EventInputInterface = {
            family: { id: "61f2dae90357581390862808" },
            attendees: [],
            date: date,
            time: time
        }

        handleAddEvent(e, newEvent);
    }

    return(
        <form className="event" onSubmit={(e) => handleSubmit(e)} >
            <button type="button" onClick={onClose}>X</button>
            <h1>Add Event</h1>
            
            <label htmlFor='date'>Date</label>
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />

            <label htmlFor='time'>Time</label>
            <input type="text" value={time} onChange={(e) => setTime(e.target.value)} />

            <button type="submit">Submit</button>
        </form>
    )
}

export default AddEvent;