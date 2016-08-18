class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.string :title
      t.string :description
      t.string :geo
      t.string :addresses
      t.string :mobiles
      t.string :url
      
      t.string :fb_access_token
      t.string :fb_category
      t.string :fb_id
      t.string :fb_url
      t.string :fb_cover
      t.string :fb_logo

      t.integer :category_id
      t.integer :user_id

      t.timestamps null: false
    end

    add_index :pages, [:title, :description]
    add_index :pages, :user_id
    add_index :pages, :category_id
  end
end
