import { defineConfig } from 'vite';
import uni_plugin from '@dcloudio/vite-plugin-uni';
import AutoImport from 'unplugin-auto-import/vite';
import UnoCSS from 'unocss/vite';

// @ts-ignore
const uni = uni_plugin.default || uni_plugin;

// https://vitejs.dev/config/pnpm run dev:mp-weixin
export default defineConfig({
  plugins: [
    uni(),
    UnoCSS(),
    AutoImport({
      imports: ['vue', 'uni-app', 'pinia'],
      dts: 'src/auto-import.d.ts',
    }),
  ],
});
