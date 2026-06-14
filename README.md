# 🖼️ Off-Image

**A modern photo editing and designing web application** built with Next.js, Fabric.js, and Convex.

---

## ✨ Features

- 🎨 **Canvas-based editing** — Draw, design, and manipulate images directly in the browser using Fabric.js
- 📁 **Image uploads** — Drag and drop your photos with react-dropzone; images are stored and served via ImageKit
- 🔐 **Authentication** — Secure user sign-up and login powered by Clerk
- ☁️ **Real-time backend** — Live data sync and storage via Convex
- 🌗 **Dark/Light mode** — Theme switching with next-themes
- 🎞️ **Smooth animations** — Polished UI transitions using Framer Motion
- 🧩 **Accessible UI** — Component library built on Radix UI and shadcn/ui

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | JavaScript |
| Styling | Tailwind CSS v4 |
| Canvas / Editing | [Fabric.js](http://fabricjs.com/) |
| Backend / Database | [Convex](https://convex.dev/) |
| Authentication | [Clerk](https://clerk.com/) |
| Image Storage | [ImageKit](https://imagekit.io/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/) |
| Animations | [Framer Motion](https://www.framer-motion.com/) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun
- A [Convex](https://convex.dev/) account
- A [Clerk](https://clerk.com/) account
- An [ImageKit](https://imagekit.io/) account

### 1. Clone the repository

```bash
git clone https://github.com/shriyansh2007/Off-Image.git
cd Off-Image
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project and add the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### 4. Initialize Convex

```bash
npx convex dev
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 📁 Project Structure

```
Off-Image/
├── app/             # Next.js App Router pages and layouts
├── components/      # Reusable React components
├── convex/          # Convex backend functions and schema
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and helpers
├── public/          # Static assets
└── proxy.js         # Proxy configuration
```

---

## 🏗️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## 🚢 Deployment

The easiest way to deploy Off-Image is with [Vercel](https://vercel.com/):

1. Push your code to GitHub
2. Import the repository on [vercel.com](https://vercel.com/new)
3. Add all environment variables in the Vercel dashboard
4. Deploy!

For more details, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source. See the repository for details.

---

## 👨‍💻 Author

**Shriyansh** — [@shriyansh2007](https://github.com/shriyansh2007)
