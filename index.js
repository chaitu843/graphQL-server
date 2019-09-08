let express = require(`express`),
    graphqlExpress = require(`express-graphql`),
    app = express();

let graphQLSchema = require(`./graphQL/schema`);

const PORT = '3000';
app. use('/graphql', graphqlExpress({
    schema: graphQLSchema,
    graphiql: true
}))

app.get('/', (req, res) => {
    res.send(`<h1>GraphQL Server</h1>`)
})

app.listen(PORT, (req, res) => console.log(`listening to ${PORT}`));