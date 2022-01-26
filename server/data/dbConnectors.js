import mongoose, { mongo } from 'mongoose';

//Mongo connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/calendar', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const familySchema = new mongoose.Schema({
    email: { type: String },
    password: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'people' }]
});

const personSchema = new mongoose.Schema({
    name: { type: String },
    birthday: { type: String },
    events: { type: Array },
    colour: { type: String },
    family: { type: mongoose.Schema.Types.ObjectId, ref: 'families' }
});

const eventSchema = new mongoose.Schema({
    family: { type: String },
    owner: {type: String },
    attendees: {type: Array },
    date: {type: String},
    time: {type: String}
});

const Families = mongoose.model('families', familySchema);
const People = mongoose.model('people', personSchema);
const Events = mongoose.model('events', eventSchema);

export { Families, People, Events };