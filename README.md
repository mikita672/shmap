# Shmap

Shmap is a mobile app for planning routes with friends. You find places on a map, add friends, and (once group chats land) build a shared route with them by picking points of interest together.

The project is in early development. Accounts, profiles, friends and the map work today. Group chats and shared routes are next.

[![Lint & Typecheck](https://github.com/mikita672/shmap/actions/workflows/lint-and-typecheck.yml/badge.svg)](https://github.com/mikita672/shmap/actions/workflows/lint-and-typecheck.yml)
[![Latest release](https://img.shields.io/github/v/release/mikita672/shmap)](https://github.com/mikita672/shmap/releases/latest)

## Contents

- [What works today](#what-works-today)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Getting started](#getting-started)
- [Profile links](#profile-links)
- [API documentation](#api-documentation)
- [CI and releases](#ci-and-releases)
- [License](#license)

## What works today

- Sign up with email and password or with Google. Sessions use JWT access and refresh tokens.
- Reset a forgotten password with a one-time code sent by email.
- Edit your profile: username, email and avatar. Avatars are uploaded straight to object storage through a presigned URL.
- Share your profile as a `shmap.dev` link or a QR code, and scan a friend's code from Add friends. On Android, profile links open straight in the app. Without the app, the link shows a web page with the person's name and avatar, and messaging apps show a preview.
- Search for other users, send and answer friend requests, mark friends as favorites, and see mutual friends on public profiles. Private accounts can hide their friends list.
- Get "People you may know" suggestions: friends of your friends, ranked by mutual friends. You can dismiss any suggestion.
- See your recent friend activity: who accepted your requests and whose requests you accepted.
- Mute friends and block users. Blocking removes the friendship, its activity and any pending requests, and the two users stop seeing each other in search and on profiles.
- Chat one-on-one or in groups through the API: open a chat with anyone, create a group, add people, leave, send text messages, page back through the history, and list your chats with their last message. The app screens come later.
- Browse an OpenStreetMap-based map, search for places, and open details for any point you tap.
- Use the Settings screen to pick a light, dark or system theme, change your password, and log out.

## Tech stack

The backend is a Spring Boot 4 application on Java 25. It uses Spring Security with JWT, Spring Data JPA on PostgreSQL, and springdoc-openapi for the API docs. Emails go out through [Resend](https://resend.com), and avatars are stored in an S3-compatible bucket (Cloudflare R2 in production). Production runs on Google Cloud Run with a [Neon](https://neon.tech) Postgres database.

The mobile app is built with Expo and React Native in TypeScript, with Expo Router for navigation, TanStack Query for server state and NativeWind for styling. The map uses MapLibre with [OpenFreeMap](https://openfreemap.org) tiles, place search uses the [Photon](https://photon.komoot.io) geocoder, and the QR scanner uses `expo-camera`.

The website at [shmap.dev](https://shmap.dev) is a Cloudflare Worker with static assets. Plain HTML and CSS pages are served as files, and a small TypeScript Worker renders profile pages at `/u/<username>`.

## Repository layout

```
.
├── backend/              Spring Boot REST API
│   ├── src/main/java/com/mdzvtt/shmap/
│   │   ├── auth/         registration, login, Google sign-in, password reset
│   │   ├── user/         account and profile endpoints, avatars
│   │   ├── friend/       friends, friend requests, user search, public profiles
│   │   ├── block/        blocking and unblocking users
│   │   ├── storage/      S3-compatible object storage
│   │   └── configuration/ security, JWT, OpenAPI
│   ├── docker-compose.yml  local PostgreSQL
│   └── Dockerfile
├── frontend/             Expo / React Native app
│   ├── app/              screens (file-based routing)
│   ├── components/
│   ├── hooks/
│   └── lib/              API client, validation, helpers
├── website/              shmap.dev on Cloudflare Workers
│   ├── public/           static pages, styles and .well-known/assetlinks.json
│   ├── src/              Worker and the profile page template
│   └── wrangler.jsonc    Worker config: domain, routing, backend URL
└── .github/workflows/    CI and release pipelines
```

## Getting started

### Prerequisites

- JDK 25 (the Maven wrapper is included, so you don't need Maven installed)
- Docker with Docker Compose, for the local database
- Node.js 24 and npm
- Android Studio or Xcode to run the app on an emulator or simulator
- A [Resend](https://resend.com) API key, an S3-compatible bucket and a Google OAuth client if you want email, avatars and Google sign-in to work locally

### Backend

```bash
cd backend
cp .env.example .env        # then fill in the values
docker compose up -d        # starts PostgreSQL on localhost:5432
```

Spring Boot doesn't read `.env` on its own, so export the variables before you start the app, and run it with the `dev` profile so it connects to the local database:

```bash
set -a; source .env; set +a
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

The API listens on `http://localhost:8080`. Hibernate creates and updates the schema on startup, so there are no migrations to run.

The backend reads these environment variables:

| Variable                                                                                                              | Purpose                                                      |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`                                                                   | Local database, used by Docker Compose and the `dev` profile |
| `DB_URL`, `DB_USER`, `DB_PASSWORD`                                                                                    | Database connection outside the `dev` profile                |
| `JWT_SECRET`                                                                                                          | Key for signing tokens, at least 256 bits                    |
| `RESEND_API_KEY`                                                                                                      | Sends password reset emails                                  |
| `GOOGLE_CLIENT_ID`                                                                                                    | Google OAuth client ID that ID tokens are checked against    |
| `STORAGE_ENDPOINT`, `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY`, `STORAGE_PUBLIC_BASE_URL` | S3-compatible bucket for avatars                             |
| `STORAGE_REGION`                                                                                                      | Optional, defaults to `auto`                                 |

### Mobile app

```bash
cd frontend
cp .env.example .env        # then fill in the values
npm install
npm run android             # or: npm run ios
```

The app uses native modules (MapLibre and Google Sign-In), so it won't run in Expo Go. `npm run android` and `npm run ios` build a development build and install it on the emulator or simulator.

Set these in `frontend/.env`:

| Variable                           | Purpose                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_API_URL`              | Backend base URL. An Android emulator reaches your machine at `http://10.0.2.2:8080`. |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Google OAuth web client ID                                                            |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | Google OAuth iOS client ID                                                            |
| `EXPO_PUBLIC_IOS_URL_SCHEME`       | Reversed iOS client ID, used as the Google Sign-In URL scheme                         |

Before you push, run the same checks CI runs:

```bash
npm run lint
npm run typecheck
```

### Website

```bash
cd website
npm install
echo "API_BASE_URL=http://localhost:8080" > .dev.vars
npm run dev                 # http://localhost:8787
```

`.dev.vars` points the Worker at your local backend. Without it, the Worker calls production. Open `/u/<username>` to see a profile page. If the backend can't be reached, the page falls back to showing only the username.

`npm run typecheck` generates the Worker types (`wrangler types`) and runs `tsc`. Don't deploy by hand: the release workflow deploys the website.

## Profile links

A profile link looks like `https://shmap.dev/u/<username>`, and the app's own scheme is `shmap://u/<username>`. Both open the route `app/u/[username].tsx`, which sends signed-in users to the profile and keeps the link through login for everyone else.

- **Android App Links.** The intent filter in `frontend/app.json` claims `https://shmap.dev/u/*`, and `website/public/.well-known/assetlinks.json` lists the signing keys allowed to open those links. It has two SHA-256 fingerprints: the debug key used by `npx expo run:android`, and the EAS release key. A build signed with any other key, for example a Google Play build, needs its fingerprint added there.
- **Checking verification.** After installing a build, run `adb shell pm get-app-links com.mdzvtt.shmap`. `shmap.dev` should say `verified`. To check again after a change, run `adb shell pm verify-app-links --re-verify com.mdzvtt.shmap`.
- **Web page.** Without the app, `shmap.dev/u/<username>` shows a card with the name and avatar from `GET /api/v1/public/profiles/{username}`. It also has link preview tags and, on wide screens, a QR code. Profile pages are marked `noindex`, so search engines don't list them.
- **iOS** Universal Links aren't set up yet. They need a paid Apple Developer account.

## API documentation

With the backend running, Swagger UI is at [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) and the OpenAPI spec is at `/v3/api-docs`. Most endpoints need a bearer token. Get one from `POST /api/v1/auth/authenticate` and paste it into the Authorize dialog.

All routes live under `/api/v1`:

| Path                          | What it covers                                                          |
| ----------------------------- | ----------------------------------------------------------------------- |
| `/auth`                       | Register, log in, refresh tokens, Google sign-in, password reset        |
| `/users`                      | The current user's profile, email, password, avatar and username checks |
| `/users/search`               | Find users by username                                                  |
| `/profiles/{username}`        | Public profiles, their friends and mutual friends                       |
| `/public/profiles/{username}` | Name and avatar for the shmap.dev page. No token needed                 |
| `/friends`                    | Friends list, removing friends, favorites, muting                       |
| `/friend-requests`            | Sending, accepting, declining and cancelling requests                   |
| `/friend-suggestions`         | "People you may know" and dismissing suggestions                        |
| `/friend-activity`            | Your recent friend activity, newest first                               |
| `/blocks`                     | Blocking and unblocking users, and the list of users you blocked        |
| `/chats`                      | Your chats, 1:1 and group chats, members, and messages                  |

## CI and releases

Feature branches are merged into `develop`. A pull request from `develop` into `release` starts a release.

Every push and pull request runs ESLint and the TypeScript type check on the app. When a pull request into `release` is merged, the release workflow:

1. picks the next `v0.0.x` version,
2. builds an Android APK and an iOS simulator build with EAS, plus an unsigned iOS IPA on a macOS runner,
3. builds the backend image and deploys it to Cloud Run,
4. type-checks the website and deploys it to Cloudflare. This needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets,
5. publishes a GitHub release with the three app builds attached.

You can download the app from the [releases page](https://github.com/mikita672/shmap/releases). The APK installs directly on Android. The IPA has to be signed with your own certificate before you can install it on an iPhone.

## License

This project doesn't have a license yet, so all rights are reserved by the author.
