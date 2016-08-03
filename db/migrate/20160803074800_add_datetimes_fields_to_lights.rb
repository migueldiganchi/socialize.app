class AddDatetimesFieldsToLights < ActiveRecord::Migration
  def change
    add_column :lights, :created_at, :datetime
    add_column :lights, :updated_at, :datetime
    add_column :lights, :deleted_at, :datetime
  end
end
