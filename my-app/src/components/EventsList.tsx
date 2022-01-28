import React from 'react';
import {EventsInterface} from './Interfaces';
import Event from './Event';

interface Props {
    events: EventsInterface[];
    setEvents: any;
}

export const EventsList: React.FC<Props> = ({events, setEvents}) => {
  return <div>
        {events.map((e) => (
            <Event event={e}
            events={events}
            setEvents={setEvents}
            />
        ))}
  </div>;
};
