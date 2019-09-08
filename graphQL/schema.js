const graphql = require('graphql'),
      {GraphQLObjectType, GraphQLSchema, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLID, GraphQLList} = graphql;

let firebase = require('../firebase.config'),
    firestore = firebase.firestore(),
    booksReference = firestore.collection('books'),
    authorsReference = firestore.collection('authors');

const books = [
                {id: '1', name: 'Book One', genre: 'genre One', authorId: '1'},
                {id: '2', name: 'Book Two', genre: 'genre Two', authorId: '2'},
                {id: '3', name: 'Book Three', genre: 'genre Three', authorId: '3'},
                {id: '4', name: 'Book Four', genre: 'genre Four', authorId: '1'}
            ];

const authors = [
                    {id: '1', name: 'Author One', age: 21},
                    {id: '2', name: 'Author Two', age: 22},
                    {id: '3', name: 'Author Three', age: 23},
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve: (parent, args) => {
                return authors.find(author => author.id === parent.authorId)
            }}
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve: (parent, args) => {
                return books.filter(book => book.authorId === parent.id)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        book: {
            type: BookType,
            args: {id : {type: GraphQLID}},
            resolve: (parent, args) => {
                return books.find(book => args.id === book.id);
            }
        },
        author: {
            type: AuthorType,
            args: {id : {type: GraphQLID}},
            resolve: (parent, args) => {
                return authors.find(book => args.id === book.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: () => {
                
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve: () => {
                return authors;
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addBook: {
            type: BookType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID),},
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve : (parent, args) => {
                return booksReference.add({
                    id : args.id,
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })
            }
        }
    }
})
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})