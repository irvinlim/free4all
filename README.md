# [Free4All](https://free4all.space)

*Submission for [Orbital 2016](http://orbital.comp.nus.edu.sg).*

A web app that allows users to view and share locations in NUS with freebie giveaways, on a real-time map view.

- **Team Name**: Apollo 3
- **Team Members**: Leon Mak, Irvin Lim
- **Proposed Level of Achievement**: Apollo 11

## Problem Scope
In institutions such as NUS, event organisers often provide freebie giveaways, such as in the form of free goodie bags or catered buffet food for their events. While this may be an incentive to attract potential members of the public to attend their events, overproduction of freebies often occurs, which leads to waste of food or other items which could potentially have been given out.

At the same time, many members of the public are attracted to the notion of freebies, and often do not mind travelling to get a free meal, or perhaps a few vouchers. These people could potentially help to reduce the amount of materials wasted by attending these events to clear the uncollected freebies.

## Our Solution
Free4All aims to tackle both problems by providing to the public a real-time map of current giveaways in the user’s vicinity, and also providing a platform for event organisers or other members of the public to share current or upcoming freebie giveaways.

People can also share a giveaway if they are organising an event and wish to attract more audience members by using freebies as incentives. Others can also share giveaways if they come across one, in order to “give back” to the community and share good stuff with others. Also, the status of the giveaway can also be updated, such as low stock levels or if the event is ending soon, making the app as real-time as possible.

Giveaways can be curated using ratings and comments in order to sieve out the bad from the good, along with systems in place to flag giveaways or user comments to be removed if they are found to be inappropriate. Moderators will then be able to view these flagged comments/giveaways and review them accordingly.

This can be extended beyond just NUS, and we can create groupings called "communities" whereby members of the community can see all and only giveaways within that specific community. Students and staff from other universities can also host their giveaways on Free4All, without having to worry about any collisions between communities. The concept of communities can be extended beyond just grouping by university, but also neighbourhoods or any sort of location-based classification.

Although not yet implemented, we also planned to send out timely mailing lists with information about upcoming giveaways, to users who subscribe to them. These mailing lists will curate the top upcoming giveaways to be emailed to each user. This mailing list would also serve as an additionaly event publicity platform within the school community (or just any defined community, really).

## What We Used

### Our Stack
- **Language:** [JavaScript ES2015 (ES6)](https://babeljs.io/docs/learn-es2015/), with [Babel](https://babeljs.io/) as the transpiler
- **Framework:** [Meteor.js](https://www.meteor.com)
- **Rendering Engine:** [React](https://facebook.github.io/react/)
- **Database:** [MongoDB](https://www.mongodb.com/)

### Frontend
- **Framework:** [React Bootstrap](https://react-bootstrap.github.io/)
- **Design:** [Google's Material Design](http://material.google.com/), implemented by [Material-UI for React](http://www.material-ui.com/)

### Map Components
- **Map Library:** [Leaflet](http://leafletjs.com/)
- **Map Tiles:** [Mapbox](https://www.mapbox.com/)
- **Map Data:** [OpenStreetMap](http://www.openstreetmap.org/)

### Servers
- **Hosting:** [Modulus](https://modulus.io/)
- **Images:** [Cloudinary](https://cloudinary.com/)
- **CDN:** [CloudFlare](https://www.cloudflare.com/)

## Acknowledgements
We would like to thanks NUS School of Computing for offering us the opportunity and help rendered throughout Orbital, especially our advisor Koh Chang Hui and the members of our Evaluation Group for offering us valuable feedback throughout development of Free4All.
