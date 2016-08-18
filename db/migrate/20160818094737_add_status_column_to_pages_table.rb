class AddStatusColumnToPagesTable < ActiveRecord::Migration
  def change
    add_column :pages, :status, :integer, :after => :category_id 
  end

  def down
    remove_column :pages, :status    
  end
end
