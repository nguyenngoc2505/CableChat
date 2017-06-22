var ready = function () {

  /**
   * When the send message link on our home page is clicked
   * send an ajax request to our rails app with the sender_id and
   * recipient_id
   */

  $('.start-conversation').click(function (e) {
    e.preventDefault();

    console.log("start");

    var sender_id = $(this).data('sid');
    var recipient_id = $(this).data('rip');

    $.post("/conversations", { sender_id: sender_id, recipient_id: recipient_id }, function (data) {
      chatBox.chatWith(data.conversation_id);
      App['conversation' + data.conversation_id] = App.cable.subscriptions.create({
        channel: "ChatRoomsChannel",
        chat_room_id: data.conversation_id
      },
      {
        connected: function() {},
        disconnected: function() {},
        received: function(data1) {
          console.log(data1);
          var chatbox = $("#chatbox_" + data.conversation_id + " .chatboxcontent");
          chatbox.append(data1.message);
          chatbox.scrollTop(chatbox[0].scrollHeight);
        },
        send_message: function(message, chat_room_id) {
          return this.perform('send_message', {
            message: message,
            chat_room_id: chat_room_id
          });
        }
      });
      if (App.cable.subscriptions['subscriptions'].length > 1) {
        var uniqSubcriptions = []
        App.cable.subscriptions['subscriptions'].forEach(function(item) {
            if(uniqSubcriptions.indexOf(item.identifier) < 0) {
                uniqSubcriptions.push(item.identifier);
            }
            else {
                App.cable.subscriptions.remove(item);
            }
        });
      };
    });
  });

  /**
   * Used to minimize the chatbox
   */

  $(document).on('click', '.toggleChatBox', function (e) {
    e.preventDefault();

    var id = $(this).data('cid');
    chatBox.toggleChatBoxGrowth(id);
  });

  /**
   * Used to close the chatbox
   */

  $(document).on('click', '.closeChat', function (e) {
    e.preventDefault();

    var id = $(this).data('cid');
    chatBox.close(id);
  });


  /**
   * Listen on keypress' in our chat textarea and call the
   * chatInputKey in chat.js for inspection
   */

  $(document).on('keydown', '.chatboxtextarea', function (event) {
    var id = $(this).data('cid');
    chatBox.checkInputKey(event, $(this), id);
  });

  /**
   * When a conversation link is clicked show up the respective
   * conversation chatbox
   */

  $('a.conversation').click(function (e) {
    e.preventDefault();

    var conversation_id = $(this).data('cid');
    chatBox.chatWith(conversation_id);
  });
}

$(document).ready(ready);
$(document).on("page:load", ready);
$(document).on("turbolinks:load", ready);
