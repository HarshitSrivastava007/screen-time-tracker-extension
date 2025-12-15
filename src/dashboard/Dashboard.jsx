import { useEffect, useState } from "react";

const Dashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const storage =
      typeof globalThis !== "undefined" &&
      typeof globalThis.chrome !== "undefined"
        ? globalThis.chrome.storage
        : typeof globalThis !== "undefined" &&
          typeof globalThis.browser !== "undefined"
        ? globalThis.browser.storage
        : null;

    if (storage && storage.local && typeof storage.local.get === "function") {
      storage.local.get(["screenTime"], (res) => {
        const today = new Date().toISOString().split("T")[0];
        setData(res.screenTime?.[today] || {});
      });
    } else {
      // Fallback when extension storage API isn't available (e.g. running in non-extension env)
      // Don't call setData synchronously inside an effect; initial state already covers the fallback.
      console.warn("Extension storage API is not available.");
    }
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m`;
  };

  const maxTime = Math.max(...Object.values(data));

  return (
    <div style={{ padding: 16, width: 360, minHeight: 360 }}>
      <h4 style={{ marginTop: 0, color: "#888" }}>Today's Screen Time</h4>
      {Object.keys(data).length === 0 ? (
        <p>No data yet</p>
      ) : (
        <div
          style={{
            height: "250px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .map(([site, time]) => (
              <div
                key={site}
                style={{
                  marginBottom: 12,
                  padding: 10,
                  borderRadius: 10,
                  background: "#1f1f1f",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{site}</span>
                  <span style={{ color: "#aaa" }}>{formatTime(time)}</span>
                </div>

                <div
                  style={{
                    height: 6,
                    borderRadius: 6,
                    background: "#333",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(time / maxTime) * 100}%`,
                      background: "linear-gradient(90deg, #4facfe, #00f2fe)",
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

Dashboard.propTypes = {
  // define prop types here
};

export default Dashboard;
