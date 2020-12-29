
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
    },
    css: {
        loaderOptions: {
          less: {
            lessOptions: {
              modifyVars: {
                'primary-color': '#287999',
                'link-color': '#287999',
                'border-radius-base': '2px',
              },
              javascriptEnabled: true,
            },
          },
        },
      },

}
