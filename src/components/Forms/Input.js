import React, { Component } from 'react'
import Formsy from 'formsy-react'
import InputMixin from '../../mixins/input'
import email from "../../assets-front/img/icons/email.svg"


const Input = React.createClass({
  mixins: [InputMixin],

  renderIcon() {
    return <span className="popup_callback_icon"><img src={email} alt=""/></span>
  },

  renderHelp() {
    return <span className="popup_callback_help">{this.props.help}</span>
  },

  render() {
    const 
        {
          className,
          label,
          icon,
          required,
          name,
          placeholder,
          help
        } = this.props,
        classNameInput = this.returnInputClassName("input");

    return (
      <div className={className}>
        <label 
          htmlFor={name}>
          {label}
          {
            required ? (
              <sup>*</sup>
            ) : null
          }
        </label>
        <div>
          <div className="popup_callback_field_container">
            {icon ? this.renderIcon() : null}
            <input 
              name={name}
              onChange={this.changeValue}
              className={classNameInput}
              ref="input"
              placeholder={placeholder || ""}/>
          </div>
           {help ? this.renderHelp() : null}
        </div>
      </div>
    );
  }
});

export default Input
