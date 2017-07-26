module.exports = {
  path: '*',
  status: 404,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/NotFound'))
    })
  }
}