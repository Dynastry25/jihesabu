import jsPDF from 'jspdf'
import { Session } from '../types'

export const generatePDF = (session: Session): void => {
  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text('Jihesabu Report', 105, 20, { align: 'center' })
  doc.setFontSize(12)
  doc.text(`Session: ${session.name}`, 20, 40)
  doc.text(`Category: ${session.category}`, 20, 50)
  doc.text(`Total Count: ${session.totalCount}`, 20, 60)
  doc.text(`Male: ${session.maleCount} | Female: ${session.femaleCount}`, 20, 70)
  doc.text(`Confidence: ${(session.confidenceAvg * 100).toFixed(1)}%`, 20, 80)
  doc.text(`Duration: ${Math.floor(session.duration / 60)} min ${session.duration % 60} sec`, 20, 90)
  doc.text(`Start: ${new Date(session.startTime).toLocaleString()}`, 20, 100)
  if (session.endTime) {
    doc.text(`End: ${new Date(session.endTime).toLocaleString()}`, 20, 110)
  }
  doc.save(`${session.name}_report.pdf`)
}

export const generateCSV = (session: Session): void => {
  const headers = ['Metric', 'Value']
  const rows = [
    ['Session Name', session.name],
    ['Category', session.category],
    ['Total Count', session.totalCount.toString()],
    ['Male', session.maleCount.toString()],
    ['Female', session.femaleCount.toString()],
    ['Confidence', `${(session.confidenceAvg * 100).toFixed(1)}%`],
    ['Duration', `${session.duration} sec`],
    ['Start Time', new Date(session.startTime).toISOString()],
    ['End Time', session.endTime ? new Date(session.endTime).toISOString() : 'N/A'],
  ]
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${session.name}_report.csv`
  a.click()
  URL.revokeObjectURL(url)
}
