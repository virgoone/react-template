export default () =>
  import(/* webpackChunkName: "lottie-web" */ 'lottie-web').then(
    value => value.default,
  )
