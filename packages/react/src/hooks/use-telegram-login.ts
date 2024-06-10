import { useRef, useState } from 'react'

const POPUP_WIDTH = 550
const POPUP_HEIGHT = 470
const POPUP_ORIGIN = 'https://oauth.telegram.org'

export interface TelegramLoginData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

export interface UseTelegramLoginOptions {
  botId: number
  onSuccess?: (data: TelegramLoginData) => unknown
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
        let data: { event: string; result: TelegramLoginData }

        try {
          data = JSON.parse(event.data)
        } catch (error) {
          return
        }

        if (!(botId in popups.current)) return

        if (event.source !== popups.current[botId].window) return
        if (data.event === 'auth_result') {
          setIsPending(false)
          onAuthDone(data.result)
        }
      }

      function onAuthDone(authData: TelegramLoginData) {
        if (!(botId in popups.current)) return

        if (popups.current[botId].authFinished) return

        onSuccess?.(authData)

        popups.current[botId].authFinished = true
        window.removeEventListener('message', onMessage)
      }

      function checkClose(botId: number) {
        if (!(botId in popups.current)) return

        const currentPopup = popups.current[botId]

        if (!currentPopup.window || currentPopup.window.closed) {
          return getAuthData({ botId })
            .then((res) => {
              if ('user' in res) onAuthDone(res.user)
              else if (
                botId in popups.current &&
                !popups.current[botId].authFinished
              )
                onFail?.()
            })
            .catch(console.error)
            .finally(() => setIsPending(false))
        }

        setTimeout(() => checkClose(botId), 100)
      }

      async function getAuthData(options: { botId: number }): Promise<
        ({ user: TelegramLoginData } | { error: string }) & {
          html: string
          origin: string
        }
      > {
        return fetch(
          POPUP_ORIGIN +
            '/auth/get' +
            '?bot_id=' +
            encodeURIComponent(options.botId),
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded; charset=UTF-8',
              'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'include',
          },
        ).then((res) => res.json())
      }
    },
    { isPending },
  ] as const
}
