import React from 'react';
import Formsy from 'formsy-react';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

import { ParentCategories } from '../../../api/parent-categories/parent-categories';
import { insertParentCategory, updateParentCategory, removeParentCategory, reorderParentCategory } from '../../../api/parent-categories/methods';

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

const SortableItem = SortableElement(({ self, parentCat }) => {
  if (!parentCat)
    return null;
  else if (parentCat._id == self.state.currentlyEditing)
    return <EditRow self={self} parentCat={parentCat} />;
  else
    return <ItemRow self={self} parentCat={parentCat} />;
});

const ItemRow = ({ self, parentCat }) => (
  <div className="sortable-row flex-row" data-id={ parentCat._id }>
    <div className="col col-xs-1 col-center">
      { self.state.currentlyEditing ? null : <Handle /> }
    </div>

    <div className="col col-xs-8 col-sm-9">
      <div className="flex-row nopad">
        <div className="col col-xs-12 col-sm-6">
          { parentCat.name }
        </div>
        <div className="col col-xs-12 col-sm-6">
          { IconsHelper.icon(parentCat.iconClass, { color: Colors.grey700, fontSize: 16, marginRight: 10 }) }
          { parentCat.iconClass }
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

const EditRow = ({ self, parentCat }) => (
  <Formsy.Form id="edit-row" onValidSubmit={ self.handleSaveEdit(parentCat ? parentCat._id : null) }>
    <div className="sortable-row flex-row" data-id={ parentCat ? parentCat._id : null }>

      <div className="col col-xs-8 col-sm-9 col-xs-offset-1">
        <div className="flex-row nopad">
          <div className="col col-xs-12 col-sm-6">
            { FormsHelper.makeTextField({
              self, name: "name", required: true, style: { fontSize: 14 },
              validationErrors: { isDefaultRequiredValue: "Please enter a category name." },
            }) }
          </div>

          <div className="col col-xs-12 col-sm-6">
            { FormsHelper.makeTextField({
              self, name: "iconClass", required: true, style: { fontSize: 14 },
              validationErrors: { isDefaultRequiredValue: "Please enter the className for the icon." },
            }) }
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
          <div className="col col-xs-12 col-sm-6">Category Name</div>
          <div className="col col-xs-12 col-sm-6">IconClass</div>
        </div>
      </div>
    </div>

    <div className="sortable-list-body">
      { items.map((parentCatId, index) => {
        const parentCat = ParentCategories.findOne(parentCatId);
        return parentCat ? <SortableItem key={index} index={index} parentCat={ parentCat } self={self} /> : null;
      }) }
      { self.state.currentlyEditing == "new" ? <EditRow self={self} parentCat={null} /> : null }
    </div>

    <div className="sortable-list-footer flex-row">
      <div className="col col-xs-12 col-right">
        <FlatButton label="Add New" onTouchTap={ self.handleAddNew.bind(self) } />
      </div>
    </div>
  </div>
));

export class ManageParentCategories extends React.Component {
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

    const oldIndexCatId = this.props.parentCategories[oldIndex]._id;
    const newIndexCat = this.props.parentCategories[newIndex];

    reorderParentCategory.call({ _id: oldIndexCatId, newIndex: newIndexCat.relativeOrder }, FormsHelper.bertAlerts("Parent categories reordered."));
  }

  handleAddNew() {
    this.setState({ currentlyEditing: "new" });
  }

  handleSelectEdit(event) {
    event.preventDefault();
    const parentCatId = $(event.target).closest(".sortable-row").data('id');
    this.selectEditRow(parentCatId);
  }

  handleCancelEdit(event) {
    event.preventDefault();
    const parentCatId = $(event.target).closest(".sortable-row").data('id');
    this.selectEditRow(null, parentCatId);
  }

  handleSaveEdit(parentCatId) {
    return () => {
      const name = this.state.name;
      const iconClass = this.state.iconClass;

      if (!parentCatId) {
        const maxOrderCat = ParentCategories.findOne({}, { sort: { relativeOrder: -1 } });
        const relativeOrder = maxOrderCat ? maxOrderCat.relativeOrder + 1 : 0;

        insertParentCategory.call({ name, iconClass, relativeOrder }, FormsHelper.bertAlerts("Parent category added."));
      } else {
        updateParentCategory.call({ _id: parentCatId, name, iconClass }, FormsHelper.bertAlerts("Parent category updated."));
      }

      this.selectEditRow(null);
    };
  }

  handleDelete(event) {
    event.preventDefault();
    const _id = $(event.target).closest(".sortable-row").data('id');
    removeParentCategory.call({ _id }, FormsHelper.bertAlerts("Parent category removed."));
  }

  selectEditRow(id) {
    const parentCat = ParentCategories.findOne(id);
    if (!parentCat) {
      this.setState({
        currentlyEditing: null,
        name: null,
        iconClass: null,
      });
    } else {
      this.setState({
        currentlyEditing: id,
        name: parentCat.name,
        iconClass: parentCat.iconClass
      });
    }
  }

  render() {
    return (
      <div className="flex-row">

        <div className="col col-xs-12 nopad">

          <Card className="card">
            <CardTitle title="Manage Parent Categories" />

            <CardText>
              <div className="sortable-list">

                <SortableList
                  self={this}
                  useDragHandle={true}
                  items={ this.props.parentCategories }
                  onSortEnd={ this.onSortEnd.bind(this) }
                  lockToContainerEdges={true}
                  helperClass="sortable-active"
                  lockAxis="y"
                  lockOffset={0} />

              </div>
            </CardText>
          </Card>

        </div>
      </div>
    );
  }
}
