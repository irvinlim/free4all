import React from 'react';
import Select from 'react-select';
import { Communities } from '../../../api/communities/communities'

export default class IncludedCommunities extends React.Component {
  constructor(props){
    super(props)

    this.subscription = null;

  }


  componentDidMount(){
    const self = this;
    let communities
      , prefilledCommunity
      , user = Meteor.user()
      , homeCommunityId = user.profile.homeCommunityId
      , communityIds = user.communityIds
      , allCommunities = user.communityIds || []

    if(communityIds && communityIds.indexOf(homeCommunityId) == -1)
      allCommunities = communityIds.concat([homeCommunityId]);

    this.subscription = Tracker.autorun(function(){
      Meteor.subscribe('communities-by-id', allCommunities, function(){

        if(communityIds){
          const data = Communities.find({ _id: {$in: communityIds}}, {sort:{createdAt: 1}}).fetch();
          communities = data.map(community => ({ value: community._id, label: community.name }))
        }

        if(homeCommunityId && !self.props.edit){
          homeComm = Communities.findOne(homeCommunityId);
          prefilledCommunity = [{ value: homeComm._id, label: homeComm.name }];
        } else if (self.props.edit){
          const includedComms =
            Communities
            .find({ _id: {$in: self.props.edit}}, {sort:{createdAt: 1}}).fetch()
            .map(community => ({ value: community._id, label: community.name }));
          prefilledCommunity = includedComms;
        }

      self.props.setOptVal(communities, prefilledCommunity );

      })
    })
    // react-select default 'value' and 'option' value is undefined
    this.props.setOptVal(communities, prefilledCommunity)
  }

  componentWillUnmount(){
    this.subscription && this.subscription.stop();
  }

  render(){
    return(
      <Select
        name="included-communities"
        placeholder="Shown in selected communities"
        value={ this.props.value }
        options ={ this.props.options }
        onChange={ this.props.handleChange }
        multi={ true } />
    )
  }
}
