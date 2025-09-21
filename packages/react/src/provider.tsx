import type { TelegramLoginClient } from '@telegram-login-ultimate/core'

import { TelegramLoginContext } from './context'

export interface TelegramLoginProviderProps {
  children: React.ReactNode

  /**
   * Telegram login client instance.
   */
  client: TelegramLoginClient
}

export const TelegramLoginProvider = ({
  client,
  children,
}: TelegramLoginProviderProps): React.ReactElement => {
  return (
    <TelegramLoginContext.Provider value={client}>
      {children}
    </TelegramLoginContext.Provider>
  )
}
