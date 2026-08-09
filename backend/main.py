from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
from io import BytesIO
from datetime import datetime
import json
from pathlib import Path

from ai.graph import run_complaint_analysis


app = FastAPI(title="AIVOA Complaint Analysis API")


# ==================================================
# CORS CONFIGURATION
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================================================
# REQUEST MODEL
# ==================================================

class ComplaintRequest(BaseModel):
    complaint_text: str


# ==================================================
# HOME
# ==================================================

@app.get("/")
def root():
    return {
        "message": "AIVOA backend is running"
    }


# ==================================================
# TEXT COMPLAINT ANALYSIS
# ==================================================

@app.post("/analyze-complaint")
def analyze_complaint(request: ComplaintRequest):

    try:

        result = run_complaint_analysis(
            request.complaint_text
        )

        return {
            "success": True,
            "message": "Complaint analyzed successfully",
            "data": result,
        }

    except Exception as error:

        print(
            "Complaint analysis error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze complaint."
        )


# ==================================================
# PDF COMPLAINT ANALYSIS
# ==================================================

@app.post("/analyze-pdf")
async def analyze_pdf(
    file: UploadFile = File(...)
):

    if file.content_type != "application/pdf":

        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file."
        )

    try:

        pdf_bytes = await file.read()

        pdf = PdfReader(
            BytesIO(pdf_bytes)
        )

        extracted_text = ""

        for page in pdf.pages:

            page_text = page.extract_text()

            if page_text:
                extracted_text += page_text + "\n"

        if not extracted_text.strip():

            raise HTTPException(
                status_code=400,
                detail="Could not extract text from the PDF."
            )

        result = run_complaint_analysis(
            extracted_text
        )

        return {
            "success": True,
            "message": "PDF complaint analyzed successfully",
            "filename": file.filename,
            "extracted_text": extracted_text,
            "data": result,
        }

    except HTTPException:
        raise

    except Exception as error:

        print(
            "PDF processing error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to process the PDF."
        )


# ==================================================
# COMMIT TO QMS LEDGER
# ==================================================

@app.post("/commit-qms")
def commit_qms(data: dict):

    try:

        ledger_file = Path(
            "qms_ledger.json"
        )

        if ledger_file.exists():

            with open(
                ledger_file,
                "r",
                encoding="utf-8"
            ) as file:

                ledger = json.load(file)

        else:

            ledger = []

        data["committed_at"] = (
            datetime.now().isoformat()
        )

        ledger.append(data)

        with open(
            ledger_file,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                ledger,
                file,
                indent=4
            )

        return {
            "success": True,
            "message": "Complaint committed to QMS Ledger successfully",
            "record": data,
        }

    except Exception as error:

        print(
            "QMS Ledger error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to commit complaint to QMS Ledger."
        )


# ==================================================
# VIEW QMS LEDGER
# ==================================================

@app.get("/qms-ledger")
def get_qms_ledger():

    try:

        ledger_file = Path(
            "qms_ledger.json"
        )

        # If ledger doesn't exist yet
        if not ledger_file.exists():

            return {
                "success": True,
                "data": []
            }

        # Read ledger
        with open(
            ledger_file,
            "r",
            encoding="utf-8"
        ) as file:

            ledger = json.load(file)

        return {
            "success": True,
            "data": ledger
        }

    except Exception as error:

        print(
            "QMS Ledger read error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to load QMS Ledger."
        )