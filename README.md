## My News

This project is just a simple wrapper around the New York Times API. It allows you to search for articles, view the most popular ones, favorite them, and view your favorites. It was built using Next.js, and some of the coolest libraries out there (better-auth, nuqs, tailwind, prisma, and more).

## Getting Started

To get started, you'll need to clone the repository and install the dependencies. You'll also need to create copy the `.env.example` file to `.env` and fill in the necessary values.

As this was written using Bun as a runtime, you can run the project using the following command:

```bash
bun install
bun dev
```

## Design decisions

Everything's done with SSR. Prisma is the ORM of choice, and the database is Postgres. The project is styled using Tailwind CSS, and the authentication is done using better-auth.

### Latest News
The 'Latest news' widget is the only component that requires a large (ish) client side interaction, that being infinite scrolling. Now, I could've done that with TanStack Query or SWR (which I prefer), but I did it with Observables, because I wanted to, sue me.

I still wanted to keep those nice and indexable, without layout shift, so the initial data is fetched server-side and rendered there, then left to hydrate on the client.

### Favoriting
Favoriting is just done via Next.js's API routes. I could've done it with server actions which I usually prefer (with next-safe-action), but it's small enough to not bother. All of that is stored in the database instead of the browser. The favorites page also shows when something was favorited, and all of the API calls use optimistic updates to update the UI before the server responds.

### Pagination
I did not add pagination to any of the pages, other than the "Latest news" widget. The NYT API loves their rate limits, so jumping through 4 pages quickly just breaks everything. That can be re-added though.

### Sidebar
The sidebar automatically closes whenever a navigation event happens. I hate it when sites keep it open, this is a pet peeve of mine. It also ended up being a nice place for the login button.

### Notification
The top of the screen has a notification component prompting for action. Since it's asking for the site to be set to the homepage, I've stored that in the localstorage instead of somewhere else. I also added framer-motion explicitly to animate that component's exit without me spamming a bunch of JS and CSS. It looks cool now.
