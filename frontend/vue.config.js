module.exports = {
  devServer: {
    proxy: 'http://127.0.0.1:8000',
    contentBase: './public'
  },
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader').options({
      fix: true
    })
  }
}
