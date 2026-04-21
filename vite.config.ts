import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import AutoImport from 'unplugin-auto-import/vite';
import Unocss from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    Unocss(),
    AutoImport({
      imports: ['vue', 'uni-app', 'pinia'],
      dts: 'src/auto-import.d.ts',
    }),
  ],
});
