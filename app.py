import streamlit as st
from streamlit_calendar import calendar
import sqlite3
import pandas as pd
from datetime import datetime, timedelta
import uuid

st.set_page_config(page_title="TaskFlow Pro (Scalable)", layout="wide")

# --- DATABASE SETUP ---
DB_FILE = "mvp_planner.db"

def run_query(query, params=(), fetch=False):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute(query, params)
    data = c.fetchall() if fetch else None
    conn.commit()
    conn.close()
    return data

# --- 🚀 CHANGE 1: OPTIMIZED QUERY (Range-Based) ---
def get_tasks_in_range(start_iso, end_iso):
    """
    Only fetch tasks that overlap with the current view.
    Logic: Task overlaps if (TaskStart < ViewEnd) AND (TaskEnd > ViewStart)
    """
    conn = sqlite3.connect(DB_FILE)
    # We use a parameterized query for speed and security
    sql = """
        SELECT * FROM tasks 
        WHERE start_time < ? AND end_time > ?
    """
    df = pd.read_sql_query(sql, conn, params=(end_iso, start_iso))
    conn.close()
    return df

# Helper functions (same as before)
def add_task(title, start, end, color):
    t_id = str(uuid.uuid4())
    run_query('INSERT INTO tasks VALUES (?,?,?,?,?,?,?)', 
              (t_id, title, start, end, color, "", ""))

def delete_task(t_id):
    run_query('DELETE FROM tasks WHERE id=?', (t_id,))

# Ensure DB exists
run_query('''CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY, title TEXT, start_time TEXT, end_time TEXT, 
    color TEXT, description TEXT, notify_email TEXT)''')

# --- 🧠 CHANGE 2: SESSION STATE MANAGEMENT ---
# We must remember what dates the user is looking at between re-runs.

if "view_start" not in st.session_state:
    # Default: Load this week (+/- buffer)
    today = datetime.now()
    st.session_state["view_start"] = (today - timedelta(days=30)).isoformat()
    st.session_state["view_end"] = (today + timedelta(days=30)).isoformat()

# --- SIDEBAR ---
with st.sidebar:
    st.header("⚡ Scalable Planner")
    st.info(f"**Current View Window:**\n\nFrom: {st.session_state['view_start'][:10]}\nTo: {st.session_state['view_end'][:10]}")
    
    with st.expander("Add Test Task"):
        with st.form("new"):
            title = st.text_input("Title")
            d = st.date_input("Date")
            if st.form_submit_button("Add"):
                s = datetime.combine(d, datetime.min.time()).isoformat()
                e = datetime.combine(d, datetime.max.time()).isoformat()
                add_task(title, s, e, "#FF5733")
                st.rerun()

# --- MAIN LOGIC ---

# 1. Fetch ONLY data for current view from DB
df_tasks = get_tasks_in_range(st.session_state["view_start"], st.session_state["view_end"])

# 2. Convert to Events
events = []
for _, row in df_tasks.iterrows():
    events.append({
        "id": row['id'], 
        "title": row['title'], 
        "start": row['start_time'], 
        "end": row['end_time'],
        "backgroundColor": row['color']
    })

# 3. Calendar Configuration
calendar_options = {
    "editable": True,
    "headerToolbar": {
        "left": "prev,next today",
        "center": "title",
        "right": "dayGridMonth,timeGridWeek"
    },
    "initialView": "timeGridWeek",
}

# --- 🚀 CHANGE 3: HANDLE NAVIGATION CALLBACKS ---
# We render the calendar. If the user clicks "Next Month", 
# the component returns the new dates in `cal_state`.

cal_state = calendar(events=events, options=calendar_options, key="pro_calendar")

# Check if the user navigated (Change of Date Range)
if cal_state.get("datesSet"):
    new_start = cal_state["datesSet"]["startStr"]
    new_end = cal_state["datesSet"]["endStr"]
    
    # Only reload if the range actually changed
    if new_start != st.session_state["view_start"]:
        st.session_state["view_start"] = new_start
        st.session_state["view_end"] = new_end
        st.rerun()  # 🔄 TRIGGER RELOAD with new DB Query

# Handle simple click/delete
if cal_state.get("eventClick"):
    delete_task(cal_state["eventClick"]["event"]["id"])
    st.rerun()

# --- DEBUG INFO (For Demo) ---
st.write(f"📊 **Performance Check:** Loaded **{len(df_tasks)}** tasks from DB for this specific view.")