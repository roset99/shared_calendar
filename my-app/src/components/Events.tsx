// this component is currently not to be used

import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import AddEvent from './AddEvent'
import { EventsList } from './EventsList';
import { EventInputInterface, EventInterface } from './Interfaces';

// || ==================== GraphQL Queries/Mutations ==================== ||

const CREATE_EVENT = gql`
    mutation CreateEvent($input: EventInput) {
        createEvent(input: $input) {
            id
        }
    }
`;

// || ==================== Component ==================== ||

const Events: any = () => {

    const [event, setEvent] = useState<string>("");
    const [events, setEvents] = useState<EventInterface[]>([]);

    const [show, setShow] = useState(false);

    const [createEvent, { data: createEventData, loading: createEventLoading, error: createEventError }] = useMutation(CREATE_EVENT);

    if (createEventLoading) return 'Submitting...';
    if (createEventError) return `Submission error! ${createEventError.message}`;

    // || ========== Functions ========== ||

    //Used later when trying to submit form
    const handleAddEvent = (e: React.FormEvent, newEvent: EventInputInterface): void => {
        e.preventDefault();

        // if(event) {
        //     setEvents([...events,{title:event, isCompleted: false}]);
        //     setEvent("");
        // }

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
    }

    // || ========== Render return ========== ||

    return (
      <>
        <button onClick={() => setShow(true)}>Add an Event</button>
        {/* <AddEvent event={event} setEvent={setEvent} handleAddEvent={handleAddEvent} onClose={() => {setShow(false)}} show={show} family={{}} members={[]}/> */}
        <EventsList events={events} setEvents={setEvents} />
      </>
    )
}

export default Events;
