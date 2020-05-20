# Dedep

Manage dependency versions for Deno.

![preview](https://user-images.githubusercontent.com/8784712/82181325-e3e43180-9914-11ea-9274-772696935c61.png)

## Install

```bash
deno install -A https://denopkg.com/egoist/dedep/dedep.ts
```

## Usage

Organize all external imports in `deps.ts`:

```ts
export * as colors from 'https://deno.land/std/fmt/colors.ts'

export { cac } from 'https://unpkg.com/cac@6.5.8/mod.js'
```

Run `dedep` to retrieve latest version of each imported module.

Run `dedep help` to get all command-line usage.

Supports:

- https://deno.land/std
- https://denopkg.com
- https://unpkg.com
- https://pika.dev

No support for `https://deno.land/x` since I personally think it's going to be obsolete eventually. 

## License

MIT &copy; [EGOIST (Kevin Titor)](https://github.com/sponsors/egoist)
