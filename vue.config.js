
module.exports = {
    configureWebpack: {
        devtool: 'source-map'
      },
    outputDir: 'dist',
    devServer: {
        //logLevel:'debug',
        proxy: {
            '/testing-platform-api/': {
                // target: 'http://platform.felixu.top:7600',
                target: 'http://localhost:20000',
                changeOrigin: true,
                logLevel:'debug',
                pathRewrite: {
                    '^/testing-platform-api/': '/'
                }
            },
            '/project/temp-export/': {
                // target: 'http://platform.felixu.top:7600',
                target: 'http://localhost:20000',
                logLevel:'debug',
                changeOrigin: true,
            }
        },
    },
    css: {
        loaderOptions: {
          less: {
            lessOptions: {
              modifyVars: {
                // 'primary-color': '#287999',
                // 'link-color': '#287999',
                'border-radius-base': '2px',
              },
              javascriptEnabled: true,
            },
          },
        },
      },

}
