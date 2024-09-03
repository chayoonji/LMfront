import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 개발 모드에서 사용하는 기본 포트
  },
  preview: {
    port: 4173, // Vite 프리뷰 모드에서 사용하는 기본 포트
  },
});
