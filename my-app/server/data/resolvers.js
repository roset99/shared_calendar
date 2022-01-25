import { Families, People, Events } from './dbConnectors';

// resolver map
export const resolvers = { 
    Query: {
        getOneFamily: (root, { email }) => {
            return new Promise((resolve, object) => {
                Families.find({ email: email }, (err, family) => {
                    if (err) reject(err)
                    else resolve(family)
                })
            })
        },
        getOnePerson: (root, { id }) => {
            return new Promise((resolve, object) => {
                People.findById(id, (err, person) => {
                    if (err) reject(err)
                    else resolve(person)
                })
            })
        },
        getOneEvent: (root, { id }) => {
            return new Promise((resolve, object) => {
                Events.findById(id, (err, event) => {
                    if (err) reject(err)
                    else resolve(event)
                })
            })
        }
    },
    Mutation: {
        createPerson: (root, { input }) => {
            const newPerson = new People({
                name: input.name,
                birthday: input.birthday,
                events: input.events,
                colour: input.colour,
                family: input.family
            });

            newPerson.id = newPerson._id;

            return new Promise((resolve, object) => {
                newPerson.save((err) => {
                    if (err) reject(err)
                    else resolve(newPerson)
                })
            })
        },
        updatePerson: (root, { input}) => {
            return new Promise(( resolve, object) => {
                People.findOneAndUpdate({ _id: input.id }, input, { new: true }, (err, person) => {
                    if (err) reject(err)
                    else resolve(person)
                })
            })
        },
        deletePerson: (root, { id }) => {
            return new Promise(( resolve, object) => {
                People.remove({ _id: id }, (err) => {
                    if (err) reject(err)
                    else resolve('Successfully deleted person')
                })
            })
        },
        createEvent: (root, { input }) => {
            const newEvent = new Events({
                family: input.family,
                owner: input.owner,
                attendees: input.attendees,
                date: input.date,
                time: input.time
            });

            newEvent.id = newEvent._id;

            return new Promise((resolve, object) => {
                newEvent.save((err) => {
                    if (err) reject(err)
                    else resolve(newEvent)
                })
            })
        },
        updateEvent: (root, { input}) => {
            return new Promise(( resolve, object) => {
                Events.findOneAndUpdate({ _id: input.id }, input, { new: true }, (err, event) => {
                    if (err) reject(err)
                    else resolve(event)
                })
            })
        },
        deleteEvent: (root, { id }) => {
            return new Promise(( resolve, object) => {
                Events.remove({ _id: id }, (err) => {
                    if (err) reject(err)
                    else resolve('Successfully deleted event')
                })
            })
        },
        createFamily: (root, { input }) => {
            const newFamily = new Families({
                email: input.email,
                password: input.password,
                members: input.members
            });

            newEvent.id = newFamily._id;

            return new Promise((resolve, object) => {
                newFamily.save((err) => {
                    if (err) reject(err)
                    else resolve(newFamily)
                })
            })
        },
        updateFamily: (root, { input}) => {
            return new Promise(( resolve, object) => {
                Families.findOneAndUpdate({ _id: input.id }, input, { new: true }, (err, family) => {
                    if (err) reject(err)
                    else resolve(family)
                })
            })
        },
        deleteFamily: (root, { id }) => {
            return new Promise(( resolve, object) => {
                Families.remove({ _id: id }, (err) => {
                    if (err) reject(err)
                    else resolve('Successfully deleted family')
                })
            })
        }
    },
};