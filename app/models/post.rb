class Post < ActiveRecord::Base
  belongs_to :user
  has_many :pages

  validates(:description, length: { maximum: 300 })

  def self.get_posts(from = 0, limit = nil)
    Post.all.order('posts.id desc').where({ deleted_at: nil })
  end

  def self.get_paginated_posts(from = 0, limit = nil)

    if limit.nil?
      limit = 3 # @todo: get from configuration
    end

    self.get_posts.offset(from).limit(limit)

  end

end