# fullstack

Using Bun all the way with Elysia on the "backend" with Eden and SvelteKit we get an amazing developer experience.

```
git clone https://github.com/svelterust/fullstack
cd fullstack
bun install
bun dev
```

## Production

```
docker build . -t fullstack
docker run -p 3000:3000 -t fullstack
```
