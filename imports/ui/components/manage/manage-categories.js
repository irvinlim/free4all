import React from 'react';
import Formsy from 'formsy-react';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

import { Categories } from '../../../api/categories/categories';

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

const SortableItem = SortableElement(({ self, cat }) => {
  if (cat._id == self.state.currentlyEditing)
    return <EditRow self={self} cat={cat} />;
  else
    return <ItemRow self={self} cat={cat} />
});

const ItemRow = ({ self, cat }) => (
  <div className="sortable-row flex-row" data-id={ cat._id }>
    <div className="col col-xs-1 col-center">
      { self.state.currentlyEditing ? null : <Handle /> }
    </div>

    <div className="col col-xs-5">
      { cat.name }
    </div>
    <div className="col col-xs-4">
      { IconsHelper.icon(cat.iconClass, { color: Colors.grey700, fontSize: 16, marginRight: 10 }) }
      { cat.iconClass }
    </div>
    <div className="col col-xs-2 col-right">
      <IconButton className="row-action" onTouchTap={ self.handleSelectEdit.bind(self) } tooltip="Edit">
        { IconsHelper.icon("edit", { color: Colors.grey700, fontSize: 18 }) }
      </IconButton>
      <IconButton className="row-action" onTouchTap={ self.handleDelete.bind(self) } tooltip="Delete">
        { IconsHelper.icon("delete", { color: Colors.grey700, fontSize: 18 }) }
      </IconButton>
    </div>
  </div>
);

const EditRow = ({ self, cat }) => (
  <Formsy.Form id="edit-row" onValidSubmit={ self.handleSaveEdit.bind(self) }>
    <div className="sortable-row flex-row" data-id={ cat ? cat._id : "new" }>

      <div className="col col-xs-5 col-xs-offset-1">
        { FormsHelper.makeTextField({
          self, name: "cat-name", required: true, style: { fontSize: 14 },
          validationErrors: { isDefaultRequiredValue: "Please enter a category name." },
        }) }
      </div>

      <div className="col col-xs-4">
        { FormsHelper.makeTextField({
          self, name: "cat-iconClass", required: true, style: { fontSize: 14 },
          validationErrors: { isDefaultRequiredValue: "Please enter the className for the icon." },
        }) }
      </div>

      <div className="col col-xs-2 col-right">
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

const SortableList = SortableContainer(({ self, parentCat, items }) => (
  <div className="sortable-list-table">
    <div className="sortable-list-header flex-row">
      <div className="col col-xs-5 col-xs-offset-1">Category Name</div>
      <div className="col col-xs-4">IconClass</div>
    </div>

    <div className="sortable-list-body">
      {items.map((cat, index) =>
        <SortableItem key={`cat-${index}`} index={index} cat={cat} self={self} />
      )}
      { self.state.currentlyEditing == "new" ?
        <EditRow self={self} cat={null} /> : null
      }
    </div>

    <div className="sortable-list-footer flex-row">
      <div className="col col-xs-12 col-right">
        <FlatButton label="Add New" onTouchTap={ self.handleAddNew.bind(self) } />
      </div>
    </div>
  </div>
));

export class ManageCategories extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submitted: false,
      currentlyEditing: null,
    };

    this.props.parentCategories.forEach(parentCat => {
      this.state[`order-${parentCat._id}`] = [];
    });
  }

  makeItems() {
    const self = this;
    const items = [];

    const makeState = (cat, props) => {
      const s = {};
      props.forEach(prop => {
        s[`cat-${prop}-${cat._id}`] = cat[prop];
      });
      return s;
    };

    this.props.parentCategories.forEach(parentCat => {
      const children = [];
      this.props.categories.forEach(cat => {
        if (cat.parent !== parentCat._id)
          return true;

        self.setState(makeState(cat, ['name', 'iconClass']));

        children.push(cat);
      });

      const s = {};
      s[`order-${parentCat._id}`] = children;
      self.setState(s);
    });
  }

  componentWillMount() {
    this.makeItems();
  }

  onSortEnd(parentCatId) {
    const self = this;
    return ({ oldIndex, newIndex }) => {
      const s = {};
      s[`order-${parentCatId}`] = arrayMove(self.state[`order-${parentCatId}`], oldIndex, newIndex)
      self.setState(s);
    };
  }

  handleAddNew(event) {
    this.setState({ currentlyEditing: "new" });
  }

  handleSelectEdit(event) {
    const $row = $(event.target).closest(".sortable-row");
    this.selectEditRow($row.data('id'));
  }

  handleCancelEdit(event) {
    this.selectEditRow(null);
  }

  handleSaveEdit(event) {
    this.selectEditRow(null);
  }

  handleDelete(event) {
    const $row = $(event.target).closest(".sortable-row");
    this.selectEditRow($row.data('id'));
  }

  selectEditRow(id) {
    const cat = Categories.findOne(id);
    if (!cat)
      this.setState({
        currentlyEditing: null,
        'cat-name': null,
        'cat-iconClass': null,
      });
    else
      this.setState({
        currentlyEditing: id,
        'cat-name': cat.name,
        'cat-iconClass': cat.iconClass
      });
  }

  render() {
    return (
      <div className="flex-row">

        <div className="col col-xs-12 nopad">

          <Card>
            <CardTitle title="Manage Categories" />

            <CardText>
              <div className="flex-row">
                <div className="col col-xs-12">
                  { this.props.parentCategories.map((parentCat, index) => (
                      <div className="sortable-list" key={ `parentCat-${index}` }>
                        <h3>{ parentCat.name }</h3>

                        <SortableList
                          self={this}
                          parentCat={ parentCat }
                          useDragHandle={true}
                          items={ this.state[`order-${parentCat._id}`] }
                          onSortEnd={ this.onSortEnd(parentCat._id) }
                          lockToContainerEdges={true}
                          helperClass="sortable-active"
                          lockAxis="y"
                          lockOffset={0} />
                      </div>
                    ))
                  }
                </div>
              </div>
            </CardText>
          </Card>

        </div>
      </div>
    );
  }
}
