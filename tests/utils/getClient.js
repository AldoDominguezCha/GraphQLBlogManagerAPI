import { ApolloClient, InMemoryCache } from '@apollo/client';

const getClient = (jwt) => {
    const headers = {}
    if(jwt)
        headers.Authorization = `Bearer ${jwt}`
    return new ApolloClient({
        uri: 'http://localhost:4000/',
        cache: new InMemoryCache(),
        headers : headers
    });
}

export { getClient }