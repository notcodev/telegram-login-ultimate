import type { TelegramUserData } from '@telegram-login-ultimate/core'

import { useContext, useState } from 'react'

import { TelegramLoginContext } from './context'

export interface UseTelegramLoginOptions {
  /**
   * The unique identifier of the Telegram bot. You can obtain it from the https://t.me/username_to_id_bot.
   */
  botId: number

  /**
   * Optional callback function that will be called if an error occurs during the login process.
   * @param {unknown} error - The error that occurred.
   */
  onError?: (error: unknown) => void

  /**
   * Optional callback function that will be called when the login process completes successfully.
   * @param {TelegramUserData} data - The authentication data returned from Telegram.
   */
  onSuccess?: (data: TelegramUserData) => void
}

export interface UseTelegramLoginReturn {
  isPending: boolean
  start: () => void
}

export const useTelegramLogin = ({
  botId,
  onError,
  onSuccess,
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
