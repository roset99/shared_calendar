import { gql } from 'apollo-server';

// || ========== Schema/TypeDefs ========== ||

export const typeDefs = gql`
    type Family {
        id: ID
        name: String
        email: String
        password: String
        members: [Person]
        events: [Event]
    }

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
        title: String
        family: Family
        attendees: [Person]
        date: String
        startTime: String
        endTime: String
    }

    enum Colour {
        ffadad
        ffd6a5
        fdffb6
        caffbf
        a0c4ff
        bdb2ff
        ffc6ff
    }

    type Query {
        getAllFamilies: [Family]
        getOneFamily(email: String): Family
        getFamilyById: Family
        getAllPeople: [Person]
        getOnePerson(id: ID): Person
        getAllEvents: [Event]
        getOneEvent(id: ID): Event
        getEventsByFamily(family: FamilyInput): [Event]
    }

    input FamilyInput {
        id: ID
        name: String
        email: String
        password: String
        members: [PersonInput]
        events: [EventInput]
    }

    input UpdateFamilyInput {
        id: ID
        name: String
        email: String
        password: String
    }

    input PersonInput {
        id: ID
        name: String
        birthday: String
        events: [EventInput]
        colour: Colour
        family: FamilyInput
    }

    input UpdatePersonInput {
        id: ID
        name: String
        birthday: String
        colour: Colour
    }

    input EventInput {
        id: ID
        title: String
        family: FamilyInput
        attendees: [PersonInput]
        date: String
        startTime: String
        endTime: String
    }

    input UpdateEventInput {
        id: ID
        title: String
        attendees: [PersonInput]
        date: String
        startTime: String
        endTime: String
    }

    type Mutation {
        login(email: String, password: String): String
        register(input: FamilyInput): String
        updateFamily(input: UpdateFamilyInput): Family
        deleteFamily(id: ID!): String
        createPerson(input: PersonInput): Person
        updatePerson(input: UpdatePersonInput): Person
        deletePerson(id: ID!): String
        createEvent(input: EventInput): Event
        updateEvent(input: UpdateEventInput): Event
        deleteEvent(id: ID!): String
    }
`;
