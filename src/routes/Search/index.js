module.exports = {
  path: 'clinics/',
  //
  childRoutes: [
	  {path: ":params1/"},
    {path: ":params1/:params2/"},
    {path: ":params1/:params2/:params3/"}
  ],

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/Search/Search'))
    })
  }
}
