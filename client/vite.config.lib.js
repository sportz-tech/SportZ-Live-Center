import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Compile library assets into a dedicated 'dist-lib' folder
    outDir: 'dist-lib',
    lib: {
      // Entry point pointing to our dedicated library entry exporter
      entry: resolve(__dirname, 'src/lib-entry.js'),
      name: 'SportZWidget',
      // Generate standard ESM (.mjs) and UMD (.umd.js) module formats
      formats: ['es', 'umd'],
      fileName: (format) => `sportz-widget.${format}.js`
    },
    rollupOptions: {
      // Critical: Ensure peer dependencies are not bundled into the library code
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        // Premium: Keep styling assets named cleanly
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          return assetInfo.name;
        }
      }
    },
    sourcemap: true,
    minify: false
  }
});
