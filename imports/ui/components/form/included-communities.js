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
    let communities = []
      , homeCommunity = {label: "", value:""}
      , homeCommunityId = this.props.user.profile.homeCommunityId
      , communityIds = this.props.user.communityIds
      , allCommunities = this.props.user.communityIds

    if(communityIds.indexOf(homeCommunityId) == -1)
      allCommunities = communityIds.concat([homeCommunityId]);

    this.subscription = Tracker.autorun(function(){
      Meteor.subscribe('communities-by-id', allCommunities, function(){
        if(communityIds)
          communities = Communities.find({ _id: {$in: communityIds}}, {sort:{createdAt: 1}}).fetch();
        if(homeCommunityId && !self.props.edit){
          homeComm = Communities.findOne(homeCommunityId);
          homeCommunity = { value: homeComm._id, label: homeComm.name };
        } else if (self.props.edit){
          console.log(self.props.edit)
          homeCommunity = self.props.edit;
        }

      const options = communities.map(community => ({ value: community._id, label: community.name }))
      self.props.setOptVal(options, homeCommunity )

      })
    })
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
