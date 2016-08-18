class ChangeColumnName < ActiveRecord::Migration
  def change
    rename_column :pages, :title, :name
  end
end
