source 'https://rubygems.org'

gem 'rails', '3.2.9'
gem 'authlogic'
gem 'json'
gem 'spreadsheet'
gem 'capistrano'
gem 'capistrano-ext'


group :development, :test do
  gem 'rspec-rails', '2.10.0'
  gem 'guard-rspec', '0.5.5'
  gem 'debugger'
  gem 'annotate', :git => 'git://github.com/ctran/annotate_models.git'
  gem 'sqlite3'
end

group :test do
  gem 'capybara', '1.1.2'
  gem 'factory_girl_rails', '1.4.0'
  gem 'cucumber-rails', '1.2.1', :require => false
  gem 'database_cleaner', '0.7.0'
  gem 'guard-spork', '0.3.2'  
  gem 'spork', '0.9.0'
  gem 'launchy', '2.1.0'
end

group :production do
  gem "exception_notification"
  gem 'daemons'
  gem 'pg'
  gem 'thin'
end