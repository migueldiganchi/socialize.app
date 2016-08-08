class Light < ActiveRecord::Base
  belongs_to :user

  validates(:description, length: { maximum: 300 })

  def self.get_lights(from = 0, limit = nil)

    lights = Light.all.order('lights.id desc').where({ deleted_at: nil })

    if limit.nil?
      limit = 10 # @todo: get from configuration
    end

    lights = lights.offset(from).limit(limit)

    return lights

  end

end