import React from 'react';

export const twoColumns = (col1, col2, col1width=64, padding=0, margin=16, className="") => (
  <div className={className}>
    <div style={{ width: (col1width + padding * 2), display: "inline-block", verticalAlign: "top", textAlign: "center" }}>
      { col1 }
    </div>
    <div style={{ width: "calc(100% - " + (col1width + padding * 2 + margin) + "px)", marginLeft: margin, display: "inline-block", verticalAlign: "top" }}>
      { col2 }
    </div>
  </div>
);

export const threeColumns = (col1, col2, col3, col1width=64, col3width=64, padding=0, margin=16, className="") => (
  <div className={className}>
    <div style={{ width: (col1width + padding * 2), display: "inline-block", verticalAlign: "top", textAlign: "center" }}>
      { col1 }
    </div>
    <div style={{ width: "calc(100% - " + (col1width + col3width + padding * 4 + margin * 2) + "px)", marginLeft: margin, display: "inline-block", verticalAlign: "top" }}>
      { col2 }
    </div>
    <div style={{ width: (col3width + padding * 2), display: "inline-block", verticalAlign: "top" }}>
      { col3 }
    </div>
  </div>
);
