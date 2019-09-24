import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import App from './App';
import './index.css';

// Pass your GraphQL endpoint to uri
const client = new ApolloClient({ uri: 'https://api.thegraph.com/subgraphs/name/makoto/deployer' });

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

// ReactDOM.render(ApolloApp, document.getElementById('root'));
render(<ApolloApp />, document.getElementById('root'));
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
