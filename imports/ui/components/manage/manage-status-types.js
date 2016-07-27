import React from 'react';
import Formsy from 'formsy-react';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

import { StatusTypes } from '../../../api/status-types/status-types';
import { insertStatusType, updateStatusType, removeStatusType, reorderStatusType } from '../../../api/status-types/methods';

import * as Colors from 'material-ui/styles/colors';
import * as UsersHelper from '../../../util/users';
import * as IconsHelper from '../../../util/icons';
import * as LayoutHelper from '../../../util/layout';
import * as FormsHelper from '../../../util/forms';

const Handle = SortableHandle(() => (
  <IconButton tooltip="Drag to reorder" onTouchTap={ event => event.preventDefault() }>
    { IconsHelper.icon("menu", { color: Colors.grey700, fontSize: 18 }) }
  </IconButton>
));

const SortableItem = SortableElement(({ self, statusType }) => {
  if (!statusType)
    return null;
  else if (statusType._id == self.state.currentlyEditing)
    return <EditRow self={self} statusType={statusType} />;
  else
    return <ItemRow self={self} statusType={statusType} />;
});

const ItemRow = ({ self, statusType }) => (
  <div className="sortable-row flex-row" data-id={ statusType._id }>
    <div className="col col-xs-1 col-center">
      { self.state.currentlyEditing ? null : <Handle /> }
    </div>

    <div className="col col-xs-8 col-sm-9">
      <div className="flex-row nopad">
        <div className="col col-xs-12 col-sm-6">
          { statusType.label }
        </div>
        <div className="col col-xs-12 col-sm-6">
          <div className="colour-preview" style={{ backgroundColor: statusType.hexColour }}>&nbsp;</div>
          { statusType.hexColour }
        </div>
      </div>
    </div>
    <div className="col col-xs-3 col-sm-2 col-right">
      <IconButton className="row-action" onTouchTap={ self.handleSelectEdit.bind(self) } tooltip="Edit">
        { IconsHelper.icon("edit", { color: Colors.grey700, fontSize: 18 }) }
      </IconButton>
      <IconButton className="row-action" onTouchTap={ self.handleDelete.bind(self) } tooltip="Delete">
        { IconsHelper.icon("delete", { color: Colors.grey700, fontSize: 18 }) }
      </IconButton>
    </div>
  </div>
);

const EditRow = ({ self, statusType }) => (
  <Formsy.Form id="edit-row" onValidSubmit={ self.handleSaveEdit(statusType ? statusType._id : null) }>
    <div className="sortable-row flex-row" data-id={ statusType ? statusType._id : null }>

      <div className="col col-xs-8 col-sm-9 col-xs-offset-1">
        <div className="flex-row nopad">
          <div className="col col-xs-12 col-sm-6">
            { FormsHelper.makeTextField({
              self, name: "label", required: true, style: { fontSize: 14 },
              validationErrors: { isDefaultRequiredValue: "Please enter a label." },
            }) }
          </div>

          <div className="col col-xs-12 col-sm-6">
            { FormsHelper.makeColourField({ self, name: "hexColour" }) }
          </div>
        </div>
      </div>

      <div className="col col-xs-3 col-sm-2 col-right">
        <IconButton type="submit" className="row-action" tooltip="Save" formNoValidate>
          { IconsHelper.icon("save", { color: Colors.grey700, fontSize: 18 }) }
        </IconButton>
        <IconButton className="row-action" onTouchTap={ self.handleCancelEdit.bind(self) } tooltip="Cancel edit">
          { IconsHelper.icon("cancel", { color: Colors.grey700, fontSize: 18 }) }
        </IconButton>
      </div>

    </div>
  </Formsy.Form>
);

const SortableList = SortableContainer(({ self, items }) => (
  <div className="sortable-list-table">
    <div className="sortable-list-header flex-row hidden-xs">
      <div className="col col-xs-8 col-sm-9 col-xs-offset-1">
        <div className="flex-row nopad">
          <div className="col col-xs-12 col-sm-6">Status Type Label</div>
          <div className="col col-xs-12 col-sm-6">Colour</div>
        </div>
      </div>
    </div>

    <div className="sortable-list-body">
      { items.map((statusTypeId, index) => {
        const statusType = StatusTypes.findOne(statusTypeId);
        return statusType ? <SortableItem key={index} index={index} statusType={ statusType } self={self} /> : null;
      }) }
      { self.state.currentlyEditing == "new" ? <EditRow self={self} statusType={null} /> : null }
    </div>

    <div className="sortable-list-footer flex-row">
      <div className="col col-xs-12 col-right">
        <FlatButton label="Add New" onTouchTap={ self.handleAddNew.bind(self) } />
      </div>
    </div>
  </div>
));

export class ManageStatusTypes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submitted: false,
      currentlyEditing: null,
    };
  }

  onSortEnd({ oldIndex, newIndex }) {
    if (oldIndex == newIndex)
      return;

    const oldIndexStatusTypeId = this.props.statusTypes[oldIndex]._id;
    const newIndexStatusType = this.props.statusTypes[newIndex];

    reorderStatusType.call({ _id: oldIndexStatusTypeId, newIndex: newIndexStatusType.relativeOrder }, FormsHelper.bertAlerts("Status Types reordered."));
  }

  handleAddNew() {
    this.setState({ currentlyEditing: "new" });
  }

  handleSelectEdit(event) {
    event.preventDefault();
    const statusTypeId = $(event.target).closest(".sortable-row").data('id');
    this.selectEditRow(statusTypeId);
  }

  handleCancelEdit(event) {
    event.preventDefault();
    const statusTypeId = $(event.target).closest(".sortable-row").data('id');
    this.selectEditRow(null, statusTypeId);
  }

  handleSaveEdit(statusTypeId) {
    return () => {
      const label = this.state.label;
      const hexColour = this.state.hexColour;

      if (!statusTypeId) {
        const maxOrder = StatusTypes.findOne({}, { sort: { relativeOrder: -1 } });
        const relativeOrder = maxOrder ? maxOrder.relativeOrder + 1 : 0;

        insertStatusType.call({ label, hexColour, relativeOrder }, FormsHelper.bertAlerts("Status Type added."));
      } else {
        updateStatusType.call({ _id: statusTypeId, label, hexColour }, FormsHelper.bertAlerts("Status Type updated."));
      }

      this.selectEditRow(null);
    };
  }

  handleDelete(event) {
    event.preventDefault();
    const _id = $(event.target).closest(".sortable-row").data('id');
    removeStatusType.call({ _id }, FormsHelper.bertAlerts("Status Type removed."));
  }

  selectEditRow(id) {
    const statusType = StatusTypes.findOne(id);
    if (!statusType) {
      this.setState({
        currentlyEditing: null,
        label: null,
        hexColour: undefined,
      });
    } else {
      this.setState({
        currentlyEditing: id,
        label: statusType.label,
        hexColour: statusType.hexColour
      });
    }
  }

  render() {
    return (
      <div className="flex-row">

        <div className="col col-xs-12 nopad">

          <Card className="card">
            <CardTitle title="Manage Status Types" />

            <CardText>
              <div className="sortable-list">
                <div className="flex-row nopad">
                  <div className="col col-xs-12 nopad">

                    <SortableList
                      self={this}
                      useDragHandle={true}
                      items={ this.props.statusTypes }
                      onSortEnd={ this.onSortEnd.bind(this) }
                      lockToContainerEdges={true}
                      helperClass="sortable-active"
                      lockAxis="y"
                      lockOffset={0} />

                  </div>
                </div>
              </div>
            </CardText>
          </Card>

        </div>
      </div>
    );
  }
}
