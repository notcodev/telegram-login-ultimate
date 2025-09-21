---
outline: deep
---

# Telegram Login Ultimate React

Implementation of the Telegram Login Ultimate for React applications.

## Installation

::: code-group

```bash [pnpm]
pnpm add @telegram-login-ultimate/react
```

```bash [npm]
npm install @telegram-login-ultimate/react
```

```bash [yarn]
yarn add @telegram-login-ultimate/react
```

```bash [bun]
bun add @telegram-login-ultimate/react
```

:::

## Usage

### Create a client

Start by creating a client instance using the `TelegramLoginClient` constructor:

```tsx
import { TelegramLoginClient } from '@telegram-login-ultimate/react'

const telegramLoginClient = new TelegramLoginClient();
```

### Provide the client to your App

To use the client in your React application, you need to wrap your app with the `TelegramLoginProvider` component:

```tsx {7-9}
import { TelegramLoginClient, TelegramLoginProvider } from '@telegram-login-ultimate/react'

const telegramLoginClient = new TelegramLoginClient();

function App() {
  return (
    <TelegramLoginProvider client={telegramLoginClient}>
      <YourApp />
    </TelegramLoginProvider>
  );
}
```

### Use the client

You can now use the client to authenticate users with Telegram:

```tsx
import { useTelegramLogin } from '@telegram-login-ultimate/react'

const LoginButton = () => {
  const { start, isPending } = useTelegramLogin({
    botId: 123456789,
    onSuccess: (user) => {
      console.log('User logged in:', user);
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  return (
    <button onClick={start} disabled={isPending}>
      Login with Telegram
    </button>
  );
}
```

> [!TIP]
> We are using id instead of username because we implement login system from scratch.  You can obtain it from the [@username_to_id_bot](https://t.me/username_to_id_bot).
