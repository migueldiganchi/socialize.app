class LightsController < ApplicationController

  def new


    if request.xhr?
      render 'app/_light', locals: { light: Light.new }
    else
      redirect_to root_url
    end

  end

  def create
  end

  def update
  end

  def destroy
  end

end