class AddPageToLightsRelation < ActiveRecord::Migration

  def change
    add_column :lights, :page_id, :integer
    add_index :lights, :page_id
  end

end
