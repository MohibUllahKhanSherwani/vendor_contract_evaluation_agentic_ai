import uuid
from datetime import datetime
from src.utils.utilities import setup_logger, hash_password, verify_password
from src.Repositories.UserRepository import UserRepository

logger = setup_logger()

class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()

    async def register_user(self, username, email, password):
        logger.info(f"Initializing register process for new user: {email}")
        try:
            existing = await self.user_repo.get_user_by_email(email)
            if existing:
                logger.warning(f"Registration failed: User already exists for email {email}")
                return {"success": False, "message": "User Already Exists"}

            user_id = str(uuid.uuid4())
            hashed_pwd = hash_password(password)

            user_data = {
                "_id": user_id,
                "Email": email,
                "HashPassword": hashed_pwd,
                "UserName": username,
                "CreatedAt": datetime.utcnow(),
                "IsDeleted": False
            }

            await self.user_repo.insert_user(user_data)
            logger.info(f"User registered successfully with ID: {user_id}")
            return {"success": True, "message": "User Registered Successfully", "user_id": user_id}
            
        except Exception as e:
            logger.error(f"Unexpected error during registration: {str(e)}")
            return {"success": False, "message": f"Error: {str(e)}"}

    async def login_user(self, email, password):
        logger.info(f"Processing login attempt for: {email}")
        try:
            user = await self.user_repo.get_user_by_email(email)
            if not user:
                logger.warning(f"Login failed: User {email} not found")
                return {"success": False, "message": "User with this email does not exist"}

            if not verify_password(password, user["HashPassword"]):
                logger.warning(f"Login failed: Incorrect password for {email}")
                return {"success": False, "message": "Incorrect Password"}

            if user.get("IsDeleted", False):
                logger.warning(f"Login failed: Account {email} is deleted")
                return {"success": False, "message": "Account has been deactivated"}

            logger.info(f"Login successful for: {email}")
            return {
                "success": True,
                "message": "Login Successful",
                "user": {
                    "user_id": user["_id"],
                    "email": user["Email"],
                    "username": user["UserName"],
                    "created_at": str(user.get("CreatedAt", "")),
                }
            }
        except Exception as e:
            logger.error(f"Unexpected error during login: {str(e)}")
            return {"success": False, "message": f"Error: {str(e)}"}
