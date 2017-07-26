module.exports = {
  path: 'diagnostics',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../../components/Details/Procedures'))
    })
  },
}