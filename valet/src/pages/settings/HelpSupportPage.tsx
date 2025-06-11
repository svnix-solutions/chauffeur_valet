import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const faqs = [
  {
    q: 'How do I reset my password?',
    a: 'Go to Privacy & Security and click on Change Password.'
  },
  {
    q: 'How do I contact support?',
    a: 'Click the Contact Support button below or email support@example.com.'
  },
  {
    q: 'How do I update my profile?',
    a: 'Go to Account Settings to update your name, email, or password.'
  }
]

export default function HelpSupportPage() {
  const handleContact = () => {
    // TODO: Implement contact support logic/modal
    alert('Contacting support...')
  }

  return (
    <div className="mx-auto max-w-md py-6 px-2 min-h-screen flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Help & Support</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full mb-4" onClick={handleContact}>
            Contact Support
          </Button>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">FAQs</h3>
            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-muted rounded p-3">
                  <div className="font-medium">{faq.q}</div>
                  <div className="text-sm text-muted-foreground mt-1">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 