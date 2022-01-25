import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = `
    type Person {
        id: ID
        name: String
        birthday: String
        events: [Event]
        colour: Colour
        family: Family
    }

    type Event {
        id: ID
        family: Family
        owner: Person
        attendees: [Person]
        date: String
        time: String
    }

    type Family {
        id: ID
        email: String
        password: String
        members: [Person]
    }

    enum Colour {
        ffadad
        ffd6a5
        fdffb6
        caffbf
        9bf6ff
        a0c4ff
        bdb2ff
        ffc6ff
    }

    type Query {
        getOneFamily(id: ID): Family
        getOnePerson(id: ID): Person
        getOneEvent(id: ID): Event
    }

    input PersonInput {
        id: ID
        name: String
        birthday: String
        events: [Event]
        colour: Colour
        family: Family
    }

    input FamilyInput {
        id: ID
        email: String
        password: String
        members: [Person]
    }
    
    input EventInput {
        id: ID
        family: Family
        owner: Person
        attendees: [Person]
        date: String
        time: String
    }

    type Mutation {
        createFamily(input: FamilyInput): Family
        updateFamily(input: FamilyInput): Family
        deleteFamily(id: ID!): String
        createPerson(input: PersonInput): Person
        updatePerson(input: PersonInput): Person
        deletePerson(id: ID!): String
        createEvent(input: EventInput): Event
        updateEvent(input: EventInput): Event
        deleteEvent(id: ID!): String
    }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };