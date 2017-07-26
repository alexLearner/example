import React, { Component } from 'react'
import Formsy from 'formsy-react'
import InputMixin from '../../mixins/input'

const Textarea = React.createClass({
  mixins: [InputMixin],

  render() {
    const {
      className,
      name, 
      label,
      required,
      placeholder
    } = this.props;
    const classNameInput=this.returnInputClassName("textarea");

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
          <textarea 
            name={name} 
            onChange={this.changeValue}
            value={this.getValue()}
            ref="input"
            className={classNameInput}
            placeholder={placeholder || ""}/>
        </div>
      </div>
    );
  }
});

export default Textarea