import React,{PureComponent} from 'react'
import addElementFunc from "../../../functions/elementStyles";
import tx from 'transform-props-with';

const rc = addElementFunc("details_accommodation");
const 
  Field = tx([{ name: 'field' }, rc])('div'),
  Caption = tx([{ name: 'caption', className: "caption" }, rc])('div'),
  Content = tx([{ name: 'field_content' }, rc])('div'),
  FieldItem = tx([{ name: 'field_item' }, rc])('div');

export default class AccommodationField extends PureComponent {
  render() {
    const {data, title, children, id} = this.props
    let items;

    if (data) {
      items = data.map(({content, caption, link, name, id}, index) => (
        <FieldItem key={index} id={`accommodation-${id}`}>
          {
            link ? (
              <a className="blue" href={link}>{name}</a>
            ) : (
              <p>{name}</p>
            )
          }

          <Content>{content}</Content>

          {
            caption ? (
              <Caption>{caption}</Caption>
            ) : null
          }
        </FieldItem>
      ))
    }


    return (
      <Field>
        <div>{title}</div>
        <div>
          {items}
          {children}
        </div>
      </Field>
    )
  }
}