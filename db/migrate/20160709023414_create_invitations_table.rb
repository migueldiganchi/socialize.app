class CreateInvitationsTable < ActiveRecord::Migration
  def change
    create_table :invitations do |t|
      t.string :origin_fb_uid
      t.string :endpoint_fb_uid
      t.string :action, length: 10
      t.string :status, length: 10
      t.timestamps
    end

    add_index :invitations, :origin_fb_uid, name: :index_invitations_on_origin_fb_uid
    add_index :invitations, :endpoint_fb_uid, name: :index_invitations_on_endpoint_fb_uid
    add_index :invitations, :action, name: :index_invitations_on_action
    add_index :invitations, :status, name: :index_invitations_on_status
  end
end
