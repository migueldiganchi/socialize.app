class Light < ActiveRecord::Base
  belongs_to :user
  has_many :pages

  validates(:description, length: { maximum: 300 })

  def self.get_lights(from = 0, limit = nil)
    Light.all.order('lights.id desc').where({ deleted_at: nil })
  end

  def self.get_paginated_lights(from = 0, limit = nil)

    if limit.nil?
      limit = 3 # @todo: get from configuration
    end

    self.get_lights.offset(from).limit(limit)

  end

end