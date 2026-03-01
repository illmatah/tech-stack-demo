import { bAuth } from './better-auth'

/**
 * @deprecated
 * Use `bAuth` directly
 * Only here because betterauth needs this export to generate migrations.
 */
export const auth = bAuth()
