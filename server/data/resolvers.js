import { Families, People, Events } from './dbConnectors';

// resolver map
export const resolvers = { 
    Query: {
        getAllFamilies: () => {
            return Families.find({});
        },
        getOneFamily: (root, { email }) => {
            return Families.findOne({ email: email }, (err, family) => {
                if (err) reject(err) 
            });
        },
        getFamilyById: (root, { id }) => {
            return Families.findById(id, (err, family) => {
                if (err) reject(err)
            });
        },
        getAllPeople: () => {
            return People.find({});
        },
        getOnePerson: (root, { id }) => {
            return People.findById(id, (err, person) => {
                if (err) reject(err)
            })
        },
        getAllEvents: () => {
            return Events.find({});
        },
        getOneEvent: (root, { id }) => {
            return Events.findById(id, (err, event) => {
                if (err) reject(err)
            })    
        }
    },
    Mutation: {
        createPerson: async (root, { input }) => {
            const newPerson = new People({
                name: input.name,
                birthday: input.birthday,
                events: input.events,
                colour: input.colour,
                family: input.family.id
            });

            newPerson.id = newPerson._id;

            newPerson.save((err) => {
                if (err) reject(err)
            });

            const family = await Families.findById(newPerson.family)
            family.members.push(newPerson)

            Families.updateOne({ _id: family.id }, family, { new: true }, (err, family) => {
                if (err) reject(err)
            })

            newPerson.family = family
            return newPerson
        },
        updatePerson: (root, { input}) => {
            return  People.findOneAndUpdate({ _id: input.id }, input, { new: true }, (err, person) => {
                    if (err) reject(err)
            })
        },
        deletePerson: (root, { id }) => {
            People.remove({ _id: id }, (err) => {
                if (err) reject(err)
                else return ('Successfully deleted person')
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

            return newEvent.save((err) => {
                if (err) reject(err)
            })
        },
        updateEvent: (root, { input }) => {
            return Events.findOneAndUpdate({ _id: input.id }, input, { new: true }, (err, event) => {
                if (err) reject(err)
            })
        },
        deleteEvent: (root, { id }) => {
            Events.remove({ _id: id }, (err) => {
                if (err) reject(err)
                else return('Successfully deleted event')
            })
        },
        createFamily: (root, { input }) => {
            const newFamily = new Families({
                email: input.email,
                password: input.password,
                members: input.members
            });

            newFamily.id = newFamily._id;

            return newFamily.save((err) => {
                if (err) reject(err)
            })
        },
        updateFamily: (root, { input }) => {
            return Families.findOneAndUpdate({ _id: input.id }, input, { new: true }, (err, family) => {
                if (err) reject(err)  
            })
        },
        deleteFamily: (root, { id }) => {
            Families.remove({ _id: id }, (err) => {
                if (err) reject(err)
                else return('Successfully deleted family')
            })
        }
    },
};