import { useEffect, useState } from "react";

interface ReportsProps {
  theaterId: number;
  hallId: number;
}

export default function Reports({ theaterId, hallId }: ReportsProps) {
  const [totalTickets, setTotalTickets] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTotalTickets() {
      try {
        const res = await fetch(
          `https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/api/v6/reports/theaters/${theaterId}/halls/${hallId}/tickets/total`
        );

        const data = await res.json();

        if (data?.total_sold !== undefined) {
          setTotalTickets(data.total_sold);
        }
      } catch (err) {
        console.error("❌ Error loading ticket report:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTotalTickets();
  }, [theaterId, hallId]);

  if (loading) return <p>Loading ticket report...</p>;

  return (
    <div>
      <h2>Hall Report</h2>
      <p><strong>Theater ID:</strong> {theaterId}</p>
      <p><strong>Hall ID:</strong> {hallId}</p>

      <h3>Total Tickets Sold:</h3>
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>
        {totalTickets ?? 0}
      </p>
    </div>
  );
}
