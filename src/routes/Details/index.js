module.exports = {
  path: 'clinic/:clinic/',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/Details'))
    })
  },

  // getIndexRoute(partialNextState, callback) {
  //   require.ensure([], function (require) {
  //     callback(null, {
  //       component: require('../../components/Details/Info'),
  //     })
  //   })
  // },
  
  // childRoutes: [
  //   require('./routes/Reviews'),
  //   require('./routes/Doctors'),
  //   require('./routes/Diagnostics'),
  //   require('./routes/Accommodation'),
  // ]
}