"""QA Workspace OS prototype backend using only the Python standard library.

Run with: python app.py
Serves the workspace UI plus versioned REST endpoints and a Server-Sent Events
stream that simulates live project, presence, notification, and activity updates.
"""
from __future__ import annotations

import json
import random
import time
from dataclasses import asdict, dataclass
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

ROOT = Path(__file__).parent


@dataclass(frozen=True)
class Role:
    name: str
    slug: str
    widgets: list[str]
    permissions: list[str]
    assistant_focus: str


ROLES = [
    Role("Trainee QA Engineer", "trainee-qa", ["Learning Progress", "Assigned Tasks", "KT Center", "AI QA Coach"], ["view_projects", "submit_reports", "execute_tests"], "Guided test cases, KT, and daily learning plans"),
    Role("QA Engineer", "qa-engineer", ["Bugs Assigned", "Smoke Suite", "Reports", "Automation Status"], ["manage_test_cases", "log_bugs", "submit_reports", "join_war_room"], "Test design, bug reports, SQL, selectors, API checks"),
    Role("Senior QA Engineer", "senior-qa", ["Pending Reviews", "Team Quality", "Automation Coverage", "Risk Radar"], ["review_reports", "approve_test_cases", "manage_automation", "mentor_team"], "Review assistance, risk analysis, regression generation"),
    Role("Project Manager", "project-manager", ["Project Health", "Sprint Progress", "Resource Allocation", "Client Updates"], ["manage_projects", "approve_reports", "configure_tracker", "export_analytics"], "Delivery summaries, staffing risk, release readiness"),
    Role("Sales / BDE", "sales-bde", ["Client Metrics", "Proposal Assets", "Delivery Proof", "Upcoming Demos"], ["view_delivery_metrics", "manage_clients", "export_proposals"], "Proposal drafts, client updates, capability search"),
]

PROJECTS: list[dict[str, Any]] = [
    {
        "name": "Commerce Cloud QA", "client": "Northstar Retail", "manager": "Aarav Mehta", "sprint": "Sprint 18", "releaseCountdown": "3d 12h", "health": 91,
        "automation": 74, "testing": 82, "openBugs": 28, "criticalBugs": 2, "reports": 17, "members": 14, "office": 8, "remote": 5, "offline": 1,
        "tracker": "Enabled", "environment": "Staging healthy", "build": "v4.18.2-rc.1", "risk": "Medium", "accent": "#38bdf8",
    },
    {
        "name": "FinPay Mobile Regression", "client": "FinPay Labs", "manager": "Sophia Carter", "sprint": "Hardening", "releaseCountdown": "6d 4h", "health": 78,
        "automation": 61, "testing": 68, "openBugs": 46, "criticalBugs": 5, "reports": 11, "members": 11, "office": 4, "remote": 6, "offline": 1,
        "tracker": "Enabled", "environment": "UAT degraded", "build": "android-2.9.0+841", "risk": "High", "accent": "#f97316",
    },
    {
        "name": "HealthOps API Platform", "client": "MedAxis", "manager": "Maya Singh", "sprint": "Sprint 9", "releaseCountdown": "11d", "health": 96,
        "automation": 88, "testing": 91, "openBugs": 12, "criticalBugs": 0, "reports": 22, "members": 9, "office": 5, "remote": 3, "offline": 1,
        "tracker": "Optional", "environment": "QA green", "build": "api-2026.07.21", "risk": "Low", "accent": "#22c55e",
    },
]

CAPABILITIES = [
    "Employee Management", "RBAC", "Project Command Center", "Live Tracker", "Presence", "Chat", "Voice Rooms", "KT Center", "Reports", "AI Report Generator",
    "Test Case Management", "Bug Management", "Automation Tracking", "API Testing", "Performance Testing", "Accessibility", "Security Testing", "Traceability Matrix",
    "AI QA Assistant", "Company Brain", "Integrations Marketplace", "Unified Notifications", "Smart Search", "No-code Workflow Automation", "Analytics", "Audit Logs",
]

INTEGRATIONS = ["Slack", "Keka", "Teams", "Discord", "Gmail", "Outlook", "Jira", "ClickUp", "Linear", "GitHub", "GitLab", "Jenkins", "GitHub Actions", "Playwright", "Selenium", "Appium", "BrowserStack", "Postman", "Notion", "Confluence", "Google Drive", "ChatGPT", "Claude", "Gemini", "Zoom", "Google Calendar"]

ACTIVITIES = ["Bug Created", "Automation Finished", "KT Uploaded", "Build Uploaded", "Report Submitted", "Sprint Risk Updated", "Release Approved", "Test Case Executed"]


def payload() -> dict[str, Any]:
    return {"roles": [asdict(r) for r in ROLES], "projects": PROJECTS, "capabilities": CAPABILITIES, "integrations": INTEGRATIONS}


class WorkspaceHandler(SimpleHTTPRequestHandler):
    def end_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        super().end_headers()

    def do_GET(self) -> None:  # noqa: N802 - stdlib API
        if self.path in ("/api/v1/workspace", "/api/v1/workspace/"):
            self._json(payload())
            return
        if self.path.startswith("/api/v1/events"):
            self._events()
            return
        if self.path == "/":
            self.path = "/index.html"
        return super().do_GET()

    def _json(self, data: Any, status: int = 200) -> None:
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _events(self) -> None:
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self.end_headers()
        for _ in range(120):
            project = random.choice(PROJECTS).copy()
            project["health"] = max(50, min(99, project["health"] + random.randint(-2, 2)))
            event = {"activity": random.choice(ACTIVITIES), "project": project["name"], "actor": random.choice(["Isha", "Noah", "Riya", "Liam", "Zara"]), "at": time.strftime("%H:%M:%S"), "projectUpdate": project}
            self.wfile.write(f"data: {json.dumps(event)}\n\n".encode())
            self.wfile.flush()
            time.sleep(3)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", 8000), WorkspaceHandler)
    print("QA Workspace OS running at http://localhost:8000")
    server.serve_forever()
