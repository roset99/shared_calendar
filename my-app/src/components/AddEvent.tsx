import React from 'react';

interface Props {
    show: boolean;
    onClose: () => void;
    handleAddEvent: (e: React.FormEvent) => void;
    event: string;
    setEvent: React.Dispatch<React.SetStateAction<string>>;
}

const Event = ({show, onClose, handleAddEvent, event, setEvent}: Props) => {
    if(!show) {
        return null;
    }

    return(
        <form onSubmit={(e) => handleAddEvent(e)} className="event">
            <button type="button" onClick={onClose}>X</button>
        <h1>Add Event</h1>
        <p>This is a placeholder</p>
        <input type="text" value={event} onChange={e => {setEvent(e.target.value)}} />
        <button type="submit">Submit</button>
        </form>
    )
}

export default Event;