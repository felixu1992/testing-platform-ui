
module.exports = {
    outputDir: 'dist',
    devServer: {
        proxy: {
            '/testing-platform-api': {
                target: 'http://platform.felixu.top:7600',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    }

}
