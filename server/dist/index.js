"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_graphql_1 = require("express-graphql");
const schema_1 = require("./data/schema");
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Graphql is amazing!');
});
app.use((0, cors_1.default)());
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
    schema: schema_1.schema,
    graphiql: true,
}));
app.listen(8080, () => console.log('Running on server port localhost:8080/graphql'));
//# sourceMappingURL=index.js.map