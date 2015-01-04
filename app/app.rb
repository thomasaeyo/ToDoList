require 'sinatra'
require 'data_mapper'
require 'time'

set :public_folder, 'public'

enable :sessions
set :session_secret, 'nottellingyou'

# Database setup
DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/user.db")

class User
  include DataMapper::Resource
  property :id, Serial
  property :first_name, String
  property :last_name, String
  property :email, String
  property :password, String
  property :created_at, DateTime
end

DataMapper.finalize
User.auto_upgrade!

# functions
def active_page?(path='')
	request.path_info == '/' + path
end

# routes
get '/' do	
	@first_name = session[:first_name]
	# look for username in db
	erb :home
end

get '/schedule' do
	@first_name = session[:first_name]
	erb :schedule
end

post '/login_process' do
	user = User.first(:email => params[:email])
	@email = params[:email]
	@comment = ""

	if !user.nil?
		if user.password == params[:password]
			session[:first_name] = user.first_name
			redirect '/'
		else 
			@comment = "Wrong password"
		end
	else
		@email
	end
end

get '/sign_up' do
	erb :sign_up
end

get '/join' do 
	@comment = ""
	if User.first(:email => params[:email]).nil?
		new_user = User.new
		new_user.first_name = params[:first_name]
		new_user.last_name = params[:last_name]
		new_user.email = params[:email]
		new_user.password = params[:password]
		new_user.created_at = Time.now
		new_user.save
		@comment = "Successful sign up"
		redirect '/'
	else
		@comment = "Email already exists"
	end
end

get '/sign_out' do
	session.clear

	redirect '/'
end