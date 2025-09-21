import { POPUP_ORIGIN } from './consts'
import { buildUrl } from './utils'

export interface PopupOptions {
  /**
   * Height of the popup
   */
  height: number
  /**
   * Width of the popup
   */
  width: number
}

interface PopupInstance {
  authFinished: boolean
  window: Window
}

type GetAuthResponse = (
  | { error: string }
  | { user: TelegramUserData }
) & {
  html: string
  origin: string
}

/**
 * Data returned after a successful Telegram login authentication.
 */
export interface TelegramUserData {
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

/**
 * Configuration options for the Telegram login client.
 */
export interface TelegramLoginClientOptions {
  /**
   * Default popup window dimensions that will be used when no specific popup options are provided in the login method.
   * @default { width: 550, height: 470 }
   */
  defaultPopupOptions?: PopupOptions
}

/**
 * Configuration options for the Telegram login method.
 */
export interface LoginOptions {
  /**
   * The unique identifier of the Telegram bot. You can obtain it from the https://t.me/username_to_id_bot.
   */
  botId: number
  /**
   * Optional popup window configuration. If not provided, default popup options will be used.
   */
  popup?: Partial<PopupOptions>
  /**
   * Optional callback function that will be called if an error occurs during the login process.
   * @param {unknown} error - The error that occurred.
   */
  onError?: (error: unknown) => void
  /**
   * Optional callback function that will be called when the login process starts.
   */
  onStart?: () => void
  /**
   * Optional callback function that will be called when the login process completes successfully.
   * @param {TelegramUserData} data - The authentication data returned from Telegram.
   */
  onSuccess?: (data: TelegramUserData) => void
}

/**
 * Telegram login client.
 */
export class TelegramLoginClient {
  private defaultPopupOptions: PopupOptions
  private popups: Partial<Record<number, PopupInstance>> = {}

  /**
   * Create a new Telegram login client.
   * @param {TelegramLoginClientOptions} options - Configuration options for the Telegram login client.
   */
  constructor(options?: TelegramLoginClientOptions) {
    this.defaultPopupOptions = options?.defaultPopupOptions ?? {
      width: 550,
      height: 470,
    }
  }

  /**
   * Opens a popup window for the user to log in to Telegram.
   * @param {LoginOptions} options
   * @returns {void}
   */
  login(options: LoginOptions): void {
    const {
      botId,
      popup: popupOptions,
      onStart,
      onSuccess,
      onError,
    } = options

    const width =
      popupOptions?.width ?? this.defaultPopupOptions.width
    const height =
      popupOptions?.height ?? this.defaultPopupOptions.height

    const popup = this.openPopup(botId, { width, height })

    const handleAuthDone = (
      popup: PopupInstance,
      authData: TelegramUserData,
    ): void => {
      if (popup.authFinished) return
      popup.authFinished = true

      onSuccess?.(authData)
    }

    const handleMessage = (event: MessageEvent<string>): void => {
      const popup = this.popups[botId]
      if (!popup) return
      if (event.source !== popup.window) return

      const data: { event: string; result: TelegramUserData } =
        JSON.parse(event.data)

      if (data.event === 'auth_result') {
        handleAuthDone(popup, data.result)
        window.removeEventListener('message', handleMessage)
      }
    }

    const checkClose = async (botId: number): Promise<void> => {
      const popup = this.popups[botId]
      if (!popup || popup.authFinished) return
      if (!popup.window.closed) {
        setTimeout(() => checkClose(botId), 100)
        return
      }

      try {
        const response = await this.getAuthData(botId)
        if ('user' in response) {
          handleAuthDone(popup, response.user)
        } else if (botId in this.popups && !popup.authFinished) {
          onError?.(new Error(response.error))
        }
      } catch (error) {
        onError?.(error)
      } finally {
        window.removeEventListener('message', handleMessage)
      }
    }

    if (popup) {
      const isPopupAlreadyExists =
        this.popups[botId]?.window.closed === false

      this.popups[botId] = { window: popup, authFinished: false }
      popup.focus()

      if (!isPopupAlreadyExists) {
        window.addEventListener('message', handleMessage)
        checkClose(botId)
        onStart?.()
      }
    }
  }

  private async getAuthData(botId: number): Promise<GetAuthResponse> {
    const url = buildUrl(`${POPUP_ORIGIN}/auth/get`, {
      bot_id: botId,
    })
    const headers = {
      'Content-Type':
        'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
    })

    return await response.json()
  }

  private openPopup(
    botId: number,
    { width, height }: PopupOptions,
  ): WindowProxy | null {
    const left =
      Math.max(0, (screen.width - width) / 2) + screen.availWidth
    const top =
      Math.max(0, (screen.height - height) / 2) + screen.availHeight

    const popupUrl = buildUrl(`${POPUP_ORIGIN}/auth`, {
      bot_id: botId,
      origin:
        location.origin ||
        `${location.protocol}//${location.hostname}`,
      return_to: location.href,
    })

    return window.open(
      popupUrl,
      `telegram_oauth_bot${botId}`,
      `width=${width},height=${height},left=${left},top=${
        top
      },status=0,location=0,menubar=0,toolbar=0`,
    )
  }
}
