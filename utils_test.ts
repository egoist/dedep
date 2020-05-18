import { getPkgLatestVersion, getLatestGitTag, getDeps } from './utils.ts'
import { assertEquals } from './dev_deps.ts'

Deno.test('latest npm version', async () => {
  const version = await getPkgLatestVersion('cac')
  assertEquals(typeof version, 'string')
})

Deno.test('latest git tag', async () => {
  const tag = await getLatestGitTag('cacjs/cac')
  assertEquals(typeof tag, 'string')
})

Deno.test('get deps', () => {
  const deps = getDeps(`
  export * from 'https://denopkg.com/cacjs/cac'
  export * from 'https://denopkg.com/cacjs/cac@v0.1.1'
  export * from 'https://unpkg.com/cac@0.1.1'
  export * from 'https://unpkg.com/cac'
  export * from 'https://deno.land/std/http'
  export * from 'https://deno.land/std@v0.1.1/http'
  export * from 'https://deno.land/std@v0.1.1/http/server.ts'
  export * as abc from 'https://deno.land/x/abc/mod.ts'
  `)
  assertEquals(deps, [
    {
      type: 'github',
      url: 'https://denopkg.com/cacjs/cac',
      name: 'cacjs/cac',
      version: 'master',
      emptyVersion: true,
    },
    {
      type: 'github',
      url: 'https://denopkg.com/cacjs/cac@v0.1.1',
      name: 'cacjs/cac',
      version: 'v0.1.1',
      emptyVersion: false,
    },
    {
      type: 'npm',
      url: 'https://unpkg.com/cac@0.1.1',
      name: 'cac',
      version: '0.1.1',
      emptyVersion: false,
    },
    {
      type: 'npm',
      url: 'https://unpkg.com/cac',
      name: 'cac',
      version: 'latest',
      emptyVersion: true,
    },
    {
      type: 'std',
      url: 'https://deno.land/std/http',
      name: 'denoland/deno',
      version: 'master',
      emptyVersion: true,
    },
    {
      type: 'std',
      url: 'https://deno.land/std@v0.1.1/http',
      name: 'denoland/deno',
      version: 'v0.1.1',
      emptyVersion: false,
    },
    {
      type: 'std',
      url: 'https://deno.land/std@v0.1.1/http/server.ts',
      name: 'denoland/deno',
      version: 'v0.1.1',
      emptyVersion: false,
    },
    {
      type: 'unknown',
      url: 'https://deno.land/x/abc/mod.ts',
      name: '',
      version: '',
      emptyVersion: true,
    }
  ])
})
