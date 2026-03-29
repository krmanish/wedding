import os
import random
import string
from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, constr
from sqlmodel import SQLModel, Session, create_engine, select

from models import AdminUser, WeddingPage, Guest, OTPCode, Comment, Gift, Photo

DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./wedding.db')
engine = create_engine(DATABASE_URL, echo=True)

app = FastAPI(
    title='Wedding Invite API',
    description='Wedding invitation API with admin management, guest invites, comments, gifts, and photo uploads.',
    version='1.0.0',
    docs_url='/swagger',
    redoc_url='/redoc',
    openapi_url='/openapi.json',
)

@app.get('/', include_in_schema=False)
def root():
    """Root endpoint to confirm server is running and redirect to Swagger UI in docs browser."""
    return {'message': 'Wedding Invite API running. See Swagger docs at /swagger'}

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)


def get_session():
    with Session(engine) as session:
        yield session


def random_otp(length: int = 6) -> str:
    return ''.join(random.choices(string.digits, k=length))


@app.on_event('startup')
def on_startup():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        if not session.exec(select(AdminUser).where(AdminUser.username == 'admin')).first():
            admin = AdminUser(username='admin', hashed_password='admin')
            session.add(admin)
            session.commit()


class AdminLogin(BaseModel):
    username: str
    password: str


class WeddingCreate(BaseModel):
    couple_name: str
    slug: constr(pattern='^[a-z0-9-]+$')
    theme: str
    venue: str
    description: str


class GuestCreate(BaseModel):
    name: str
    mobile: constr(min_length=10, max_length=15)


class OTPReq(BaseModel):
    mobile: constr(min_length=10, max_length=15)


class OTPVerify(BaseModel):
    mobile: constr(min_length=10, max_length=15)
    code: constr(min_length=6, max_length=6)


@app.post('/admin/login')
def admin_login(payload: AdminLogin, session: Session = Depends(get_session)):
    admin = session.exec(select(AdminUser).where(AdminUser.username == payload.username)).first()
    if not admin or admin.hashed_password != payload.password:
        raise HTTPException(status_code=401, detail='Invalid credentials')
    return {'token': 'admin-token'}


@app.post('/admin/weddings')
def create_wedding(payload: WeddingCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(WeddingPage).where(WeddingPage.slug == payload.slug)).first()
    if existing:
        raise HTTPException(status_code=400, detail='Slug already exists')
    wedding = WeddingPage(**payload.dict())
    session.add(wedding)
    session.commit()
    session.refresh(wedding)
    return wedding


@app.get('/weddings')
def list_weddings(session: Session = Depends(get_session)):
    return session.exec(select(WeddingPage)).all()


@app.post('/admin/weddings/{wedding_id}/guests')
def add_guest(wedding_id: int, payload: GuestCreate, session: Session = Depends(get_session)):
    wedding = session.get(WeddingPage, wedding_id)
    if not wedding:
        raise HTTPException(status_code=404, detail='Wedding not found')
    guest = Guest(wedding_id=wedding_id, **payload.dict())
    session.add(guest)
    session.commit()
    session.refresh(guest)
    return guest


@app.post('/weddings/{slug}/auth/start')
def auth_start(slug: str, payload: OTPReq, background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    wedding = session.exec(select(WeddingPage).where(WeddingPage.slug == slug)).first()
    if not wedding:
        raise HTTPException(status_code=404, detail='Wedding not found')
    guest = session.exec(select(Guest).where(Guest.wedding_id == wedding.id, Guest.mobile == payload.mobile)).first()
    if not guest:
        raise HTTPException(status_code=403, detail='Mobile not invited')
    code = random_otp(6)
    otp = OTPCode(wedding_id=wedding.id, mobile=payload.mobile, code=code, expires_at=datetime.utcnow() + timedelta(minutes=10))
    session.add(otp)
    session.commit()
    # TODO: implement actual SMS provider / email code delivery
    return {'message': 'OTP generated', 'code': code}


@app.post('/weddings/{slug}/auth/verify')
def auth_verify(slug: str, payload: OTPVerify, session: Session = Depends(get_session)):
    wedding = session.exec(select(WeddingPage).where(WeddingPage.slug == slug)).first()
    if not wedding:
        raise HTTPException(status_code=404, detail='Wedding not found')
    otp = session.exec(select(OTPCode).where(OTPCode.wedding_id == wedding.id, OTPCode.mobile == payload.mobile, OTPCode.code == payload.code)).first()
    if not otp or otp.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail='Invalid or expired OTP')
    return {'message': 'Authenticated'}


@app.get('/weddings/{slug}')
def get_wedding(slug: str, session: Session = Depends(get_session)):
    wedding = session.exec(select(WeddingPage).where(WeddingPage.slug == slug)).first()
    if not wedding:
        raise HTTPException(status_code=404, detail='Wedding not found')
    return wedding


@app.post('/weddings/{wedding_id}/comments')
def add_comment(wedding_id: int, mobile: str, text: str, session: Session = Depends(get_session)):
    wedding = session.get(WeddingPage, wedding_id)
    if not wedding:
        raise HTTPException(status_code=404, detail='Wedding not found')
    lower_text = text.lower()
    abusive = any(word in lower_text for word in ['abuse', 'stupid', 'idiot', 'hate'])
    comment = Comment(wedding_id=wedding_id, mobile=mobile, text=text, is_flagged=abusive, is_approved=not abusive)
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment


@app.post('/weddings/{wedding_id}/gifts')
def add_gift(wedding_id: int, mobile: str, amount: float, message: Optional[str] = None, session: Session = Depends(get_session)):
    wedding = session.get(WeddingPage, wedding_id)
    if not wedding:
        raise HTTPException(status_code=404, detail='Wedding not found')
    gift = Gift(wedding_id=wedding_id, mobile=mobile, amount=amount, message=message)
    session.add(gift)
    session.commit()
    session.refresh(gift)
    return gift


@app.post('/weddings/{wedding_id}/photos')
def add_photo(wedding_id: int, mobile: str, filename: str, url: str, session: Session = Depends(get_session)):
    wedding = session.get(WeddingPage, wedding_id)
    if not wedding:
        raise HTTPException(status_code=404, detail='Wedding not found')
    photo = Photo(wedding_id=wedding_id, mobile=mobile, filename=filename, url=url)
    session.add(photo)
    session.commit()
    session.refresh(photo)
    return photo
