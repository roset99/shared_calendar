import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import AddEvent from './AddEvent'
import { EventsList } from './EventsList';
import { EventInputInterface, EventInterface } from './Interfaces';

const CREATE_EVENT = gql`
    mutation CreateEvent($input: EventInput) {
        createEvent(input: $input) {
            id
        }
    }
`;

const Events: any = () => {
    const [event, setEvent] = useState<string>("");
    const [events, setEvents] = useState<EventInterface[]>([]);

    const [show, setShow] = useState(false);

    const [createEvent, { data, loading, error }] = useMutation(CREATE_EVENT);

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

    //Used later when trying to submit form
    const handleAddEvent = (e: React.FormEvent, newEvent: EventInputInterface) => {
        e.preventDefault();

        // if(event) {
        //     setEvents([...events,{title:event, isCompleted: false}]);
        //     setEvent("");
        // }

        createEvent({ 
          variables: {
              input: { 
                  family: newEvent.family,
                  attendees: newEvent.attendees,
                  date: newEvent.date,
                  time: newEvent.time
              }
          } 
      }).then(result => console.log(result))
    }

    return (
      <>
        <button onClick={() => setShow(true)}>Add an Event</button>
        <AddEvent event={event} setEvent={setEvent} handleAddEvent={handleAddEvent} onClose={() => {setShow(false)}} show={show} family={{}} members={[]}/>
        <EventsList events={events} setEvents={setEvents} />
      </>
    )
}

export default Events;
