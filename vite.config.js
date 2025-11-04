// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx"], // ✅ .js/.jsx 확장자 자동 인식
  },
  build: {
    target: "esnext", // ✅ 최신 JS 문법 지원 (ESM 빌드 안정화)
    outDir: "dist",   // 기본 출력 폴더
  },
  server: {
    port: 5173,       // 로컬 dev 서버 포트
  },
});
