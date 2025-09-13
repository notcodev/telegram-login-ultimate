import { TelegramLoginClient } from '@telegram-login-ultimate/core'
import React from 'react'
import { createRoot } from 'react-dom/client'

import { TelegramLoginProvider, useTelegramLogin } from '../src'

const App = () => {
  const [openPopup, { isPending }] = useTelegramLogin({
    botId: 7783073834,
    onSuccess: (user) => console.log('@@', user),
    onError: () => console.log('Popup closed'),
  })

  return (
    <button disabled={isPending} type='button' onClick={openPopup}>
      {isPending ? 'Popup opened' : 'Open popup'}
    </button>
  )
}

const telegramLoginClient = new TelegramLoginClient()

const root = createRoot(document.querySelector('#app')!)

root.render(
  <React.StrictMode>
    <TelegramLoginProvider client={telegramLoginClient}>
      <App />
    </TelegramLoginProvider>
  </React.StrictMode>,
)
