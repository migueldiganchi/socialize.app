# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160709023414) do

  create_table "invitations", force: :cascade do |t|
    t.string   "origin_fb_uid"
    t.string   "endpoint_fb_uid"
    t.string   "action"
    t.string   "status"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "invitations", ["action"], name: "index_invitations_on_action"
  add_index "invitations", ["endpoint_fb_uid"], name: "index_invitations_on_endpoint_fb_uid"
  add_index "invitations", ["origin_fb_uid"], name: "index_invitations_on_origin_fb_uid"
  add_index "invitations", ["status"], name: "index_invitations_on_status"

  create_table "users", force: :cascade do |t|
    t.string   "provider"
    t.string   "uid"
    t.string   "name"
    t.string   "oauth_token"
    t.datetime "oauth_expires_at"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

end
