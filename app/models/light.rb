class Light < ActiveRecord::Base
  belongs_to :user

  validates(:description, length: { maximum: 300 })

  def get_lights(from = 0)

    Light.all.order('lights.id asc').last(10)

  end

end