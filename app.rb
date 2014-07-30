require 'sinatra/base'
require 'sinatra/assetpack'

require 'redis'
require 'json'

module SituationRoom
  class Monitor < Sinatra::Base

    set :root, File.dirname(__FILE__)
    set :redis_url, ENV['REDISCLOUD_URL'] || 'redis://localhost:6379'

    register Sinatra::AssetPack

    get '/' do
      erb :dashboard
    end

    get '/rooms' do
      client = build_redis_client
      keys = client.keys('*')
      values = client.mget(keys)
      client.quit

      tuples = keys.zip(values)
      Hash[tuples].to_json
    end

    post '/rooms/:room' do |room|
      unless params[:api_key] && params[:api_key] == ENV['API_KEY']
        halt 401
      end

      client = build_redis_client
      client.set(room, Time.now.to_s)
      client.quit
    end

    assets {
      serve '/js/*',     from: 'app/js'
      serve '/css',    from: 'app/css'

      css :application, '/css/application.scss', ['/css/application.css']

      js :app, '/js/app.js', [
        '/js/vendor/*.js',
        '/js/*.js',
      ]

      js_compression  :jsmin
      css_compression :sass
    }

  private
    def build_redis_client
      Redis.new(url: settings.redis_url)
    end

  end
end
