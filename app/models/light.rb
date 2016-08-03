class Light < ActiveRecord::Base
  belongs_to :user

  validates(:description, length: { maximum: 300 })
end