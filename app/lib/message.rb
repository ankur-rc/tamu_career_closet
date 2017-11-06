class Message
    def self.not_found(record = 'Record')
      "Sorry, #{record} not found."
    end
  
    def self.invalid_credentials
      'Invalid credentials'
    end
  
    def self.invalid_token
      'Invalid token'
    end
  
    def self.missing_token
      'Missing token'
    end
  
    def self.unauthorized
      'Unauthorized request'
    end
  
    def self.account_created
      'Account created successfully. Please login to continue.' 
    end
  
    def self.account_not_created
      'Account could not be created'
    end
  
    def self.expired_token
      'Sorry, your token has expired. Please login to continue.'
    end

    def self.assigned_success
      'Assigned succcessfuly'
    end

    def self.success_response
      'Success'
    end

    def self.created_successfuly(record = 'Record')
      "#{record} created successfuly."
    end

    def self.updated_successfuly(record = 'Record')
      "#{record} updated successfuly."
    end

    def self.destroyed_successfuly(record = 'Record')
      "#{record} destroyed successfuly."
    end

    
end