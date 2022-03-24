import Cookies from "js-cookie"
import { safeParse } from "./commonUtils"

const TOKEN_BUNDLE = "sivf_token_bundle"
const TOKEN = "sivf_token"

export function setTokenBundle(loginBundle) {
  const parsedBundle = JSON.parse(loginBundle)
  if (parsedBundle.keepLogin) {
    Cookies.set(TOKEN_BUNDLE, loginBundle, { expires: 1 })
  } else {
    Cookies.set(TOKEN_BUNDLE, loginBundle)
  }
  window.localStorage.setItem(TOKEN, parsedBundle.token)
}

export function clearToken() {
  Cookies.remove(TOKEN_BUNDLE)
}

export function getTokenBundle() {
  return Cookies.get(TOKEN_BUNDLE)
}

export function getToken() {
  return safeParse(getTokenBundle()).token
}
