import React,{PureComponent} from 'react'
import {FormattedMessage, defineMessages} from 'react-intl';
import addElementFunc from "../../../functions/elementStyles";
import tx from 'transform-props-with';

const msg = defineMessages({
  day: {
    id: "details.hotels.day",
    defaultMessage: "сутки"
  }
});
const rc = addElementFunc("details_hotels");

const
  Hotels = tx([{ className: 'details_hotels' }])('div'),
  Hotel = tx([{ name: 'hotel' }, rc])('div'),
  Container = tx([{ name: 'container' }, rc])('div'),
  Header = tx([{ name: 'header' }, rc])('div'),
  Scroll = tx([{ name: 'scroll' }, rc])('div'),
  Img = tx([{ name: 'img' }, rc])('div'),
  Link = tx([{ name: 'link', className: "blue" }, rc])('a'),
  SubTitle = tx([{ name: 'subtitle' }, rc])('div'),
  Type = tx([{ name: 'type', className: "green" }, rc])('div'),
  More = tx([{ name: 'more', className: "blue" }, rc])('a'),
  Price = tx([{ name: 'price' }, rc])('div');

export default class HotelsClass extends PureComponent {
  render() {
    const {data, link} = this.props;
    const {f} = this.context;
    const items = data.map(({img, link, name, type, time, price}, index) => (
      <Hotel key={index}>

        <Img style={{backgroundImage: `url(${img})`}}/>

        <Link href={link}>{name}</Link>
        {
          type ? <Type>{type}</Type> : null
        }
        {
          time ? <SubTitle>{time}</SubTitle> : null
        }
        <Price>{price + `/${f(msg.day)}`}</Price>

      </Hotel>
    ));

    return (
      <Hotels>
        <Header>
          <FormattedMessage id="details.hotels.hotels_near" defaultMessage="Гостиницы рядом" />
          <More href={link}>
            <FormattedMessage id="details.hotels.show_more" defaultMessage="Смотреть все гостиницы на Booking.com" />
          </More>

        </Header>

        <Container>
          <Scroll>
            {items}
          </Scroll>
        </Container>
      </Hotels>
    )
  }
}

HotelsClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};
