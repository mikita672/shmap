// Allow side-effect imports of CSS files (e.g. `import "./global.css"` used by NativeWind).
// This declaration lives here — not in nativewind-env.d.ts — so it is preserved
// when NativeWind regenerates its file.
declare module "*.css" {}
