import { useRef, useState } from 'react'

const POPUP_WIDTH = 550
const POPUP_HEIGHT = 470
const POPUP_ORIGIN = 'https://oauth.telegram.org'

export interface TelegramLoginData {
  /**
   * Unix timestamp indicating when the authentication occurred.
   */
  auth_date: number
  /**
   * User's first name.
   */
  first_name: string
  /**
   * Data hash for verification of the authentication data integrity.
   */
  hash: string
  /**
   * Unique identifier for the user.
   */
  id: number
  /**
   * User's last name, if available.
   */
  last_name?: string
  /**
   * URL of the user's profile photo, if available.
   */
  photo_url?: string
  /**
   * User's username, if available.
   */
  username?: string
}

export interface UseTelegramLoginOptions {
  /**
   * The unique identifier of the Telegram bot. You can obtain it from the https://t.me/username_to_id_bot.
   */
  botId: number

  /**
   * Optional callback function that will be called when the login process completes successfully.
   * @param {TelegramUserData} data - The authentication data returned from Telegram.
   */
  onSuccess?: (data: TelegramLoginData) => unknown

  /**
   * Optional callback function that will be called if an error occurs during the login process.
   */
  onFail?: () => unknown
}

export const useTelegramLogin = ({
  botId,
  onFail,
  onSuccess,
}: UseTelegramLoginOptions) => {
  const [isPending, setIsPending] = useState(false)
  const popups = useRef<
    Record<number, { window: Window | null; authFinished: boolean }>
  >({})

  return [
    () => {
      const width = POPUP_WIDTH
      const height = POPUP_HEIGHT
      const left = Math.max(0, (screen.width - width) / 2) + screen.availWidth
      const top = Math.max(0, (screen.height - height) / 2) + screen.availHeight

      const popupUrl =
        POPUP_ORIGIN +
        '/auth?bot_id=' +
        encodeURIComponent(botId) +
        '&origin=' +
        encodeURIComponent(
          location.origin || location.protocol + '//' + location.hostname,
        ) +
        '&return_to=' +
        encodeURIComponent(location.href)

      const popup = window.open(
        popupUrl,
        'telegram_oauth_bot' + botId,
        'width=' +
          width +
          ',height=' +
          height +
          ',left=' +
          left +
          ',top=' +
          top +
          ',status=0,location=0,menubar=0,toolbar=0',
      )

      popups.current[botId] = {
        window: popup,
        authFinished: false,
      }

      if (popup) {
        setIsPending(true)
        window.addEventListener('message', onMessage)
        popup.focus()
        checkClose(botId)
      }

      function onMessage(event: MessageEvent<string>) {
        if (event.source !== popups.current[botId].window) return
        if (!(botId in popups.current)) return

        const data: { event: string; result: TelegramLoginData | false } =
          JSON.parse(event.data)

        if (data.event === 'auth_result') {
          onAuth(data.result)
        }
      }

      function onAuth(authData: TelegramLoginData | false) {
        if (!(botId in popups.current)) return
        if (popups.current[botId].authFinished) return

        if (authData) {
          onSuccess?.(authData)
        } else {
          onFail?.()
        }

        setIsPending(false)
        popups.current[botId].authFinished = true
        window.removeEventListener('message', onMessage)
      }

      function checkClose(botId: number) {
        if (!(botId in popups.current)) return

        const currentPopup = popups.current[botId]

        if (!currentPopup.window || currentPopup.window.closed) {
          return getAuthData({ botId })
            .then((res) => {
              if ('user' in res) {
                onAuth(res.user)
              } else {
                onAuth(false)
              }
            })
            .catch(() => {
              setIsPending(false)
              onFail?.()
            })
        }

        setTimeout(() => checkClose(botId), 100)
      }

      async function getAuthData(options: { botId: number }): Promise<
        ({ user: TelegramLoginData } | { error: string }) & {
          html: string
          origin: string
        }
      > {
        const url =
          POPUP_ORIGIN +
          '/auth/get' +
          '?bot_id=' +
          encodeURIComponent(options.botId)

        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
        }

        const response = await fetch(url, {
          method: 'POST',
          headers,
          credentials: 'include',
        })

        return response.json()
      }
    },
    { isPending },
  ] as const
}
