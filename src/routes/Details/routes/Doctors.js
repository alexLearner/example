module.exports = {
  path: 'doctors',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../../components/Details/Doctors'))
    })
  },
}