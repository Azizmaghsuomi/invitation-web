"use client";

import { useEffect, useState } from "react";

const ADMIN_PASSWORD = "123456";

interface Entry {
  id: number;
  registered_at: string;
  selected_date: string;
  food: string;
  time?: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadEntries = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/submit");
        const data = await response.json();
        setEntries(data.entries ?? []);
      } catch {
        setEntries([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("رمز اشتباه است");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="admin-login">
        <div className="admin-card">
          <h1>ورود ادمین</h1>
          <p>برای مشاهده اطلاعات، رمز را وارد کن.</p>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="رمز ورود"
          />
          <button onClick={handleLogin}>ورود</button>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-panel">
      <div className="admin-card">
        <div className="admin-header">
          <div>
            <h1>پنل ادمین</h1>
            <p>تاریخ ثبت، تاریخ انتخابی و نوع غذا را مشاهده کن.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsAuthenticated(false);
              setEntries([]);
              setPassword("");
            }}
          >
            خروج
          </button>
        </div>

        <div className="info-box">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" aria-hidden="true" />
              <p>در حال بارگذاری اطلاعات...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="empty-state">هنوز اطلاعاتی ثبت نشده است.</div>
          ) : (
            entries.map((item) => (
              <div key={item.id} className="info-item">
                <div>
                  <h3>تاریخ ثبت: {item.registered_at}</h3>
                  <p>تاریخ انتخابی: {item.selected_date}</p>
                  <p>نوع غذا: {item.food}</p>
                  {item.time && <p>ساعت: {item.time}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
