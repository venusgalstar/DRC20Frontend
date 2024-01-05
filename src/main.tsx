import * as Sentry from '@sentry/react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { WalletProvider } from './WalletContext'

//import './assets/styles/index.less'
import './App.css'
//import 'unocss'
import '@unocss/reset/normalize.css'

// console.table(import.meta.env)

if (typeof process !== 'undefined' && process.env.SENTRY === 'active') {
  Sentry.init({
    dsn: 'https://f3ef2f99ce5df953c52f77dec6dc2890@o4506343641776128.ingest.sentry.io/4506343643086848',
    integrations: [
      new Sentry.BrowserTracing({
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: [
          'localhost',
          /^https:\/\/d20-api2.dogeord\.io/,
          /^https:\/\/marketplace-api.dogeord\.io/,
        ],
      }),
      new Sentry.Replay({
        networkDetailAllowUrls: [/^https:\/\/d20-api2.dogeord\.io/, /^https:\/\/marketplace-api.dogeord\.io/],
        networkRequestHeaders: ['X-Custom-Header'],
        networkResponseHeaders: ['X-Custom-Header'],
      }),
    ],
    ignoreErrors: [
      /**
       * Thrown when firefox prevents an add-on from refrencing a DOM element that has been removed.
       * This can also be filtered by enabling the browser extension inbound filter
       */
      "TypeError: can't access dead object",
      /**
       * React internal error thrown when something outside react modifies the DOM
       * This is usually because of a browser extension or Chrome's built-in translate
       */
      "NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.",
      "NotFoundError: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.",
      /* https://github.com/getsentry/sentry-javascript/issues/3440#issuecomment-954602174 */
      'Non-Error promise rejection captured',
      "undefined is not an object (evaluating 'a.L')",
      'chrome-extension://',
      "Can't find variable: zaloJSV2",
      'TypeError: Failed to fetch',
      'Cannot redefine property: ethereum',
      "Cannot read properties of null (reading 'disconnect')",
      'Request aborted',
      'timeout exceeded',
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  })
}

export default Sentry

ReactDOM.render(
  <BrowserRouter>
    <WalletProvider>
      <App />
    </WalletProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
