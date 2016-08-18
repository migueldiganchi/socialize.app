class AddNewIndexToPagesTable < ActiveRecord::Migration
  def change
    add_index :pages, :fb_id
  end
end
