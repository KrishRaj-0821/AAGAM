from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import exception_handler

def success_response(data=None, message="Operation successful", status_code=status.HTTP_200_OK):
    return Response({
        "success": True,
        "message": message,
        "data": data if data is not None else {}
    }, status=status_code)


def error_response(message="An error occurred", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
    return Response({
        "success": False,
        "message": message,
        "errors": errors if errors is not None else {}
    }, status=status_code)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        return Response({
            "success": False,
            "message": str(exc),
            "errors": response.data
        }, status=response.status_code)
    return response
