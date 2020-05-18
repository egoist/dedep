# Dedep

Check dependency versions for Deno.

![preview](https://user-images.githubusercontent.com/8784712/82176867-8a770500-990a-11ea-85a2-274aca559440.png)

## Install

```bash
deno install -A https://denopkg.com/egoist/dedep/dedep.ts
```

## Usage

Orginaize all external imports in `deps.ts`:

```ts
export * as colors from 'https://deno.land/std/fmt/colors.ts'

export { cac } from 'https://unpkg.com/cac@6.5.8/mod.js'
```

Run `dedep` to retrieve latest version of each imported module.

Supports:

- https://deno.land/std
- https://denopkg.com
- https://unpkg.com
- https://pika.dev

No support for `https://deno.land/x` since I personally think it's going to be obsolete eventually. 

## License

MIT &copy; [EGOIST (Kevin Titor)](https://github.com/sponsor/egoist)