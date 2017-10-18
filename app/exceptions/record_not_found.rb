class RecordNotFoundError<StandardError
      attr_accessor :message

      def self.setErrorMessage(message)
      self.message=message
      end

end