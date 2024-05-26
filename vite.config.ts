import { defineConfig} from 'vite'

export default defineConfig({
    build: {
        manifest: true,
        rollupOptions: {
            input: __dirname + '/src/resources/css/styles.css',
        },
        outDir: __dirname + '/public/dist',
        
    },
    resolve: {
        alias: {
            '@': __dirname + '/src',
        }
    },
})