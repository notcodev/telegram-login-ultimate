import { useTelegramLogin } from '../src'
import React from 'react'
import { createRoot } from 'react-dom/client'

const App = () => {
  const [openPopup, { isPending }] = useTelegramLogin({
    botId: 5948544568,
    onSuccess: (user) => console.log('@@', user),
    onFail: () => console.log('Popup closed'),
  })

  return (
    <button disabled={isPending} onClick={openPopup}>
      {isPending ? 'Popup opened' : 'Open popup'}
    </button>
  )
}

const root = createRoot(document.querySelector('#app')!)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
