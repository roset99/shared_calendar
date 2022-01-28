import React from 'react';
import { EventInterface } from './Interfaces';

interface Props {
    event: EventInterface;
    events: EventInterface[];
    setEvents: React.Dispatch<React.SetStateAction<EventInterface[]>>
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