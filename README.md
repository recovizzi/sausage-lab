# Sausage Lab — Starter Skeleton

Ready-to-drop files for a Vite + React + TypeScript app using:
- Tailwind CSS v4 (via @tailwindcss/vite)
- daisyUI v5
- Three.js

## How to use

1. Create your Vite app (TypeScript):
   ```bash
   pnpm create vite@latest sausage-lab --template react-ts
   cd sausage-lab
   pnpm install
   ```

2. Install UI deps:
   ```bash
   pnpm add -D tailwindcss @tailwindcss/vite daisyui
   pnpm add three
   ```

3. Drop the files from this archive into your project root (overwrite when asked).

4. Start dev server:
   ```bash
   pnpm dev
   ```

You should see:
- Tailwind and daisyUI styling working
- A navbar with theme toggle
- A Three.js scene with a yellow ground and a bouncing toon sausage
- Drag vertically to rotate the scene around the X axis
