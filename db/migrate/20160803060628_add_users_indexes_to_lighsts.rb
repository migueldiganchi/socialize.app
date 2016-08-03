class AddUsersIndexesToLighsts < ActiveRecord::Migration
  def change
    add_index :lights, :user_id
  end
end
