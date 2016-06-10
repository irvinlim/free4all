Herald.addCourier('serviceAnnouncement', {
  media: {
    onsite: {}
  },

  message: function () {
    return {
      title: this.data.title,
      body: this.data.body,
      timestamp: Chronos.liveMoment(this.timestamp).fromNow(),
      avatar: this.data.avatar,
      url: this.data.url,
    }
  }
});
