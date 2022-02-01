"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_tools_1 = require("graphql-tools");
const resolvers_1 = require("./resolvers");
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
        title: String
        family: Family
        attendees: [Person]
        date: String
        startTime: String
        endTime: String
    }

    type Family {
        id: ID
        familyName: String
        email: String
        password: String
        members: [Person]
        events: [Event]
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
        getAllEvents: [Event]
        getAllPeople: [Person]
        getOneFamily(email: String): Family
        getOnePerson(id: ID): Person
        getOneEvent(id: ID): Event
        getEventsByFamily(family: FamilyInput): [Event]
        getFamilyById(id: ID): Family
    }

    input PersonInput {
        id: ID
        name: String
        birthday: String
        events: [EventInput]
        colour: Colour
        family: FamilyInput
    }

    input FamilyInput {
        id: ID
        familyName: String
        email: String
        password: String
        members: [PersonInput]
        events: [EventInput]
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
        date: String
        startTime: String
        endTime: String
    }

    type Mutation {
        createFamily(input: FamilyInput): Family
        updateFamily(input: FamilyInput): Family
        deleteFamily(id: ID!): String
        createPerson(input: PersonInput): Person
        updatePerson(input: PersonInput): Person
        deletePerson(id: ID!): String
        createEvent(input: EventInput): Event
        updateEvent(input: UpdateEventInput): Event
        deleteEvent(id: ID!): String
    }
`;
const schema = (0, graphql_tools_1.makeExecutableSchema)({ typeDefs, resolvers: resolvers_1.resolvers });
exports.schema = schema;
//# sourceMappingURL=schema.js.map