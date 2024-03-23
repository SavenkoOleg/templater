import os
from functools import wraps
import jwt
from flask import request, abort
from app.db import get_user_by_id

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return {
                "message": "Authentication Token is missing!",
                "data": None,
                "error": "Unauthorized"
            }, 401
        try:
            data=jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
            current_user=get_user_by_id(data["user_id"])

            if current_user is None:
                return {
                "message": "Invalid Authentication token!",
                "data": [],
                "error": "Unauthorized"
            }, 401
            if not current_user["active"]:
                return {
                    "success": False,
                    "result": [],
                    "noactive": True,
                    "error": "Ваш аккаунт не активирован"
                }, 403
        except Exception as e:
            return {
                "message": "Something went wrong",
                "data": [],
                "error": str(e)
            }, 500

        return f(current_user["id"], *args, **kwargs)

    return decorated