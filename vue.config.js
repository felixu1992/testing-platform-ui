
module.exports = {
    configureWebpack: {
        devtool: 'source-map'
      },
    outputDir: 'dist',
    devServer: {
        proxy: {
            '/testing-platform-api': {
                target: 'http://platform.felixu.top:7600',
                // target: 'http://localhost:8000',
                changeOrigin: true,
                pathRewrite: {
                    '^/testing-platform-api': '/'
                }
            }
        }
    }

}
