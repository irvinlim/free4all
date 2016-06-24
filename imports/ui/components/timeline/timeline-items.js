import React from 'react';
import Subheader from 'material-ui/Subheader';
import { Row, Col } from 'react-bootstrap';
import { GridList, GridTile } from 'material-ui/GridList';
import { Card, CardActions, CardHeader, CardText, CardTitle, CardMedia } from 'material-ui/Card';

import * as Colors from 'material-ui/styles/colors';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as ImagesHelper from '../../../util/images';

const listItemRow = (ga) => (
  <Card key={ ga._id } style={{ marginBottom: 20 }} className="giveaway">
    <Row style={{ margin: 0, height: 200 }}>
      <Col xs={4} sm={3} style={{ padding: 0 }}>
        <CardMedia>
          { ga.avatarId ?
              ImagesHelper.make(ga.avatarId, 200, 200, { height: 200, objectFit: "cover" }) :
                <div className="icon-avatar" style={{ backgroundColor: GiveawaysHelper.getStatusColor(ga) }}>
                  { GiveawaysHelper.getCategoryIcon(ga, { fontSize: 64, lineHeight: "200px", color: Colors.grey50 }) }
                </div>
          }
        </CardMedia>
      </Col>
      <Col xs={8} sm={9} style={{ padding: 15 }}>
        <h3 className="lines-1">{ ga.title }</h3>
        <h5 className="lines-1">{ GiveawaysHelper.categoryBreadcrumbs(ga) }</h5>
        <p className="description lines-2">{ GiveawaysHelper.description(ga) }</p>
        <p className="small-text lines-1">{ GiveawaysHelper.compactDateRange(ga.startDateTime, ga.endDateTime) }</p>
      </Col>
    </Row>
  </Card>
);

export const TimelineItems = ({ giveaways, props }) => (
  <div id="timeline-items">
    <Subheader>Showing items { props.offset + 1 }-{ props.offset + props.perPage }</Subheader>
    { giveaways.map(listItemRow) }
  </div>
);
