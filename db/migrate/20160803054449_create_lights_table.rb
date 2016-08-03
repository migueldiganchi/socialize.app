class CreateLightsTable < ActiveRecord::Migration
  def change
    create_table :lights do |t|
      t.string    :title
      t.string    :description
      t.integer   :up
      t.integer   :down
      t.integer   :user_id
     
      t.datetime  :denounced_at
    end
  end
end
 