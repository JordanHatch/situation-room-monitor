(function() {
  "use strict";

  var root = this,
      $ = root.jQuery;
  if(typeof root.SituationRoom === 'undefined') { root.SituationRoom = {}; }

  var roomStatus = {
    $template: function() {
      return $('li.template');
    },
    requestRoomStatus: function() {
      $.ajax({
        url: '/rooms',
        dataType: 'json',
      }).done(roomStatus.updateRoomStatus);
      roomStatus.scheduleNextRequest();
    },
    updateRoomStatus: function(data) {
      $('li:not(.template)').remove();
      $.each(data, roomStatus.insertRoomItem);
    },
    insertRoomItem: function(room, timestamp) {
      var item = roomStatus.$template().clone();
      item.removeClass('template');
      item.find('h2').text(room);

      if (roomStatus.isOk(timestamp)) {
        item.addClass('ok');
      } else {
        item.addClass('alert');
      }

      var statusText = roomStatus.statusText(timestamp);
      item.find('.status').text(statusText);

      item.insertBefore(roomStatus.$template());
    },
    isOk: function(timestamp) {
      var lastUpdatedAt = moment(timestamp);
      var difference = moment().diff(lastUpdatedAt, 'minutes');

      return (difference < 5);
    },
    statusText: function(timestamp) {
      var lastUpdatedAt = moment(timestamp)
      return lastUpdatedAt.fromNow();
    },
    scheduleNextRequest: function(){
      setTimeout(roomStatus.requestRoomStatus, 10000);
    },
    init: function() {
      roomStatus.requestRoomStatus();
    }
  }

  root.SituationRoom.roomStatus = roomStatus;
  roomStatus.init();
}).call(this);
