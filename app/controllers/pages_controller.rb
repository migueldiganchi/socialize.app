class PagesController < ApplicationController
  # @todo: validate pages for certain users
  
  def create

    raise 'bad_request error' unless logged_in? && request.xhr?
    # @todo: if it is the correct user
    
    # validate saving request
    raise 'bad request' if !params.has_key(:fpages)

    @pages = []
    errors = []
    fpage = nil
    fpages = params[:fpages]

    # @todo: valdiate fpages structure
    
    fpages.each do |fpage_entry|
      
      # get facebook page entry
      fpage = fpage_entry[1]

      # check if page has already registered 
      page = Page.find_by fb_id: fpage[:id].strip

      # if page exist we will not create it
      unless page 
        # we have to register by creating this page
        page = current_user.pages.build

        # set basic values
        page.name = fpage[:name]
        page.fb_category = fpage[:category]
        page.fb_access_token = fpage[:access_token]
        page.fb_id = fpage[:id]
        page.fb_url = '' # todo: this

        # save
        if !page.save
          # @todo: log error
          # @todo: consider rollback
          errors.push({ message: 'Creating page error' })
        end
      end

      # push the page to show
      @pages.push(page)
    end

    # check for errors
    if errors.empty?
      render partial: 'pages/pages'
    else
      render json: { status: false, message: 'Error al crear la/s página/s del usuario' }
    end
  end

  def index
    # @todo: list all pages
  end

  def show
    # @todo: check for correct user
    # @todo: show user
    page_id = params.has_key?(:id) ? params[:id] : 0

    @page = Page.find page_id

    if request.xhr?
      render partial: 'pages/page'
    end

  end

  def edit
    # @todo: get edit form for page
  end

  def new
    # @todo: get new form for page
  end

  def create
    # @todo: post for page create
  end

  def update
    # @todo: patch page
  end

  def destroy
    # @todo: delete page
  end

end