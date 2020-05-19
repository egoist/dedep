export function getDeps(text: string) {
  const deps: Array<{
    type: 'npm' | 'github' | 'std' | 'unknown'
    url: string
    name: string
    version: string
    emptyVersion: boolean
  }> = []

  const SCOPED_PKG_RE = /^\/(@[^\/]+)\/([^\/]+)/
  const PKG_RE = /^\/([^\/]+)/

  text.replace(/\s+from\s+['"`](.+)['"`]/g, (_, p1) => {
    if (/^https:\/\//.test(p1)) {
      const { hostname, pathname } = new URL('', p1)
      let m: RegExpExecArray | null = null

      if (hostname === 'unpkg.com' || hostname === 'cdn.pika.dev') {
        if ((m = SCOPED_PKG_RE.exec(pathname))) {
          const version = m[2].split('@')[1]
          deps.push({
            url: p1,
            type: 'npm',
            name: m[1] + '/' + m[2].split('@')[0],
            version: version || 'latest',
            emptyVersion: !version,
          })
        } else if ((m = PKG_RE.exec(pathname))) {
          const version = m[1].split('@')[1]
          deps.push({
            type: 'npm',
            url: p1,
            name: m[1].split('@')[0],
            version: version || 'latest',
            emptyVersion: !version,
          })
        } else {
          handlerUnkown(p1)
        }
      } else if (hostname === 'deno.land') {
        if ((m = /^\/std(?:@([^\/]+))?/.exec(pathname))) {
          deps.push({
            type: 'std',
            url: p1,
            name: 'denoland/deno',
            version: m[1] || 'master',
            emptyVersion: !m[1],
          })
        } else {
          handlerUnkown(p1)
        }
      } else if (hostname === 'denopkg.com') {
        if ((m = /\/([^\/]+)\/([^\/]+)/.exec(pathname))) {
          const version = m[2].split('@')[1]
          deps.push({
            type: 'github',
            url: p1,
            name: `${m[1]}/${m[2].split('@')[0]}`,
            version: version || 'master',
            emptyVersion: !version,
          })
        }
      } else {
        handlerUnkown(p1)
      }
    }
    return ''
  })

  function handlerUnkown(url: string) {
    deps.push({
      type: 'unknown',
      url,
      name: '',
      version: '',
      emptyVersion: true
    })
  }

  return deps
}


export async function getPkgLatestVersion(name: string) {
  const json = await fetch(`https://registry.npmjs.org/${name}`).then((res) =>
    res.json()
  )

  return json['dist-tags']['latest']
}

// https://github.com/substack/semver-compare/blob/master/index.js
export function semverCompare(a: string, b: string) {
  const pa = a.split('.')
  const pb = b.split('.')
  for (let i = 0; i < 3; i++) {
    const na = Number(pa[i])
    const nb = Number(pb[i])
    if (na > nb) return 1
    if (nb > na) return -1
    if (!isNaN(na) && isNaN(nb)) return 1
    if (isNaN(na) && !isNaN(nb)) return -1
  }
  return 0
}

// https://github.com/sindresorhus/semver-regex/blob/master/index.js
const isSemver = (v: string) =>
  /(?<=^v?|\sv?)(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:0|[1-9]\d*|[\da-z-]*[a-z-][\da-z-]*)(?:\.(?:0|[1-9]\d*|[\da-z-]*[a-z-][\da-z-]*))*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?(?=$|\s)/gi

export async function getLatestGitTag(repo: string) {
  const json = await fetch(
    `https://api.github.com/repos/${repo}/git/refs/tags`
  ).then((res) => res.json())
  const tags = json
    .map((v: any) => v.ref.replace(/^refs\/tags\/v?/, ''))
    .filter((v: string) => isSemver(v))
  return tags.sort((a: string, b: string) => -semverCompare(a, b))[0]
}

export async function getLatestStdVersion() {
  const json = await fetch(
    `https://denopkg.com/denoland/deno_website2@master/deno_std_versions.json`
  ).then((res) => res.json())

  return json.sort((a: string, b: string) => -semverCompare(a, b))[0]
}
