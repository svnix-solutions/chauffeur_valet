import { useFrappeAuth, useFrappeGetDocList } from 'frappe-react-sdk'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface LedgerEntry {
  name: string
  posting_date: string
  description: string
  amount: number
  balance: number
  type: 'Credit' | 'Debit'
}

export default function TransactionsPage() {
  const { currentUser } = useFrappeAuth()
  // Adjust DocType and filters as per your Frappe backend
  const { data, isLoading } = useFrappeGetDocList<LedgerEntry>(
    'Valet Ledger Entry',
    {
      filters: [
        ['valet', '=', currentUser]
      ],
      fields: ['name', 'posting_date', 'description', 'amount', 'balance', 'type'],
      orderBy: {
        field: 'posting_date',
        order: 'desc',
      },
    }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md py-6 px-2 min-h-screen flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-2">Transactions</h2>
      {data && data.length > 0 ? (
        data.map(entry => (
          <Card key={entry.name} className="border-l-4" style={{ borderColor: entry.type === 'Credit' ? '#22c55e' : '#ef4444' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">
                {entry.type === 'Credit' ? '+' : '-'}${entry.amount.toFixed(2)}
              </CardTitle>
              <span className="text-xs text-muted-foreground">{new Date(entry.posting_date).toLocaleDateString()}</span>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-1">{entry.description}</CardDescription>
              <div className="text-xs text-muted-foreground">Balance: ${entry.balance.toFixed(2)}</div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-24">
            <span className="text-muted-foreground">No transactions found.</span>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 