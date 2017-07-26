import uniq from "lodash/uniq"

export default function FiltersChange(initialValue, alphabet = false) {
	let items,
		cache = {},
		q = initialValue && initialValue.target ? initialValue.target.value : initialValue,
		{activeItems: data} = this.state;

	if (q === "") {
		let newItems = this.state.activeItems;
		if (newItems && newItems[0] && newItems[0][0]) {
			newItems = newItems.map(list =>
				list.map(listInner => {
					listInner.hidden = false;
					return listInner;
				})
			);
		}

		this.setState({q, items: newItems, result: true});
		return;
	}

	if (!(q && q.length)) {
		this.setState({items: this.state.activeItems, result: true});
		return;
	}


	q = q.replace(/(<([^>]+)>)/ig,'');
	const oldQ = q;
	q = q.trim().replace(/[|\\{}()[\]^$+*?.]/g, '');

	let visibleTitles = [];

	if (cache[q]) {
		items = cache[q];
	}

	else {
		items = data.map((list, listIndex) =>
			list.map((item, index) => {
				let
					name = item.name.replace(/[|\\{}()[\]^$+*?.]/g, ''),
					indexOf = name.search(new RegExp(q, 'gi'));

				item.replace = false;
				item.hidden = true;

				if (indexOf + 1)  {
					if (!(alphabet && indexOf !== 0)) {
						visibleTitles.push(listIndex);
						item.hidden = false;
					}

					const string = name.substring(indexOf, q.length + indexOf);
					name = name.replace(string, `<span class="green">${string}</span>`);
					if (index === 0) {
						item.replace = true;
					}
				}

				return {...item, name};
			})
		)
	}

	let result = true;
	if (!visibleTitles.length) {
		result = false
	}
	else {
		visibleTitles = uniq(visibleTitles);
		visibleTitles.forEach(value => items[value][0].hidden = false);
	}

	cache[q] = items;

	this.setState({q: oldQ, items, reset: false, result});
}