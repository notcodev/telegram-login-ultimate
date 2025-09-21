import type {
  LoginOptions,
  TelegramUserData,
} from '@telegram-login-ultimate/core'

import { useContext, useState } from 'react'

import { TelegramLoginContext } from './context'

export type UseTelegramLoginOptions = LoginOptions

export interface UseTelegramLoginReturn {
  /**
   * Flag indicating whether the login process is pending.
   */
  isPending: boolean

  /**
   * Function to start the login process.
   */
  start: () => void
}

export const useTelegramLogin = ({
  botId,
  onError,
  onSuccess,
  onStart,
}: UseTelegramLoginOptions): UseTelegramLoginReturn => {
  const [isPending, setIsPending] = useState(false)
  const client = useContext(TelegramLoginContext)

  if (!client) {
    throw new Error(
      'useTelegramLogin must be used within a TelegramLoginProvider',
    )
  }

  const handleStart = (): void => {
    setIsPending(true)
    onStart?.()
  }

  const handleError = (error: unknown): void => {
    setIsPending(false)
    onError?.(error)
  }

  const handleSuccess = (data: TelegramUserData): void => {
    setIsPending(false)
    onSuccess?.(data)
  }

  const start = (): void => {
    client.login({
      botId,
      onError: handleError,
      onSuccess: handleSuccess,
      onStart: handleStart,
    })
  }

  return { start, isPending } as const
}
