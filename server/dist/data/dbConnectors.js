"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = exports.People = exports.Families = void 0;
const mongoose_1 = require("mongoose");
// || ========== Mongo connection ========== ||
// -- old connection
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/calendar', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
// -- new connection
main().catch(err => console.log(err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, mongoose_1.connect)('mongodb://localhost/calendar', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });
}
const familySchema = new mongoose_1.Schema({
    familyName: { type: String },
    email: { type: String },
    password: { type: String },
    members: [{ type: mongoose_1.Types.ObjectId, ref: 'people' }],
    events: [{ type: mongoose_1.Types.ObjectId, ref: 'events' }]
});
const personSchema = new mongoose_1.Schema({
    name: { type: String },
    birthday: { type: String },
    events: [{ type: mongoose_1.Types.ObjectId, ref: 'events' }],
    colour: { type: String },
    family: { type: mongoose_1.Types.ObjectId, ref: 'families' }
});
const eventSchema = new mongoose_1.Schema({
    title: { type: String },
    family: { type: mongoose_1.Types.ObjectId, ref: 'families' },
    attendees: [{ type: mongoose_1.Types.ObjectId, ref: 'people' }],
    date: { type: String },
    startTime: { type: String },
    endTime: { type: String }
});
// || ========== Models ========== ||
const Families = (0, mongoose_1.model)('families', familySchema);
exports.Families = Families;
const People = (0, mongoose_1.model)('people', personSchema);
exports.People = People;
const Events = (0, mongoose_1.model)('events', eventSchema);
exports.Events = Events;
//# sourceMappingURL=dbConnectors.js.map