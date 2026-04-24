import uni_plugin from '@dcloudio/vite-plugin-uni';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';

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
