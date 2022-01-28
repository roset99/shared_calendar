import React, { useState } from 'react';
import Event from './AddEvent'
import { EventsList } from './EventsList';
import { EventsInterface } from './Interfaces';


function Events(): JSX.Element {
    const [event, setEvent] = useState<string>("");
    const [events, setEvents] = useState<EventsInterface[]>([]);

    const [show, setShow] = useState(false);

    //Used later when trying to submit form
    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();

        if(event) {
            setEvents([...events,{title:event, isCompleted: false}]);
            setEvent("");
        }
    }

    console.log(events);

  return (
      <>
      <button onClick={() => setShow(true)}>Add an Event</button>
      <Event event={event} setEvent={setEvent} handleAddEvent={handleAddEvent} onClose={() => {setShow(false)}} show={show} />
      <EventsList events={events} setEvents={setEvents} />
      </>
  )
}

export default Events;
