import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 5174,
        proxy: {
            '/api': {
                target: 'http://localhost:7071',
                secure: false
            }
        }
    },
    plugins: [react()]
})
