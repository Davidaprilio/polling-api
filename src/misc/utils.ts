import { AppJWTPayload } from '@/types/jwt';
import { sign, verify } from 'hono/jwt';
import ENV from '@/misc/env';
import * as _ from 'lodash';
import { randomInt } from 'crypto';
import path from 'path';

export function env(key: string, defaultValue: string): string
export function env(key: string, defaultValue: number): number
export function env(key: string, defaultValue: boolean): boolean
export function env(key: string, defaultValue: any): any {
    let envV = process.env[key] ?? defaultValue ?? null
    switch (typeof defaultValue) {
        case 'number': return Number(envV);
        case 'string': return String(envV);
        case 'boolean': return (envV === 'true')
        default: return envV
    }
}

/**
 * Check env value if not exist, throw error
 * use at before server start
 */
export function requiredEnv(key: string, safe: boolean = false): boolean|never {
    const val = process.env[key] ?? undefined
    if (val === undefined) {
        if (safe) return false
        throw new Error(`Environment variable ${key} is required`)
    }
    return true
}

/**
 * to parse the time unit like 15m, 5h
 * to 15, minutes and 5, hours
 */
export function getUnitValue(str: string) {
    str = str.toLowerCase()
    const arr = str.split(/([a-zA-Z])/)

    return {
        duration: Number(arr[0]),
        unit: unitFullName(arr[1] as any)
    }
}

export type Unit = 'minutes' | 'hours' | 'days' | 'months' | 'years'
export function unitFullName(key: 'm' | 'h' | 'd' | 'mo' | 'y'): Unit {
    switch (key) {
        case 'm': return 'minutes';
        case 'h': return 'hours';
        case 'd': return 'days';
        case 'mo': return 'months';
        case 'y': return 'years';
        default: throw new Error("Unsupported unit: " + key);
    }
}


export async function makeJwtToken(payload: AppJWTPayload) {
    return await sign(payload, ENV.JWT_SECRET, ENV.JWT_ALGORITHM)
}

export async function verifyJwtToken(token: string) {
    return await verify(token, ENV.JWT_SECRET) as AppJWTPayload
}

const alphaLower = 'abcdefghijklmnopqrstuvwxyz'
const alphaUpper = alphaLower.toUpperCase()
const alpha = alphaLower + alphaUpper
const numeric = '0123456789'
const symbol = '!@#$%^&*()'
const alphaNumeric = alpha + numeric
const alphaNumericSymbol = alphaNumeric + symbol
const characterSet = {
    alphaLower,
    alphaUpper,
    alpha,
    numeric,
    alphaNumeric,
    alphaNumericSymbol
}

type strVariant = keyof typeof characterSet
export function randomStr(length: number, variant: strVariant = 'alphaNumeric') {
    if (characterSet[variant] === undefined) {
        throw new Error(`Unsupported variant: ${variant}`)
    }
    let str = ''
    const lengthChars = characterSet[variant].length - 1
    for (let i = 0; i < length; i++) {
        str += characterSet[variant][randomInt(lengthChars)]
    }
    return str
}

export function rootPath(paths: string) {
    paths = paths.replace(/\/$/, '')

    return path.join(process.cwd(), paths)
}

export function url(path: string) {
    if (path.startsWith('/')) {
        path = path.replace(/\/$/, '')
    }
    return `${ENV.APP_HOST}:${ENV.APP_PORT}/${path}`
}