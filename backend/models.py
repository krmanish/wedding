from datetime import datetime, timedelta
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class AdminUser(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    hashed_password: str

class WeddingPage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    couple_name: str
    slug: str
    theme: str
    venue: str
    description: Optional[str] = None
    is_published: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    guests: list['Guest'] = Relationship(back_populates='wedding')
    comments: list['Comment'] = Relationship(back_populates='wedding')
    gifts: list['Gift'] = Relationship(back_populates='wedding')
    photos: list['Photo'] = Relationship(back_populates='wedding')

class Guest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    wedding_id: int = Field(foreign_key='weddingpage.id')
    name: str
    mobile: str
    can_attend: Optional[bool] = None

    wedding: Optional[WeddingPage] = Relationship(back_populates='guests')

class OTPCode(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    wedding_id: int = Field(foreign_key='weddingpage.id')
    mobile: str
    code: str
    expires_at: datetime

class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    wedding_id: int = Field(foreign_key='weddingpage.id')
    mobile: str
    text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_approved: bool = False
    is_flagged: bool = False
    note: Optional[str] = None

    wedding: Optional[WeddingPage] = Relationship(back_populates='comments')

class Gift(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    wedding_id: int = Field(foreign_key='weddingpage.id')
    mobile: str
    amount: float
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    wedding: Optional[WeddingPage] = Relationship(back_populates='gifts')

class Photo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    wedding_id: int = Field(foreign_key='weddingpage.id')
    mobile: str
    filename: str
    url: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    wedding: Optional[WeddingPage] = Relationship(back_populates='photos')
