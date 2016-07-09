class Invitation < ActiveRecord::Base
  validates :origin_fb_uid, presence: true
  validates :endpoint_fb_uid, presence: true

  # @todo: map with invited collections
  def self.save_invitations(fb_uid_from, fb_uids_to)
    
    invitations = Array.new

    ActiveRecord::Base.transaction do
      fb_uids_to.each do |fb_uid_to|

        # check for existing invitation
        checkin = Invitation.where({
          origin_fb_uid: fb_uid_from, 
          endpoint_fb_uid: fb_uid_to,
          action: 'invite'
        })

        unless !checkin.empty? then

          invitation = Invitation.new({
            origin_fb_uid: fb_uid_from,
            endpoint_fb_uid: fb_uid_to, 
            action: 'invite', 
            status: 'pending'
          })

          invitations.push(invitation) if invitation.save!

        end
      end
    end

    return invitations

  end



end
