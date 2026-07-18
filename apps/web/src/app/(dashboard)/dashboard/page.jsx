"use client"
import { useEffect, useState } from "react"
import { getInvoice } from "@/features/invoice/services/invoiceApi"
import Link from "next/link"


export default function DashboardPage () {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [data, setData] = useState([])

  useEffect(() => {
    async function apiFetch() {
      try {
        const data = await getInvoice()
        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      }
      finally {
        setLoading(false)
      }
      
    }
  apiFetch()
  },[])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!data.length) {
    return <p>Belum ada invoice.</p>
  }

  return (
    <>



    <div>{data.map((item) => (
      <div key={item.id} className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex flex-col border p-2">
          <p>{item.title}</p>
          <h1>{item.invoice_number}</h1>
        </div>
        <div className="flex gap-6">
          <p>{item.status}</p>
          <p>{item.amount}Rp</p>
          <Link href={`/invoices/${item.public_id}`}>Detail</Link>
          <Link href={`/invoices/${item.public_id}/items`}>Detail items</Link>
        </div>


      </div>
    
    ))}</div>
    </>
  )
}