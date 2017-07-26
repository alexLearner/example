import React,{PureComponent} from 'react'
import {FormattedMessage, defineMessages} from 'react-intl';
import {RatingList, SVG, SymbolImg} from "../../UI"
import content_item from "../../../assets-front/img/icons/content_item.svg"
import youtube from "../../../assets-front/img/icons/youtube.svg"
import {Link} from "react-router"
import {isMobile} from "../../../functions/viewport"
import msg from "./msg"
import tx from 'transform-props-with';
import addElementFunc from "../../../functions/elementStyles";

const rc = addElementFunc("details_review");

const
	Review = tx([{ className: "details_review" }])('div'),
	Content = tx([{ name: 'content', className: "size2of3" }, rc])('div'),
	Comment = tx([{ name: 'comment', className: 'block_content' }, rc])('div'),
	Status = tx([{ name: 'status'}, rc])('div'),
	StatusImg = tx([{ name: 'status_img'}, rc])('i'),
	Footer = tx([{ name: 'footer' }, rc])('div'),
	Video = tx([{ name: 'video' }, rc])('a'),
	VideoContent = tx([{ name: 'video_content' }, rc])('div'),
	VideoLink = tx([{ name: 'video_link' }, rc])('div'),
	InfoField = tx([{ name: 'info_field' }, rc])('div'),
	InfoHeader = tx([{ name: 'info_header' }, rc])('div'),
	InfoBlock = tx([{ name: 'info_block' }, rc])('div'),
	Images = tx([{ name: 'images' }, rc])('div'),
	Btn = tx([{ name: 'btn', className: "btn btn_form" }, rc])('div'),
	Info = tx([{ name: 'info', className: "size1of3" }, rc])('div');

export default class ReviewClass extends PureComponent {
	constructor(props) {
		super(props);

		this.postHelpfulness = this.postHelpfulness.bind(this);
		this.show = this.show.bind(this);

		this.state = {activeBtn: -1}
	}

	postHelpfulness(activeBtn, id) {
		if (this.state.activeBtn !== activeBtn) {
			this.setState({activeBtn});
		}
		else {
			this.setState({activeBtn: -1});
			return this.props.onClickBtn(id, !!activeBtn, true)
		}

		this.props.onClickBtn(id, !!activeBtn)
	}

	show(e, id) {
		e.preventDefault();
		e.stopPropagation();
		this.props.showDoctor && this.props.showDoctor(
			id,
			undefined,
			{clinic_id: this.props.clinic_id}
		);
	}

	render() {
		let videosJSX, imagesJSX;
		const
			{
				rating,
				date_nice,
				diagnostic,
				doctor,
				name,
				coordinator,
				close,
				id,
				country,
				clinic_hidden,
				city,
				clinic,
				comment,
				videos,
				images,
				helpfulness,
				country_flag
			} = this.props,
			route = this.context.pathnames.clinics,
			{f, pathnames: {s_host}} = this.context,
			{activeBtn} = this.state;
		let
			{
				likes: positive_count = "0",
				dislikes: negative_count,
				is_positive_max,
				is_negative_max
			} = helpfulness || {},
			count = positive_count + negative_count;

		if (videos) {
			videosJSX = videos.map(({name, thumbnail, iframe, time}, index) => (
				<Video
					className="video"
					data-rel="media"
					href={iframe}
					key={index}>
					<VideoLink
						style={{backgroundImage: `url(${thumbnail})`}}>
						<img
							src={youtube}
							className="icon"
							alt="" />
					</VideoLink>
					<VideoContent>
						<p>{name}</p>
						<span>{time}</span>
					</VideoContent>
				</Video>
			))
		}

		if (images) {
			imagesJSX = images.map(({image_b}, index) =>
				<img
					src={image_b ? s_host + image_b : null}
					key={index}
					alt="" />
			)
		}

		const leftBlock = (
			<InfoBlock>
				{
				//	diagnostic && diagnostic.name ? (
				//			<InfoField>
				//				<p>{f(msg.diagnostic)}</p>
				//				<span
				//					className="link">
				//					{diagnostic.name}
				//				</span>
				//			</InfoField>
				//		) : null
				}

				{
					doctor && doctor.name ? (
							<InfoField>
								<p>{f(msg.doctor)}</p>
								<a
									href=""
									onClick={e => this.show(e, doctor.id)}
									className="link">
									{doctor.name}
								</a>
							</InfoField>
						) : null
				}

				{
					clinic && clinic.name && !clinic_hidden ? (
							<InfoField>
								<p>{f(msg.clinic)}</p>
								<Link
									to={`/${route}/${clinic.alias}/`}
									className="link">
									<span onClick={close}>{clinic.name}</span>
								</Link>
							</InfoField>
						) : null
				}

				{
					coordinator && coordinator.name ? (
							<InfoField>
								<p>{f(msg.coordinator)}</p>
								<span>{coordinator.name}</span>
							</InfoField>
						) : null
				}
			</InfoBlock>
		);

		if (positive_count === 0) {
			positive_count = "0";
		}

		return (
			<Review>
				<Info>
					<InfoHeader>
						<SymbolImg value={name} />
						<div>
							<p>{name}</p>
							{
								country ? (
										<p>
											<img
												src={country_flag}
												className="icon_flag"
												alt={country} />
											{country}
											{city ? `, ${city}`: null}
										</p>
									) : null
							}
						</div>
					</InfoHeader>

					<InfoField>
						<RatingList
							disabled
							rating={rating.toFixed(1)}
							rating_5={true}
						/>
						<p>{date_nice}</p>
					</InfoField>

					{!isMobile ? leftBlock : null}
				</Info>

				<Content>
					{
						is_positive_max ? (
								<Status>
									<StatusImg className="positive" />
									{f(msg.best_positive_review)}
								</Status>
							) : null
					}

					{
						is_negative_max ? (
								<Status>
									<StatusImg className="negative" />
									{f(msg.best_negative_review)}
								</Status>
							) : null
					}

					{videosJSX}

					{
						imagesJSX ? (
								<Images>
									{imagesJSX}
								</Images>
							) : null
					}

					<Comment>
						<img className="icon icon_content" src={content_item} alt='' />
						<div dangerouslySetInnerHTML={{__html: comment}}/>

						{isMobile ? leftBlock : null}

						<Footer>
							{
								count
									? <div>{f(msg.helpfulness, {positive_count, count})}</div>
									: <div>{f(msg.no_helpfulness)}</div>
							}
							<div>
								<p>{f(msg.is_helpfulness)}</p>
								<Btn
									active={activeBtn === 1}
									onClick={() => this.postHelpfulness(1, id)} >
									<FormattedMessage
										id="yes"
										defaultMessage="Да"/>
								</Btn>
								<Btn
									active={activeBtn === 0}
									onClick={() => this.postHelpfulness(0, id)}>
									<FormattedMessage
										id="no"
										defaultMessage="Нет"/>
								</Btn>
							</div>
						</Footer>
					</Comment>
				</Content>
			</Review>
		)
	}
}

ReviewClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};
