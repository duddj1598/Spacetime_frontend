# main.py 파일에 저장할 내용입니다.
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# 1. FastAPI 애플리케이션 생성
app = FastAPI()

# 2. CORS (Cross-Origin Resource Sharing) 설정
# React 클라이언트 (5173 포트)의 요청을 허용합니다.
origins = [
    "http://localhost:5173",  # React 개발 서버 포트
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       
    allow_credentials=True,      
    allow_methods=["*"],         
    allow_headers=["*"],         
)

# 3. 데이터 모델 정의 (Pydantic)
class ClientData(BaseModel):
    name: str 

# 4. API 엔드포인트 정의 (React 코드가 요청하는 곳)
@app.post("/api/check")
async def check_connection(data: ClientData):
    """
    클라이언트로부터 POST 요청을 받아 연동 성공 메시지를 반환합니다.
    """
    received_name = data.name
    
    response_message = (
        f"FastAPI 서버 응답 성공! 환영합니다, [{received_name}]. "
        "데이터를 성공적으로 수신하고 처리했습니다."
    )
    
    return {
        "status": "ok",
        "message": response_message,
        "client_name_received": received_name
    }

# 5. 서버 실행 확인용 엔드포인트
@app.get("/")
def read_root():
    return {"message": "FastAPI 서버가 8080 포트에서 실행 준비되었습니다."}