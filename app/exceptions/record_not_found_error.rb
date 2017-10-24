class RecordNotFoundError<StandardError
      attr_accessor :message

      def initialize(msg="My default message")
            super(msg)
      end

      def self.setErrorMessage(message)
            self.message=message
      end

end