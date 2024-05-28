import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});


const client = new ApolloClient({
  uri: '/graphql',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  try {
    console.log("Initializing Apollo Client...");
    // Log the client configuration for debugging
    console.log("Apollo Client Configuration:", client);
    return (
      <ApolloProvider client={client}>
        <div className="flex-column justify-center align-center min-100-vh bg-primary">
          <Navbar />
          <Outlet />
        </div>
      </ApolloProvider>
    );
  } catch (error) {
    // Log any errors that occur during initialization
    console.error("Error initializing Apollo Client:", error);
    // Render an error message or fallback UI
    return (
      <div>Error initializing Apollo Client. Please check the console for details.</div>
    );
  }
}

export default App;
