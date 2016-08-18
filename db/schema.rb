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

ActiveRecord::Schema.define(version: 20160817102301) do

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

  create_table "lights", force: :cascade do |t|
    t.string   "title"
    t.string   "description"
    t.integer  "up"
    t.integer  "down"
    t.integer  "user_id"
    t.datetime "denounced_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "deleted_at"
    t.integer  "page_id"
  end

  add_index "lights", ["page_id"], name: "index_lights_on_page_id"
  add_index "lights", ["user_id"], name: "index_lights_on_user_id"

  create_table "pages", force: :cascade do |t|
    t.string   "title"
    t.string   "description"
    t.string   "geo"
    t.string   "addresses"
    t.string   "mobiles"
    t.string   "url"
    t.string   "fb_access_token"
    t.string   "fb_category"
    t.string   "fb_id"
    t.string   "fb_url"
    t.string   "fb_cover"
    t.string   "fb_logo"
    t.integer  "category_id"
    t.integer  "user_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "pages", ["category_id"], name: "index_pages_on_category_id"
  add_index "pages", ["fb_id"], name: "index_pages_on_fb_id"
  add_index "pages", ["title", "description"], name: "index_pages_on_title_and_description"
  add_index "pages", ["user_id"], name: "index_pages_on_user_id"

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
