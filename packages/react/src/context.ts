import type { TelegramLoginClient } from '@telegram-login-ultimate/core'

import { createContext } from 'react'

export const TelegramLoginContext = createContext<
  TelegramLoginClient | undefined
>(undefined)
