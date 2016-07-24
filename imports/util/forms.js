import React from 'react';

import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup, FormsySelect, FormsyText, FormsyTime, FormsyToggle } from 'formsy-material-ui/lib';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';

import { objToPairArray } from './helper';

const baseTextField = ({ self, name, label, hintText, type, multi, required, validations, validationError, validationErrors }) => {
  return (
    <FormsyText
      type={ type }
      id={ "field-" + name }
      ref={ name }
      name={ name }
      floatingLabelText={ label }
      fullWidth={true}
      multiLine={multi}
      value={ self.state[name] }
      required={ required }
      validations={ validations }
      validationError={ validationError }
      validationErrors={ validationErrors }
      onChange={ event => {
        const s = {};
        s[name] = event.target.value;
        self.setState(s);
      } } />
  );
};

export const makeTextField = (options) => baseTextField(_.extend(options, { type: 'text', multi: false }));
export const makePasswordField = (options) => baseTextField(_.extend(options, { type: 'password', multi: false }));
export const makeMultiTextField = (options) => baseTextField(_.extend(options, { type: 'text', multi: true }));

const defaultFormatDate = date => moment(date).format("D MMM YYYY");
const baseDatePicker = ({ self, name, label, hintText, minDate, maxDate, formatDate, required, validations, validationError, validationErrors }) => {
  return (
    <FormsyDate
      id={ "field-" + name }
      ref={ name }
      name={ name }
      floatingLabelText={ label }
      fullWidth={true}
      value={ self.state[name] }
      validations={ validations ? validations : required ? "isExisty" : null }
      validationError={ validationError }
      validationErrors={ validationErrors }
      minDate={ minDate }
      maxDate={ maxDate }
      formatDate={ formatDate }
      onChange={ (event, date) => {
        const s = {};
        s[name] = date;
        self.setState(s);
      } } />
  );
};

export const makeBirthdayDatePicker = (options) =>
  baseDatePicker(_.extend(options, { minDate: moment().subtract(100, 'years').toDate(), maxDate: new Date(), formatDate: defaultFormatDate }));

const baseSelectField = ({ self, name, label, hintText, items, required, validations, validationError, validationErrors }) => {
  const menuItem = (item, index) => <MenuItem key={ index } value={ item.value } primaryText={ item.label } />;

  return (
    <FormsySelect
      id={ "field-" + name }
      ref={ name }
      name={ name }
      floatingLabelText={ label }
      fullWidth={true}
      value={ self.state[name] }
      validations={ validations ? validations : required ? "isExisty" : null }
      validationError={ validationError }
      validationErrors={ validationErrors }
      onChange={ (event, payload, index) => {
        const s = {};
        s[name] = payload;
        self.setState(s);
      } }>
      { objToPairArray(items, "value", "label").map(menuItem) }
    </FormsySelect>
  );
};

export const makeSelectField = (options) => baseSelectField(options);
