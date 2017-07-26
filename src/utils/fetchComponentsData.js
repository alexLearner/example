import Promise from 'bluebird';

export default function fetchComponentsData(
	store,
	renderProps,
	serverData
	) {
		const
			location = {
				query: renderProps.query || {},
				params: renderProps.params || {},
				pathname: serverData.pathname
			},
			{components} = renderProps;

    const promises = components
      .filter(current => current)
      .map(current => {
        const component = current.WrappedComponent ? current.WrappedComponent : current;
        // const componentDef = component.default ? component.default.WrappedComponent: undefined;

	      // const name = component.default && component.default.fetchData ? ""
        // if (componentDef) {
	       //  return componentDef.fetchData
        //     ? componentDef.fetchData(store, location, serverData)
        //     : null;
        // }
        // else {
            if (component.default && component.default.fetchData) {
                return component.default.fetchData(store, location, serverData);
            }
            else if (component.fetchData) {
    	        return component.fetchData(store, location, serverData)
            }
        // }
    });

    return Promise.all(promises);
}
