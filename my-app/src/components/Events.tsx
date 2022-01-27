import React, { useState } from 'react';
import Event from './Event'

interface Events {
    title: string;
    organiser: string;
    users: string[];
    date: Date;
    time: string;
}

function Events(): JSX.Element {
    const [event, setEvent] = useState<string>("");
    const [events, setEvents] = useState<Events[]>([]);

    const [show, setShow] = useState(false);




    //Used later when trying to submit form
    const handleAddEvent = (e: React.FormEvent) => {
        // e.preventDefault;

        if(event) {
        }
    }

  return (
      <>
      <button onClick={() => setShow(true)}>Add an Event</button>
      <Event handleAddEvent={handleAddEvent} onClose={() => {setShow(false)}} show={show} />
      </>
  )
}

export default Events;
