import * as app from 'tns-core-modules/application';
import * as moment from 'moment';
import { ItemType } from '~/core/constants';

// Date converter
export const dateConverter = function (value) {
  if (value !== undefined) {
    return moment(value).format('MMM D, YYYY');
  } else {
    return '';
  }
};

// Convert an item to the indicator calss name
export const itemToIndicatorClassConverter = function (value) {
  if (value !== undefined) {
    return ItemType.indicatorClassFromType(value.type);
  } else {
    return '';
  }
};

// Registering converters
app.getResources().dateConverter = dateConverter;
app.getResources().itemToIndicatorClassConverter = itemToIndicatorClassConverter;
