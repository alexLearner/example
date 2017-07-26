import React, {PureComponent} from 'react';
import tx from 'transform-props-with';
import addElementFunc from '../../functions/elementStyles';
import Slider from "../UI/Slider"
import LazyImg from "../UI/LazyImg"
import { defineMessages } from 'react-intl';

const msg = defineMessages({
	title: {
		defaultMessage: "Вам это может быть интересно",
		id: "search.articles.title"
	},

	all: {
		defaultMessage: "Все статьи",
		id: "search.articles.all"
	}
});

const rc = addElementFunc("articles");
const pr = addElementFunc("");

const
	Articles = tx([{ name: "" }, pr])('section'),
	ArticleContent = tx([{ name: 'item_content' }, rc])('div'),
	ArticleFooter = tx([{ name: 'item_footer' }, rc])('div');

export default class ArticlesClass extends PureComponent {
	render() {
		const
			{f, pathnames: {s_host}} = this.context,
			{
				fetched,
				data,
			} = this.props.articles,
			{className, title = f(msg.title)} = this.props;

		if (!fetched) {
			return (
				<Articles className={className} />
			)
		}
		
		if (!(data && data.length)) {
			return null;
		}

		let items = data.map((item, index) => index < 10
			? <a
					key={index}
					href={s_host + `/article/${item.alias}/`}
					className="articles_item">
					<LazyImg
						className="articles_item_img"
						src={s_host + "/resize_240x162" + item.image}
						alt={item.title} />
					<ArticleContent>
						<p>{item.title}</p>
						<ArticleFooter>{item.direction}</ArticleFooter>
					</ArticleContent>
				</a>
			: null
		);

		return (
			<Articles
				active={true}
				className={"articles preloader " + className || ""}
				id="articles">
				<Slider
					title={title}
					more={f(msg.all)}
					footerBtn={true}
					outLink={true}
					moreLink={s_host + "/articles/"}
					slides={items}
				/>
			</Articles>
		)
	}
}

ArticlesClass.contextTypes = {
  f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};
