class TableNameChanging < ActiveRecord::Migration
  def change
    rename_table :lights, :posts
  end
end
