# 🚀 Telegram Login React

Ultimate tool for working with Telegram login widget with TypeScript support in your React application

## Installation

Install with [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io)

```shell
npm install @telegram-login-ultimate/react
# or
yarn add @telegram-login-ultimate/react
# or
pnpm add @telegram-login-ultimate/react
```

## Features

- TypeScript support out of the box - full typed package
- Simple usage - import hook and use

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { useTelegramLogin } from '@telegram-login-ultimate/react';

const App = () => {
  const [openPopup, { isPending }] = useTelegramLogin({
    botId: <your_bot_id>,
    onSuccess: (user) => handleSuccess(user),
    onFail: () => handleFail(),
  })

  return (
    <button disabled={isPending} onClick={openPopup}>
      {isPending ? 'Popup opened' : 'Open popup'}
    </button>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
```
