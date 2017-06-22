class AddSenderIdToChatRooms < ActiveRecord::Migration[5.0]
  def change
    add_column :chat_rooms, :sender_id, :integer
  end
end
