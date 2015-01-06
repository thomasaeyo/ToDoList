require 'sinatra'
require 'data_mapper'
require 'time'
require 'json'
require 'dm-serializer/to_json'

set :public_folder, 'public'

enable :sessions
set :session_secret, 'nottellingyou'

#################################
# 			DATABASE 			#
#################################
# Database setup
DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/user.db")
DataMapper::Model.raise_on_save_failure = true # raise exceptions when needed

class User
  include DataMapper::Resource
  property :id, Serial
  property :first_name, String
  property :last_name, String
  property :email, String
  property :password, String
  has n, :tasks
  property :created_at, DateTime
end

class Task
	include DataMapper::Resource
	property :id, Serial
	belongs_to :user, :model => User
	property :title, String
	property :start, String
	property :end, String
end

DataMapper.finalize
User.auto_upgrade!
Task.auto_upgrade!


#############################
# 			ROUTES 			#
#############################
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
	@user_id = session[:user_id]
	erb :schedule
end

post '/task/new' do
	Task.create(
		:user_id => session[:user_id],
		:title => params[:title],
		:start => params[:start],
		:end => params[:end],
		)
end

# is this optimal?
# cache
get '/task/getAllTasks' do
	content_type :json
	json = []
	Task.all(:user_id => session[:user_id]).each do |task|
		json << JSON[task.to_json(:exclude => [:user_id, :id])]
	end
	json.to_json
end

post '/login_process' do
	user = User.first(:email => params[:email])
	@email = params[:email]
	@comment = ""

	if !user.nil?
		if user.password == params[:password]
			session[:first_name] = user.first_name
			session[:user_id] = user.id
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
		User.create(
			:first_name => params[:first_name],
			:last_name => params[:last_name],
			:email => params[:email],
			:password => params[:password], # need to encrypt it
			:created_at => Time.now
			)
		@comment = "Successful sign up"
		redirect '/'
	else	# need better handling
		@comment = "Email already exists"
	end
end

get '/sign_out' do
	session.clear
	redirect '/'
end

# get '/create_tasks' do
# 	Task.create(
# 		:user => session[:user_id],
# 		:title => "A",
# 		:start_time => params[:start],
# 		:end_time => params[:end]
# 		)
# 	redirect back 
# end