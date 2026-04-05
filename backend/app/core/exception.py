class AppException(Exception):
    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)


class UserAlreadyExists(AppException):
    pass

class InvalidCredentials(AppException):
    pass

class UserNotActive(AppException):
    pass

class InvoiceAlreadyExists(AppException):
    pass

class InvoiceNotFound(AppException):
    pass

class InvoiceItemNotFound(AppException):
    pass
