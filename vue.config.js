
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://platform.felixu.top:7600',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    }

}
