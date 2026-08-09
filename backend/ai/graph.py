import os
from typing import TypedDict

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, START, END
from pydantic import BaseModel

load_dotenv()


class ComplaintData(BaseModel):
    product_name: str
    batch_number: str
    originating_site: str
    impacted_materials: str
    defect_summary: str
    risk_level: str
    risk_reason: str


class ComplaintState(TypedDict):
    complaint_text: str
    result: dict


llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY"),
)


def analyze_complaint(state: ComplaintState):
    complaint = state["complaint_text"]

    prompt = f"""
You are an AI assistant for a pharmaceutical Customer Complaint
Management System.

Analyze the following customer complaint.

Extract:

1. Product name
2. Batch / lot number
3. Originating site
4. Impacted non-product materials
5. Structured defect summary
6. Risk level
7. Reason for the risk level

Risk level must be one of:
Low
Medium
High
Critical

Do not invent information that is not present.
If information is missing, write "Not provided".

Customer complaint:

{complaint}
"""

    response = llm.with_structured_output(ComplaintData).invoke(prompt)

    return {
        "result": response.model_dump()
    }


workflow = StateGraph(ComplaintState)

workflow.add_node(
    "analyze_complaint",
    analyze_complaint
)

workflow.add_edge(
    START,
    "analyze_complaint"
)

workflow.add_edge(
    "analyze_complaint",
    END
)

complaint_graph = workflow.compile()


def run_complaint_analysis(complaint_text: str):
    result = complaint_graph.invoke(
        {
            "complaint_text": complaint_text,
            "result": {},
        }
    )

    return result["result"]