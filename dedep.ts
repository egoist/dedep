#!/usr/bin/env deno
import { colors } from "./deps.ts"
import {
  getDeps,
  getPkgLatestVersion,
  getLatestGitTag,
  getLatestStdVersion,
  semverCompare,
} from "./utils.ts"

const file = Deno.args[0] || "deps.ts"

if (file === "help") {
  console.log(`
  ${colors.bold("dedep [file]")}
  ${colors.underline(colors.dim("https://github.com/egoist/dedep"))}

  Examples:

    $ dedep             # Check deps.ts
    $ dedep exports.ts  # Check exports.ts
  `)
  Deno.exit()
}

try {
  await Deno.stat(file)
} catch (error) {
  console.log(colors.red(`${file} does not exist`))
  Deno.exit(1)
}

const decoder = new TextDecoder("utf-8")
const data = await Deno.readFile(file)
const text = decoder.decode(data)

// Let's keep this simple for now, no need to use something like babel to parse the file
// Instead just do string replace

const deps = getDeps(text)

console.log(`\n  Fetching latest version..\n`)

await Promise.all(
  deps
    .filter((dep) => dep.type !== "unknown")
    .map(async (dep) => {
      const latestVersion =
        dep.type === "npm"
          ? await getPkgLatestVersion(dep.name)
          : dep.type === "std"
          ? await getLatestStdVersion()
          : await getLatestGitTag(dep.name)
      console.log(`  ${colors.dim(colors.underline(dep.url))}`)
      const needsUpgrade =
        dep.emptyVersion || semverCompare(latestVersion, dep.version) === 1

      console.log(
        `  ${colors.bold(dep.name)} Latest: ${colors[
          needsUpgrade ? "red" : "green"
        ](latestVersion)} Current: ${dep.emptyVersion ? "empty" : dep.version}`
      )
      console.log()
    })
)

for (const dep of deps) {
  if (dep.type === "unknown") {
    console.log(`  ${colors.dim(colors.underline(dep.url))}`)
    console.log(`  ${colors.yellow("unknown this dep")}`)
    console.log()
  }
}
