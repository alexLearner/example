module.exports = {
  path: 'accommodation',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../../components/Details/Accommodation'))
    })
  },
}