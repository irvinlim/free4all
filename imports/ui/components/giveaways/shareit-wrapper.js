import React from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

// Wrapping a Blaze component: https://www.meteor.com/tutorials/react/adding-user-accounts

export default class ShareItWrapper extends React.Component {
  componentDidMount() {
    const ga = this.props.ga;
    const shareData = {
      title: ga.title,
      description: ga.description,
    };

    this.view = Blaze.renderWithData(Template.shareit, shareData, ReactDOM.findDOMNode(this.refs.container));
  }

  componentWillUnmount() {
    Blaze.remove(this.view);
  }

  render() {
    return <span ref="container" />;
  }
}
