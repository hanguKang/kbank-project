import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@kbank/motion': path.resolve(__dirname, 'packages/motion/src'),
      '@kbank/motion-playground': path.resolve(__dirname, 'packages/motion/src/playground'),
      '@motion': path.resolve(__dirname, 'packages/motion/src'),
      '@components': path.resolve(__dirname, 'packages/components/src'),
      '@common': path.resolve(__dirname, 'packages/common/src')
      
    },
    // 모듈 해석 범위 확장
    mainFields: ['module', 'main'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  // packages 디렉토리를 모듈로 인식
  optimizeDeps: {
    include: ['**/*']
  },
  build: {
    commonjsOptions: {
      include: [/packages/, /node_modules/]
    }
  }
})