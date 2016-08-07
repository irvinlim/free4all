Herald.addCourier('notification', {
  media: {
    onsite: {}
  },

  // Object properties:
  // - title
  // - body
  // - avatar: { type, url }
  // - url
  // - metadata: { ... }
  message: function () {
    return this.data;
  }
});
