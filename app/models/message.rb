class Message < ApplicationRecord
  belongs_to :user
  belongs_to :chat_room
  belongs_to :conversation

  after_create_commit { MessageBroadcastJob.perform_later(self) }
  after_create :abc

  def timestamp
    created_at.strftime('%H:%M:%S %d %B %Y')
  end

  def abc
    # ActionCable.server.broadcast "chat_rooms_#{self.conversation_id}_channel",
    #   message: render_message
  end

  def render_message
    MessagesController.render partial: 'messages/message', locals: {message: self}
  end
end
