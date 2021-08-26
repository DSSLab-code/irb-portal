import './App.scss';
import { Switch, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import NewTrial from './pages/NewTrial';
import TrialInfo from './pages/TrialInfo';
import Amplify from 'aws-amplify';
import {
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifySignUp,
} from '@aws-amplify/ui-react';

var redirectSignIn = '';
var redirectSignOut = '';
if (process.env.REACT_APP_REDIRECT_SIGNIN) {
  redirectSignIn = process.env.REACT_APP_REDIRECT_SIGNIN;
}
if (process.env.REACT_APP_REDIRECT_SIGNOUT) {
  redirectSignOut = process.env.REACT_APP_REDIRECT_SIGNOUT;
}

// If Amplify is doing a build, override these values with the values set by Amplify
if (process.env.REACT_APP_AWS_APP_ID) {
  redirectSignIn = process.env.REACT_APP_AWS_PULL_REQUEST_ID
    ? `https://pr-${process.env.REACT_APP_AWS_PULL_REQUEST_ID}.${process.env.REACT_APP_AWS_APP_ID}.amplifyapp.com`
    : `https://${process.env.REACT_APP_AWS_APP_ID}.amplifyapp.com`;
  redirectSignOut = process.env.REACT_APP_AWS_PULL_REQUEST_ID
    ? `https://pr-${process.env.REACT_APP_AWS_PULL_REQUEST_ID}.${process.env.REACT_APP_AWS_APP_ID}.amplifyapp.com`
    : `https://${process.env.REACT_APP_AWS_APP_ID}.amplifyapp.com`;
}

Amplify.configure({
  Auth: {
    region: 'us-east-1',

    userPoolId: process.env.REACT_APP_USER_POOL_ID,

    userPoolWebClientId: process.env.REACT_APP_WEB_CLIENT_ID,

    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,

    oauth: {
      domain: process.env.REACT_APP_DOMAIN,
      scope: [
        'phone',
        'email',
        'profile',
        'openid',
        'aws.cognito.signin.user.admin',
      ],
      redirectSignIn: redirectSignIn,
      redirectSignOut: redirectSignOut,
      responseType: 'code',
    },
  },
  API: {
    endpoints: [
      {
        name: process.env.REACT_APP_API_NAME,
        endpoint: process.env.REACT_APP_API_ENDPOINT,
      },
    ],
  },
  Storage: {
    AWSS3: {
      bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      region: 'us-east-1',
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    },
  },
});

function App() {
  return (
    <AmplifyAuthenticator federated={{}}>
      <div slot="sign-in">
        <AmplifySignIn
          usernameAlias="email"
          formFields={[
            { type: 'email', label: 'email' },
            { type: 'password', label: 'password' },
          ]}
        >
          <div slot="federated-buttons"></div>
        </AmplifySignIn>
      </div>
      <div slot="sign-up">
        <AmplifySignUp
          usernameAlias="email"
          formFields={[
            { type: 'email', label: 'email' },
            { type: 'password', label: 'password' },
          ]}
        />
      </div>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/trial-info/:id" component={TrialInfo} />
        <Route exact path="/new-trial" component={NewTrial} />
      </Switch>
    </AmplifyAuthenticator>
  );
}

export default App;
