import React from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import { Grid, Row, Col } from 'react-bootstrap';

import * as IconsHelper from '../../../util/icons';

const customContentStyle = {
  width: "93%",
  maxWidth: "none"
};

const customTitleStyle = {
  color: "#FFFFFF",
  backgroundColor: "#3F51B5",
  marginBottom: "33px"
}
/**
 * The dialog width has been set to occupy the full width of browser through the `contentStyle` property.
 */
export default class SelectHome extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      open: props.isHomeLocOpen,
    }

  }

  handleOpen() {
    this.props.openSelectHomeModal();
  }

  handleClose() {
    this.props.closeSelectHomeModal();
  }

  componentWillReceiveProps(nextProps){
    this.setState({ open: nextProps.isHomeLocOpen })
  }

  render() {

    return (
      <div>
        { this.props.homeLocation ?
        <FloatingActionButton 
          style={{marginBottom: "10px"}} 
          onTouchTap={this.props.setMapCenter(this.props.homeLocation)} >
          { IconsHelper.materialIcon("home") }
        </FloatingActionButton>
        :
        <div>
          <IconButton
          tooltip="Home Location not set"
          style={{ zIndex: 1, position: "absolute" }} />
          <FloatingActionButton disabled={true} >
          { IconsHelper.materialIcon("home", {color:"black"}) }
          </FloatingActionButton>
        </div>
        }

        <Dialog
          title="View a community"
          titleStyle={customTitleStyle}
          modal={false}
          contentStyle={customContentStyle}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this)}
        >
        <Grid>
          <Row>
            <Col xs={4} style={{textAlign:"center"}}>
              <svg className="schoolCommunity" viewBox="0 0 637.000000 244.000000" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,244.000000) scale(0.100000,-0.100000)"
                fill="#000000" stroke="none">
                <path d="M5099 2360 c-223 -20 -413 -93 -520 -200 -97 -96 -139 -205 -139
                -360 0 -162 40 -270 139 -373 106 -112 231 -180 531 -290 293 -107 394 -167
                441 -263 41 -86 23 -200 -45 -281 -38 -45 -150 -99 -238 -113 -115 -20 -350
                -8 -468 24 -141 37 -228 75 -324 141 l-66 45 0 -153 c0 -83 3 -161 6 -173 4
                -14 26 -28 73 -46 285 -111 722 -138 1020 -62 323 82 494 276 495 564 0 164
                -44 284 -147 396 -105 114 -265 206 -575 328 -347 136 -442 211 -442 347 0 74
                31 134 89 170 62 40 122 56 251 70 195 20 395 -17 580 -109 52 -26 98 -48 103
                -50 4 -2 7 59 7 136 l0 141 -57 21 c-198 75 -482 111 -714 90z"/>
                <path d="M200 1290 l0 -1010 140 0 140 0 0 737 c0 590 3 735 13 725 6 -7 230
                -324 497 -705 436 -622 490 -694 534 -722 l49 -30 204 -3 203 -3 0 1010 0
                1011 -145 0 -145 0 -2 -735 -3 -735 -470 672 c-259 370 -488 693 -510 717 -68
                74 -91 81 -312 81 l-193 0 0 -1010z"/>
                <path d="M2382 1558 c3 -731 4 -744 26 -821 77 -276 261 -436 577 -502 110
                -23 327 -30 453 -16 371 43 584 197 683 496 l24 70 3 758 3 757 -211 0 -210 0
                0 -707 c0 -771 -2 -792 -57 -901 -64 -126 -175 -202 -325 -223 -231 -31 -429
                69 -500 253 -45 117 -47 164 -48 891 l0 687 -210 0 -211 0 3 -742z"/>
                </g>
              </svg>
            </Col>
            <Col xs={4} style={{textAlign:"center"}}>
              <svg className="schoolCommunity" viewBox="0 0 299.000000 118.000000" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,118.000000) scale(0.100000,-0.100000)"
                fill="#000000" stroke="none">
                <path d="M140 1061 c0 -5 13 -11 29 -14 16 -4 46 -21 66 -38 l36 -32 -3 -343
                c-3 -329 -4 -344 -24 -371 -13 -18 -35 -31 -62 -37 -23 -6 -42 -16 -42 -23 0
                -10 34 -13 155 -13 121 0 155 3 155 13 0 7 -19 17 -42 23 -27 6 -49 19 -62 37
                -20 27 -21 43 -24 329 -2 223 0 299 8 296 7 -2 139 -161 294 -353 154 -191
                287 -350 294 -353 9 -3 12 77 12 368 0 238 4 387 11 415 12 47 34 68 87 79 72
                16 25 26 -123 26 -85 0 -155 -4 -155 -8 0 -5 21 -15 48 -23 74 -22 76 -31 80
                -323 2 -136 1 -255 -2 -263 -4 -9 -97 100 -258 302 l-252 315 -113 0 c-62 0
                -113 -4 -113 -9z"/>
                <path d="M1110 1013 c0 -32 -3 -82 -6 -110 -6 -45 -4 -53 9 -53 10 0 19 12 23
                28 13 53 44 102 77 119 23 12 57 17 117 17 l85 1 3 -350 c3 -390 0 -417 -50
                -434 -17 -6 -42 -11 -54 -11 -15 0 -24 -6 -24 -15 0 -13 28 -15 190 -15 154 0
                190 3 190 14 0 8 -16 16 -42 19 -80 11 -78 -1 -78 423 l0 374 63 0 c129 -1
                185 -34 209 -125 7 -25 18 -45 25 -45 10 0 13 27 13 110 l0 110 -375 0 -375 0
                0 -57z"/>
                <path d="M1910 1061 c0 -5 18 -12 39 -16 86 -14 90 -31 90 -381 1 -299 7 -331
                79 -403 66 -65 133 -85 274 -79 93 3 112 7 164 33 70 36 116 97 133 175 6 29
                11 154 11 285 0 318 8 350 98 369 72 16 25 26 -123 26 -85 0 -155 -4 -155 -8
                0 -5 21 -15 48 -23 81 -24 83 -35 80 -359 -3 -255 -5 -278 -24 -320 -27 -58
                -71 -95 -136 -115 -139 -41 -272 15 -309 132 -14 43 -25 508 -14 580 8 55 31
                79 84 88 91 15 33 25 -149 25 -108 0 -190 -4 -190 -9z"/>
                </g>
              </svg>
            </Col>
            <Col xs={4} style={{textAlign:"center"}}>
              <svg className="schoolCommunity" viewBox="0 0 298.000000 110.000000" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,110.000000) scale(0.100000,-0.100000)"
                fill="#000000" stroke="none">
                <path d="M294 1081 c-155 -40 -225 -190 -155 -334 24 -50 100 -127 211 -214
                41 -33 87 -75 102 -95 80 -106 34 -250 -89 -276 -125 -27 -229 28 -242 129 -9
                67 -28 59 -36 -13 -12 -108 -6 -130 40 -153 33 -16 60 -20 150 -20 95 0 117 3
                163 24 134 60 193 212 137 348 -18 43 -93 123 -180 191 -150 118 -185 162
                -185 232 0 91 75 148 181 136 33 -3 73 -13 89 -21 32 -16 60 -61 60 -94 0 -21
                15 -37 23 -24 3 5 7 44 8 87 4 76 3 79 -21 88 -33 13 -217 19 -256 9z"/>
                <path d="M885 1048 c-3 -18 -17 -134 -31 -258 -77 -677 -73 -660 -136 -660
                -19 0 -28 -4 -26 -12 6 -18 270 -18 275 0 3 7 -5 12 -22 12 -52 0 -65 15 -65
                78 0 51 30 400 45 540 l6 52 143 -282 c168 -333 207 -402 226 -406 11 -2 68
                104 190 347 96 193 176 349 177 347 2 -2 12 -95 23 -207 11 -112 22 -226 26
                -254 3 -27 7 -90 9 -140 l3 -90 129 -8 c70 -4 134 -5 140 -2 25 9 12 25 -21
                25 -52 0 -95 20 -111 50 -15 29 -23 85 -85 629 -25 225 -38 287 -54 270 -7 -6
                -225 -445 -323 -648 -40 -84 -75 -152 -77 -150 -3 4 -107 204 -297 576 -63
                123 -119 223 -126 223 -7 0 -15 -15 -18 -32z"/>
                <path d="M1960 1072 c-23 -8 -7 -20 31 -25 76 -10 73 0 79 -355 6 -302 7 -320
                29 -376 52 -130 165 -203 331 -213 198 -12 345 75 396 236 26 82 33 176 34
                429 0 137 4 241 10 252 6 11 26 22 46 26 99 18 -26 31 -246 25 -34 -1 -22 -18
                18 -25 20 -3 44 -10 52 -16 39 -25 39 -558 0 -692 -17 -59 -70 -120 -132 -152
                -47 -23 -68 -28 -130 -28 -85 0 -130 15 -185 65 -90 82 -105 160 -101 521 3
                268 3 268 27 287 13 10 34 19 47 19 24 0 35 20 12 21 -71 2 -310 3 -318 1z"/>
                </g>
              </svg>
            </Col>
          </Row>
        </Grid>

        </Dialog>
      </div>
    );
  }

}