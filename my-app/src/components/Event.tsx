import React from 'react';
import { EventsInterface } from './Interfaces';

interface Props {
    event: EventsInterface;
    events: EventsInterface[];
    setEvents: React.Dispatch<React.SetStateAction<EventsInterface[]>>
}

const Event: React.FC<Props> = ({event, events, setEvents}) => {
  return <form>
      {event.title}

    {/* {possible buttons} */}
      <section>
        <span className="">edit</span>
        <span className="">delete</span>
        <span className="">complete</span>
      </section>
    </form>;
};

export default Event;