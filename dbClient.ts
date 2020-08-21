import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const { FAUNADB_SECRET } = process.env

const client = new ApolloClient({
  link: createHttpLink({
    uri: 'https://graphql.fauna.com/graphql',
    headers: {
      Authorization: `Bearer ${FAUNADB_SECRET}`,
    },
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})

export default client
