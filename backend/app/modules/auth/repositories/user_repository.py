from app.modules.auth.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

class UserRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_id(self, user_id):
        query = select(User).where(User.id == user_id)
        result = await self.db.scalar(query)
        return result
    
    async def get_user_by_email(self, user_email):
        query = select(User).where(User.email == user_email)
        result = await self.db.scalar(query)
        return result
    
    async def create_user(self, user: User) -> User:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def read_users(self):
        result = await self.db.execute(select(User))
        users = result.scalars().all()
        return users
    
    async def update_users(self, user: User) -> User:
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def delete_user(self, user: User) -> None:
        await self.db.delete(user)
        await self.db.commit()
