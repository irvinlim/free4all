import React from 'react';
import { Bert } from 'meteor/themeteorchef:bert';

import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup, FormsySelect, FormsyText, FormsyTime, FormsyToggle } from 'formsy-material-ui/lib';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import { SketchPicker } from 'react-color';

import { objToPairArray } from './helper';

const setNamedState = (self, name, value) => {
  const s = {};
  s[name] = value;
  self.setState(s);
};

const baseTextField = ({ self, name, label, value, hintText, type, multi, required, underlineHide, style, validations, validationError, validationErrors }) => {
  return (
    <FormsyText
      type={ type }
      id={ "field-" + name }
      name={ name }
      floatingLabelText={ label }
      fullWidth={true}
      style={ style }
      multiLine={multi}
      value={ self.state[name] }
      required={ required }
      underlineShow={ !underlineHide }
      validations={ validations }
      validationError={ validationError }
      validationErrors={ validationErrors }
      onKeyPress={ event => (event.which || event.keyCode || 0) === 13 ? setNamedState(self, name, event.target.value) : null }
      onBlur={ event => setNamedState(self, name, event.target.value) } />
  );
};

export const makeTextField = (options) => baseTextField(_.extend(options, { type: 'text', multi: false }));
export const makePasswordField = (options) => baseTextField(_.extend(options, { type: 'password', multi: false }));
export const makeMultiTextField = (options) => baseTextField(_.extend(options, { type: 'text', multi: true }));
export const makeUrlTextField = (options) => baseTextField(_.extend(options, { type: 'url', multi: false }));

const defaultFormatDate = date => moment(date).format("D MMM YYYY");
const baseDatePicker = ({ self, name, label, value, hintText, minDate, maxDate, formatDate, required, style, validations, validationError, validationErrors }) => {
  return (
    <FormsyDate
      id={ "field-" + name }
      name={ name }
      floatingLabelText={ label }
      fullWidth={true}
      style={ style }
      value={ self.state[name] }
      validations={ validations ? validations : required ? "isExisty" : null }
      validationError={ validationError }
      validationErrors={ validationErrors }
      minDate={ minDate }
      maxDate={ maxDate }
      formatDate={ formatDate }
      onChange={ (event, date) => setNamedState(self, name, date) } />
  );
};

export const makeBirthdayDatePicker = (options) =>
  baseDatePicker(_.extend(options, { minDate: moment().subtract(100, 'years').toDate(), maxDate: new Date(), formatDate: defaultFormatDate }));

const baseSelectField = ({ self, name, label, value, hintText, items, required, style, validations, validationError, validationErrors }) => {
  const menuItem = (item, index) => <MenuItem key={ index } value={ item.value } primaryText={ item.label } />;

  return (
    <FormsySelect
      id={ "field-" + name }
      name={ name }
      floatingLabelText={ label }
      fullWidth={true}
      style={ style }
      value={ self.state[name] }
      validations={ validations ? validations : required ? "isExisty" : null }
      validationError={ validationError }
      validationErrors={ validationErrors }
      onChange={ (event, payload, index) => setNamedState(self, name, payload) }>
      { objToPairArray(items, "value", "label").map(menuItem) }
    </FormsySelect>
  );
};

export const makeSelectField = (options) => baseSelectField(options);

const baseColourField = ({ self, name, label, value, hintText, items, required, style }) => {
  return (
    <SketchPicker
      id={ "field-" + name }
      name={ name }
      fullWidth={true}
      style={ style }
      color={ self.state[name] }
      onChangeComplete={ color => setNamedState(self, name, color ? color.hex : null) }
      />
  );
};
export const makeColourField = (options) => baseColourField(options);


// Bert
export const bertAlerts = (msg="") => (error) => {
  if (error) {
    Bert.alert(error.reason, 'danger');
  } else {
    Bert.alert(msg.length ? msg : "Success.", 'success');
  }
};
