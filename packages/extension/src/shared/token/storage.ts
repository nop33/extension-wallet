import * as yup from "yup"

import { ArrayStorage } from "../storage"
import { assertSchema } from "../utils/schema"
import { BaseToken, Token } from "./type"
import { equalToken, defaultKnownAlephiumTokens } from "./utils"

export const tokenStore = new ArrayStorage(defaultKnownAlephiumTokens, {
  namespace: "core:tokens",
  areaName: "local",
  compare: equalToken,
})

export const baseTokenSchema: yup.Schema<BaseToken> = yup
  .object()
  .required("BaseToken is required")
  .shape({
    id: yup.string().required("Id is required"),
    networkId: yup.string().required("Network is required"),
  })

export const tokenSchema: yup.Schema<Token> = baseTokenSchema
  .required("Token is required")
  .shape({
    id: yup.string().required("Id is required"),
    name: yup.string().required("Name is required"),
    symbol: yup.string().required("Symbol is required"),
    decimals: yup.number().required("Decimals is required"),
    logoURI: yup.string(),
    showAlways: yup.boolean(),
  })

export async function addToken(token: Token) {
  const newToken: Token = { ...token, showAlways: true }
  await assertSchema(tokenSchema, newToken)
  return tokenStore.push(newToken)
}

export async function hasToken(token: BaseToken) {
  await assertSchema(baseTokenSchema, token)
  const [hit] = await tokenStore.get((t) => equalToken(t, token))
  return Boolean(hit)
}

export async function removeToken(token: BaseToken) {
  await assertSchema(baseTokenSchema, token)
  return tokenStore.remove((t) => equalToken(t, token))
}
