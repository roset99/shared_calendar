import React from 'react';
import { EventInterface } from './Interfaces';
import Event from './Event';

interface Props {
    events: EventInterface[];
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
