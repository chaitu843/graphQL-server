let express = require(`express`),
    graphqlExpress = require(`express-graphql`),
    cors = require('cors');
    app = express();
    
let graphQLSchema = require(`./graphQL/schema`);

const PORT = '4000';

app.use(cors())
app. use('/graphql', graphqlExpress({
    schema: graphQLSchema,
    graphiql: true
}))

app.get('/', (req, res) => {
    res.send(`<h1>GraphQL Server</h1><br /><a href = '/graphql'> go to GraphiQL</a>`)
})

app.listen(PORT, (req, res) => console.log(`listening to ${PORT}`));