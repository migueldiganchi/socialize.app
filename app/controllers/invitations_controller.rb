class InvitationsController < ApplicationController

  def create
    
    fb_uid_from = current_user.uid
    fb_uids_to = params[:fb_uids]

    @invited_users = Invitation.save_invitations(fb_uid_from, fb_uids_to)

    if request.xhr?
      respond_to do |format|
        format.json do
            render json: {
              status: true, 
              message: 'Invitación exitosa.'
            }
        end
        format.html do
          render partial: 'invited_users'
        end
      end
    else
      redirect_to root_url
    end

  end

  # def update  

  # end

  # def destroy

  # end

end