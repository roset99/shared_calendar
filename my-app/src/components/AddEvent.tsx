import React, { useState } from 'react';

import { EventInputInterface } from './Interfaces';

// || ==================== Props Interface ==================== ||

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

// || ==================== Component ==================== ||

const AddEvent: React.FC<Props> = ({ show, onClose, handleAddEvent, event, setEvent, family, members }) => {
    
    const [title, setTitle] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [attendees, setAttendees] = useState<[]>([]);

    if(!show) { return null; } // returns null if popup is not to be shown

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

        handleAddEvent(e, newEvent);
    }

    // || ========== Render return ========== ||

    return (
        <form className="event" onSubmit={(e) => handleSubmit(e)} >
            <button type="button" onClick={onClose}>X</button>
            <h1>Add Event</h1>

            <label htmlFor='title'>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            
            <label htmlFor='date'>Date</label>
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />

            <label htmlFor='startTime'>Start Time</label>
            <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

            <label htmlFor='endTime'>End Time</label>
            <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

            <button type="submit">Submit</button>
        </form>
    )
}

export default AddEvent;