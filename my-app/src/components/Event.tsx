import React from 'react';

interface Props {
    show: boolean;
    onClose: () => void;
    handleAddEvent: (e: React.FormEvent) => void;
}

const Event = ({show, onClose, handleAddEvent}: Props) => {
    if(!show) {
        return null;
    }

    return(
        <form onSubmit={(e) => handleAddEvent(e)} className="event">
            <button onClick={onClose}>X</button>
        <h1>Add Event</h1>
        <p>This is a placeholder</p>
        <input type="text" />
        <button type="submit">Submit</button>
        </form>
    )
}

export default Event;