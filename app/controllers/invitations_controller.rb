class InvitationsController < ApplicationController

  def create
    
    fb_uid_from = current_user.uid
    fb_uids_to = params[:fb_uids]

    @invited_users = Invitation.save_invitations(fb_uid_from, fb_uids_to)

    if request.xhr?
      respond_to do |format|
        format.json render json: {status: true, message: 'Invitación exitosa.' }
        format.html render partial: 'app/invitations'
      end
    else
      redirect_to root_url
    end

  end

  def update  

    invitation_id = params[:id]
    invitation_status = params[:status]

    # @todo: update invitation status with the invitation.id

  end

  # def destroy

  # end
  
end